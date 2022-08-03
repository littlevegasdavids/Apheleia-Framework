<script>
    export let items

    import RemoveItemFromCart from './RemoveFromCartBtn.svelte'
    function goToProductPage(id){
        window.location.href = `/product/${id}`
    }
</script>

<table class="table w-full tablet:text-lg">
    <thead>
        <tr>
            <th></th>
            <th class="tablet:text-xl">Product</th>
            <th class="tablet:text-xl">Price</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {#each items as item}
            <tr class="hover">
                <td on:click={goToProductPage(item.Product.id)}>
                    <div class="grid tablet:hidden">
                        <img src="/product_images/{item.Product.id}/1.jpg" height="30" width="23" alt="{item.Product.name} - image" class="rounded-md shadow-lg"/>
                    </div>
                    <div class="hidden tablet:grid">
                        <img src="/product_images/{item.Product.id}/1.jpg" height="120" width="90" alt="{item.Product.name} - image" class="rounded-md shadow-lg"/>
                    </div>
                </td>
                <td on:click={goToProductPage(item.Product.id)}>
                    {item.Product.name}
                </td>
                <td on:click={goToProductPage(item.Product.id)}>
                    R{item.Product.price}
                </td>
                <td>
                    <RemoveItemFromCart product_id={item.Product.id} extraCss={"btn-sm btn-error"} />
                </td>
            </tr>
        {/each}
    </tbody>
</table>