<script>
    import { onMount } from "svelte";
    import LoginForm from '../Customer/LoginForm.svelte'
    import AddressBlock from '../Address/AddressBlock.svelte'
    import AddAddress from '../Address/AddAddress.svelte'
    let addresses

    let login = null
    onMount(async ()=>{
        const res = await fetch('/api/customer/get')
        const result = await res.json()
        if(result.success){
            addresses = result.message.customer.Customer_Address
            login = true
        }
        else{
            if(result.message === "Customer not login"){
                login = false
            }
            else{
                console.error('Error Customer ID not found')
            }
        }
    })
</script>

<h1 class="font-bold text-xl text-center">Check out page</h1>

{#if login === null}
    <p>Loading ....</p>
{:else if login}
    {#if addresses.length != 0}
    <div class="grid grid-cols-2 gap-4">
        <p>Select Address to Deliver to</p>
        <button class="btn btn-secondary rounded-md" on:click={()=>window.location.href = "/addAddressCheckout"}>Add new Address</button>
    </div>
        
    {/if}
    {#each addresses as address}
        <AddressBlock address = {address} />
    {:else}
        <AddAddress />
    {/each}
{:else if !login}
    <LoginForm />
{/if}