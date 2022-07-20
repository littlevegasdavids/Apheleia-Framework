<script>
    import {countries} from '../../Stores/countries'

    let windowLocation = window.location.pathname

    let showError = false
    let errorMessage = ""

    let street_address = ""
    let suburb = ""
    let city = ""
    let postal_code = ""
    let country = ""

    async function addAddress(){
        if(street_address === "" || street_address.match(/^ *$/)){
            errorMessage = "Street Address cannot be empty"
            showError = true
            return
        }
        if(suburb === "" || suburb.match(/^ *$/)){
            errorMessage = "Suburb cannot be empty"
            showError = true
            return
        }
        if(city === "" || city.match(/^ *$/)){
            errorMessage = "City cannot be empty"
            showError = true
            return
        }
        if(postal_code === ""){
            errorMessage = "Postal Code be empty"
            showError = true
            return
        }
        
        if(country === "" || country.match(/^ *$/)){
            errorMessage = "Please select a valid country"
            showError = true
            return
        }

        if(confirm('Save Changes ?')){
            const res = await fetch(`/api/customer/address/`, {
                method: 'POST',
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
                if(windowLocation === "/addAddressCheckout"){
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
<div class="grid grid-cols-1 justify-items-center">
    <h1 class="text-3xl font-bold">Add New Address</h1>

    <div class="outline outline-1 outline-black p-6 grid grid-cols-1 gap-4">
        <div>
            <p>Street Address</p>
            <input id="street_address" type="text" class="input input-bordered" bind:value={street_address}/>
        </div>
        
        <div>
            <p>Suburb</p>
            <input id="suburb" type="text" class="input input-bordered" bind:value={suburb}/>
        </div>

        <div>
            <p>City/Town</p>
            <input id="city" type="text" class="input input-bordered" bind:value={city}/>
        </div>

        <div>
            <p>Postal Code</p>
            <input id="postal_code" type="number" class="input input-bordered" bind:value={postal_code}/>
        </div>

        <div>
            <p>Country</p>
            <select id="country" class="select select-bordered" bind:value={country}>
                <option selected disabled>Select Country</option>
                {#each $countries as country}
                    <option value={country}>{country}</option>
                {/each}
            </select>
        </div>
        {#if showError}
            <p class="text-center text-red-600">{errorMessage}</p>
        {/if}
        <button class="btn btn-success rounded-md" on:click={addAddress}>Save</button>
        <button class="btn btn-warning rounded-md" on:click={()=>window.location.href="/customer"}>Cancel</button>

    </div>
</div>