<script>
    import { onMount } from "svelte";
    import Loading from "../../Loading.svelte";
    export let category_id
    let category
    let name
    let showError = false
    let errorMessage = ""

    let loading = true

    onMount(async ()=>{
        const res = await fetch(`/api/category/get/${category_id}`)
        const result = await res.json()

        if(result.success){
            category = result.message.category
            name = category.name
            loading = false
        }
        else{
            console.log(result.message)
            alert('Error getting category info')
        }
    })

    async function editCategory(){
        if(name === "" || name.match(/^ *$/)){
            errorMessage = "Name cannot be empty"
            showError = true
            return
        }

        const res = await fetch(`/api/category/${category_id}`, {
                method: 'PATCH',
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
            console.error(result.message)
            alert('Error editing category')
        }
    }
</script>
{#if !loading}
    <div class="grid justify-items-center gap-4">
        <h1 class="font-bold text-4xl underline underline-offset-4 text-center">Edit category</h1>
        <div>
            <p class="pb-1 text-xl">Name</p>
            <div>
                <input type="text" bind:value={name} class="input outline outline-1"/>
                <button class="btn btn-success rounded-md ml-3" on:click={editCategory}>Save</button>
            </div>
            {#if showError}
                <p class="text-red-600 mt-5 font-bold text-center text-lg">{errorMessage}</p>
            {/if}
            
        </div>
    </div>
{:else}
    <Loading />
{/if}
