<script>
    import {show_notification, message} from '../Stores/notification'
    import {fade} from 'svelte/transition'
    import { onDestroy, onMount } from 'svelte';

    onMount(()=>{
        setTimeout(()=>{
            $show_notification = false
        }, 3000)
    })
</script>

<div in:fade={{duration: 100 }} out:fade={{duration: 500 }} class="grid absolute shadow-xl left-9 justify-items-center bg-success w-10/12 rounded-lg p-3 font-bold tablet:text-xl tablet:w-8/12 tablet:left-36 browser:w-6/12 browser:left-80">
    <p>{$message}</p>
</div>