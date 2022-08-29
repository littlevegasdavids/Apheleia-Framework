<script>
    import { onMount } from "svelte";
import { identity } from "svelte/internal";
    import Loading from '../Loading.svelte'

    let categories
    let null_category
    let loading = true
    let i = 0

    onMount(async ()=>{
        const res = await fetch('/api/category/all')
        const result = await res.json()
        if(result.success){
            categories = result.categories
        }
        else{
            alert('Cannot load categories')
        }

        const null_res = await fetch('/api/product/nullCategory')
        const null_result = await null_res.json()
        
        if(null_result.success){
            null_category = null_result.products
            console.log(null_category)
            loading = false
        }   
        else{
            alert('Cannot get null category products')
        }

    })

    function cardColor(){
        if(i % 2 === 0){ 
            i++
            return 'bg-base-200'
        }
        else{
            i++
            return 'bg-base-300'
        }
    }

    async function deleteCategory(id, name){
        if(confirm(`Are you sure you want to delete category ${name}`)){
            const res = await fetch(`/api/category/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                }
            })

            const result = await res.json()

            if(result.success){
                window.location.reload()
            }   
            else{
                console.error(result.message)
                alert(`Error encountered deleting category ${name}`)
            }
        }
    }
</script>



{#if !loading}
<div class=" w-4/6 mx-auto mb-10">
    <div class="grid grid-cols-3">
        <h1 class="col-start-2 text-center font-bold text-4xl underline underline-offset-2 mb-5">Categories</h1>
        <button class="btn btn-success justify-self-end" on:click={()=>window.location.href="/dashboard/newCategory"}>Create new Category<i class="fa-solid fa-plus fa-xl pl-3"></i></button>
    </div>
    
    <div class="grid gap-4">
        {#each categories as category}
        <div class="grid grid-cols-3 p-3 {cardColor()} rounded-md outline outline-1">
            <p class="font-bold text-center col-start-2 text-3xl">{category.name}</p>
            <div class="justify-self-end grid grid-cols-2 gap-4">
                <div class="tooltip tooltip-bottom tooltip-primary" data-tip="Edit">
                    <button class="btn btn-circle btn-primary" on:click={()=>window.location.href=`/dashboard/editCategory/${category.id}`}><i class="fa-solid fa-pen-to-square"></i></button>
                </div>
                <div class="tooltip tooltip-bottom tooltip-error" data-tip="Delete">
                    <button class="btn btn-circle btn-error" on:click={deleteCategory(category.id, category.name)}><i class="fa-solid fa-trash"></i></button>
                </div>

            </div>
            {#each category.Product as product}
                <div class="grid grid-cols-2 mt-5">
                    <img src="/product_images/{product.id}/1.jpg" alt="{product.name} - image" height="120" width="90"/>
                    <p class='text-lg self-center'>{product.name}</p>
                </div>
            {:else}
                <p class="text-lg text-center">No items in categories</p>
            {/each}
        
        
            
        </div>
        {/each}
        {#if null_category.length > 0}
            <div class="grid grid-cols-3 p-3 {cardColor()} rounded-md outline outline-1">
                <p class="font-bold text-center col-start-2 text-3xl">Products with no category assigned</p>
                <button class="btn btn-success justify-self-end" on:click={()=>window.location.href="/dashboard/assignCategory"}>Assign</button>
                {#each null_category as product}
                    <div class="grid grid-cols-2 mt-5">
                        <img src="/product_images/{product.id}/1.jpg" alt="{product.name} - image" height="120" width="90"/>
                        <p class='text-lg self-center'>{product.name}</p>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
{:else}
    <Loading />
{/if}