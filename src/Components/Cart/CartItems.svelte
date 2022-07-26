<script>
    export let items

    import RemoveItemFromCart from './RemoveFromCartBtn.svelte'
    function goToProductPage(id){
        window.location.href = `/product/${id}`
    }
</script>

<table class="table table-zebra outline outline-black outline-1 w-full tablet:text-xl">
    <thead>
        <tr>
            <th></th>
            <th class="text-lg">Product Name</th>
            <th class="text-lg">Price</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {#each items as item}
        <tr>
            <td on:click={goToProductPage(item.Product.id)}>
                <img src="/product_images/{item.Product.id}/1.jpg" alt="{item.name} - image" height="175" width="131"/>
            </td>
            <td on:click={goToProductPage(item.Product.id)}>
                {item.Product.name}
            </td>
            <td on:click={goToProductPage(item.Product.id)}>
                R{item.Product.price}
            </td>
            <td>
                <RemoveItemFromCart product_id={item.Product.id} extraCss={"btn-sm"} />
            </td>
        </tr>
        {/each}
    </tbody>
</table>
