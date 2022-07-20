require('dotenv').config()
const prisma = require('../prisma/client')
const {Router} = require('express')
const { generateHash, comparePassword } = require('../helpers/hashPass')
const { checkPassword } = require('../helpers/passwordCheck')
const {checkEmail} = require('../helpers/emailCheck')
const logger = require('../helpers/logger')
const {createRegisteredToken} = require('../middleware/session')
const router = new Router()
const jwt = require('jsonwebtoken')
const {sendForgotPassword} = require('../helpers/nodeMailer')

// *** Create *** 
// Create new Customer
router.post('/', async (req, res)=>{
    const name = req.body.name
    const password = req.body.password
    const email = req.body.email

    if(name === undefined){
        return res.status(400).json({success: false, message: 'Missing Name in req body'})
    }
    if(password === undefined){
        return res.status(400).json({success: false, message: 'Missing password in req body'})
    }
    if(email === undefined){
        return res.status(400).json({success: false, message: 'Missing email in req body'})
    }

    const temp = await prisma.customer.findUnique({
        where:{
            email: email
        }
    })

    if(temp != null){
        return res.status(400).json({success: false, message: "Email is already in use"})
    }

    if(!checkEmail(email)){
        return res.status(400).json({success: false, message: "Invalid email"})
    }

    if(!checkPassword(password)){
        return res.status(401).json({success: false, message: 'Password does not pass requirements (Minimum length of 8 characters and must contain letters as well as numbers)'})
    }

    const hash = await generateHash(password)

    const customer = await prisma.customer.create({
        data:{
            email: email,
            name: name, 
            password: hash
        }
    })

    const session_id = req.session_id

    await prisma.shopping_Session.update({
        data:{
            customer_id: customer.id
        }, 
        where:{
            id: session_id
        }
    })

    const token = createRegisteredToken(session_id, customer.id) 
    res.cookie('authCookie', token)

    logger.info(`Customer API -- Created id: ${customer.id}`)

    return res.status(200).json({success: true, message: {customer}})
})

// *** Read ***
// Get Current Customer Info including address
router.get('/get', async(req, res)=>{
    const customer_id = req.customer_id

    if(customer_id === null){
        return res.status(200).json({success: false, message: "Customer not login"})
    }

    const customer = await prisma.customer.findUnique({
        where:{
            id: customer_id
        },
        include:{
            Customer_Address: true, 
            Order_Details: true
        }
    })

    if(customer === null){
        return res.status(404).json({success: false, message: `Cannot find customer with id: ${customer_id}`})
    }

    return res.status(200).json({success: true, message: {customer}})
})

// *** Update ***
// Change customer name
router.patch('/name/:id', async(req, res)=>{
    const id = parseInt(req.params['id'])
    const name = req.body.name

    if(isNaN(id)){
        return res.status(400).json({success: false, message:"Invalid id"})
    }

    if(name === undefined){
        return res.status(400).json({success: false, message: 'Missing Name in req body'})
    }

    let temp = await prisma.customer.findUnique({
        where:{
            id: id
        }
    })

    if(temp === null){
        return res.status(404).json({success: false, message: `Customer does not exist with id: ${temp.id}`})
    }

    await prisma.customer.update({
        where:{
            id: id
        }, 
        data:{
            name: name
        }
    })
    logger.info(`Customer API -- Changed Name id: ${id}`)
    return res.status(200).json({success: true, message: "Succcessfully changed name"})
})

// Change Customer Password
router.patch('/password/:id', async (req, res)=>{
    const id = parseInt(req.params['id'])
    const password = req.body.password

    if(isNaN(id)){
        return res.status(400).json({success: false, message:"Invalid id"})
    }
    
    if(password === undefined){
        return res.status(400).json({success: false, message: 'Missing password in req body'})
    }
    if(!checkPassword(password)){
        return res.status(401).json({success: false, message: 'Password does not pass requirements (Must be length of 8, have numbers and letters)'})
    }

    const temp = await prisma.customer.findUnique({
        where:{
            id: id
        }
    })

    if(temp === null){
        return res.status(404).json({success: false, message: `Customer does not exist with id: ${temp.id}`})
    }

    const hash = await generateHash(password)

    await prisma.customer.update({
        where:{
            id: id
        },
        data:{
            password: hash
        }
    })

    logger.info(`Customer API -- Changed Password: ${id}`)

    return res.status(200).json({success: true, message: `Successfully update customer password id: ${id}`})

})
 
