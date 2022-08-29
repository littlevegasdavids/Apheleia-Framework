<script>
    let name = ""
    let errorMessage = ""
    let showError = false

    async function createCategory(){
        if(name === "" || name.match(/^ *$/)){
            errorMessage = "Name cannot be empty"
            showError = true
            return
        }

        const res = await fetch(`/api/category`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name
                })
        })
        
        const result = await res.json()
        if(result.success){
            window.location.href = "/dashboard/categories"
        }
        else{
            console.log(result.message)
            alert('Error creating new category')
        }
    }
</script>

<div class="grid justify-items-center gap-4">
    <h1 class="font-bold text-4xl underline underline-offset-4 text-center">Create new Category</h1>
    <div>
        <p class="pb-1 text-xl">Name</p>
        <div>
            <input type="text" bind:value={name} class="input outline outline-1"/>
            <button class="btn btn-success ml-3" on:click={createCategory}>Create</button>
        </div>
        {#if showError}
            <p class="text-red-600 mt-5 font-bold text-center text-lg">{errorMessage}</p>
        {/if}
        
    </div>
</div>
