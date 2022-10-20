<script>
    import {Link} from 'svelte-routing'
</script>


<div class="grid divide-y divide-solid max-w-6xl mx-auto text-black">
    <div class="grid justify-items-center py-5">
        <img src="/logo.jpg" alt="main_logo">
    </div>
    <div class="py-5">
        <div class="grid justify-items-center py-5">
            <Link to="/products">
                <button class="btn btn-primary shadow-lg">See Latest Products</button>
            </Link>
        </div>
    </div>
</div>