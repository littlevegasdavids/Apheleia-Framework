<script>
    import { onMount } from "svelte";
    import Loading from '../Loading.svelte'
import CollectedOrderCollapse from "./Orders/CollectedOrderCollapse.svelte";
    import ConfirmOrderCollapse from "./Orders/ConfirmOrderCollapse.svelte";
    import NewOrderCollapse from './Orders/NewOrderCollapse.svelte'
    import ShippedOrderCollapse from "./Orders/ShippedOrderCollapse.svelte";
    let loading = true

    let orders
    let new_orders = []
    let confirmed_orders = []
    let shipped_orders = []
    let collect_orders = []
    onMount(async ()=>{
        const orders_res = await fetch(window.location.origin + "/api/order/all")
        const order_result = await orders_res.json()
        orders = order_result.message.orders
        orders.forEach(order => {
            switch(order.status){
                case 0:
                    new_orders.push(order)
                break;

                case 1:
                    confirmed_orders.push(order)
                break;

                case 2:
                    shipped_orders.push(order)
                break;

                case 3:
                    collect_orders.push(order)
                break;
            }
        });

        loading = false
    })

</script>

<div class="grid max-w-6xl mx-auto">
    {#if loading}
        <Loading />
    {:else}
        <div class="grid pt-5 w-4/6 mx-auto gap-4">
            {#if new_orders.length != 0}
                <NewOrderCollapse {new_orders} />
            {/if}

            {#if confirmed_orders.length != 0}
                <ConfirmOrderCollapse {confirmed_orders} />
            {/if}

            {#if shipped_orders.length != 0}
                <ShippedOrderCollapse {shipped_orders} />
            {/if}

            {#if collect_orders.length != 0}
                <CollectedOrderCollapse {collect_orders} />
            {/if}
        </div>
    {/if}
</div>