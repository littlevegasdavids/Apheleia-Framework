require('dotenv').config()
const logger = require('./helpers/logger')
const express = require('express')
const app = express()
const port = process.env.PORT
const prisma = require('./prisma/client')
const jwt = require('jsonwebtoken')
const compression = require('compression')
const asyncHandler = require('express-async-handler')

app.use(compression())
app.use(express.json())


const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(express.urlencoded({extended: true}))

const {checkSession} = require('./middleware/session.js')
app.use(checkSession)
app.use(express.static('public'))

// Error Handle
app.use((err, req, res, next)=>{
    logger.error(err.message)
    return res.status(500).send('Internal server error')
})

const mountRoutes = require('./routes')
mountRoutes(app)

if(process.env.NODE_ENV !== 'test'){
    app.listen(port, ()=>{
        logger.info(`Start Server at http://localhost:${port}`)
    })
}

app.get('/', (req, res)=>{
    return res.sendFile(__dirname + "/public/index.html")
})

app.get('/product/:id', asyncHandler(async (req, res)=>{
    const id = parseInt(req.params['id'])
    if(isNaN(id)){
        return res.status(400).send('Invalid ID')
    }

    const temp = await prisma.product.findUnique({
        where:{
            id: id
        }
    })

    if(temp === null){
        return res.status(404).end('product not found')
    }
    return res.sendFile(__dirname + "/public/index.html")
}))

app.get('/products', (req, res)=>{
    return res.sendFile(__dirname + "/public/index.html")
})

app.get('/cart', (req, res)=>{
    return res.sendFile(__dirname + "/public/index.html")
})

app.get('/login', (req, res)=>{
    if(req.registered){
        return res.redirect('/customer')
    }
    return res.sendFile(__dirname + "/public/index.html")
})

app.get('/register', async(req, res)=>{
    if(req.registered){
        return res.redirect('/')
    }
    return res.sendFile(__dirname + "/public/index.html")
})

app.get('/customer', (req, res)=>{
    if(!req.registered){
        return res.redirect('/login')
    }
    return res.sendFile(__dirname + "/public/index.html")
})

app.get('/customer/changeName/:id', (req, res)=>{
    const id = parseInt(req.params['id'])

    if(isNaN(id)){
        return res.status(400).send('Invalid ID')
    }

    if(!req.registered){
        return res.redirect('/login')
    }

    if(req.customer_id != id){
        return res.status(401).send('Not allowed')
    }

    return res.sendFile(__dirname + "/public/index.html")
})

app.get('/customer/changePassword/:id', (req, res)=>{
    const id = parseInt(req.params['id'])

    if(isNaN(id)){
        return res.status(400).send('Invalid ID')
    }

    if(!req.registered){
        return res.redirect('/login')
    }

    if(req.customer_id != id){
        return res.status(401).send('Not allowed')
    }

    return res.sendFile(__dirname + "/public/index.html")
})

app.get('/editAddress/:id', asyncHandler(async (req, res)=>{
    const address_id = parseInt(req.params['id'])
    if(isNaN(address_id)){
        return res.status(400).send('Invalid ID')
    }
    if(!req.registered){
        return res.redirect('/login')
    }
    const temp = await prisma.customer_Address.findUnique({
        where:{
            id: address_id
        },
        include:{
            Customer: true
        }
    })

    if(temp === null){
        return res.status(404).send('Cannot find address')
    }

    if(temp.Customer.id != req.customer_id){
        return res.status(401).send('Not Allowed')
    }

    return res.sendFile(__dirname + "/public/index.html") 
}))

app.get('/addNewAddress', (req, res)=>{
    if(!req.registered){
        return res.redirect('/login')
    }
    return res.sendFile(__dirname + "/public/index.html")

})

app.get('/order/:id', asyncHandler( async(req, res)=>{
    const order_id = parseInt(req.params['id'])
    if(isNaN(order_id)){
        return res.status(400).send('Invalid ID')
    }
    const temp = await prisma.order_Details.findUnique({
        where:{
            id: order_id
        }
    })

    if(temp === null){
        return res.status(404).send('Cannot find order')
    }

    return res.sendFile(__dirname + "/public/index.html")
}))

app.get('/checkout', (req, res)=>{
    return res.sendFile(__dirname + "/public/index.html")
})

app.get('/registerCheckout', (req, res)=>{
    return res.sendFile(__dirname + "/public/index.html")
})

app.get('/addAddressCheckout', (req, res)=>{
    return res.sendFile(__dirname + "/public/index.html")
})

app.get('/editAddressCheckout/:id', asyncHandler(async(req, res)=>{
    const address_id = parseInt(req.params['id'])
    if(isNaN(address_id)){
        return res.status(400).send('Invalid ID')
    }
    if(!req.registered){
        return res.redirect('/login')
    }
    const temp = await prisma.customer_Address.findUnique({
        where:{
            id: address_id
        },
        include:{
            Customer: true
        }
    })

    if(temp === null){
        return res.status(404).send('Cannot find address')
    }

    if(temp.Customer.id != req.customer_id){
        return res.status(401).send('Not Allowed')
    }

    return res.sendFile(__dirname + "/public/index.html") 
}))

app.get('/checkoutSummary/:address_id', asyncHandler (async(req, res)=>{
    const address_id = parseInt(req.params['address_id'])
    if(isNaN(address_id)){
        return res.status(400).send('Invalid ID')
    }
    if(!req.registered){
        return res.redirect('/login')
    }
    const temp = await prisma.customer_Address.findUnique({
        where:{
            id: address_id
        },
        include:{
            Customer: true
        }
    })

    if(temp === null){
        return res.status(404).send('Cannot find address')
    }

    if(temp.Customer.id != req.customer_id){
        return res.status(401).send('Not Allowed')
    }

    return res.sendFile(__dirname + "/public/index.html") 
}))

app.get('/forgot-password', (req, res)=>{
    if(req.registered){
        return res.redirect('/customer')
    }
    return res.sendFile(__dirname + "/public/index.html") 
})

app.get('/reset-password/:id/:token', asyncHandler (async (req, res)=>{
    const id = parseInt(req.params['id'])
    const token = req.params['token']
    
    if(isNaN(id)){
        return res.status(400).send('Invalid ID')
    }

    // Check if this id exists in DB
    const customer = await prisma.customer.findUnique({
        where:{
            id: id
        }
    })

    if(customer === null){
        return res.status(404).send('Cannot find customer')
    }

    const secrete = process.env.TOKEN_PASSWORD_SECRETE + customer.password
    jwt.verify(token, secrete, (err, data)=>{
        if(err){
            return res.status(401).send('Link has timed out')
        }
        return res.sendFile(__dirname + "/public/index.html")  
    })
}))

app.get('/deleteAccount', (req, res)=>{
    if(!req.registered){
        return res.redirect('/login')
    }
    return res.sendFile(__dirname + "/public/index.html") 
})

setInterval(async()=>{
    // numHours is the number of hours where a cart will be deleted if not used in that amount of hours
    const numHours = 3
    const date = new Date()
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - numHours, date.getMinutes(), date.getSeconds(), date.getMilliseconds())
    
    await prisma.shopping_Session.deleteMany({
        where:{
            modified_at:{
                lt: compareDate
            }, 
            customer_id: null
        }
    })
}, 3000)

