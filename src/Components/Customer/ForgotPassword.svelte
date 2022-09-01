<script>
    let showError = false
    let errorMessage = ""
    let email
    let showSuccess = false 

    async function sendForgotPassword(){
        const res = await fetch('/api/customer/forgot-password', {
            method: 'POST', 
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({email: email})
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

</script>

<div class="grid grid-cols-1 gap-4 justify-items-center max-w-screen-tablet mx-auto">
    <div class="divide-y divide-solid w-full">
        <h1 class="text-center font-bold text-3xl pb-3 tablet:text-4xl">Forgot Password</h1>
        <p></p>
    </div>
    
    <div class="grid justify-items-center gap-4">
        <div>
            <p class="pb-1 pl-3 tablet:text-xl">Email</p>
            <input type="email" class="input outline outline-1 outline-black " bind:value={email}/>
        </div>
        {#if showError}
            <p class="text-red font-bold">{errorMessage}</p>
        {/if}
        <button class="btn btn-primary shadow-lg" on:click={sendForgotPassword}>Continue</button>

        {#if showSuccess}
            <p>Link has been sent to email. You will receieve the link only if the email is registered to the website</p>
        {/if}
    </div>
</div>