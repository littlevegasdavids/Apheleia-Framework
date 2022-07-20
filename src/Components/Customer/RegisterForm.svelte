<script>
    let showError = false
    let erorrMessage = ""
    let name = ""
    let email = ""
    let password = ""
    let windowLocation = window.location.pathname
    console.log(windowLocation)
    async function createCustomer(){
        name = document.getElementById('name').value
        email = document.getElementById('email').value
        password = document.getElementById('password').value

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
            else if(windowLocation === "/checkoutRegister"){
                window.location.href = "/checkout"
            }
           
        }
        else{
            erorrMessage = result.message
            showError = true
        }
    }

</script>

<div class="grid justify-items-center gap-4">
    <h1 class="font-bold text-3xl">Register</h1>
    <div>
        <p class="">Full Name</p>
        <input class="input input-bordered" type="text" placeholder="Enter Name" id="name"/>
    </div>

    <div>
        <p>Email</p>
        <input class="input input-bordered" type="email" placeholder="Enter Email" id="email"/>
    </div>

    <div>
        <p>Password</p>
        <input class="input input-bordered" type="password" placeholder="Enter Password" id="password"/>
    </div>
    {#if showError}
        <p class="text-center font-bold text-red-600">{erorrMessage}</p>
    {/if}
    <button class="btn btn-success rounded-md" on:click={createCustomer}>Create Account</button>
</div>