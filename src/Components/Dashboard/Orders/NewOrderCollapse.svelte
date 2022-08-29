<script>
    export let new_orders

    function collapseCard(c){
        let card = document.getElementById(c)
        
        if(card.className.includes('collapse-open')){
            card.className = card.className.replace('collapse-open', 'collapse-close')
        }
        else{
            card.className = card.className.replace('collapse-close', 'collapse-open')
        }
    }

    async function changeOrderToConfirm(id){
        const res = await fetch(`/api/order/status/${id}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 1
                })
        })
        const result = await res.json()
        if(result.success){
            window.location.reload()
        }
        else{
            alert(`Something went wrong: ${result.message}`)
        }
    }
</script>

<div class="collapse collapse-arrow outline outline-1 outline-black bg-accent rounded-md collapse-open" id="new_orders_collapse">
    <div class="collapse-title text-3xl text-center font-bold pb-5" on:click={()=>collapseCard("new_orders_collapse")}>
        New Orders
    </div>
    <div class="collapse-content pt-1">
        {#each new_orders as order}
            <div class="grid outline outline-1 outline-black p-5 rounded-md gap-4 mb-5 justify-self-center">
                <div class="grid grid-cols-3 font-bold">
                    <p>#{order.id}</p>
                    {#if order.customer_id != null}
                        <p class="text-center">{order.Customer.name} - {order.Customer.email}</p>
                    {:else}
                        <p class="text-center">[Deleted Customer]</p>
                    {/if}
                    <p class="text-end">R{order.subtotal}</p>
                </div>
            <p>{order.shipping_address}</p>
            <div class="grid grid-cols-2 gap-4">
                {#each order.Order_Items as item}
                    {#if item.product_id != null}
                        <div class="grid grid-cols-3">
                            <img alt="{item.Product.name}" src="/product_images/{item.Product.id}/1.jpg" height="120" width="90" class="shadow-lg rounded-md outline outline-1 outline-black"/>
                            <p class="text-start place-self-center">{item.Product.name}</p>
                        </div>
                    {:else}
                        <div class="grid grid-cols-3">
                            <p class="text-start place-self-center">[Deleted Product]</p>
                        </div>
                    {/if}
                {/each}
                </div>
                <button class="btn btn-primary w-4/12" on:click={()=>changeOrderToConfirm(order.id)}>Confirm order</button>
            </div>
        {/each}
    </div>
</div>