<script>
    import { onMount } from "svelte";
    import AddToCartBtn from '../Cart/AddToCartBtn.svelte'
    import {Link} from 'svelte-routing'
    export let product_id;
    let loading = true
    let product
    let other_products
    let sold

    onMount(async ()=>{
        const prod_res = await fetch(`/api/product/get/${product_id}`)
        const prod_result = await prod_res.json()
        if(prod_result.success){
            product = prod_result.message.product
            sold = prod_result.message.product.Product_Inventory.sold

            const other_prod_res = await fetch(`/api/category/get/${product.category_id}`)
            const other_prod_result = await other_prod_res.json()

            if(other_prod_result.success){
                other_products = other_prod_result.message.category.Product
                other_products = other_products.filter(p =>{
                    if(p.id != product_id){
                        return p
                    }
                })
                loading = false
            }
            else{
                console.log(other_prod_result.message)
            }
        }
        else{
            console.log(prod_result.message)
        }

        
    })
</script>

{#if loading}
    <p>Loading Product</p>
{:else}
    <div class="grid bg-primary-content p-4 rounded-3xl shadow-2xl gap-4 text-center outline outline-1 outline-black browser:grid-cols-2">
        <div class="grid justify-items-center browser:">
            <a href="/product_images/image.jpg" target="__blank" class="">
                <img src="/product_images/image.jpg" alt="{product.name} - image" class="rounded-xl"/>
            </a>
        </div>
        <div class="my-auto">
            <div class="pb-3">
                <p class="font-bold text-3xl pb-3">{product.name}</p>
                <p class="font-bold text-xl">R{product.price}</p>
            </div>
            <div class="grid gap-4">
                {#if !sold}
                <AddToCartBtn product_id={product.id} product_name={product.name} extraCss={""}/>
                {:else}
                    <button class="btn">Sold</button>
                {/if}
                <button class="btn btn-secondary rounded-md shadow-lg" on:click={()=>{window.location.href="/products"}}>Back To Product Page</button>
                <p class="font-bold pt-3">Description</p>
                <p>{product.description}</p>
            </div>
        </div>
    </div>
    <div class="grid justify-items-center mt-5">
        <p class="font-bold text-3xl pb-3">You may also like</p>
        <div class="grid grid-cols-3 gap-3 text-center browser:grid-cols-4">
            {#each other_products as other}
                <div class="grid grid-cols-1 bg-primary-content p-3 rounded-2xl shadow-lg browser:hover:bg-secondary">
                    <Link to="/product/{other.id}">
                        <img src="/product_images/image.jpg" alt={other.name + " - image"} class="rounded-lg"/>
                    </Link>
                    <p class="font-bold pt-1">{other.name}</p>
                    <p class="">R{other.price}</p>
                </div>
            {/each}
        </div>
    </div>
{/if}
