import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import {
	PRIVATE_JWT_SECRET,
	PRIVATE_AZ_CLIENT_SECRET,
	PRIVATE_GROUP_ALLOWED,
	PRIVATE_GROUP_BLOCKED,
	PRIVATE_MERAKI_PASSWORD,
	PRIVATE_MERAKI_USERNAME
} from '$env/static/private';
import {
	PUBLIC_AZ_CLIENT_ID,
	PUBLIC_AZ_TENANT_ID,
	PUBLIC_REDIRECT_URL,
	PUBLIC_HOME_PAGE
} from '$env/static/public';

import { KJUR } from 'jsrsasign';

const group_allowed = PRIVATE_GROUP_ALLOWED.split(',').filter((id) => id.length >= 2);
const groups_blocked = PRIVATE_GROUP_BLOCKED.split(',').filter((id) => id.length >= 2);

// Function to handle redirection
const redirectToError = (location?: string) => {
	return new Response(null, {
		status: 302,
		headers: {
			Location: location || '/error/unknown'
		}
	});
};

async function exchangeCodeForToken(code: string) {
	const response = await fetch(
		`https://login.microsoftonline.com/${PUBLIC_AZ_TENANT_ID}/oauth2/v2.0/token`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				client_id: PUBLIC_AZ_CLIENT_ID,
				client_secret: PRIVATE_AZ_CLIENT_SECRET,
				redirect_uri: PUBLIC_REDIRECT_URL
			})
		}
	);
	const response_data = await response.json();
	return response_data;
}

async function isUserInGroup(access_token: string, group_ids: Array<string>) {
	const response = await fetch('https://graph.microsoft.com/v1.0/me/memberOf', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
	const response_data = await response.json();
	if ('value' in response_data) {
		const groups = response_data['value'];
		const ids = groups.map((group: any) => group['id']);
		for (const group_id of group_ids) {
			if (ids.includes(group_id)) return true;
		}
	}
	return false;
}

export type LoginPayload = {
	loginUrl: string;
	continueUrl: string;
	apMac: string;
	apName: string;
	apTags: string;
	clientMac: string;
	clientIp: string;
	iat: number;
	exp: number;
};

export const GET: RequestHandler = async ({ request, url }) => {
	// Check 1: Verify the cookie is present and valid
	const cookie = request.headers.get('cookie');
	if (!cookie) {
		return redirectToError();
	}
	let splash = cookie.split(';').find((c) => c.trim().startsWith('splash='));
	splash = splash?.split('=')[1];

	if (!splash) return redirectToError();

	const idVaid = KJUR.jws.JWS.verifyJWT(splash, PRIVATE_JWT_SECRET, { alg: ['HS256'] });
	if (!idVaid) return redirectToError();

	// decode jwt
	let payload: LoginPayload;
	try {
		const decoded_jwt = KJUR.jws.JWS.parse(splash);
		if (!decoded_jwt) return redirectToError();
		if (!decoded_jwt.payloadObj) return redirectToError();
		payload = decoded_jwt.payloadObj as LoginPayload;
	} catch (e) {
		return redirectToError();
	}

	if (!payload) return redirectToError();
	// --------------------------------------------

	// Check 2: Verify the code query parameter is present and valid
	const code = url.searchParams.get('code');
	if (!code) return redirectToError();

	const { access_token, id_token } = await exchangeCodeForToken(code);

	if (!access_token || !id_token) return redirectToError();
	// --------------------------------------------

	// Check 3: Check if we need to block or allow groups
	if (groups_blocked.length > 0) {
		const is_blocked = await isUserInGroup(access_token, groups_blocked);
		if (is_blocked) return redirectToError('/error/blocked');
	}

	if (group_allowed.length > 0) {
		const is_allowed = await isUserInGroup(access_token, group_allowed);
		if (!is_allowed) return redirectToError('/error/blocked');
	}

	// Check 4: Verify the mauth token in payload
	// Make a post request to payload.loginUrl with the meraki username and pass
	const loginUrl =
		payload.loginUrl + `&username=${PRIVATE_MERAKI_USERNAME}&password=${PRIVATE_MERAKI_PASSWORD}`;

	const verify_resp = await fetch(loginUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'manual'
	});


	// Use the payload in your code here
	return new Response(null, {
		status: 302,
		headers: {
			Location: PUBLIC_HOME_PAGE || 'https://google.com'
		}
	});
};
