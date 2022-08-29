<script>
    export let items

    import RemoveItemFromCart from './RemoveFromCartBtn.svelte'
    function goToProductPage(id){
        window.location.href = `/product/${id}`
    }
</script>

<table class="table w-full bg-base-200 shadow-md rounded-md tablet:text-lg">
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
                
                <td>
                    <a href="/product/{item.Product.id}" target="_blank">
                        <div class="grid tablet:hidden">
                            <img src="/product_images/{item.Product.id}/1.jpg" height="60" width="45" alt="{item.Product.name} - image" class="rounded-md shadow-lg"/>
                        </div>
                        <div class="hidden tablet:grid">
                            <img src="/product_images/{item.Product.id}/1.jpg" height="120" width="90" alt="{item.Product.name} - image" class="rounded-md shadow-lg"/>
                        </div>
                    </a>
                </td>
                <td>
                    {item.Product.name}
                </td>
                <td>
                    R{item.Product.price}
                </td>
                <td>
                    <RemoveItemFromCart product_id={item.Product.id} extraCss={"btn-sm btn-error tablet:btn-md"} />
                </td>
            </tr>
        {/each}
    </tbody>
</table>