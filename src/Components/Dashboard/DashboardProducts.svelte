<script>
    import { onMount } from "svelte";
    import Loading from '../Loading.svelte'

    let products
    let loading = true
    let i = 0

    onMount(async()=>{
        const res = await fetch('/api/product/all')
        const result = await res.json()
        if(result.success){
            products = result.message.products
            loading = false
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

    async function deleteProduct(product_id, product_name){
        if(confirm(`Are you sure you want to delete ${product_name}`)){
            const res = await fetch(`/api/product/${product_id}`, {
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
                alert(`Error encounterd deleting product ${product_name}`)
            } 
        }
    }
</script>

{#if !loading}
    <div class="grid w-4/6 mx-auto gap-4">
        <div class="grid grid-cols-3">
            <p class="font-bold text-center text-3xl underline underline-offset-4 col-start-2">Products</p>
            <button class="btn btn-success rounded-md justify-self-end" on:click={()=>window.location.href = "/dashboard/newProduct"}>Add New Product<i class="fa-solid fa-plus fa-xl pl-3"></i></button>
        </div>
        
        {#each products as product}
            <div class="p-5 outline outline-1 outline-black rounded-md {cardColor()}">
                <div class="grid grid-cols-1">
                    {#if product.Product_Inventory.sold}
                        <p class="p-1 rounded-md font-bold justify-self-end bg-success">Sold</p>
                    {:else}
                        <p class="p-1 rounded-md font-bold justify-self-end bg-warning">Available</p>
                    {/if}
                </div>
                <div class="grid grid-cols-3 gap-4">
                    <img alt="{product.name} - image" src="/product_images/{product.id}/1.jpg" class="rounded-md" height="120" width="90"/>
                    <p class="font-bold text-xl self-center">{product.name}</p>
                    <div class="self-center grid grid-cols-3 gap-2">
                        <div class="tooltip" data-tip="Edit">
                            <button class="btn btn-secondary btn-circle" on:click={()=>window.location.href=`/dashboard/editProduct/${product.id}`}><i class="fa-solid fa-pen-to-square"></i></button>
                        </div>
                        <div class="tooltip" data-tip="View">
                            <a href="/product/{product.id}" target="_blank">
                                <button class="btn btn-primary btn-circle"><i class="fa-solid fa-eye"></i></button>
                            </a> 
                        </div>

                        <div class="tooltip" data-tip="Delete">
                            <button class="btn btn-error btn-circle" on:click={deleteProduct(product.id, product.name)}><i class="fa-solid fa-trash"></i></button>
                        </div>           
                    </div>
                </div>
               
            </div>
        {:else}
            <p>No Products</p>
        {/each}
    </div>
{:else}
    <Loading />
{/if}