<script>
    import {show_notification, message} from '../../Stores/notification'
    let password = ""
    let confirmPassword = ""
    let showError = false
    let errorMessage = ""
    

    async function deleteAccount(){
        if(password === "" || password.match(/^ *$/)){
            errorMessage = "Password cannot be empty"
            showError = true
            return
        }
        
        if(confirmPassword === "" || confirmPassword.match(/^ *$/)){
            errorMessage = "Confirm password cannot be empty"
            showError = true
            return
        }

        if(password != confirmPassword){
            errorMessage = "Passwords do not match"
            showError = true
            return
        }

        if(confirm('Are you sure you want to delete your account ?')){
            const res = await fetch(`/api/customer`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: password
                })
            })

            const result = await res.json()
            if(result.success){
                $message = "Successfully deleted account. Redirecting in 3s"
                $show_notification = true
                setTimeout(()=>{
                    window.location.href = "/"
                }, 3000)
            }
            else{
                errorMessage = result.message
            }
        }
    }
</script>

<div class="grid grid-cols-1 divide-y divide-solid">
    <h1 class="font-bold text-3xl underline underline-offset-4 text-center pb-5 tablet:text-4xl">Delete account</h1>
    <div class="grid divide-y divide-solid pt-5 tablet:gap-10 tablet:w-10/12 tablet:mx-auto browser:w-9/12">
        <div class="text-center self-center">
            <p>By deleting your account, you will loose access to all of your order history.</p>
            <p>Please enter your password to confirm that you would like to delete your account.</p>
        </div>
        
        <div class="grid gap-4 justify-items-center">
            <div>
                <p class="pb-1 tablet:text-xl">Password</p>
                <input type="password" class="input outline outline-1 outline-black" bind:value={password}/>
            </div>
            
            <div>
                <p class="pb-1 tablet:text-xl">Confirm password</p>
                <input type="password" class="input outline outline-1 outline-black" bind:value={confirmPassword}/>
            </div>
            {#if showError}
                <p class="font-bold text-red-600 text-center">{errorMessage}</p>
            {/if}
            <button class="btn btn-error" on:click={deleteAccount}>Delete account</button>
        </div>
</div>
</div>
