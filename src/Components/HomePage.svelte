<script>
    import About from '../Components/Home/About.svelte'
    import FAQ from '../Components/Home/Faq.svelte'
</script>

<div class="grid gap-10">
    <h1 class="font-bold text-3xl text-center underline underline-offset-4 tablet:text-4xl browser:text-6xl">Welcome to App Heading</h1>
    <div class="grid justify-items-center">
        <img src="/main_banner.jpg" alt="banner"/>
    </div>
    <div class="grid justify-items-center">
        <button class="btn btn-primary rounded-md" on:click={()=>window.location.href = "/products"}>See Latest Products</button>
    </div>
    <About />
    <FAQ />
</div>