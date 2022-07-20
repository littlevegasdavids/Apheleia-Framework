<script>
    import { onMount } from "svelte";
    import Yoco from '../Payment/Yoco.svelte'
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
            console.log(address)
        }

        const session_res = await fetch('/api/cart')
        const session_result = await session_res.json()
        if(session_result.success){
            session = session_result.message.session
            items = session_result.message.cart_items
            if(items.length === 0){
                window.location.href = "/cart"
            }
            console.log(session)
            console.log(items)
            total = session.total + 100
        }
    })

    function addressToString(address){
        return `${address.street_address}, ${address.suburb}, ${address.city}, ${address.postal_code}, ${address.country}`
    }
</script>

{#if address === null || items === null || session === null}
    <p>Loading ...</p>
{:else}
    <button class="btn btn-warning rounded-md" on:click={()=>window.location.href = "/checkout"}>Back</button>
    <p>Deliver to:</p>
    <p>{addressToString(address)}</p>
    <p>Items</p>
    {#each items as item}
        <div class="grid grid-cols-3 gap-4 bg-base-300 p-3 rounded-2xl">
            <img src="/product_images/image.jpg" alt="{item.Product.name} - image" class="rounded-lg"/>
            <div>
                <p class="font-bold pb-3">{item.Product.name}</p>
            </div>
            <p class="font-bold col-start-3 text-right">R{item.Product.price}</p>
        </div>
    {/each}

    <p>Shipping fee: R100</p>
    <p>Subtotal: {session.total}</p>
    <p>Total: {total}</p>
    <Yoco total={total * 100} items={items} address_id = {address_id} subtotal={session.total} shipping_price={100} shipping_address={addressToString(address)}/>
{/if}
