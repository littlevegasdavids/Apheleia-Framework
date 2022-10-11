<script>
    import {Link} from "svelte-routing"
    import {onMount} from "svelte"
    import CartPopUp from "./Cart/CartPopUp.svelte"
    import {num_items, cart_items} from '../Stores/cart'
    import Loading from '../Components/Loading.svelte'

    let loading = true

    onMount(async ()=>{
        const res = await fetch('/api/cart')
        const result = await res.json()
        if(result.success){
            $cart_items = result.message.cart_items
            $num_items = result.message.cart_items.length
            loading = false
        }
        else{
            console.error(result.message)
            alert('Something went wrong getting cart info for navbar')
        }
    })
    
</script>

{#if !loading}
<div class="navbar bg-white shadow-xl rounded-xl w-11/12 mx-auto tablet:w-10/12 browser:w-8/12">
    <div class="flex-1">
        <Link to="/">
            <img src="/logo.jpg" alt="App Logo" width="90" heigh="90"/>
        </Link>
    </div>

    <div class="flex-none tablet:hidden">

        <div class="dropdown dropdown-left font-bold">
            <p tabindex="0" class="btn btn-ghost m-1"><i class="fa-solid fa-bars fa-xl"></i></p>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-gray-200 rounded-box w-52">
                <li>
                    <a href="/">
                        <i class="fa-solid fa-house pr-2 fa-xl"></i><p class="pt-1">Home</p>
                    </a>
                </li>
                <li>
                    <a href="/products">
                        <i class="fa-solid fa-bag-shopping pr-2 fa-xl"></i><p class="pt-1">Products</p>
                    </a>
                </li>
                <li>
                    <a href="/search">
                        <i class="fa-solid fa-magnifying-glass pr-2 fa-xl"></i><p class="pt-1">Search</p>
                    </a>
                </li>
                <li>
                    <a href="/customer">
                        <i class="fa-solid fa-user pr-2 fa-xl"></i><p class="pt-1">User</p>
                    </a>
                </li>
            </ul>
        </div>

        <div class="indicator dropdown dropdown-end dropdown-hover">
            <span class="indicator-item badge badge-primary rounded-full mr-3">{$num_items}</span> 
            <Link to="/cart">
                <button class="btn btn-ghost btn-sm">
                <i class="fa-solid fa-xl fa-cart-shopping"></i>
            </button>
            </Link>
            <CartPopUp />
        </div>
    </div>
    <div class="hidden tablet:flex tablet:flex-none">
        <div class="tooltip tooltip-primary tooltip-bottom" data-tip="Home Page">
            <Link to="/">
                <button class="btn btn-ghost"><i class="fa-solid fa-house fa-xl"></i></button>
            </Link>
        </div>

        <div class="tooltip tooltip-primary tooltip-bottom" data-tip="Products Page">
            <Link to="/products">
                <button class="btn btn-ghost"><i class="fa-solid fa-bag-shopping fa-xl"></i></button>
            </Link>
        </div>

        <div class="tooltip tooltip-primary tooltip-bottom" data-tip="Search">
            <button class="btn btn-ghost" on:click={()=>window.location.href = "/search"}><i class="fa-solid fa-xl fa-magnifying-glass"></i></button>
        </div>

        <div class="tooltip tooltip-primary tooltip-bottom" data-tip="User Page">
            <Link to="/customer">
                <button class="btn btn-ghost"><i class="fa-solid fa-xl fa-user"></i></button>
            </Link>
        </div>
        
        <div class="indicator dropdown dropdown-end dropdown-hover">
            <span class="indicator-item badge badge-primary rounded-full mr-3">{$num_items}</span> 
            <Link to="/cart">
                <button class="btn btn-ghost btn-sm">
                <i class="fa-solid fa-xl fa-cart-shopping"></i>
            </button>
            </Link>
            <CartPopUp />
        </div>
    </div>
    
</div>

{:else}
    <Loading />
{/if}

