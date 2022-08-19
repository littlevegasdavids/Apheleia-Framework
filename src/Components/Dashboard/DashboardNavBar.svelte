<script>
    import {Link} from 'svelte-routing'
    const pathname = window.location.pathname
</script>

<div class="navbar bg-base-300 shadow-xl rounded-xl z-40 mx-auto browser:w-8/12">
    <div class="flex-1">
        <Link to="/dashboard">
            <img src="/favicon.png" alt="App Logo" width="60" heigh="60"/>
        </Link>
    </div>
    <div class="flex-none gap-2">
        <Link to="/dashboard/orders">
            <button class="btn btn-ghost rounded-md">Orders</button>
        </Link>
        <Link to="/dashboard/products">
            <button class="btn btn-ghost rounded-md">Products</button>
        </Link>
        <Link to="/dashboard/categories">
            <button class="btn btn-ghost rounded-md">Categories</button>
        </Link>

        {#if !pathname.includes('/login')}
            <button class="btn btn-error rounded-md" on:click={()=>window.location.href = "/dashboard/logout"}>Logout</button>
        {/if}
    </div>
</div>