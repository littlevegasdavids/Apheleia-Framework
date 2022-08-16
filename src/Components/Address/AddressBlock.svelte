<script>
import { Link } from "svelte-routing"

    export let address
    let windowLocation = window.location.pathname

    async function deleteAddress(id){
        if(confirm('Are you sure you want to delete this address ?')){
            const res = await fetch(`/api/customer/address/${id}`, {method: 'DELETE'})
            const result = await res.json()
            if(result.success){
                window.location.reload()
            }
        }
    }
</script>

<div class="bg-secondary outline outline-black outline-1 grid grid-rows-2 p-3 rounded-lg shadow-md">
    <p class="font-bold">{address.street_address}, {address.suburb}, {address.city}, {address.postal_code}</p>
    {#if windowLocation === "/checkout"}
        <div class="grid grid-cols-3 gap-4 mt-2">
            <Link to="/checkoutSummary/{address.id}">
                <button class="btn btn-primary rounded-md btn-sm shadow-lg tablet:w-8/12 tablet:mx-auto browser:w-8/12">Select<i class="fa-solid fa-check pl-2"></i></button>
            </Link>
            <Link to="/editAddressCheckout/{address.id}">
                <button class="btn btn-warning rounded-md btn-sm shadow-lg tablet:w-8/12 tablet:mx-auto browser:w-8/12">Edit<i class="fa-solid fa-pen-to-square pl-2"></i></button>
            </Link>
            <button class="btn btn-error rounded-md btn-sm shadow-lg tablet:w-8/12 tablet:mx-auto browser:w-8/12" on:click={deleteAddress(address.id)}>Delete<i class="fa-solid fa-trash pl-2"></i></button>
        </div>
    {:else}
        <div class="grid grid-cols-2 gap-4 mt-2">
            <Link to="/editAddress/{address.id}">
                <button class="btn btn-secondary-content rounded-md btn-sm shadow-lg tablet:w-8/12 tablet:mx-auto browser:w-6/12">Edit<i class="fa-solid fa-pen-to-square pl-2"></i></button>
            </Link>
            <button class="btn btn-error rounded-md btn-sm shadow-lg tablet:w-8/12 tablet:mx-auto browser:w-6/12" on:click={deleteAddress(address.id)}>Delete<i class="fa-solid fa-trash pl-2"></i></button>
        </div>
    {/if}
    
</div>
