<script>
    import { onMount } from "svelte";
    import Yoco from '../Payment/Yoco.svelte'
    import CartItemsMobile from "../Cart/CartItemsMobile.svelte";
    import CartItems from '../Cart/CartItems.svelte'
    import Loading from '../Loading.svelte'
    export let address_id
    let address = null
    let session = null
    let items = null
    let total

    onMount(async ()=>{
        const address_res = await fetch(`/api/customer/address/get/${address_id}`)
        const address_result = await address_res.json()
        if(address_result.success){
            address = address_result.message
        }

        const session_res = await fetch('/api/cart')
        const session_result = await session_res.json()
        if(session_result.success){
            session = session_result.message.session
            items = session_result.message.cart_items
            if(items.length === 0){
                window.location.href = "/cart"
            }

            total = session.total + 100
        }
    })

    function addressToString(address){
        return `${address.street_address}, ${address.suburb}, ${address.city}, ${address.postal_code}, ${address.country}`
    }
</script>

{#if address === null || items === null || session === null}
    <Loading /> 
{:else}
<div class="divide-y divide-solid">
    <h1 class="font-bold text-2xl text-center underline underline-offset-8 tablet:text-4xl">Checkout Summary</h1>
    <p class="my-5"></p>
</div>

    <div class="grid gap-4 tablet:w-9/12 tablet:mx-auto">
        <div class="tablet:hidden grid justify-items-center">
            <CartItemsMobile items={items} />
        </div>

        <div class="hidden tablet:grid tablet:justify-items-center">
            <CartItems items={items} />
        </div>
        
        <div class="grid divide-y divide-solid">
            <p></p>
            <p class="font-bold text-center py-5 tablet:text-xl">Shipping Address: {addressToString(address)}</p>
            <div class="py-3 text-xl text-center tablet:text-2xl">
                <p>Shipping fee: R100</p>
                <p>Subtotal: R{session.total}</p>
                <p class="font-bold">Total: R{total}</p>
            </div>
            <p class="py-5"></p>
            <div class="grid gap-4 tablet:w-8/12 tablet:mx-auto">
                <Yoco total={total * 100} items={items} subtotal={session.total} shipping_price={100} shipping_address={addressToString(address)}/>
                <button class="btn btn-primary rounded-md" on:click={()=>window.location.href = "/checkout"}>Select different address<i class="fa-solid fa-pen-to-square fa-lg pl-2"></i></button>
                <button class="btn btn-secondary rounded-md" on:click={()=>window.location.href = "/products"}>Continue Shopping<i class="fa-solid fa-bag-shopping fa-lg pl-2"></i></button>
            </div>
            
        </div>  
    </div>
{/if}