// *** Delete ***
// Delete Customer
router.delete('/:id', async (req, res)=>{
    const id = parseInt(req.params['id'])

    if(isNaN(id)){
        return res.status(400).json({success: false, message:"Invalid id"})
    }

    const temp = await prisma.customer.findUnique({
        where:{
            id: id
        }, 
        include:{
            Shopping_Session: true
        }
    })
    if(temp === null){
        return res.status(404).json({success: false, message: `Customer does not exist with id: ${temp.id}`})
    }

    await prisma.customer.delete({
        where:{
            id: id
        }
    })

    logger.info(`Customer API -- Deleted id: ${id}`)
    return res.status(200).json({success: true, message: `Success delete customer id: ${id}`})
    
})

// Whenever a customer logins, replace there old customer_session with the new one that they have been using
// Edge case: guest session is empty and has no items. Then do not replace the session
router.post('/login', async (req, res)=>{
    const email = req.body.email
    const password = req.body.password

    if(password === undefined){
        return res.status(400).json({success: false, message: 'Missing password in req body'})
    }
    if(email === undefined){
        return res.status(400).json({success: false, message: 'Missing email in req body'})
    }

    const temp = await prisma.customer.findUnique({
        where:{
            email: email
        }
    })

    if(temp === null){
        return res.status(401).json({success: false, message: "Invalid email or password"})
    }

    const passRes = await comparePassword(password, temp.password)

    if(!passRes){
        return res.status(401).json({success: false, message: "Invalid email or password"})
    }

    const customer_id = temp.id
    const session_id = req.session_id

    const cart_items = await prisma.cart_Item.findMany({
        where:{
            session_id: session_id
        }
    })

    
    // Current session has cart items --> Replace old customer session
    if(cart_items.length != 0){
         // Find old session and delete it
         const old_session = await prisma.shopping_Session.findUnique({
            where:{
                customer_id: customer_id
            }
        })
        if(old_session != null){
            await prisma.shopping_Session.delete({
                where:{
                    id: old_session.id
                }
            })
        }
        // Replace new session
        await prisma.shopping_Session.update({
            data:{
                customer_id: customer_id
            }, 
            where:{
                id: session_id
            }
        })
    }

    const token = createRegisteredToken(session_id, customer_id) 
    res.cookie('authCookie', token)

    logger.info(`Customer API -- Login id: ${customer_id}`)

    return res.status(200).json({success: true, message: "Successful login"})
})

router.get('/logout', (req, res)=>{
    res.clearCookie('authCookie')
    logger.info(`Customer API -- Logout id: ${req.customer_id}`)
    return res.redirect('/login')
})

router.post('/forgot-password', async (req, res)=>{
    const email = req.body.email
    if(email === undefined){
        return res.status(400).json({success: false, message: "Email missing in req body"})
    }

    if(!checkEmail(email)){
        return res.status(400).json({success: false, message: 'Invalid email format'})
    }

    const customer = await prisma.customer.findUnique({
        where:{
            email: email
        }
    })
    // User exists and now creating one time link for 15 mins
    if(customer != null){
        const secrete = process.env.TOKEN_PASSWORD_SECRETE + customer.password
        const pass_token = jwt.sign({email: customer.email, id: customer.id}, secrete, {expiresIn: '15m'})
        const link = `http://localhost:9000/reset-password/${customer.id}/${pass_token}`
        logger.info(`Customer API -- Sent forgot password email id: ${req.customer_id}`)
        // Send email to user
        sendForgotPassword(email, link)
    }

    return res.status(200).send({success: true})
})

module.exports = router