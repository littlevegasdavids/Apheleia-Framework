<script>
    import { onMount } from "svelte";
    import ProductBox from './ProductBox.svelte'

    let loading = true
    let list_categories = ""

    let products = ""
    let list_products
    let category = "-1"
    let sorting = "-1"

    if(window.localStorage.getItem('selected_category') != null){
        category = parseInt(window.localStorage.getItem('selected_category'))
    }
    if(window.localStorage.getItem('selected_sorting') != null){
        sorting = parseInt(window.localStorage.getItem('selected_sorting'))
    }

    onMount(async ()=>{
        
        const cat_res = await fetch('/api/category/all')
        const cat_result = await cat_res.json()
        if(cat_result.success){
             list_categories = cat_result.categories
        }
        else{
            console.error('Did not recieve list of categories')
            return
        }

        const prod_res = await fetch('/api/product/notSold/all')
        const prod_result = await prod_res.json()
        if(prod_result.success){
            products = prod_result.message.products
            list_products = products
            filterProducts()
            loading = false
        }
        else{
            console.error('Did not recieve list of products')
        }
        
    })

    function filterProducts(){

        if(category != "All" && category != "-1"){
            window.localStorage.setItem('selected_category', category)
            list_products = products.filter((product)=>{
                return product.category_id === category
            })
        }
        else{
            window.localStorage.removeItem('selected_category')
            list_products = products
        }

        if(sorting != "None" && sorting != '-1'){
            window.localStorage.setItem('selected_sorting', sorting)
            switch(sorting){
                // Name A-Z
                case 1:
                    list_products = list_products.sort((a,b)=>{
                        a = a.name.toLowerCase()
                        b = b.name.toLowerCase()

                        return (a < b) ? -1 : (a > b) ? 1 : 0; 
                    })
                break;

                // Name Z-A
                case 2:
                    list_products = list_products.sort((a,b)=>{
                            a = a.name.toLowerCase()
                            b = b.name.toLowerCase()

                            return (a > b) ? -1 : (a < b) ? 1 : 0; 
                    })
                break;

                // Price (Low > High)
                case 3:
                    list_products = list_products.sort((a,b)=>{
                        return a.price - b.price
                    })
                break;

                // Price (High > Low)
                case 4:
                    list_products = list_products.sort((a,b)=>{
                        return b.price - a.price
                    })
                break;
            }
        }
        else{
            window.localStorage.removeItem('selected_sorting')
            // This is needed to reset the order of the products to default
            if(sorting === "None"){
                window.location.reload()
            }
        }
        
    }
</script>

{#if !loading}
    <div class="divide-y divide-solid grid">
        <h1 class="text-2xl font-bold text-center pb-5 underline underline-offset-8 tablet:text-4xl">Products</h1>
        <div>
            <div class="grid grid-cols-2 py-5 gap-2 mx-auto tablet:w-8/12">
                <div class="">
                    <p class="font-bold pb-1 tablet:text-xl">Category</p>
                    <select class="select select-bordered w-full" bind:value={category} on:change={filterProducts} id="selectCategory">
                        <option selected disabled value={"-1"}>Select Category</option>
                        <option value="All">All</option>
                        {#each list_categories as c}
                            <option value={c.id}>{c.name}</option>
                        {:else}
                            <option>No categories</option>
                        {/each}
                    </select>
                </div>
                <div class="">
                    <p class="font-bold pb-1 tablet:text-xl">Sort by</p>
                    <select class="select select-bordered w-full" bind:value={sorting} on:change={filterProducts} >
                        <option selected disabled value={"-1"}>Select sorting</option>
                        <option value="None">None</option>
                        <option value={1}>Name {"(A - Z)"}</option>
                        <option value={2}>Name {"(Z - A)"}</option>
                        <option value={3}>Price {"(Low > High)"}</option>
                        <option value={4}>Price {"(High > Low)"}</option>
    
                    </select>
                </div>
                
            </div>
        </div>
        
        <p></p>
    </div>



    <div class="grid grid-cols-2 gap-4 tablet:grid-cols-3">
        {#each list_products as product}
            <ProductBox product_name={product.name} product_price={product.price} product_id={product.id} />
        {/each}
    </div>


{:else}
    <div class="font-bold text-center text-4xl pt-5">
        <p>Loading ... <i class="fas fa-spinner fa-spin"></i></p>
    </div>  
{/if}