<script>
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

<div class="bg-primary-content outline outline-black outline-1 grid grid-rows-2 p-3 rounded-lg">
    <p>{address.street_address}</p>
    <p>{address.suburb}, {address.city}, {address.postal_code}</p>
    {#if windowLocation === "/checkout"}
        <div class="grid grid-cols-3 gap-4 mt-2">
            <button class="btn btn-primary rounded-md btn-sm" on:click={()=>window.location.href=`/checkoutSummary/${address.id}`}>Select<i class="fa-solid fa-check pl-2"></i></button>
            <button class="btn btn-warning rounded-md btn-sm" on:click={()=>window.location.href=`/editAddressCheckout/${address.id}`}>Edit<i class="fa-solid fa-pen-to-square pl-2"></i></button>
            <button class="btn btn-error rounded-md btn-sm" on:click={deleteAddress(address.id)}>Delete<i class="fa-solid fa-trash pl-2"></i></button>
        </div>
    {:else}
        <div class="grid grid-cols-2 gap-4 mt-2">
            <button class="btn btn-warning rounded-md btn-sm" on:click={()=>window.location.href=`/editAddress/${address.id}`}>Edit<i class="fa-solid fa-pen-to-square pl-2"></i></button>
            <button class="btn btn-error rounded-md btn-sm" on:click={deleteAddress(address.id)}>Delete<i class="fa-solid fa-trash pl-2"></i></button>
        </div>
    {/if}
    
</div>
