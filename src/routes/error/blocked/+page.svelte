<script lang="ts">
	import { PUBLIC_ACCENT_COLOR, PUBLIC_COMPANY_NAME, PUBLIC_LOGO } from '$env/static/public';
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
		<hr class="border-2 w-[100%] mb-2" style="border-color: {PUBLIC_ACCENT_COLOR}" />

		<!-- Content -->
		<div class="max-w-3xl text-2xl">
			<div class="mb-6 mx-5">
				You are not authorized to use this Wifi network. Please disconnect. If you believe this is a
				mistake, please contact IT department.
			</div>
		</div>
	</div>
</div>
