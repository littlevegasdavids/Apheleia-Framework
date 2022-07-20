<script>
    import AddToCartBtn from "../Cart/AddToCartBtn.svelte";
    import { Link } from "svelte-routing";
    export let product_name;
    export let product_price;
    export let product_id;
</script>

<div class="grid grid-cols-1 p-3 text-center">
    <Link to="/product/{product_id}">
        <img src="/product_images/image.jpg" alt={product_name + " - image"} class="rounded-lg"/>
    </Link>
    <p class="font-bold pt-1">{product_name}</p>
    <p class="">R{product_price}</p>
    <AddToCartBtn product_id={product_id} product_name={product_name} extraCss={"btn-sm"}/>
</div>