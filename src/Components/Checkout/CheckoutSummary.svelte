<script>
    import { onMount } from "svelte";
    import Yoco from '../Payment/Yoco.svelte'
    import Loading from '../Loading.svelte'
    import CartItemsTable from "../Cart/CartItemsTable.svelte";
    import {waiting_for_payment} from '../../Stores/waitingPayment'

    export let address_id
    let address = null
    let session = null
    let items = null

    onMount(async ()=>{
        const address_res = await fetch(`/api/customer/address/get/${address_id}`)
        const address_result = await address_res.json()
        if(address_result.success){
            address = address_result.message
        }
        else{
            console.error(address_result.message)
            alert('Something went wrong trying to get checkout address information')
        }

        const session_res = await fetch('/api/cart')
        const session_result = await session_res.json()
        if(session_result.success){
            session = session_result.message.session
            items = session_result.message.cart_items
            if(items.length === 0){
                window.location.href = "/cart"
            }
        }
        else{
            console.error(session_result.message)
            alert('Something went wrong trying to get session information')
        }
    })

    function addressToString(address){
        return `${address.street_address}, ${address.suburb}, ${address.city}, ${address.postal_code}, ${address.country}`
    }
</script>

{#if address === null || items === null || session === null}
    <Loading /> 
{:else if !$waiting_for_payment}
<div class="divide-y divide-solid">
    <h1 class="font-bold text-2xl text-center underline underline-offset-8 tablet:text-4xl">Checkout Summary</h1>
    <!--Demo Purposes-->
    <h1 class="font-bold text-center py-5 text-xl text-red-600">This is currently a live demo of the website.
    <br>
    <br>
    The items you are about to "purchase" are only to demonstrate the functionality of the website.
    <br>
    <br>
    To successfully simulate a Yoco transaction please use the current card details
    </h1>
    <img alt="yoco-test-card" src="/yoco-test-card.png" class="mx-auto" width="350"> 
    <p class="my-5"></p>
</div>


    <div class="grid gap-4 tablet:w-9/12 tablet:mx-auto">
        <div class="grid justify-items-center">
            <CartItemsTable items={items} />
        </div>
        <div class="grid">
            <div class="divide-y divide-solid">
                <p></p>
                <p class="font-bold text-center py-5 tablet:text-xl">Shipping Address: {addressToString(address)}</p>
                <p class="font-bold text-center py-5 text-green-500 underline underline-offset-2 tablet:text-xl">Free shipping including</p>
                <div class="py-3 text-xl text-center tablet:text-2xl">
                    <p class="font-bold">Total: R{session.total}</p>
                </div>
                <p class="py-3"></p>
            </div> 
            <div class="grid gap-4 tablet:w-8/12 tablet:mx-auto">
                <Yoco total={session.total * 100} items={items} shipping_address={addressToString(address)}/>
                <button class="btn btn-secondary shadow-lg" on:click={()=>window.location.href = "/checkout"}>Select different address<i class="fa-solid fa-pen-to-square fa-lg pl-2"></i></button>
                <button class="btn btn-primary shadow-lg" on:click={()=>window.location.href = "/products"}>Continue Shopping<i class="fa-solid fa-bag-shopping fa-lg pl-2"></i></button>
            </div>
        </div>
         
    </div>
{:else if waiting_for_payment}
<div class="font-bold text-center text-4xl pt-5">
    <p>Waiting for payment confirmation ... <i class="fas fa-spinner fa-spin"></i></p>
</div>  
{/if}


