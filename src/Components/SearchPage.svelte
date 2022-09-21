<script>
    import { onMount } from 'svelte';
    import {fade} from 'svelte/transition'
    let products = []
    let searchValue = ""

    let listProducts
    onMount(async ()=>{
        const res = await fetch('/api/product/notSold/all')
        const result = await res.json()
        if(result.success){
            listProducts = result.message.products
        }
        else{
            console.error(result.message)
            alert('Something went wrong trying to get list of products for search bar')
        }
    })

    async function searchProducts(){
        if(searchValue === "" || searchValue.match(/^ *$/)){
            products = []
        }
        else{
            products = listProducts.filter((product)=>{
                if(product.name.toLowerCase().includes(searchValue.toLowerCase())){
                    return product
                }
                else if(product.Product_Category.name.toLowerCase().includes(searchValue.toLowerCase())){
                    return product
                }
            })
        }
    }
</script>

<div in:fade={{duration: 100 }} out:fade={{duration: 100 }} class="grid justify-items-center">
    <div class="w-full bg-white">
        <div class="grid grid-rows-1 place-items-center gap-4">
            <div class="">
                <input type="text" placeholder="Search" class="input outline outline-1 outline-black bg-base-200" bind:value={searchValue} on:input={searchProducts}/>
            </div>
            <div class="divide-y divide-black divide-solid w-full px-3">
                <p></p>
                <p class="py-3 font-bold text-center tablet:text-2xl browser:text-4xl">Products</p>
                <p></p>
            </div>
            
            {#each products as product}
                <div class="grid grid-cols-4 justify-items-start w-10/12 rounded-xl shadow-xl outline outline-solid outline-1 bg-gray-100 text-black browser:text-xl cursor-pointer" on:click={()=>window.location.href=`/product/${product.id}`}>
                    <img src="/product_images/{product.id}/1.jpg" alt="{product.name} - image" width="150" class="p-2 rounded-lg shadow-lg"/>
                    <p class="text-lg font-bold col-span-2 col-start-2 place-self-center justify-start">{product.name}</p>
                </div>
            {:else}
                <p class="browser:text-xl">Empty</p>
            {/each}
        </div>
    </div>
</div>