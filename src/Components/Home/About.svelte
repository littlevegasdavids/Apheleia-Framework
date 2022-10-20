<script>
    let images = [
        {title: "1.jpg", src:"home_images/1.jpg"}, 
        {title: "1.jpg", src:"home_images/2.jpg"}, 
        {title: "1.jpg", src:"home_images/3.jpg"},
        {title: "1.jpg", src:"home_images/4.jpg"},
        {title: "1.jpg", src:"home_images/5.jpg"},
        {title: "1.jpg", src:"home_images/6.jpg"},
        {title: "1.jpg", src:"home_images/7.jpg"}
    ]
</script>

<div class="text-center grid gap-3">
    <h1 class="text-3xl font-bold underline underline-offset-4 pb-3 tablet:text-5xl">About</h1>
    <div class="grid grid-cols-1 tablet:grid-cols-2 gap-6">
        <p class="tablet:self-center browser:text-xl">
            Colin Davids has been an active collector in the industry of collecting vintage pieces for over 40 years. Ramona Davids met Colin in the early 90's and was instantly deeply passionate of the idea of these beautiful pieces that have been maintained for years and are incredibly well-looked-after.
        </p>
        <img src={images[0].src} alt="home_image_0" class="shadow-lg tablet:self-center "/>
        <p class="tablet:self-center browser:text-xl">
            Colin started dabbling in the retail world in the early 2000's with his brand "Memphis" in Parktown, Johannesburg, to then move to 44 Stanley rebranding to "Vintage Cowboys" and then to "Emporium Of Curiosity" where Ramona ran the current shop. Emporium of Curiosity, situated in Melville, Johannesburg, is a treasure trove of vintage pieces and collectibles.
        </p>
        <img src={images[2].src} alt="home_image_2" class="shadow-lg tablet:self-center"/>
        <p class="tablet:self-center browser:text-xl">
            This dedicated couple specifically seek out rare, unique, charming pieces from past to present in the best light. Finding these treasures is always exciting and satisfying for Colin and ramona who both have a keen eye for the unusual and rare pieces. "Emporium of Curiosity" is an Emporium not specific in any decade or style but collect pieces form the 19th Century to present.
        </p>
        <img src={images[4].src} alt="home_image_4" class="shadow-lg tablet:self-center"/>
        <p class="italic tablet:col-span-2 browser:text-xl">
            "We love discovering amazing pieces, restoring and turning them into premium pieces our clientele want to purchace to be apart of their special space in their abode. Pieces in store including exquisite decor and interior fashion recycles in a full circle, as always say to clients: One person's discarded piece is someone's new exciting find."
        </p>
    </div>
    <p>

        
    </p>
</div>