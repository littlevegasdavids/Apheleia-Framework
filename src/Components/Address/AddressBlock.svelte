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
            else{
                console.error(result.message)
                alert('Something went wrong tryin to delete the address')
            }
        }
    }
</script>

<div class="bg-base-200 outline outline-black outline-1 grid grid-rows-2 p-3 rounded-lg shadow-md">
    <p class="font-bold">{address.street_address}, {address.suburb}, {address.city}, {address.postal_code}</p>
    {#if windowLocation === "/checkout"}
        <div class="grid grid-cols-3 gap-4 mt-2">
            <button class="btn btn-primary btn-sm shadow-lg tablet:w-8/12 tablet:mx-auto browser:w-8/12" on:click={()=>window.location.href=`/checkoutSummary/${address.id}`}>Select<i class="fa-solid fa-check pl-2"></i></button>
            <button class="btn btn-warning btn-sm shadow-lg tablet:w-8/12 tablet:mx-auto browser:w-8/12" on:click={()=>window.location.href=`/editAddressCheckout/${address.id}`}>Edit<i class="fa-solid fa-pen-to-square pl-2"></i></button>
            <button class="btn btn-error btn-sm shadow-lg tablet:w-8/12 tablet:mx-auto browser:w-8/12" on:click={deleteAddress(address.id)}>Delete<i class="fa-solid fa-trash pl-2"></i></button>
        </div>
    {:else}
        <div class="grid grid-cols-2 gap-4 mt-2">
            <button class="btn btn-secondary btn-sm shadow-lg tablet:w-8/12 tablet:mx-auto browser:w-6/12" on:click={()=>window.location.href=`/editAddress/${address.id}`}>Edit<i class="fa-solid fa-pen-to-square pl-2"></i></button>
            <button class="btn btn-error btn-sm shadow-lg tablet:w-8/12 tablet:mx-auto browser:w-6/12" on:click={deleteAddress(address.id)}>Delete<i class="fa-solid fa-trash pl-2"></i></button>
        </div>
    {/if}
    
</div>
