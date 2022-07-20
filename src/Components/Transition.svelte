<script>
    import {fade} from 'svelte/transition'
	import {ShowCartNotification} from '../Stores/CartNotificationPopUp'
    export let url

	ShowCartNotification.update(n=>n=false)
</script>

{#key url}
	<div
		in:fade={{duration: 250, delay: 300 }}
		out:fade={{duration: 250 }}
    >
		<slot />
	</div>
{/key}