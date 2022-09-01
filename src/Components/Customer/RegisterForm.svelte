<script>
    let showError = false
    let erorrMessage = ""
    let name = ""
    let email = ""
    let password = ""
    let confirm_password = ""
    let windowLocation = window.location.pathname

    async function createCustomer(){
        name = document.getElementById('name').value
        email = document.getElementById('email').value
        password = document.getElementById('password').value
        confirm_password = document.getElementById('confirm_password').value

        if(name === "" || name.match(/^ *$/)){
            erorrMessage = "Name cannot be empty"
            showError = true
            return
        }
        if(email === "" || email.match(/^ *$/)){
            erorrMessage = "Email cannot be empty"
            showError = true
            return
        }
        if(password === "" || password.match(/^ *$/)){
            erorrMessage = "Password cannot be empty"
            showError = true
            return
        }

        if(confirm_password === "" || confirm_password.match(/^ *$/)){
            erorrMessage = "Confirm Password cannot be empty"
            showError = true
            return
        }

        if(confirm_password != password){
            erorrMessage = "Passwords do not match"
            showError = true
            return
        }
        
        const res = await fetch('/api/customer', {
            method: 'POST',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({
                name: name, 
                email: email,
                password: password
            })
        })

        const result = await res.json()

        if(result.success){
            if(windowLocation === "/register"){
                window.location.href = "/customer"
            }
            else if(windowLocation === "/registerCheckout"){
                window.location.href = "/checkout"
            }
           
        }
        else{
            erorrMessage = result.message
            showError = true
        }
    }

</script>

<div class="grid justify-items-center gap-4 max-w-screen-tablet mx-auto">
    <div class="divide-y divide-solid w-full">
        <h1 class="font-bold text-3xl text-center underline underline-offset-8 pb-5 tablet:text-4xl">Register</h1>
        <p></p>
    </div>

    <div class="grid grid-cols-1 gap-4 p-3 min-w-full justify-items-center">
        <div>
            <p class="pb-1 pl-3 tablet:text-xl">Full Name</p>
            <input class="input  outline outline-1 outline-black" type="text" id="name"/>
        </div>
    
        <div>
            <p class="pb-1 pl-3 tablet:text-xl">Email</p>
            <input class="input  outline outline-1 outline-black" type="email" id="email"/>
        </div>
    
        <div>
            <p class="pb-1 pl-3 tablet:text-xl">Password</p>
            <input class="input  outline outline-1 outline-black" type="password" id="password"/>
        </div>

        <div>
            <p class="pb-1 pl-3 tablet:text-xl">Confirm Password</p>
            <input class="input  outline outline-1 outline-black" type="password" id="confirm_password"/>
        </div>
        {#if showError}
            <p class="text-center font-bold text-red-600">{erorrMessage}</p>
        {/if}
        <div class="grid grid-cols-1 gap-4">
            <button class="btn btn-success shadow-lg" on:click={createCustomer}>Create Account</button>
            <button class="btn btn-warning shadow-lg" on:click={()=>window.location.href = "/login"}>Cancel</button>
        </div>
        
    </div>
    
</div>