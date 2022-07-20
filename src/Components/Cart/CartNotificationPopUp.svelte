<script>
    import {recent_item} from '../../Stores/recent_cart_item'
    import {ShowCartNotification} from '../../Stores/CartNotificationPopUp'

    function closeNotification(){
        ShowCartNotification.update(n=>false)
    }
</script>

<div class="bg-success p-3 z-50 h-3/5 grid grid-cols-3 justify-items-stretch">
    <div class="col-start-2">
        <p class="text-center"><span class="font-bold">{$recent_item}</span> added to cart.</p>
    </div>
    <button class="justify-self-end col-start-3" on:click={closeNotification}>X</button>
</div>