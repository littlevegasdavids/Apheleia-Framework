const {Router} = require('express')
const router = new Router()
const prisma = require('../prisma/client')
const logger = require('../helpers/logger')
const path = require('path')
const filesystem = require('fs')
const Handlebars = require('handlebars')
const puppeteer = require('puppeteer')

const {send_order_invoice, order_confirmed_email, order_shipped_email} = require('../helpers/nodeMailer')

// *** Create ***
router.post('/', async(req, res)=>{
    try{
        const payment_provider = req.body.payment_provider
        const product_ids = req.body.product_ids
        const total = parseInt(req.body.total)
        const customer_id = parseInt(req.customer_id)
        const shipping_address = req.body.shipping_address
    
        if(isNaN(total)){
            return res.status(400).json({success: false, message: "Total invalid format"})
        }
    
        if(isNaN(customer_id)){
            return res.status(400).json({success: false, message: "Customer ID invalid format"})
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
    
        const order_details = await prisma.order_Details.create({
            data:{
                customer_id: customer_id, 
                total: total,
                status: 0, 
                shipping_address: shipping_address,
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
    
            await prisma.product.update({
                where:{
                    id: product_id
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
                Order_Items: {
                    include:{
                       Product: true 
                    }
                }, 
                Payment_Details: true, 
                Customer: true
            }
        })
    
        create_and_send_invoice(order.id, order.Customer.name, shipping_address, payment_provider, total)
    
        logger.info(`Order API -- Created id: ${order.id}`)
        return res.status(201).json({success: true, message: {order}})
    }
    catch(err){
        logger.error(`Order API -- Something went wrong in create: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
})

async function create_and_send_invoice(order_number, customer_name, shipping_address, payment_service, total){
    try{
        const order = await prisma.order_Details.findUnique({
            where:{
                id: order_number
            }, 
            include:{
                Order_Items: {
                    include:{
                       Product: true 
                    }
                }, 
                Payment_Details: true, 
                Customer: true
            }
        })
        let items = []
        order.Order_Items.forEach(item => {
            items.push(item.Product)
        });
        const filepath = path.join(__dirname, '../', 'email_templates', 'order_invoice.html')
        const source = filesystem.readFileSync(filepath, 'utf-8').toString()
        const template = Handlebars.compile(source)
        const replace = {
            app_heading: 'App Heading',
            order_number: String(order_number),
            customer_name: customer_name, 
            shipping_address: shipping_address, 
            items: items, 
            payment_service: payment_service,  
            total_amount: String(total)
        }
        const html = template(replace)
        
        const browser = await puppeteer.launch({
            headless: true, 
            args: ['--no-sandbox']
        })
        const page = await browser.newPage()
    
        await page.setContent(html)
        
        const invoice_dir = path.join(__dirname, '../', 'public', 'order_invoices', String(order_number))

        filesystem.mkdirSync(invoice_dir)

        const invoice_path = path.join(invoice_dir, `Order #${order_number} - invoice.pdf`)
        
        await page.pdf({path: invoice_path, format: 'A4'})
        await browser.close()

        send_order_invoice(order.Customer.email, invoice_path, order_number, order.Customer.name)
    
        logger.info(`Successfully created Order Invoice #${order_number}`)
    }
    catch(err){
        logger.error(`Order Create Invoice function -- Error creating pdf: ${err.message}`)
    }
    
}

// *** Read ***
// Get Order By Order_Details ID
router.get('/get/:id', async(req, res)=>{
    try{
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
    }
    catch(err){
        logger.error(`Order API -- Something went wrong in read: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

router.get('/get/download/:id', async(req, res)=>{
    try{
        const order_id = parseInt(req.params['id'])
        
        if(isNaN(order_id)){
            return res.status(400).send(`Invalid order id`)
        }

        const order = await prisma.order_Details.findUnique({
            where:{
                id: order_id
            }, 
            include:{
                Customer: true
            }
        })

        if(order === null){
            return res.status(404).send(`Order not found`)
        }

        if(req.customer_id != order.Customer.id){
            return res.status(401).send('Not allowed')
        }

        const pathFile = path.join(__dirname, ".." , 'public', 'order_invoices', `${order_id}`, `Order #${order_id} - invoice.pdf`)

        return res.download(pathFile, function(err){
            if(err){
                throw err
            }
        })
    }
    catch(err){
        logger.error(`Order API -- Something went wrong downloading invoice: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
})

// Get Order By Customer_Id 
router.get('/get/customer_id/:id', async(req, res)=>{
    try{
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
    }
    catch(err){
        logger.error(`Order API -- Something went wrong in getting order via customer id: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// Get Order_Items 
router.get('/get/order_items/:id', async(req, res)=>{
    try{
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
    }
    catch(err){
        logger.error(`Customer API -- Something went wrong in getting order items: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// Get All Orders by order_status = x
router.get('/get/order_status/:status', async (req, res)=>{
    try{
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
    }
    catch(err){
        logger.error(`Order API -- Something went wrong in getting orders via status: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// *** Update ***
// Currently no need for patch methods
router.patch('/status/:id', async(req, res)=>{
    try{
        const status = parseInt(req.body.status)
        const order_id = parseInt(req.params['id'])
    
        if(isNaN(status)){
            return res.status(400).json({success: false, message: "Status invalid format"})
        }
    
        if(isNaN(order_id)){
            return res.status(400).json({success: false, message: "Order Id invalid format"})
        }
    
        if(status != 0 && status != 1 && status != 2 && status != 3){
            return res.status(400).json({success: false, message: "Invalid status number"})
        }
    
        const order = await prisma.order_Details.update({
            where:{
                id: order_id
            }, 
            data:{
                status: status
            }, 
            include:{
                Customer: true
            }
        })
    
        
    
        if(status === 1){
            order_confirmed_email(order.Customer.email, order.id, order.Customer.name, convertDate(order.created_at), order.shipping_address, `http://localhost:9000/order/${order.id}`)
        }
        else if(status === 2){
            order_shipped_email(order.Customer.email, order.id, order.Customer.name, convertDate(order.created_at), order.shipping_address, `http://localhost:9000/order/${order.id}`)
        }
    
        logger.info(`Order API -- Updated order #${order_id} status to #${status}`)
    
        return res.status(200).json({success: true, message:`Updated order ${order_id} to status ${status}`})
    }
    catch(err){
        logger.error(`Order API -- Something went wrong in update order: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// *** Delete ***
router.delete('/:id', async(req, res)=>{
    try{
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
    }
    catch(err){
        logger.error(`Order API -- Something went wrong in delete order: ${err.message}`)
    }
    
})

//All
router.get('/all', async(req, res)=>{
    try{
        const orders = await prisma.order_Details.findMany({
            include:{
                Customer: true,
                Payment_Details: true, 
                Order_Items: {
                    include:{
                        Product: true
                    }
                }
            }, 
            orderBy:{
                created_at: "desc"
            }
        })
    
        return res.status(200).json({success: true, message: {orders}})
    }
    catch(err){
        logger.error(`Order API -- Something went wrong in getting all orders: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// Returns all the orders with status 0 (new orders made)
router.get('/all/new', async (req, res)=>{
    try{
        const orders = await prisma.order_Details.findMany({
            where:{
                status: 0
            }, 
            include:{
                Customer: true,
                Payment_Details: true, 
                Order_Items: {
                    include:{
                        Product: true
                    }
                }
                
            }
        })
    
        return res.status(200).json({success: true, message: {orders}})
    }
    catch(err){
        logger.error(`Order API -- Something went wrong in getting all new orders: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

function convertDate(date){
    try{
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        const d = new Date(date)
        const dateString = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
        return dateString
    }
    catch(err){
        logger.error(`Order API -- Something went wrong in convert date function: ${err.message}`)
        return ""
    }
    
}

module.exports = router