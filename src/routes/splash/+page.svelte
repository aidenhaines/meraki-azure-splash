<script lang="ts">
	import {
		PUBLIC_LOGO,
		PUBLIC_COMPANY_NAME,
		PUBLIC_ACCENT_COLOR,
		PUBLIC_REDIRECT_URL,
		PUBLIC_AZ_TENANT_ID,
		PUBLIC_AZ_CLIENT_ID,
		PUBLIC_AZ_SCOPES
	} from '$env/static/public';

	const AUTHORIZATION_URL = `https://login.microsoftonline.com/${PUBLIC_AZ_TENANT_ID}/oauth2/v2.0/authorize`;

	function getAuthUrl() {
		const params = new URLSearchParams({
			client_id: PUBLIC_AZ_CLIENT_ID,
			response_type: 'code',
			redirect_uri: PUBLIC_REDIRECT_URL,
			response_mode: 'query',
			scope: PUBLIC_AZ_SCOPES,
			prompt: 'select_account'
		});

		return `${AUTHORIZATION_URL}?${params}`;
	}

	const authUrl = getAuthUrl();
</script>

<div class="grid w-full h-screen justify-items-center content-center">
	<div
		class="grid bg-gray-100 border-4 rounded-2xl text-center justify-items-center"
		style="border-color: {PUBLIC_ACCENT_COLOR}"
	>
		<!-- Branding -->
		<div class="grid grid-cols-4 p-6">
			<img src={PUBLIC_LOGO} alt="logo" class="w-20 h-w-20 mx-auto drop-shadow-xl" />
			<div class="text-4xl font-bold m-auto col-span-3">
				{PUBLIC_COMPANY_NAME}
			</div>
		</div>

		<!-- Seperator -->
		<hr class="border-2 w-[100%]" style="border-color: {PUBLIC_ACCENT_COLOR}" />

		<!-- Content -->
		<div class="max-w-3xl text-2xl">
			<div class="mb-6 mx-5">
				To access the internet, you must sign in with your employee Microsoft account. If you do not
				have a Microsoft account, please contact your IT department.
			</div>
		</div>

		<!-- Button -->
		<div class="p-6">
			<a href={authUrl}>
				<img src="/ms-symbollockup_signin_dark.svg" alt="Microsoft Logo" />
			</a>
		</div>
	</div>
</div>
