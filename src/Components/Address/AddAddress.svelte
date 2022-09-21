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
        showError = false
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
                if(windowLocation === "/checkout"){
                    window.location.href = `/checkoutSummary/${result.message.address_id}`
                }
                else{   
                    window.location.href="/customer"
                }
                
            }
            else{
                console.error(result.message)
                alert('Something went wrong trying to add new address')
            }
        }

        
    }
</script>
<div class="grid grid-cols-1 justify-items-center max-w-screen-tablet mx-auto">
    <div class="divide-y divide-solid w-full">
        <h1 class="text-3xl underline underline-offset-8 pb-5 font-bold text-center tablet:text-4xl">Add New Address</h1>
        <p></p>
    </div>
    
    <div class="p-6 grid grid-cols-1 gap-4 min-w-full justify-items-center">
        <div>
            <p class="pb-1 tablet:text-xl">Street Address</p>
            <input id="street_address" type="text" class="input outline outline-1 outline-black " bind:value={street_address}/>
        </div>
        
        <div>
            <p class="pb-1 tablet:text-xl">Suburb</p>
            <input id="suburb" type="text" class="input outline outline-1 outline-black " bind:value={suburb}/>
        </div>

        <div>
            <p class="pb-1 tablet:text-xl">City/Town</p>
            <input id="city" type="text" class="input outline outline-1 outline-black " bind:value={city}/>
        </div>

        <div>
            <p class="pb-1 tablet:text-xl">Postal Code</p>
            <input id="postal_code" type="number" class="input outline outline-1 outline-black " bind:value={postal_code}/>
        </div>

        <div>
            <p class="pb-1  tablet:text-xl">Country</p>
            <select id="country" class="select outline outline-1 outline-black" bind:value={country}>
                <option selected disabled>Select Country</option>
                {#each $countries as country}
                    <option value={country}>{country}</option>
                {/each}
            </select>
        </div>
        {#if showError}
            <p class="text-center text-red-600">{errorMessage}</p>
        {/if}
        <div class="grid grid-cols-1 gap-4 tablet:grid-cols-2">
            <button class="btn btn-success shadow-lg" on:click={addAddress}>Save</button>
            <button class="btn btn-warning shadow-lg" on:click={()=>window.location.href="/customer"}>Cancel</button>
        </div>
        

    </div>
</div>