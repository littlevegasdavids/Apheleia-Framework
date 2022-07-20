<script>
    import { onMount } from "svelte"
    import RemoveItemFromCart from './RemoveFromCartBtn.svelte'
    import CartItems from './CartItems.svelte'
    import CartItemsMobile from './CartItemsMobile.svelte'
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
    })

    function goToProductPage(id){
        window.location.href = `/product/${id}`
    }

</script>

<p class="text-2xl font-bold text-center pb-5 underline underline-offset-8 tablet:text-4xl">Shopping Cart<i class="fa-solid fa-cart-shopping pl-2"></i></p>
    
{#if items != null}
    {#if items.length != 0}
        <div class="grid place-items-center gap-4 outline outline-1 outline-black bg-primary-content p-5 rounded-lg tablet:w-9/12 tablet:mx-auto">
            <div class="tablet:hidden grid justify-items-center">
                <CartItemsMobile items={items} />
            </div>

            <div class="hidden tablet:grid tablet:justify-items-center">
                <CartItems items={items} />
            </div>
            
            <div class="grid justify-center gap-5 p-5">
                <p class="font-extrabold text-xl text-center">Subtotal: R{total}</p>
                <button class="btn btn-success rounded-md shadow-xl" on:click={()=>window.location.href="/checkout"}>Check out<i class="fa-solid fa-basket-shopping fa-lg pl-2"></i></button>
                <button class="btn btn-primary rounded-md shadow-xl" on:click={()=>window.location.href="/products"}>Continue Shopping<i class="fa-solid fa-bag-shopping fa-lg pl-2"></i></button>
            </div>
            
        </div>
    {:else}
        <p class="text-center">Your Cart Is Empty</p>
        <div class="grid justify-items-center pt-3">
            <button class="btn btn-secondary rounded-md shadow-xl" on:click={()=>window.location.href="/products"}>Cotinue Shopping</button>
        </div>
    {/if}
{:else}
    <p class="text-center font-bold text-xl">Loading ...</p>
{/if}