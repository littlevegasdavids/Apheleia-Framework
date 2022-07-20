<script>
    import { onMount } from "svelte";
    import {Link} from 'svelte-routing'
    export let order_id
    let order_details
    let items
    let loading = true
    let status

    onMount(async ()=>{
        const order_items_res = await fetch(`/api/order/get/order_items/${order_id}`)
        const order_items_result = await order_items_res.json()
        items = order_items_result.message.order_items

        const order_details_res = await fetch(`/api/order/get/${order_id}`)
        const order_details_result = await order_details_res.json()

        order_details = order_details_result.message.order
        loading = false
    })

    function convertDate(date){
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        const d = new Date(date)
        const dateString = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
        return dateString
    }
</script>


<h1 class="font-bold text-3xl text-center">Order #{order_id}</h1>

{#if !loading}
    {#if order_details.status === 0}
        <div class="badge justify-self-end text-xl">Waiting for confirmation</div>
    {:else if order_details.status === 1}
        <div class="badge badge-primary text-xl">Confirmed</div>
    {:else if order_details.status === 2}
        <div class="badge badge-secondary text-xl">Shipped to address</div>
    {:else if order_details.status === 3}
        <div class="badge badge-accent text-xl p-4 outline outline-black outline-1">Collected</div>
    {/if}
    <div class="grid justify-start">
        <p>Date Ordered: {convertDate(order_details.created_at)}</p>
        <br>
        <p class="text-xl font-bold">Payment Details:</p>
        <p>ID: #{order_details.Payment_Details[0].id}</p>
        <p>Provider: {order_details.Payment_Details[0].provider}</p>
        <br>
        <p class="text-xl font-bold">Items:</p>
            {#each items as item}
            <Link to="/product/{item.Product.id}">
                <div class="grid grid-cols-3 bg-primary-content my-3 rounded-xl shadow-xl outline outline-1 outline-line outline-black gap-2 place-items-center p-2">
                    <img src="/product_images/image.jpg" alt="{item.Product.name} - image" width="100" height="100" class="rounded-md pr-3">
                    <p class="text-">{item.Product.name}</p>
                    <p>R {item.Product.price}</p>
                </div>
            </Link>
            {/each}
        <p class="text-lg">Subtotal: R{order_details.subtotal}</p>
        <p class="text-lg">Shipping: R{order_details.shipping_price}</p>
        <p class="font-bold text-lg">Total: R{order_details.total}</p> 
        <br>
        <p class="text-xl font-bold">Shipped to:</p>
        <p>{order_details.shipping_address}</p>

        <button class="btn btn-warning rounded-md" on:click={()=>window.location.href = "/customer"}>Back</button>
    </div>
{:else}
    <p>Loading ....</p>
{/if}
    
