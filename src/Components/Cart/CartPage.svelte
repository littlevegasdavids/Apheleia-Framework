<script>
    import { onMount } from "svelte"
    import CartItemsTable from "./CartItemsTable.svelte";
    import Loading from '../Loading.svelte'
    let items = null
    let total = 0
    onMount(async ()=>{
        const res = await fetch('/api/cart')
        const result = await res.json()
        if(result.success){
            items = result.message.cart_items
            items.forEach(item => {
                total += item.Product.price
            });
        }
        else{
            console.error(result.message)
            alert('Something went wrong getting cart information')
        }
    })

</script>
<div class="divide-y divide-solid">
<p class="text-2xl font-bold text-center pb-5 underline underline-offset-8 tablet:text-4xl">Shopping Cart<i class="fa-solid fa-cart-shopping pl-2"></i></p>
    
{#if items != null}
    {#if items.length != 0}
        <div class="grid place-items-center divide-y divide-solid gap-4 p-5 tablet:w-9/12 tablet:mx-auto">
            <div class="grid justify-items-center z-0 w-full">
                <CartItemsTable items={items} />
            </div>
            
            <div class="grid justify-center gap-5 p-5 w-full">
                <p class="font-extrabold text-2xl text-center">Subtotal: R{total}</p>
                <button class="btn btn-success shadow-lg" on:click={()=>window.location.href="/checkout"}>Check out<i class="fa-solid fa-basket-shopping fa-lg pl-2"></i></button>
                <button class="btn btn-primary shadow-lg" on:click={()=>window.location.href="/products"}>Continue Shopping<i class="fa-solid fa-bag-shopping fa-lg pl-2"></i></button>
            </div>
        </div>
    {:else}
        <p class="text-center text-2xl py-5">Your Cart Is Empty</p>
        <div class="grid justify-items-center pt-3">
            <button class="btn btn-primary shadow-lg" on:click={()=>window.location.href="/products"}>Cotinue Shopping</button>
        </div>
    {/if}
{:else}
    <Loading />
{/if}

</div>