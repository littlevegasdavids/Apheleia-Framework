<script>
    import { onMount } from "svelte";
    import Loading from '../Loading.svelte'

    let numItemsSold = 0
    let revenue = 0

    let list_orders
    let orders

    let select_num = 5

    let loading = true

    onMount(async ()=>{
        const res = await fetch('/api/order/all')
        const result = await res.json()

        if(result.success){
            list_orders = result.message.orders
            calculateOrders()
            loading = false
        }
        else{
            console.error(`Error getting all orders: ${result.message}`)
            alert('Erorr getting all orders')
        }
    })

    function calculateOrders(){
        numItemsSold = 0
        revenue = 0
        let dateRange = new Date()

        switch (select_num){
            case 1:
                dateRange.setDate(dateRange.getDate() - 7)
            break;

            case 2:
                dateRange.setMonth(dateRange.getMonth() - 1)
            break;

            case 3:
                dateRange.setMonth(dateRange.getMonth() - 6)
            break;

            case 4:
                dateRange.setFullYear(dateRange.getFullYear() - 1)
            break;

            case 5:
                dateRange = null
            break;
        }
        if(dateRange === null){
            orders = list_orders
            orders.forEach(order => {
                numItemsSold += order.Order_Items.length
                revenue += order.subtotal
            });
        }
        else{
            dateRange.setHours(0,0,0)

            orders = list_orders.filter((order)=>{
                let order_date = new Date(order.created_at)
                return order_date > dateRange
            })
            orders.forEach(order =>{
                numItemsSold += order.Order_Items.length
                revenue += order.subtotal
            })
        }
    }

    let order_colour_index = 0
    function getOrderColour(){
        if(order_colour_index % 2 === 0){
            order_colour_index++
            return 'bg-base-300'
        }
        else{
            order_colour_index++
            return 'bg-base-200'
        }
        
    }
</script>

{#if !loading}
    <div class="grid max-w-6xl mx-auto">
        <h1 class="text-5xl font-bold text-center underline underline-offset-4">Dashboard Home</h1>
        <div class="grid w-8/12 mx-auto pt-5 gap-4">
            <div class="justify-self-end">
                <select class="select outline outline-black outline-1" bind:value={select_num} on:change={calculateOrders}>
                    <option value={1}>Last week</option>
                    <option value={2}>Last month</option>
                    <option value={3}>Last 6 months</option>
                    <option value={4}>Last year</option>
                    <option selected value={5}>All time</option>
                </select>
            </div>
            <div class="p-5 bg-base-300 rounded-xl shadow-xl grid grid-cols-2 gap-4 justify-items-center divide-solid">
                <div class="grid text-3xl">
                    <p>Amount of items sold</p>
                    <p class="text-center font-bold">{numItemsSold}</p>
                </div>
                <div class="grid text-3xl">
                    <p>Revenue made</p>
                    <p class="text-center font-bold">R{revenue}</p>
                </div>
            </div>
            <div>
                <p class="text-3xl font-bold underline underline-offset-4 pt-5 text-center pb-3">Orders</p>
                <div class='grid gap-4 justify-items-center'>
                    {#each orders as order}
                        <div class="{getOrderColour()} rounded-md shadow-xl outline outline-black outline-1 p-3 w-full grid">
                            <p class="text-center font-bold text-xl">#{order.id}</p>
                            <div class="grid grid-cols-2 gap-4">
                                {#each order.Order_Items as item}
                                    {#if item.product_id != null}
                                        <div class="grid grid-cols-3">
                                            <img alt="{item.Product.name}" src="/product_images/{item.Product.id}/1.jpg" height="120" width="90" class="shadow-lg rounded-md outline outline-1 outline-black"/>
                                            <p class="text-start place-self-center">{item.Product.name}</p>
                                        </div>
                                    {:else}
                                        <div class="grid grid-cols-3">
                                            <p class="text-start place-self-center">[Deleted Product]</p>
                                        </div>
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
{:else}
    <Loading />
{/if}




