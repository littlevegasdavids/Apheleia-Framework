<script>
    import About from '../Components/Home/About.svelte'
    import FAQ from '../Components/Home/Faq.svelte'
    import {Link} from 'svelte-routing'
</script>

<div class="grid divide-y divide-solid max-w-6xl mx-auto text-black">
    <h1 class="font-bold text-3xl pb-5 text-center underline underline-offset-4 tablet:text-4xl browser:text-6xl">Welcome to Emporium Of Curiosity</h1>
    <div class="grid justify-items-center py-5">
        <img src="/main_banner.jpg" alt="banner" class="rounded-md shadow-lg"/>
    </div>
    <div class="grid justify-items-center py-5">
        <Link to="/products">
            <button class="btn btn-primary shadow-lg">See Latest Products</button>
        </Link>
    </div>
    <div class="py-5">
        <About />
    </div>
    <div class="py-5">
        <FAQ />
    </div>

</div>