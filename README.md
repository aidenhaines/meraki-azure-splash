# meraki-azure-splash
This is a [SvelteKit](https://kit.svelte.dev/) project that allows you to create a custom splash page for Meraki Captive Portals that uses Azure AD for authentication.

<details>
<summary>Example Images</summary>
  
![brave_841yAzxgHI](https://github.com/Wolfhound905/meraki-azure-splash/assets/58155937/58ce8fb5-4ade-4a5a-9a06-40e3b7a71a05)


https://github.com/Wolfhound905/meraki-azure-splash/assets/58155937/22f32ae9-59c2-42a4-9046-064ff1e5ac5b


</details>

### Auth Flow
1. Client connects to Wifi
2. Meraki sends the client to the custom splash page inside a walled garden, only allowing what you need
3. In order to verify the [mauth token](https://developer.cisco.com/meraki/captive-portal-api/sign-on-api/#login-url) from Meraki, the login must be valid and in your Tenant
4. Once logged in, the token is verified with a "service" account you made in Meraki
5. The client is given the verified token and then connects to the network.
   
ℹ️ To actually protect a user from bypassing the login "Click-through" is NOT supported, as it is effortless to bypass

### Setup Overview
- Create a Guest user in Meraki
- Create a new app in Azure
- Deploy the app your preferred way (example: Cloudflare Pages)

<details>
  <summary>Setting Up Azure</summary>

  1. Go to your desired [active directory](https://portal.azure.com/#home)
  2. Copy your `Tenant ID` and put the ID in a notepad for later.
  3. Click on "App Registrations"
  4. Make a "New registration"
  5. Name the application something like: Meraki Splash
  6. Set the Redirect URI type to web and the url to https://<yourdomain>.com/login
     - If you do not have a domain, leave this black and look at deploying with CF Pages
  7. Copy `Application (client) ID`
  8. Go to "Certificates & Secrets" on the Manage list.
  9. Click "New Client Secret" and create a new secret.
      - The max you can set is 24 months. So make a reminder to update this variable
  11. Copy the `Value` from your new Secret
      - It look like: `Xz_8Q~zQuZUmwys~FoVAuwnLqf1JzdJLmQRGjdoX`
  12. Go to "API Permissions"
  13. Click "Add a permission" > "Microsoft Graph" > "Delegated Permissions"
      - Expand OpenId permissions and add a profile
      - Search "GroupMember.Read.all", expand the box, and add the permission
  14. Click "Add permissions"
  15. Click "Grant admin consent for <domain>"
      - This will make it so users don't need to consent
  16. Pat yourself on the back for getting this far 😁
     
</details>

<details>
  <summary>Setting Meraki</summary>

  1. Go to your Meraki Dashboard
  2. Go to "Wireless" > "Configure" > "Access Control"
  3. On "Splash Page" select Sign-on with "Meraki Cloud Authentication"
  4. Expand Advanced Splash Settings
  5. Click "Block all access until sign-on is complete"
  6. Enable the walled garden
     - [Here](https://paste.zevs.me/BENa8MhyvzM2) is the list I use. This is not very restrictive, so look into what only your case need.
     - Visit Microsofts Docs [Here](https://learn.microsoft.com/en-us/microsoft-365/enterprise/urls-and-ip-address-ranges?view=o365-worldwide#microsoft-365-common-and-office-online) to view their IP ranges and domains
  7. Turn off Self-registration
  8. Select "Allow simultaneous devices per user"
  9. I suggest "Restricted" for Controller disconnection behavior
  10. Save Changes
  11. Go to "Wireless" > "Configure" > "Splash Page"
  12. Select "Custom splash URL" and set it to `https://<yourdomain>.com`
  13. Save Changes
  14. Now give yourself a 👏 round of applause!
     
</details>

<details>
  <summary>Deploying with Cloudflare Pages</summary>

  1. Sign up or log in to Cloudflare [here](https://dash.cloudflare.com/)
  2. Go to "Workers & Pages" > "Overview"
  3. Click "Create application" > "Pages"
  4. Clone this repository
  5. Back on Cloudflare, click "Connect to git" and follow prompts
  6. Select the "meraki-azure-splash" repo that you cloned
  7. Press "Begin Setup"
  8. Set "Framework preset" to "**SvelteKit**"
  9. Expand environment variables
     - Add `NODE_VERSION` and set it to `18.12.1`
     - This is also where you add all of the secrets and variables from [sample.env](https://github.com/Wolfhound905/meraki-azure-splash/blob/master/sample.env)
     - Add every one of those to the environment variables
     - If you DO NOT plan to use a custom domain, look at the top under Project Name, copy the `*.pages.dev` url for your `REDIRECT_URL`
  10. Save and Deploy
      - It takes around a minute to fully build and deploy
  11. 🚧Still working on this guide
     
</details>
