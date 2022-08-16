<script>
import { onMount } from 'svelte';

    import Loading from '../../Loading.svelte'
 
    let loading = true
    let list_categories
    let showError = false
    let errorMessage = ""
    let new_category = false

    let category
    
    onMount(async ()=>{
        const res = await fetch('/api/category/all')
        const result = await res.json()
        if(result.success){
            list_categories = result.categories
            if(list_categories.length == 0){
                new_category = true
            }
            loading = false
        }
        else{
            console.error('Did not recieve list of categories')
            return
        }
    })

    async function createProduct(){
        const form = document.getElementById('createProductForm')
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
        
        if(isNaN(parseInt(data.price))){
            errorMessage = "Product price must be a number"
            showError = true
            return
        }
        
        if(data.price.includes('.') || data.price.includes(',')){
            errorMessage = "Price must be whole number (i.e R100)"
            showError = true
            return
        }

        if(isNaN(data.price)){
            errorMessage = "Invalid input for product price"
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

        if(category === -1 && new_category == false){
            errorMessage = "Please select a category for the product"
            showError = true
            return
        }

        if(new_category == true && (data.new_category_name === "" || data.new_category_name.match(/^ *$/))){
            errorMessage = "The new category name cannot be empty"
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

        if(data.image1.size === 0){
            errorMessage = "Please select a main image for the product"
            showError = true
            return
        }

        if(data.image2.size === 0){
            errorMessage = "Please select a 2nd image for the product"
            showError = true
            return
        }

        if(data.image3.size === 0){
            errorMessage = "Please select a 3rd image for the product"
            showError = true
            return
        }

        showError = false
        form.submit()
        
    }

</script>

<h1 class="text-center font-bold text-3xl underline underline-offset-2">Create New Product</h1>

{#if !loading}
    <form class="w-4/6 bg-primary-content rounded-md outline outline-1 outline-black mx-auto mt-5 p-5" id="createProductForm" on:submit|preventDefault method='post' action="/api/product" enctype="multipart/form-data">
        <div class="grid grid-cols-2">
            <div class="grid grid-cols-1 gap-4">
                <div>
                    <p class="pb-1 text-xl">Name</p>
                    <input type="text" class="input outline outline-1 outline-black" name="name"/>
                </div>
                <div>
                    <p class="pb-1 text-xl">Price (R)</p>
                    <input type="text" class="input outline outline-1 outline-black" name="price"/>
                </div>

                <div>
                    <p class="pb-1 text-xl">Description</p>
                    <textarea id="street_address" type="text" class="input outline outline-1 outline-black " name="description"/>
                </div>

                <div>
                    {#if new_category == true}
                        <p class="pb-1 text-xl">New Category</p>
                    {:else}
                        <p class="pb-1 text-xl">Category</p>
                    {/if}
                    
                    {#if list_categories.length != 0 && new_category == false}
                    <div class="grid grid-cols-2 gap-2">
                        <select class="select outline outline-1 outline-black" id="selectCategory" bind:value={category} form="createProductForm" name="category">
                            <option selected disabled value={-1}>Select Category</option>
                            {#each list_categories as c}
                                <option value={c.id}>{c.name}</option>
                            {/each}
                        </select>
                        <button class="btn rounded-md btn-seondary justify-self-start" on:click={()=>{new_category = !new_category}}>+</button>
                        <input class="hidden" name="new_category_bool" value={false}/>
                    </div>
                    {:else}
                        {#if list_categories.length != 0}
                            <div div class="grid grid-cols-2 gap-2">
                                <input name="new_category_name" class="input outline outline-black outline-1" />
                                <button class="btn rounded-md btn-seondary justify-self-start" on:click={()=>{new_category = !new_category}}>Select</button>
                            </div>
                        {:else}
                            <input name="new_category_name" class="input outline outline-black outline-1" />
                        {/if}
                        <input class="hidden" name="new_category_bool" value={true}/>
                    {/if}
                </div>

                <div>
                    <p class="pb-1 text-xl">
                        Height (i.e 3cm / 3m / N.A)
                    </p>
                    <input class="input outline outline-1 outline-black" type="text" name="dimension_height"/>
                </div>
                <div>
                    <p class="pb-1 text-xl">
                        Width (i.e 3cm / 3m / N.A)
                    </p>
                    <input class="input outline outline-1 outline-black" type="text" name="dimension_width"/>
                </div>
                <div>
                    <p class="pb-1 text-xl">
                        Length (i.e 3cm / 3m / N.A)
                    </p>
                    <input class="input outline outline-1 outline-black" type="text" name="dimension_length"/>
                </div>
            </div>

            <div class="grid grid-cols gap-4">
                <div>
                    <p class="pb-1 text-xl">Main Image</p>
                    <input type="file" name="image1" accept="image/png, image/jpeg"/>
                </div>

                <div>
                    <p class="pb-1 text-xl">Image 2</p>
                    <input type="file" name="image2" accept="image/png, image/jpeg"/>
                </div>

                <div>
                    <p class="pb-1 text-xl">Image 3</p>
                    <input type="file" name="image3" accept="image/png, image/jpeg"/>
                </div>
                
            </div>
        </div>
        <button class="btn btn-success mt-3" on:click={createProduct}>Create product<i class="fa-solid fa-check fa-xl pl-3"></i></button>
        <button class="btn btn-warning rounded-md mt-3" on:click={()=>window.location.href="/dashboard/products"}>Back</button>
        {#if showError}
            <p class="text-red-600 text-center font-bold text-xl">{errorMessage}</p>
        {/if}
    </form>
{:else}
    <Loading />
{/if}
