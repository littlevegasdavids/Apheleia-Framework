<script>
    import { onMount } from "svelte";
    import Loading from '../Loading.svelte'
    export let order_id
    let order_details
    let items
    let loading = true

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

    async function downloadInvoice(){
        
    }
</script>

{#if !loading}
<div class="divide-y divide-solid">
    <h1 class="font-bold text-3xl text-center pb-5">Order #{order_id} | {convertDate(order_details.created_at)}</h1>
    <p class="pb-5"></p>
</div>

<div class="grid gap-4 grid-cols-1">
    <div class="divide-y divide-solid">
        <table class="table table-zebra w-full text-lg mx-auto tablet:w-9/12 outline outline-1 outline-black rounded-md z-0">
            <thead>
                <tr>
                    <th></th>
                    <th class="text-lg">Name</th>
                    <th class="text-lg">Price</th>
                </tr>
            </thead>
            <tbody>
                {#each items as item}
                    {#if item.product_id != null}
                    <tr>
                        <td>
                            <img src="/product_images/{item.Product.id}/1.jpg" alt="{item.Product.name} - image" height="175" width="131" class="rounded-md shadow-lg"/>
                        </td>
                        <td>{item.Product.name}</td>
                        <td>R{item.Product.price}</td>
                    </tr>
                    {:else}
                        <tr>
                            <td>
                                [Deleted Product]
                            </td>
                            <td>[Deleted Product]</td>
                            <td>[Deleted Product]</td>
                        </tr>
                    {/if}
                {/each}
            </tbody>
        </table>
        <p class="mt-5"></p>
    </div>

    <div class="col-start-1 mx-auto">
        <div class="grid gap-2">
            <p class="font-bold text-xl">Details:</p>
            <div class="grid p-3 outline outline-1 outline-black">
                <p>Status: 
                    <span>
                        {#if order_details.status === 0}
                            <div class="badge bg-white text-black">Waiting for confirmation</div>
                        {:else if order_details.status === 1}
                            <div class="badge badge-primary">Confirmed</div>
                        {:else if order_details.status === 2}
                            <div class="badge badge-secondary">Shipped to address</div>
                        {:else if order_details.status === 3}
                            <div class="badge bg-success text-black">Collected</div>
                        {/if}
                    </span>
                </p>
                <p>Payment Service: {order_details.Payment_Details[0].provider}</p>
                <p>Shipped to: {order_details.shipping_address}</p>

                <div class="grid pt-3">
                    <p class="font-bold text-lg">Total: R{order_details.total}</p> 
                </div>
            </div>
        </div>
    </div>

    <button class="btn btn-success col-span-2 w-4/12 justify-self-center shadow-lg" on:click={()=>window.location.href = `/api/order/get/download/${order_id}`}>Download Invoice<i class="fa-solid fa-download pl-2"></i></button>
    <button class="btn btn-warning col-span-2 w-4/12 justify-self-center shadow-lg" on:click={()=>window.location.href = "/customer"}>Back</button>

</div>
    
{:else}
    <Loading />  
{/if}
    
