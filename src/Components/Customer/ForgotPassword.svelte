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

<h1 class="text-center font-bold text-3xl pb-3">Forgot Password</h1>
<div class="grid justify-items-center gap-2">
    <p class="text-start">Email</p>
    <input type="email" class="input input-bordered" placeholder="Enter Email" bind:value={email}/>
    {#if showError}
        <p class="text-red font-bold">{errorMessage}</p>
    {/if}
    <button class="btn btn-primary rounded-md" on:click={sendForgotPassword}>Continue</button>

    {#if showSuccess}
        <p>Link has been sent to email. You will receieve the link only if the email is registered to the website</p>
    {/if}
</div>