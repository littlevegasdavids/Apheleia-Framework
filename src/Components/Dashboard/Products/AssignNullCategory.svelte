<script>
    import { onMount } from "svelte";
    import Loading from "../../Loading.svelte";
    let loading = true
    let null_category
    let categories
    let i = 0

    onMount(async ()=>{
        const null_res = await fetch('/api/product/nullCategory')
        const null_result = await null_res.json()
        
        if(null_result.success){
            null_category = null_result.products
            if(null_category.length === 0){
                window.location.href = "/dashboard/categories"
            }
        }   
        else{
            console.error(null_result.message)
            alert('Cannot get null category products')
        }

        const res = await fetch('/api/category/all')
        const result = await res.json()
        if(result.success){
            categories = result.categories
            console.log(categories)
            loading = false
        }
        else{
            console.error(result.message)
            alert('Cannot get list of categories')
        }
    })

    function cardColor(){
        if(i % 2 === 0){ 
            i++
            return 'bg-primary-content'
        }
        else{
            i++
            return 'bg-base-300'
        }
    }

    async function selectProductCategory(e){
        
        const category_id = e.target.value
        const index = e.target.selectedIndex
        const product_id = e.target.id
        const category_text = e.target[index].text

        if(confirm(`Are you sure you want to change the product to category: ${category_text}`)){
            const res = await fetch(`/api/product/assignCategory/${product_id}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category_id: category_id
                })
            })
            
            const result = await res.json()

            if(result.success){
                window.location.reload()
            }
            else{
                console.error(result.message)
                alert('Error encountered changing product category')
            }
        }
        else{
            window.location.reload()
        }
    }
</script>
{#if !loading}
    <div class="grid w-4/6 mx-auto gap-4">
        <h1 class="font-bold text-4xl underline underline-offset-2 text-center">Assign Products to categories</h1>
        {#each null_category as product}
            <div class="rounded-md outline outline-1 {cardColor()} p-3 grid grid-cols-5">
                <img alt="{product.name} - image" src="/product_images/{product.id}/1.jpg" height="120" width="90"/>
                <p class="text-xl justify-self-start self-center">{product.name}</p>
                <select class="col-span-2 select outline outline-1 self-center" on:input={selectProductCategory} id="{product.id}">
                    <option disabled selected>Choose a category</option>
                    {#each categories as category}
                    <option value={category.id}>{category.name}</option>
                    {/each}
                </select>
            </div>
        {:else}
            {()=>window.location.href="/dashboard/categories"}
        {/each}
    </div>
{:else}
    <Loading />
{/if}
