<script>
    let username
    let password
    let showError = false

    async function login(){
        const res = await fetch('/dashboard/login', {
            method: "POST",
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({username: username, password: password})
        })

        const result = await res.json()

        if(result.success){
            window.location.href = "/dashboard"
        }
        else{
            showError = true
        }
    }

    document.addEventListener('keypress', function(e){
        if(e.key === 'Enter'){
            login()
        }
    })
</script>

<div class="grid grid-cols-1 justify-items-center max-w-screen-tablet mx-auto">
    <div class="divide-y divide-solid w-full">
        <h1 class="text-3xl text-center font-extrabold underline underline-offset-8 pb-5 tablet:text-4xl">Login Dashborad</h1>
        <p class=""></p>
    </div>

    <div class="grid grid-cols-1 gap-4 p-3 min-w-full justify-items-center">
        <div class="">
            <p class="pb-1 tablet:text-xl">Username</p>
            <input type="Email" class="input outline outline-black outline-1 " bind:value={username}/>
        </div>

        <div class="">
            <p class="pb-1 tablet:text-xl">Password</p>
            <input type="Password" class="input outline outline-black outline-1 " bind:value={password}/>
        </div>
        
        {#if showError}
            <p class="font-bold text-red-600 text-center">Invalid Login</p>
        {/if}
        <div class="grid grid-cols-1 gap-4">
            <button class="btn btn-primary justify-self-center min-w-full shadow-lg tablet:w-6/12" on:click={login}>Login</button>
        </div>
        
    </div>
</div>