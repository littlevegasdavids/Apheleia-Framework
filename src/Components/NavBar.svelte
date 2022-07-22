<script>
    import {Link} from "svelte-routing"
    import {onMount} from "svelte"
    import {IsSearchOverlayOpen} from '../Stores/IsSearchOverlayOpen'
    import {ShowCartNotification} from '../Stores/CartNotificationPopUp'
    import ShowCartNotificationPopUp from "./Cart/CartNotificationPopUp.svelte";
    import SearchBar from './SearchBar.svelte'
    import {num_items} from '../Stores/num_cart_items'

    onMount(async ()=>{
        const res = await fetch('/api/cart')
        const result = await res.json()
        if(result.success){
            num_items.update(n=> n = result.message.cart_items.length)
        }
    })
    
</script>

<div class="navbar bg-base-300 shadow-lg rounded-xl w-11/12 mx-auto tablet:w-10/12 browser:w-8/12">
    <div class="flex-1">
        <Link to="/">
            <img src="/favicon.png" alt="App Logo" width="60" heigh="60"/>
        </Link>
    </div>
    <div class="flex-none">
        <button class="btn btn-ghost rounded-md" on:click={()=>IsSearchOverlayOpen.update(n=>n=true)}><i class="fa-solid fa-xl fa-magnifying-glass"></i></button>
        <button class="btn btn-ghost rounded-md" on:click={()=>window.location.href="/customer"}><i class="fa-solid fa-xl fa-user"></i></button>

        <Link to="/cart">
            <div class="indicator">
                <span class="indicator-item badge badge-primary rounded-full mr-3">{$num_items}</span> 
                <button class="btn btn-ghost btn-sm rounded-md">
                    <i class="fa-solid fa-xl fa-cart-shopping"></i>
                </button>
            </div>
        </Link>
    </div>
</div>

{#if $IsSearchOverlayOpen}
    <SearchBar />
{/if}

{#if $ShowCartNotification}
    <ShowCartNotificationPopUp />
{/if}