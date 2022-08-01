const {Router} = require('express')
const router = new Router()
const logger = require('../helpers/logger')
const prisma = require('../prisma/client')

// *** Create ***
router.post('/', async (req, res) =>{
    const name = req.body.name
    let price = req.body.price
    const description = req.body.description
    const categoryID = req.body.category_id

    if(name === undefined){
        return res.status(400).json({success: false, message: 'Missing Name in req body'})
    }
    if(price === undefined){
        return res.status(400).json({success: false, message: 'Missing Price in req body'})
    }
    if(description === undefined){
        return res.status(400).json({success: false, message: 'Missing Description in req body'})
    }
    if(categoryID === undefined){
        return res.status(400).json({success: false, message: 'Missing Category ID in req body'})
    }

    // Check if price is whole integer
    price = parseInt(price)
    if(isNaN(price)){
        return res.status(400).json({success: false, message:"Price invalid format"})
    }

    // Checking that category exists
    const category = await prisma.product_Category.findUnique({
        where:{
            id: categoryID
        }
    })

    if(category === null){
        return res.status(404).json({success: false, message: `Category does not exist with id: ${categoryID}`})
    }

    // Creating inventory for the new product
    const inventory = await prisma.product_Inventory.create({data:{}})

    if(inventory == null){
        logger.error('Create new inventory: null inventory return')
        return res.status(500).json({success: false, message: "Error encountered creating new product"})
    }
    
    const newProduct = await prisma.Product.create({
        data:{
            name: name, 
            price: parseInt(price), 
            description: description, 
            inventory_id: inventory.id, 
            category_id: categoryID
        }
    })

    if(newProduct == null){
        logger.error('Create new product: null product return')
        return res.status(500).json({success: false, message: "Error encountered creating new product"})
    }
    
    logger.info(`Product API -- Created id: ${newProduct.id}`)

    return res.status(201).json({success: true, message:{newProduct}})
})

// *** Read ***
// Get By ID
router.get('/get/:id', async (req, res)=>{
    const id = parseInt(req.params['id'])
    
    if(isNaN(id)){
        return res.status(400).json({success: false, message:"Invalid ID"})
    }
    
    const product = await prisma.Product.findUnique({   
        where:{
            id: id
        }, 
        include:{
            Product_Inventory: true
        }
    })

    if(product == null){
        return res.status(404).json({success: false, message: `Product does not exist with id: ${id}`})
    }

    return res.status(200).json({success: true, message: {product}})
})

// Return all products that aren't sold
router.get('/notSold/all', async(req, res)=>{
    const products = await prisma.Product.findMany({
        include:{
            Product_Category: true
        },
        where:{
            Product_Inventory:{
                sold: false
            }
        }
    })

    return res.status(200).json({success: true, message:{products}})
})


// Returns true or false if the item is sold
router.get('/isSold/:id', async(req, res)=>{
    const product_id = parseInt(req.params['id'])

    if(isNaN(product_id)){
        return res.status(400).json({success: false, message: 'ID invalid format'})
    }

    if(product_id === undefined){
        return res.status(400).json({success: false, message: 'Product ID not in req body'})
    }

    const product = await prisma.product.findUnique({
        where:{
            id: product_id
        }, 
        include: {
            Product_Inventory: true
        }
    })

    if(product === null){
        return res.status(404).json({success: false, message: `Cannot find product with id: ${product_id}`})
    }

    if(product.Product_Inventory.sold){
        return res.status(200).json({success: true, sold: true})
    }
    else{
        return res.status(200).json({success: true, sold: false})
    }
})

// *** Update ***
router.patch('/:id', async (req, res)=>{
    const id = parseInt(req.params['id'])

    if(isNaN(id)){
        return res.status(400).json({success: false, message:"Invalid ID"})
    }

    const name = req.body.name
    const price = req.body.price
    const description = req.body.description
    const categoryID = req.body.category_id
    const sold = req.body.sold

    if(name === undefined){
        return res.status(400).json({success: false, message: 'Missing Name in req body'})
    }
    if(price === undefined){
        return res.status(400).json({success: false, message: 'Missing Price in req body'})
    }
    if(description === undefined){
        return res.status(400).json({success: false, message: 'Missing Description in req body'})
    }
    if(categoryID === undefined){
        return res.status(400).json({success: false, message: 'Missing Category ID in req body'})
    }
    if(sold === undefined){
        return res.status(400).json({success: false, message: 'Missing Sold in req body'})
    }

    const category = await prisma.product_Category.findUnique({
        where:{
            id: categoryID
        }
    })

    if(category === null){
        return res.status(400).json({success: false, message: `Category does not exist with id: ${categoryID}`})
    }
    
    const temp = await prisma.product.findUnique({
        where:{
            id: id
        }, 
        include:{
            Product_Inventory: true
        }
    })

    if(temp === null){
        return res.status(400).json({success: false, message: `Product does not exist with id: ${id}`})
    }

    await prisma.product_Inventory.update({
        where:{
            id: temp.Product_Inventory.id
        }, 
        data:{
            sold: sold
        }
    })

    const product = await prisma.Product.update({
        where:{ 
            id: id
        },
        data:{
            name: name, 
            price: price, 
            description: description, 
            category_id: categoryID
        }, 
        include:{
            Product_Inventory: true
        }
    })

    logger.info(`Product API -- Updated id: ${id}`)
    if(sold){
        logger.info(`Product API -- Set to Sold id: ${id}`)
    }
    if(categoryID != temp.category_id){
        logger.info(`Product API -- Changed Category id: ${id}, new_category_id: ${temp.category_id}`)
    }
    
    return res.status(200).json({success: true, message: {product}})
})

// *** Delete ***
router.delete('/:id', async (req, res)=>{
    const id = parseInt(req.params['id'])

    if(isNaN(id)){
        return res.status(400).json({success: false, message:"Invalid ID"})
    }

    const temp = await prisma.product.findUnique({
        where:{
            id: id
        }
    })

    if(temp === null){
        return res.status(400).json({success: false, message: `Product does not exist with id: ${id}`})
    }

    await prisma.Product.delete({
        where:{
            id: id
        }
    })

    await prisma.product_Inventory.delete({
        where:{
            id: temp.inventory_id
        }
    })

    logger.info(`Product API -- Deleted id: ${id}`)

    return res.status(200).json({success: true, message: `Product successfully deleted id: ${id}`})
})

// All
router.get('/all', async (req, res)=>{
    const products = await prisma.Product.findMany({
        include:{
            Product_Inventory: true
        }
    })

    return res.status(200).json({success: true, message:{products}})
})


module.exports = router