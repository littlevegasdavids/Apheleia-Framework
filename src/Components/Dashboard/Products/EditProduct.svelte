<script>
    import { onMount } from "svelte";
    import Loading from "../../Loading.svelte";
    export let product_id

    let loading = true
    let showError = false
    let errorMessage = ""

    let product
    let list_categories

    onMount(async ()=>{
        const prod_res = await fetch(`/api/product/get/${product_id}`)
        const prod_result = await prod_res.json()

        if(prod_result.success){
            product = prod_result.message.product
        }
        else{
            alert('Cannot find information on product')
        }

        const cat_res = await fetch('/api/category/all')
        const cat_result = await cat_res.json()
        if(cat_result.success){
            list_categories = cat_result.categories
            loading = false
        }
        else{
            alert('Cannot find list of categories')
        }
    })

    async function editProduct(){
        const form = document.getElementById('editProductForm')
        const formData = new FormData(form);

        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }

        if(data.name === "" || data.name.match(/^ *$/)){
            errorMessage = "Product name cannot be empty"
            showError = true
            return
        }
        if(data.price === "" || data.price.match(/^ *$/)){
            errorMessage = "Product price cannot be empty"
            showError = true
            return
        }
        
        if(data.price.includes('.') || data.price.includes(',')){
            errorMessage = "Price must be whole number (i.e R100)"
            showError = true
            return
        }

        if(isNaN(parseInt(data.price))){
            errorMessage = "Product price must be a number"
            showError = true
            return
        }
        
        if(data.description === "" || data.description.match(/^ *$/)){
            errorMessage = "Product description cannot be empty"
            showError = true
            return
        }

        if(data.description.length < 10){
            errorMessage = "Product description is too short"
            showError = true
            return
        }

        if(data.category === -1){
            errorMessage = "Please select a category for the product"
            showError = true
            return
        }

        if(data.dimension_height === "" || data.dimension_height.match(/^ *$/)){
            errorMessage = "Cannot leave height empty. Please add N.A if value is meant to be empty"
            showError = true 
            return
        }

        if(data.dimension_width === "" || data.dimension_width.match(/^ *$/)){
            errorMessage = "Cannot leave width empty. Please add N.A if value is meant to be empty"
            showError = true 
            return
        }

        if(data.dimension_length === "" || data.dimension_length.match(/^ *$/)){
            errorMessage = "Cannot leave length empty. Please add N.A if value is meant to be empty"
            showError = true 
            return
        }

        showError = false
        form.submit()
    }
</script>

<h1 class="text-center font-bold text-4xl underline underline-offset-2">Edit Product</h1>

{#if !loading}
    <form class="w-4/6 bg-primary-content rounded-md outline outline-1 outline-black mx-auto mt-5 p-5" id="editProductForm" on:submit|preventDefault method='post' action="/api/product/{product_id}" enctype="multipart/form-data">
        <div class="grid grid-cols-2">
            <div class="grid grid-cols-1 gap-4">
                <div>
                    <p class="pb-1 text-xl">Name</p>
                    <input type="text" class="input outline outline-1 outline-black" name="name" bind:value={product.name}/>
                </div>
                <div>
                    <p class="pb-1 text-xl">Price (R)</p>
                    <input type="text" class="input outline outline-1 outline-black" name="price" bind:value={product.price}/>
                </div>

                <div>
                    <p class="pb-1 text-xl">Description</p>
                    <textarea id="street_address" type="text" class="input outline outline-1 outline-black " name="description" bind:value={product.description}/>
                </div>

                <div>
                    <p class="pb-1 text-xl">Category</p>
                    <div class="grid grid-cols-2 gap-2">
                        <select class="select outline outline-1 outline-black" id="selectCategory" form="editProductForm" name="category">
                            <option disabled value={-1}>Select Category</option>
                            {#each list_categories as c}
                                {#if c.id === product.category_id}
                                    <option value={c.id} selected>{c.name}</option>
                                {:else}
                                    <option value={c.id}>{c.name}</option>
                                {/if}
                                
                            {/each}
                        </select>
                    </div>
                </div>

                <div>
                    <p class="pb-1 text-xl">
                        Height (i.e 3cm / 3m / N.A)
                    </p>
                    <input class="input outline outline-1 outline-black" type="text" name="dimension_height" bind:value={product.dimension_height}/>
                </div>
                <div>
                    <p class="pb-1 text-xl">
                        Width (i.e 3cm / 3m / N.A)
                    </p>
                    <input class="input outline outline-1 outline-black" type="text" name="dimension_width" bind:value={product.dimension_width}/>
                </div>
                <div>
                    <p class="pb-1 text-xl">
                        Length (i.e 3cm / 3m / N.A)
                    </p>
                    <input class="input outline outline-1 outline-black" type="text" name="dimension_length" bind:value={product.dimension_length}/>
                </div>

                <div>
                    <p class="pb-1 text-xl">Is Sold</p>
                    <select class="select outline outline-1 outline-black" bind:value={product.Product_Inventory.sold} name="sold">
                        <option disabled>Select</option>
                        <option value={false}>Available</option>
                        <option value={true}>Sold</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols gap-4">
                <div>
                    <p class="pb-1 text-xl">Main Image</p>
                    <div class="grid grid-cols-4 gap-2">
                        <img src="/product_images/{product_id}/1.jpg" alt="{product.name} - image 1" height="120" width="90"/>
                        <input type="file" name="image1" class="col-span-2" accept="image/png, image/jpeg"/>
                    </div>
                </div>

                <div>
                    <p class="pb-1 text-xl">Image 2</p>
                    <div class="grid grid-cols-4 gap-2">
                        <img src="/product_images/{product_id}/2.jpg" alt="{product.name} - image 2" height="120" width="90"/>
                        <input type="file" name="image2" class="col-span-2" accept="image/png, image/jpeg"/>
                    </div>
                </div>

                <div>
                    <p class="pb-1 text-xl">Image 3</p>
                    <div class="grid grid-cols-4 gap-2">
                        <img src="/product_images/{product_id}/3.jpg" alt="{product.name} - image 3" height="120" width="90"/>
                        <input type="file" name="image3" class="col-span-2" accept="image/png, image/jpeg"/>
                    </div>
                </div>
                
            </div>
        </div>
        <button class="btn btn-success mt-3" on:click={editProduct}>Save Changes<i class="fa-solid fa-floppy-disk fa-xl pl-3"></i></button>
        <button class="btn btn-warning rounded-md mt-3" on:click={()=>window.location.href="/dashboard/products"}>Back</button>
        {#if showError}
            <p class="text-red-600 text-center font-bold text-xl">{errorMessage}</p>
        {/if}
    </form>

{:else}
    <Loading />
{/if}