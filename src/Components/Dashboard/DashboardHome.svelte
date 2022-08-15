<script>
   
</script>

<div class="grid max-w-6xl mx-auto">
    <h1 class="text-5xl font-bold text-center underline underline-offset-4">Dashboard Home</h1>
    <div class="grid grid-cols-2 w-2/6 mx-auto gap-4 pt-3">
        <button class="btn btn-primary rounded-md" on:click={()=>window.location.href="/dashboard/products"}>Products</button>
        <button class="btn btn-secondary rounded-md" on:click={()=>window.location.href="/dashboard/orders"}>Orders</button>
        <button class="btn btn-accent rounded-md" on:click={()=>window.location.href="/dashboard/categories"}>Categories</button>

    </div>
</div>


