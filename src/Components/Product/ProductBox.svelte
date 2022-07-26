<script>
    import AddToCartBtn from "../Cart/AddToCartBtn.svelte";
    import { Link } from "svelte-routing";
    export let product_name;
    export let product_price;
    export let product_id;
</script>

<div class="grid grid-cols-1 p-3 text-center">
    <div class="justify-self-center">
        <Link to="/product/{product_id}">
            <img src="/product_images/{product_id}/1.jpg" alt={product_name + " - image"} class="rounded-lg" height="400" width="300" />
        </Link>
    </div>
    
    <p class="font-bold pt-1">{product_name}</p>
    <p class="py-1">R{product_price}</p>
    <div>
        <AddToCartBtn product_id={product_id} product_name={product_name} extraCss={"btn-sm browser:w-8/12"}/>
    </div>
    
</div>