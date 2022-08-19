<script>
export let src
export let alt
export let height
export let width

import { onMount } from 'svelte'

let loaded = false
let thisImage

onMount(() => {
    thisImage.onload = () => {
    loaded = true
    }
}) 

</script>

<img {src} {alt} {height} {width} class:loaded bind:this={thisImage} class="rounded-md shadow-lg" loading="lazy"/>

<style>
    img {
        opacity: 0;
        transition: opacity 1200ms ease-out;
    }
    img.loaded {
        opacity: 1;
    }
</style>