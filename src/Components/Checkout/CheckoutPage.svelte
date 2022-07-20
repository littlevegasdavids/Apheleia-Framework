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

<h1 class="font-bold text-2xl text-center pb-3 tablet:text-4xl">Select your shipping address</h1>

{#if login === null}
    <p>Loading ....</p>
{:else if login}

    <div class="grid gap-4">
        {#each addresses as address}
            <AddressBlock address = {address} />
        {:else}
            <AddAddress />
        {/each}
        {#if addresses.length != 0}
            <button class="btn btn-secondary rounded-md justify-self-center" on:click={()=>window.location.href = "/addAddressCheckout"}>Add new Address</button>
        {/if}
    </div>
{:else if !login}
    <LoginForm />
{/if}