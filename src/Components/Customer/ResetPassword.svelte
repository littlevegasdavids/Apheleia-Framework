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

<h1>Reset Password</h1>

<div class="grid justify-items-center gap-4">
    <input class="input input-bordered" placeholder="New Password" type="password" bind:value={password}/>
    <input class="input input-bordered" placeholder="Confirm New Password" type="password" bind:value={confirmPassword}/>
    {#if showError}
        <p class="text-red-600 font-bold">{errorMessage}</p>
    {/if}
    <button class="btn btn-primary rounded-md" on:click={resetPassword}>Reset Password</button>
    {#if showSuccess}
        <p>Password Successfully changed. Redirecting in 5s</p>
    {/if}
</div>