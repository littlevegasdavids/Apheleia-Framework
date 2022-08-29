<script>
    export let total
    export let items
    export let shipping_address
    export let shipping_price
    export let subtotal

    let item_ids = []
    items.forEach(element => {
         item_ids.push(element.product_id)
    });

    let yoco = new window.YocoSDK({
        publicKey:'pk_test_0b55572fgVblVmK37a54'
    })

    function sendYocoPayment(){
        yoco.showPopup({
            amountInCents: total,
            currency: 'ZAR',
            name: 'App Heading',
            description: '',
            callback: async function(result){
                if(result.error){
                    const errorMessage = result.error.message 
                    alert('Unable to make payment: ' + errorMessage)
                }
                else{
                    // Checking items are not sold one more time
                    item_ids.forEach(async (id)=>{
                        const res = await fetch(`/api/product/isSold/${id}`)
                        const result = await res.json()
                        if(result.success){
                            if(result.sold){
                                window.location.href = '/cart'
                            }
                        }
                    })

                    const pay_res = await fetch('/api/payment/yocoPayment', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json', 
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token_id: result.id,
                            total: total
                        })
                    })

                    const pay_result = await pay_res.json()
                    if(pay_result.success){
                        
                        const order_res = await fetch('/api/order', {
                            method: 'POST',
                            headers: {
                            'Accept': 'application/json', 
                            'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                payment_provider: 'Yoco', 
                                product_ids: item_ids,
                                total: (total/100),
                                shipping_address: shipping_address,
                                subtotal: subtotal, 
                                shipping_price: shipping_price
                            })
                        })

                        const order_result = await order_res.json()
                        
                        if(order_result.success){
                            window.location.href = `/order/${order_result.message.order.id}`
                        }
                        
                    }
                    else{
                        // Show error message on checkout page
                        if(result.message === "Card declined"){
                            alert('Card declined. Please contact your bank or try again with another card')
                        }
                        else{
                            alert('Internal server error. You have not been charged. Please try again.')
                        }
                    }
                }
            }
        })
    }
</script>

<button id="checkout-button" class="btn btn-accent shadow-lg" on:click={sendYocoPayment}>Pay With Yoco<i class="fa-solid fa-money-check-dollar fa-lg pl-2"></i></button>

