<script>
    import { onMount } from "svelte";
    import AddressBlock from '../Address/AddressBlock.svelte'
    import OrderBlock from '../Order/OrderBlock.svelte'
    let loading = true
    let name
    let addresses
    let customer_id

    let orders

    onMount(async ()=>{
        const res = await fetch('/api/customer/get')
        const result = await res.json()
        if(result.success){
            name = result.message.customer.name
            customer_id = result.message.customer.id
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
    <div class="grid grid-cols-1 divide-y divide-solid">
        <p class="font-bold text-center underline underline-offset-8 text-3xl pb-5 tablet:text-4xl">Hello {name}<i class="fa-solid fa-user pl-3"></i></p>
        
        <div class="grid divide-y divide-solid pt-5 tablet:gap-10 tablet:w-10/12 tablet:mx-auto browser:w-9/12">
            <div class="grid gap-4 pb-3 tablet:pb-0">
                <p class="font-bold text-lg tablet:text-2xl">Orders</p>
                {#each orders as order}
                    <OrderBlock order={order} />
                {:else}
                    <p class="text-lg tablet:text-2xl">No orders.</p>
                {/each}
            </div>
            <div class="pt-5">
                <div class="grid gap-4 grid-cols-2 mb-3">
                    <p class="font-bold text-lg tablet:text-2xl">Addresses</p>
                    <button class="btn btn-primary rounded-md btn-sm justify-self-end tablet:w-9/12" on:click={()=>window.location.href="/addNewAddress"}>Add New Address<i class="fa-solid fa-plus pl-2"></i></button>
                </div>
                <div class="grid gap-4">
                    {#each addresses as address}
                        <AddressBlock address={address} />
                    {:else}
                        <p class="text-lg tablet:text-2xl">No Addresses</p>
                    {/each}
                </div>
            </div>
            
            <div class="grid grid-cols-1 justify-center gap-4 mt-5 pt-5 tablet:mt-0">
                <button class="btn btn-warning rounded-md tablet:w-8/12 tablet:mx-auto browser:w-6/12" on:click={()=>window.location.href = `/customer/changePassword/${customer_id}`}>Change Password<i class="fa-solid fa-key fa-lg pl-2"></i></button> 
                <button class="btn btn-neutral rounded-md tablet:w-8/12 tablet:mx-auto browser:w-6/12" on:click={()=>window.location.href = `/customer/changeName/${customer_id}`}>Change Name<i class="fa-solid fa-user-pen fa-lg pl-2"></i></button>
                <button class="btn btn-error rounded-md tablet:w-8/12 tablet:mx-auto browser:w-6/12" on:click={()=>window.location.href = "/api/customer/logout"}>Logout<i class="fa-solid fa-arrow-right-from-bracket pl-2 fa-lg"></i></button> 
            </div>

        </div>
        
    </div>
{:else}
<div class="font-bold text-center text-4xl pt-5">
    <p>Loading ... <i class="fas fa-spinner fa-spin"></i></p>
</div>  
{/if}