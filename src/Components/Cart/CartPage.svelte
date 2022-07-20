<script>
    import { onMount } from "svelte"
    import {Link} from 'svelte-routing'
    import RemoveItemFromCart from './RemoveFromCartBtn.svelte'
    import Yoco from '../Payment/Yoco.svelte'

    let items = null
    let total = 0
    onMount(async ()=>{
        const res = await fetch('/api/cart')
        const result = await res.json()
        if(result.success){
            items = result.message.cart_items
            items.forEach(item => {
                total += item.Product.price
            });
        }
    })

    function goToProductPage(id){
        window.location.href = `/product/${id}`
    }

</script>

<p class="text-2xl font-bold text-center pb-5">Shopping Cart</p>
    
{#if items != null}
    {#if items.length != 0}
        <div class="grid place-items-center gap-4 browser:grid-cols-3">
            <table class="table outline outline-black outline-1 tablet:w-11/12 browser:col-span-2">
                <thead>
                    <tr>
                        <th></th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {#each items as item}
                    <tr>
                        <td on:click={goToProductPage(item.Product.id)}>
                            <img src="/product_images/image.jpg" alt="{item.name} - image" height="90" width="90"/>
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
            <div class="grid justify-center gap-5 p-5">
                <p class="font-extrabold text-xl">Subtotal: R{total}</p>
                <button class="btn btn-primary rounded-md shadow-xl" on:click={()=>window.location.href="/checkout"}>Check out</button>
                <button class="btn btn-secondary rounded-md shadow-xl" on:click={()=>window.location.href="/products"}>Cotinue Shopping</button>
            </div>
            
        </div>
    {:else}
        <p class="text-center">Your Cart Is Empty</p>
        <div class="grid justify-items-center pt-3">
            <button class="btn btn-secondary rounded-md shadow-xl" on:click={()=>window.location.href="/products"}>Cotinue Shopping</button>
        </div>
    {/if}
{:else}
    <p class="text-center font-bold text-xl">Loading ...</p>
{/if}