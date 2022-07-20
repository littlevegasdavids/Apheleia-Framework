<script>
    export let items
    import RemoveItemFromCart from './RemoveFromCartBtn.svelte'
    function goToProductPage(id){
        window.location.href = `/product/${id}`
    }

</script>

<table class="table table-compact outline outline-black outline-1">
    <thead>
        <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {#each items as item}
        <tr>
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