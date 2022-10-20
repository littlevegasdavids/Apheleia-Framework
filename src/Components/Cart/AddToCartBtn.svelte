<script>
    import { onMount } from "svelte";
    import {num_items, cart_items} from '../../Stores/cart'
    import {show_notification, message} from '../../Stores/notification'
    export let product_id
    export let product_name 
    export let extraCss

    let addedToCart = null

    async function addItemToCart(){
        addedToCart = null
        const res = await fetch(`/api/cart/${product_id}`, {method: "PATCH"})
        const result = await res.json()
        if(result.success){
            addedToCart = true
            $cart_items = result.message.cart_items
            $num_items = $num_items + 1
            $message = `${product_name} has been added to your cart`
            $show_notification = true
        }
    }

    async function removeItemFromCart(){
        addedToCart = null
        const res = await fetch(`/api/cart/${product_id}`, {method: "DELETE"})
        const result = await res.json()
        if(result.success){
            addedToCart = false
            $cart_items = result.message.cart_items
            $num_items = $num_items - 1
        }
        else{
            console.error(result.message)
            alert('Something went wrong trying to remove item to cart')
        }
    }

    onMount(async ()=>{
        const res = await fetch(`/api/cart/isInCart/${product_id}`)
        const result = await res.json()
        if(result.success){
            addedToCart = result.message
        }
        else{
            console.error(result.message)
            alert('Something went wrong getting item in cart information')
        }
    })
</script>

{#if addedToCart === null}
    <button class="btn btn-disabled selection:shadow-lg {extraCss}" id="btn">
        Loading ... <i class="fas fa-spinner fa-spin"></i>
    </button>
{:else if addedToCart === false}
    <button class="btn btn-primary shadow-lg {extraCss}" on:click={addItemToCart} id="btn">Add To Cart<i class="fa-solid fa-cart-shopping pl-2"></i></button>
{:else}
    <button class="btn bg-teal-600 hover:bg-teal-600 shadow-lg {extraCss}" on:click={removeItemFromCart} id="btn">Remove from Cart</button>
{/if}

