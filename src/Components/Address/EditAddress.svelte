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
        showError = false
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
    <div class="grid grid-cols-1 justify-items-center max-w-screen-tablet mx-auto">
        <div class="divide-y divide-solid w-full">
            <p class="font-bold text-3xl text-center pb-5 underline underline-offset-8 tablet:text-4xl">Edit Address</p>
            <p></p>
        </div>
        
        <div class="p-6 grid grid-cols-1 gap-4 min-w-full justify-items-center">
            <div>
                <p class="tablet:text-xl">Street Address</p>
                <input id="street_address" type="text" class="input input-bordered tablet:input-lg" value={address.street_address}/>
            </div>
            
            <div>
                <p class="tablet:text-xl">Suburb</p>
                <input id="suburb" type="text" class="input input-bordered tablet:input-lg" value={address.suburb}/>
            </div>

            <div>
                <p class="tablet:text-xl">City/Town</p>
                <input id="city" type="text" class="input input-bordered tablet:input-lg" value={address.city}/>
            </div>

            <div>
                <p class="tablet:text-xl">Postal Code</p>
                <input id="postal_code" type="number" class="input input-bordered tablet:input-lg" value={address.postal_code}/>
            </div>

            <div>
                <p class="tablet:text-xl">Country</p>
                <select id="country" class="select select-bordered tablet:select-lg">
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
            <div class="grid grid-cols-1 gap-4 tablet:grid-cols-2">
                <button class="btn btn-success rounded-md" on:click={saveAddress}>Save</button>
                <button class="btn btn-warning rounded-md" on:click={()=>window.location.href="/customer"}>Cancel</button>
            </div>
            

        </div>
    </div>
{/if}

