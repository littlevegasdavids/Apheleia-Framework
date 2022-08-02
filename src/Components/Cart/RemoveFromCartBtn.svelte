<script>
    export let product_id
    export let extraCss
    async function removeItemFromCart(){
        const res = await fetch(`/api/cart/${product_id}`, {method: "DELETE"})
        const result = await res.json()
        if(result.success){
            window.location.reload()
        }
    }
</script>

<button class="btn {extraCss}" on:click={removeItemFromCart}>X</button>