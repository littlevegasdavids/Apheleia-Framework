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
<div class="navbar bg-base-300 shadow-xl rounded-xl z-40 w-11/12 mx-auto tablet:w-10/12 browser:w-8/12">
    <div class="flex-1">
        <Link to="/">
            <img src="/favicon.png" alt="App Logo" width="60" heigh="60"/>
        </Link>
    </div>
    <div class="flex-none">
        <div class="tooltip tooltip-accent tooltip-bottom" data-tip="Home Page">
            <Link to="/">
                <button class="btn btn-ghost"><i class="fa-solid fa-house fa-xl"></i></button>
            </Link>
        </div>

        <div class="tooltip tooltip-accent tooltip-bottom" data-tip="Products Page">
            <Link to="/products">
                <button class="btn btn-ghost"><i class="fa-solid fa-bag-shopping fa-xl"></i></button>
            </Link>
        </div>

        <div class="tooltip tooltip-accent tooltip-bottom" data-tip="Search">
            <button class="btn btn-ghost" on:click={()=>window.location.href = "/search"}><i class="fa-solid fa-xl fa-magnifying-glass"></i></button>
        </div>

        <div class="tooltip tooltip-accent tooltip-bottom" data-tip="User Page">
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

