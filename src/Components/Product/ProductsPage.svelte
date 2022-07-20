<script>
    import { onMount } from "svelte";
    import ProductBox from './ProductBox.svelte'

    let products = ""

    onMount(async ()=>{
        const res = await fetch('/api/product/notSold/all')
        const result = await res.json()
        if(result.success){
            products = result.message.products
        }
    })
</script>

<div class="grid grid-cols-2 gap-4 tablet:grid-cols-3">
    {#each products as product}
        <ProductBox product_name={product.name} product_price={product.price} product_id={product.id} />
    {:else}
        <p class="text-center text-xl font-bold col-span-2">Loading ...</p>
    {/each}
</div>