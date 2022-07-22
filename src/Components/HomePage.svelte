<script>
    import About from '../Components/Home/About.svelte'
    import FAQ from '../Components/Home/Faq.svelte'
</script>

<div class="grid divide-y divide-solid">
    <h1 class="font-bold text-3xl pb-5 text-center underline underline-offset-4 tablet:text-4xl browser:text-6xl">Welcome to App Heading</h1>
    <div class="grid justify-items-center py-5">
        <img src="/main_banner.jpg" alt="banner"/>
    </div>
    <div class="grid justify-items-center py-5">
        <button class="btn btn-primary rounded-md" on:click={()=>window.location.href = "/products"}>See Latest Products</button>
    </div>
    <div class="py-5">
        <About />
    </div>
    <div class="py-5">
        <FAQ />
    </div>

</div>