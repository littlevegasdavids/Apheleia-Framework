<script>
    import { onDestroy, onMount } from "svelte";
    import { fade } from 'svelte/transition';

    let images = [
        {title: "1.jpg", src:"home_images/1.jpg"}, 
        {title: "1.jpg", src:"home_images/2.jpg"}, 
        {title: "1.jpg", src:"home_images/3.jpg"},
        {title: "1.jpg", src:"home_images/4.jpg"},
        {title: "1.jpg", src:"home_images/5.jpg"},
        {title: "1.jpg", src:"home_images/6.jpg"},
        {title: "1.jpg", src:"home_images/7.jpg"}
    ]

    let timer
    let index = -1

    let image_source = images[0].src


    onMount(()=>{
        timer = setInterval(()=>{
            if(index === images.length-1){
                index = 0
            }
            else{
                index++
            }
            image_source = images[index].src
        }, 3000)
    })

    onDestroy(()=>{
        clearInterval(timer)
    })
</script>

<img src={image_source} alt="carosel_image"/>