<script>
    let email
    let password
    let showError = false
    let windowLocation = window.location.pathname

    async function loginCustomer(){
        const res = await fetch('/api/customer/login', {
            method: "POST",
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({email: email, password: password})
        })
        const result = await res.json()
        if(result.success){
            if(windowLocation === "/login"){
                window.location.href = "/customer"
            }
            else{
                window.location.href = "/checkout"
            }
        }   
        else{
            console.log(result.message)
            showError = true
        }     
    }

    function regiterCustomer(){
        if(windowLocation === "/checkout"){
            window.location.href = "/checkoutRegister"
        }
        else if(windowLocation === "/login"){
            window.location.href = "/register"
        }
    }
</script>

{#if windowLocation === "/login"}
<h1 class="text-3xl text-center font-extrabold">Login</h1>
{/if}
<div class="grid grid-cols-1 gap-4  p-3">
    <input placeholder="email" type="Email" class="input outline outline-black outline-1" bind:value={email}/>
    <input placeholder="password" type="Password" class="input outline outline-black outline-1" bind:value={password}/>
    {#if showError}
        <p class="font-bold text-red-600 text-center">Invalid Email/Password</p>
    {/if}
    <button class="btn btn-primary rounded-md" on:click={loginCustomer}>Login</button>
    <button class="btn btn-secondary rounded-md" on:click={()=>window.location.href="/forgot-password"}>Forgot Password ?</button>
    <button class="btn btn-accent rounded-md" on:click={regiterCustomer}>Register New Account</button>
</div>