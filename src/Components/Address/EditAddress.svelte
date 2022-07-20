<script>
    import { onMount } from "svelte";
    import {countries} from '../../Stores/countries'

    let windowLocation = window.location.pathname

    export let address_id
    let address
    let loading = true
    let showError = false
    let errorMessage = ""

    onMount(async ()=>{
        const res = await fetch(`/api/customer/address/get/${address_id}`)
        const result = await res.json()
        if(result.success){
            address = result.message
            loading = false
        }
    })

    async function saveAddress(){
        let street_address = document.getElementById('street_address').value
        if(street_address === "" || street_address.match(/^ *$/)){
            errorMessage = "Street Address cannot be empty"
            showError = true
            return
        }
        
        let suburb = document.getElementById('suburb').value
        if(suburb === "" || suburb.match(/^ *$/)){
            errorMessage = "Suburb cannot be empty"
            showError = true
            return
        }

        let city = document.getElementById('city').value
        if(city === "" || city.match(/^ *$/)){
            errorMessage = "City/Town cannot be empty"
            showError = true
            return
        }

        let postal_code = document.getElementById('postal_code').value
        if(postal_code === ""){
            errorMessage = "Postal Code cannot be empty"
            showError = true
            return
        }
        let country = document.getElementById('country').value

        if(confirm('Are you sure you want to the changes ?')){
            const res = await fetch(`/api/customer/address/${address_id}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    street_address: street_address,
                    suburb: suburb,
                    city: city,
                    postal_code: postal_code + "",
                    country: country
                })
            })
            const result = await res.json()
            if(result.success){
                if(windowLocation === `/editAddressCheckout/${address_id}`){
                    window.location.href = "/checkout"
                }
                else{
                    window.location.href="/customer"
                }
                
            }
            else{
                console.log(result.message)
            }
        }
        
    }
</script>

{#if loading}
    <p class="font-bold text-center">Loading ...</p>
{:else}
    <div class="grid grid-cols-1 justify-items-center">
        <p class="font-bold text-3xl">Edit Address</p>
        <div class="outline outline-1 outline-black p-6 grid grid-cols-1 gap-4">
            <div>
                <p>Street Address</p>
                <input id="street_address" type="text" class="input input-bordered" value={address.street_address}/>
            </div>
            
            <div>
                <p>Suburb</p>
                <input id="suburb" type="text" class="input input-bordered" value={address.suburb}/>
            </div>

            <div>
                <p>City/Town</p>
                <input id="city" type="text" class="input input-bordered" value={address.city}/>
            </div>

            <div>
                <p>Postal Code</p>
                <input id="postal_code" type="number" class="input input-bordered" value={address.postal_code}/>
            </div>

            <div>
                <p>Country</p>
                <select id="country" class="select select-bordered">
                    {#each $countries as country}
                        {#if address.country === country}
                            <option selected>{country}</option>
                        {:else}
                            <option value={country}>{country}</option>
                        {/if}
                    {/each}
                </select>
            </div>
            {#if showError}
                <p class="text-center text-red-600">{errorMessage}</p>
            {/if}
            <button class="btn btn-success rounded-md" on:click={saveAddress}>Save</button>
            <button class="btn btn-warning rounded-md" on:click={()=>window.location.href="/customer"}>Cancel</button>

        </div>
    </div>
{/if}

