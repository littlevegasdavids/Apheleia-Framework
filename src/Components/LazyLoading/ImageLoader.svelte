<script>
    export let src
    export let alt
    export let height
    export let width

    import IntersectionObserver from './IntersectionObserver.svelte'
    import Image from './Image.svelte'
    import {onMount} from 'svelte'

    let nativeLoading = false

    onMount(()=>{
        if('loading' in HTMLImageElement.prototype){
            nativeLoading = true
        }
    })
</script>

<IntersectionObserver once={true} let:intersecting={intersecting}>
    {#if intersecting || nativeLoading}
        <Image {alt} {src} {height} {width}/>
    {/if}
</IntersectionObserver>