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
            window.location.href = "/registerCheckout"
        }
        else if(windowLocation === "/login"){
            window.location.href = "/register"
        }
    }

    document.addEventListener('keypress', function(e){
        if(e.key === 'Enter'){
            loginCustomer()
        }
    })

</script>


<div class="grid grid-cols-1 justify-items-center max-w-screen-tablet mx-auto">
    {#if windowLocation === "/login"}
    <div class="divide-y divide-solid w-full">
        <h1 class="text-3xl text-center font-extrabold underline underline-offset-8 pb-5 tablet:text-4xl">Login</h1>
        <p class=""></p>
    </div>

    {/if}
    <div class="grid grid-cols-1 gap-4 p-3 min-w-full justify-items-center">
        <div class="">
            <p class="pb-1 tablet:text-xl">Email</p>
            <input type="Email" class="input outline outline-black outline-1 tablet:input-lg" bind:value={email}/>
        </div>

        <div class="">
            <p class="pb-1 tablet:text-xl">Password</p>
            <input type="Password" class="input outline outline-black outline-1 tablet:input-lg" bind:value={password}/>
        </div>
        
        {#if showError}
            <p class="font-bold text-red-600 text-center">Invalid Email/Password</p>
        {/if}
        <div class="grid grid-cols-1 gap-4">
            <button class="btn btn-primary rounded-md justify-self-center min-w-full tablet:w-6/12" on:click={loginCustomer}>Login</button>
            <button class="btn btn-secondary rounded-md justify-self-center min-w-full tablet:w-6/12" on:click={()=>window.location.href="/forgot-password"}>Forgot Password ?</button>
            <button class="btn btn-accent rounded-md justify-self-center min-w-full tablet:w-6/12" on:click={regiterCustomer}>Register New Account</button>
        </div>
        
    </div>
</div>