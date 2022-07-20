<script>
    import { onMount } from "svelte";
    import {recent_item} from '../../Stores/recent_cart_item.js'
    import {num_items} from '../../Stores/num_cart_items'
    import {ShowCartNotification} from '../../Stores/CartNotificationPopUp'
    export let product_id
    export let extraCss
    export let product_name

    let addedToCart = null

    async function addItemToCart(){
        addedToCart = null
        const res = await fetch(`/api/cart/${product_id}`, {method: "PATCH"})
        const result = await res.json()
        if(result.success){
            addedToCart = true
            num_items.update(n=> n+1)
            recent_item.update(n=>n=product_name)
            ShowCartNotification.update(n=>n=true)
        }
    }

    async function removeItemFromCart(){
        addedToCart = null
        const res = await fetch(`/api/cart/${product_id}`, {method: "DELETE"})
        const result = await res.json()
        if(result.success){
            addedToCart = false
            num_items.update(n=> n-1)
            ShowCartNotification.update(n=>n=false)
        }
    }

    onMount(async ()=>{
        const res = await fetch(`/api/cart/isInCart/${product_id}`)
        const result = await res.json()
        if(result.success){
            addedToCart = result.message
        }
    })
</script>

{#if addedToCart === null}
    <button class="btn btn-disabled rounded-md shadow-lg {extraCss}" id="btn">Loading...</button>
{:else if addedToCart === false}
    <button class="btn btn-primary rounded-md shadow-lg {extraCss}" on:click={addItemToCart} id="btn">Add To Cart<i class="fa-solid fa-cart-shopping pl-2"></i></button>
{:else}
    <button class="btn btn-error rounded-md shadow-lg {extraCss}" on:click={removeItemFromCart} id="btn">Remove from Cart</button>
{/if}

