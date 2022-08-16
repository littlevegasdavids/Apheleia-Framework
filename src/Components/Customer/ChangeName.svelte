<script>
    import {Link} from 'svelte-routing'
    export let customer_id
    let newName = ""
    let showError = false
    let errorMessage = ""

    async function changeName(){
        showError = false
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
        
        if(confirm('Are you sure you want to save changes ?')){
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

        
    }
</script>

<div class = "grid grid-cols-1 justify-items-center max-w-screen-tablet mx-auto">
    <div class="divide-y divide-solid w-full">
        <h1 class="font-bold text-center text-3xl pb-3">Change Name</h1>
        <p></p>
    </div>

    <div class="grid justify-items-center gap-4 mt-5">
        <div>
            <p class="text-center tablet:text-xl pb-1">Enter the new name you would like to change to :</p>
            <input class="input outline outline-1 outline-black w-full" type="text" bind:value={newName} placeholder="New Name"/>
        </div>
        
        {#if showError}
            <p class="font-bold text-red-600 text-center">{errorMessage}</p>
        {:else}
            <p class="text-center tablet:text-lg">(Note please your real name so that we can associated any orders with you)</p>
        {/if}
        <div class="grid grid-cols-1 gap-4 tablet:grid-cols-2">
            <button class="btn btn-success rounded-md shadow-lg" on:click={changeName}>Save</button>
            <Link to="/customer">
                <button class="btn btn-primary rounded-md shadow-lg">Back</button>
            </Link>
        </div>
        

    </div>
</div>