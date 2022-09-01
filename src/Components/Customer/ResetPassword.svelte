<script>
    export let customer_id
    let password = ""
    let confirmPassword = ""
    let showError = false
    let errorMessage = ""
    let showSuccess = false

    async function resetPassword(){
        errorMessage = ""
        showError = false
        if(password === "" || password.match(/^ *$/)){
            errorMessage = "Password input field cannot be empty"
            showError = true
            return
        }

        if(confirmPassword === "" || confirmPassword.match(/^ *$/)){
            errorMessage = "Confirm password input field cannot be empty"
            showError = true
            return
        }

        if(password != confirmPassword){
            errorMessage = "Passwords do not match"
            showError = true
            return
        }
        else{
            const res = await fetch(`/api/customer/reset-password/${customer_id}`, {
                method: 'PATCH', 
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({password: password})
            })
            const result = await res.json()
            if(result.success){
                showSuccess = true
                setTimeout(() => {
                    window.location.href = "/login"
                }, 5000);
            }
            else{
                errorMessage = result.message 
                showError = true
            }
        }
    }
</script>
<div class="grid grid-cols-1 gap-4 justify-items-center max-w-screen-tablet mx-auto">
    <div class="divide-y divide-solid w-full">
        <h1 class="text-center font-bold text-3xl pb-3 tablet:text-4xl">Reset Password</h1>
        <p></p>
    </div>
    
    <div>
        <p class="pb-1 pl-3 tablet:text-xl">New Password</p>
        <input class="input outline outline-1 outline-black " type="password" bind:value={password}/>
    </div>

    <div>
        <p class="pb-1 pl-3 tablet:text-xl">Confirm Password</p>
        <input class="input outline outline-1 outline-black " type="password" bind:value={confirmPassword}/>
    </div>
    
    
    {#if showError}
        <p class="text-red-600 font-bold">{errorMessage}</p>
    {/if}
    <div class="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <button class="btn btn-primary shadow-lg" on:click={resetPassword}>Reset Password</button>
        <button class="btn btn-warning shadow-lg" on:click={()=>window.location.href = "/login"}>Cancel</button>
    </div>
    
    
    {#if showSuccess}
        <p>Password Successfully changed. Redirecting in 5s</p>
    {/if}
</div>