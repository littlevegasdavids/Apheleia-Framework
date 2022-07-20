<script>
    export let customer_id
    let newName = ""
    let showError = false
    let errorMessage = ""

    async function changeName(){
        if(newName === "" || newName.match(/^ *$/)){
            errorMessage = "Name cannot be empty"
            showError = true
            return
        }

        if(newName.length < 4){
            errorMessage = "Name cannot be less than 4 characters"
            showError = true
            return
        }
        
        const res = await fetch(`/api/customer/name/${customer_id}`, {
            method: 'PATCH', 
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newName
            })
        })

        const result = await res.json()

        if(result.success){
            window.location.href = "/customer"
        }
        else{
            errorMessage = "Something went wrong. Please contact the admin of the website"
            showError = true
        }
    }
</script>

<h1 class="font-bold text-center text-3xl pb-3">Change Name</h1>

<div class="grid justify-items-center gap-4">
    <div>
        <p class="text-center">Enter the new name you would like to change to :</p>
        <input class="input input-bordered w-full" type="text" bind:value={newName} placeholder="New Name"/>
    </div>
    
    {#if showError}
        <p class="font-bold text-red-600 text-center">{errorMessage}</p>
    {:else}
        <p class="text-center">(Note please your real name so that we can associated any orders with you)</p>
    {/if}
    
    <button class="btn btn-success rounded-md w-4/6" on:click={changeName}>Save</button>
    <button class="btn btn-primary rounded-md w-4/6" on:click={()=>window.location.href = "/customer"}>Back</button>

</div>