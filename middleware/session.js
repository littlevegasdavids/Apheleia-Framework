require('dotenv').config()
const jwt = require('jsonwebtoken')
const prisma = require('../prisma/client')
const { v4: uuidv4 } = require('uuid')
const asyncHandler = require('express-async-handler')
const secrete = process.env.TOKEN_SECRETE

// Used to generate JWT token and cookie if not found
// Generates a new shopping session as well
const checkSession = asyncHandler (async function checkSession(req, res, next){
    const authCookie = req.cookies.authCookie
    // First time visiting
    if(authCookie === undefined){
        const session = await prisma.shopping_Session.create({data:{id: uuidv4()}})
        const token = createGuestToken(session.id)
        res.cookie('authCookie', token)
        req.session_id = session.id
        req.registered = false
        req.customer_id = null
        return next()
    }
    else{
        jwt.verify(authCookie, secrete, async (err, data)=>{
            if(err){
                res.clearCookie('authCookie')
                return next()
            }
            
            const session_id = data.session_id
            const registered = data.registered
            const customer_id = data.customer_id

            if(customer_id != null){
                //Check that customer stills exist
                const customer = await prisma.customer.findUnique({
                    where:{
                        id: customer_id
                    }
                })
                if(customer === null){
                    res.clearCookie('authCookie')
                    return res.redirect('/')
                }
            }
            
            const shopping_session = await prisma.shopping_Session.findUnique({
                where:{
                    id: session_id
                }
            })

            // Session no longer available and must create new one for user
            if(shopping_session === null){
                // Guest User
                if(!registered){
                    const new_session = await prisma.shopping_Session.create({data:{
                        id: uuidv4()
                    }})
                    const token = createGuestToken(new_session.id)
                    res.cookie('authCookie', token)
                    req.session_id = new_session.id
                    req.registered = false
                    req.customer_id = null
                    return next()
                }
                // Registered user
                else{
                    const new_session = await prisma.shopping_Session.create({
                        data:{
                            id: uuidv4(),
                            customer_id: customer_id
                        }
                    })
                    const token = createRegisteredToken(new_session.id, customer_id)
                    res.cookie('authCookie', token)
                    req.session_id = new_session.id
                    req.registered = true
                    req.customer_id = customer_id
                    return next()
                }   
            }
            // Session is still alive
            else{
                req.session_id = session_id
                req.registered = registered
                req.customer_id = customer_id
                return next()
            }
            
        })
        
    }
    
})

function createGuestToken(session_id){
    return jwt.sign({session_id: session_id, registered: false, customer_id: null}, secrete)
}

function createRegisteredToken(session_id, customer_id){
    return jwt.sign({session_id: session_id, registered: true, customer_id: customer_id}, secrete, {expiresIn: '7d'})
}

module.exports = {checkSession, createRegisteredToken}