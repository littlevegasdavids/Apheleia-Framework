<script>
    export let product_id
    export let extraCss
    async function removeItemFromCart(){
        const res = await fetch(`/api/cart/${product_id}`, {method: "DELETE"})
        const result = await res.json()
        if(result.success){
            window.location.reload()
        }
        else{
            console.error(result.message)
            alert('Something went wrong trying to remove item from cart')
        }
    }
</script>

<button class="btn shadow-lg {extraCss}" on:click={removeItemFromCart}>X</button>