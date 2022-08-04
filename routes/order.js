const {Router} = require('express')
const router = new Router()
const prisma = require('../prisma/client')
const logger = require('../helpers/logger')
const asyncHandler = require('express-async-handler')

// *** Create ***
router.post('/', asyncHandler (async(req, res)=>{
    const payment_provider = req.body.payment_provider
    const product_ids = req.body.product_ids
    const total = parseInt(req.body.total)
    const customer_id = parseInt(req.customer_id)
    const shipping_address = req.body.shipping_address
    const shipping_price = parseInt(req.body.shipping_price)
    const subtotal = parseInt(req.body.subtotal)

    if(isNaN(total)){
        return res.status(400).json({success: false, message: "Total invalid format"})
    }

    if(isNaN(customer_id)){
        return res.status(400).json({success: false, message: "Customer ID invalid format"})
    }


    if(isNaN(shipping_price)){
        return res.status(400).json({success: false, message: "Shipping Price invalid format"})
    }

    if(isNaN(subtotal)){
        return res.status(400).json({success: false, message: "Subtotal invalid format"})
    }

    if(payment_provider === undefined){
        return res.status(400).json({success: false, message:"Payment provider missing in req body"})
    }
    if(product_ids === undefined){
        return res.status(400).json({success: false, message:"Product IDs missing in req body"})
    }
    if(total === undefined){
        return res.status(400).json({success: false, message:"Total missing in req body"})
    }
    if(customer_id === undefined){
        return res.status(400).json({success: false, message:"Customer ID missing in req body"})
    }
    if(shipping_address === undefined){
        return res.status(400).json({success: false, message:"Shipping Address missing in req body"})
    }
    if(shipping_price === undefined){
        return res.status(400).json({success: false, message:"Shipping Price missing in req body"})
    }
    if(subtotal === undefined){
        return res.status(400).json({success: false, message:"Subtotal missing in req body"})
    }

    const order_details = await prisma.order_Details.create({
        data:{
            customer_id: customer_id, 
            total: total,
            status: 0, 
            shipping_address: shipping_address,
            shipping_price: shipping_price,
            subtotal: subtotal
        }
    })

    await prisma.payment_Details.create({
        data:{
            amount: total, 
            provider: payment_provider, 
            order_id: order_details.id
        }
    })

    product_ids.forEach(async (product_id) => {
        await prisma.order_Items.create({
            data:{
                product_id: product_id, 
                order_id: order_details.id
            }
        })

        let product = await prisma.Product.findUnique({
            where:{
                id: product_id
            },
            include:{
                Product_Inventory: true
            }
        })

        await prisma.Product_Inventory.update({
            where:{
                id: product.Product_Inventory.id
            },
            data:{
                sold: true
            }
        })
        logger.info(`Order API -- Product Sold id: ${product_id}`)
    })

    const order = await prisma.order_Details.findUnique({
        where:{
            id: order_details.id
        }, 
        include:{
            Order_Items: true, 
            Payment_Details: true
        }
    })


    logger.info(`Order API -- Created id: ${order.id}`)
    return res.status(201).json({success: true, message: {order}})
}))

// *** Read ***
// Get Order By Order_Details ID
router.get('/get/:id', asyncHandler (async(req, res)=>{
    const id = parseInt(req.params['id'])

    if(isNaN(id)){
        return res.status(400).json({success: false, message: "Order ID invalid format"})
    }

    const order = await prisma.order_Details.findUnique({
        where:{
            id: id
        }, 
        include:{
            Payment_Details: true, 
            Order_Items: true,
        }
    })

    if(order === null){
        return res.status(404).json({success: false, message: `Order with id: ${id} does not exist`})
    }
    
    return res.status(200).json({success: true, message: {order}})
}))

// Get Order By Customer_Id 
router.get('/get/customer_id/:id', asyncHandler (async(req, res)=>{
    const customer_id = parseInt(req.params['id'])

    if(isNaN(customer_id)){
        return res.status(400).json({success: false, message: "Customer ID invalid format"})
    }

    const customer = await prisma.customer.findUnique({
        where:{
            id: customer_id
        }
    })

    if(customer === null){
        return res.status(404).json({success: false, message: `Customer with id: ${customer_id} does not exist`})
    }

    const orders = await prisma.order_Details.findMany({
        where:{
            customer_id: customer_id
        }, 
        include:{
            Payment_Details: true, 
            Order_Items: true
        }
    })

    return res.status(200).json({success: true, message: {orders}})
}))

// Get Order_Items 
router.get('/get/order_items/:id', asyncHandler (async(req, res)=>{
    const id = parseInt(req.params['id'])

    if(isNaN(id)){
        return res.status(400).json({success: false, message: "Order ID invalid format"})
    }

    const order_items = await prisma.order_Items.findMany({
        where:{
            order_id: id
        }, 
        include:{
            Product: true
        }
    })

    if(order_items === null){
        return res.status(404).json({success: false, message: `Order with id: ${id} does not exist`})
    }

    return res.status(200).json({success: true, message: {order_items}})
}))

// Get All Orders by order_status = x
router.get('/get/order_status/:status', asyncHandler (async (req, res)=>{
    const status = parseInt(req.params['status'])
    
    if(isNaN(status)){
        return res.status(400).json({success: false, message: "Status invalid format"})
    }

    const orders = await prisma.order_Details.findMany({
        where:{
            status: status
        }, 
        include:{
            Customer: true, 
            Order_Items: true, 
            Payment_Details: true
        }
    })

    return res.status(200).json({success: true, message: {orders}})
}))

// *** Update ***
// Currently no need for patch methods

// *** Delete ***
router.delete('/:id', asyncHandler (async(req, res)=>{
    const id = parseInt(req.params['id'])

    if(isNaN(id)){
        return res.status(400).json({success: false, message: 'ID invalid format'})
    }

    const order = await prisma.order_Details.findUnique({
        where:{
            id: id
        }
    })

    if(order === null){
        return res.status(404).json({success: false, message: `Order with id: ${id} does not exist`})
    }

    await prisma.order_Details.delete({
        where:{
            id: id
        }
    })

    logger.info(`Order API -- Deleted id: ${id}`)
    return res.status(200).json({success: true, message: `Successfully deleted order id: ${id}`})
}))

//All
router.get('/all', asyncHandler(async(req, res)=>{
    const orders = await prisma.order_Details.findMany({})

    return res.status(200).json({success: true, message: {orders}})
}))

module.exports = router