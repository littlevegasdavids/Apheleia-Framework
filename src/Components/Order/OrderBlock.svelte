<script>
    export let order

    function convertDate(date){
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        const d = new Date(date)
        const dateString = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
        return dateString
    }
</script>

<div class="bg-primary-content outline outline-black outline-1 grid grid-rows-2 p-3 rounded-lg gap-2">
    <div class="grid grid-cols-2">
        <p class="font-bold">Order #{order.id} | {convertDate(order.created_at)}</p>
        {#if order.status === 0}
            <div class="badge justify-self-end">Waiting for confirmation</div>
        {:else if order.status === 1}
            <div class="badge badge-primary justify-self-end">Confirmed</div>
        {:else if order.status === 2}
            <div class="badge badge-secondary justify-self-end">Shipped to address</div>
        {:else if order.status === 3}
            <div class="badge badge-accent justify-self-end">Collected</div>
        {/if}
    </div>
    
    <p>Total: R{order.total}</p>
    <button class="btn btn-primary rounded-md btn-sm" on:click={()=>window.location.href=`/order/${order.id}`}>View Order</button>
</div>