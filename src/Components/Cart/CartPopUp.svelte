<script>
    import {cart_items} from '../../Stores/cart.js'
    
    let total = 0

    $:{
        total = 0
        $cart_items.forEach(item => {
            total += item.Product.price
        });

    }

</script>


{#if $cart_items.length != 0}
    <div tabindex="0" class="mt-10 card card-compact dropdown-content w-52 bg-base-100 shadow">
        <div class="card-body">
            <div class="divide-y-2 divide-solid tablet:text-lg">
                {#each $cart_items as item}
                    <div class="grid py-2">
                        <p>{item.Product.name}</p>
                        <p>R{item.Product.price}</p>
                    </div>
                {/each}
            </div>

            <span class="font-bold text-lg tablet:text-xl">Subtotal: R{total}</span>
            <div class="card-actions">
                <button class="btn btn-primary btn-sm rounded-md shadow-lg" on:click={()=>window.location.href="/cart"}>View cart</button>
            </div>
        </div>
    </div>
{:else}
<div tabindex="0" class="mt-10 card card-compact dropdown-content w-52 bg-base-100 shadow">
    <div class="card-body">
        <p>Cart is empty</p>
    </div>
</div>
{/if}