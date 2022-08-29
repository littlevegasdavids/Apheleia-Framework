const {Router} = require('express')
const router = new Router()
const logger = require('../helpers/logger')
const prisma = require('../prisma/client')

// *** CREATE ***
// Creating a session cart is in middleware session.js

// *** READ ***
// Returns all products in cart including the information about it
router.get('/', async (req, res)=>{
    try{
        const session_id = req.session_id
        const session = await prisma.shopping_Session.findUnique({
            where:{
                id: session_id
            }
        })
        const cart_items = await prisma.cart_Item.findMany({
            where:{
                session_id: session_id
            },
            include:{
                Product: true
            }
        })
    
        return res.status(200).json({success: true, message: {session, cart_items}})
    }
    catch(err){
        logger.error(`Cart API -- Something went wrong trying to read cart`)
        return res.status(500).send('Something went wrong')
    }
    
})

// Returns true or false whether an item is already in a cart
// Used to determine state of AddToCartBtn.svelte
router.get('/isInCart/:product_id', async (req, res)=>{
    try{
        const product_id = parseInt(req.params['product_id'])
        const session_id = req.session_id
        
        if(isNaN(product_id)){
            return res.status(400).json({success: false, message:"Invalid product_id"})
    
        }
        if(product_id === null){
            return res.status(400).json({success: false, message: 'Missing product_id in req body'})
        }
    
        const check = await prisma.cart_Item.findFirst({
            where:{
                session_id: session_id, 
                product_id: product_id
            }
        })
        if(check === null){
            return res.status(200).json({success: true, message: false})
        }
        else{
            return res.status(200).json({success: true, message: true})
        }
    }
    catch(err){
        logger.error(`Cart API -- Something went wrong trying to determine if product is in cart: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// *** Update ***
// Add new item to cart
router.patch('/:product_id', async(req, res)=>{
    try{
        const product_id = parseInt(req.params['product_id'])
    
        if(isNaN(product_id)){
            return res.status(400).json({success: false, message:"Invalid product_id"})
    
        }
        
        if(product_id === null){
            return res.status(400).json({success: false, message: 'Missing product_id in req body'})
        }
    
        const temp = await prisma.product.findUnique({
            where:{
                id: product_id
            }
        })
    
        if(temp === null){
            return res.status(404).json({success: false, message: `Cannot find product with id: ${product_id}`})
        }
        if(temp.sold){
            return res.status(400).json({success: false, message: 'Cannot add sold product to cart'})
        }
    
        const session_id = req.session_id
    
        // Try catch block implemented in case user has already added product to cart
        try{
            await prisma.cart_Item.create({
                data:{
                    session_id: session_id, 
                    product_id: product_id
                }
            })
            
            const cart_items = await prisma.cart_Item.findMany({
                where:{
                    session_id: session_id
                },
                include:{
                    Product: true
                }
            })
            
            return res.status(200).json({success: true, message: {cart_items}})
    
        }
        catch(err){
            return res.status(400).json({success: false, message: "Cannot add item to cart if it is already added"})
        }
    }
    catch(err){
        logger.error(`Cart API -- Something went wrong adding product to cart: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// *** Delete ***
// Remove item from cart
router.delete('/:product_id', async(req, res)=>{
    try{
        const product_id = parseInt(req.params['product_id'])

        if(isNaN(product_id)){
            return res.status(400).json({success: false, message:"Invalid product_id"})
    
        }
    
        const temp = await prisma.product.findUnique({
            where:{
                id: product_id
            }
        })
    
        if(temp === null){
            return res.status(404).json({success: false, message: `Cannot find product with id: ${product_id}`})
        }
    
        const session_id = req.session_id
    
        // Catch if cart does not have item in cart to begin with
        try{
            await prisma.cart_Item.deleteMany({
                where:{
                    session_id: session_id, 
                    product_id: product_id
                }
            })
            const cart_items = await prisma.cart_Item.findMany({
                where:{
                    session_id: session_id
                },
                include:{
                    Product: true
                }
            })
            return res.status(200).json({success: true, message: {cart_items}})
    
        }
        catch(err){
            logger.error(`Error in removing product ${product_id} from cart ${session_id}: ${err.message}`)
            return res.status(500).json({success: false, message: 'Something went wrong removing product from cart'})
        }
    }
    catch(err){
        logger.error(`Cart API -- Something went wrong trying to remove product from cart: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

module.exports = router