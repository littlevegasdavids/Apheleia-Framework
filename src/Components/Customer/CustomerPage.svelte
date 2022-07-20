<script>
    import { onMount } from "svelte";
    import AddressBlock from '../Address/AddressBlock.svelte'
    import OrderBlock from '../Order/OrderBlock.svelte'
    let loading = true
    let name
    let addresses

    let orders

    onMount(async ()=>{
        const res = await fetch('/api/customer/get')
        const result = await res.json()
        if(result.success){
            name = result.message.customer.name
            addresses = result.message.customer.Customer_Address
            orders = result.message.customer.Order_Details
            
            loading = false
        }
        else{
            window.location.href = "/login"
        }
    })

    
</script>

{#if !loading}
    <div class="grid grid-cols-1 gap-4">
        <p class="font-bold text-center text-3xl">Hello {name}</p>

        <div class="grid gap-4">
            <p class="font-bold text-lg">Orders</p>
            {#each orders as order}
                <OrderBlock order={order} />
            {:else}
                <p>No orders.</p>
            {/each}
        </div>
       
        <div>
            <div class="grid grid-cols-2 mb-3">
                <p class="font-bold text-lg">Addresses</p>
                <button class="btn btn-primary rounded-md btn-sm" on:click={()=>window.location.href="/addNewAddress"}>Add New Address<i class="fa-solid fa-plus pl-2"></i></button>
            </div>
            <div class="grid gap-4">
                {#each addresses as address}
                    <AddressBlock address={address} />
                {:else}
                    <p>No Addresses</p>
                {/each}
            </div>
            
        </div>
        
        <div class="grid grid-cols-1 justify-center">
            <button class="btn btn-error rounded-md" on:click={()=>window.location.href = "/api/customer/logout"}>Logout</button> 
        </div>
    </div>
{:else}
    <p class="font-bold text-center">Loading ...</p>
{/if}