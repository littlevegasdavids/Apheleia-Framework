require('dotenv').config()
const prisma = require('../prisma/client')
const {Router} = require('express')
const logger = require('../helpers/logger')
const router = new Router()

// *** Create *** -- CHECK
router.post('/address', async (req, res)=>{
    const street_address = req.body.street_address
    const suburb = req.body.suburb
    const city = req.body.city
    const country = req.body.country
    const postal_code = req.body.postal_code
    const customer_id = req.customer_id

    if(street_address === undefined){
        return res.status(400).json({success: false, message: 'Missing Street Address in req body'}) 
    }
    if(suburb === undefined){
        return res.status(400).json({success: false, message: 'Missing Suburb in req body'}) 
    }
    if(city === undefined){
        return res.status(400).json({success: false, message: 'Missing City in req body'}) 
    }
    if(country === undefined){
        return res.status(400).json({success: false, message: 'Missing Country in req body'}) 
    }
    if(postal_code === undefined){
        return res.status(400).json({success: false, message: 'Missing Postal Code in req body'}) 
    }
    if(customer_id === undefined){
        return res.status(400).json({success: false, message: 'Missing Customer ID in req body'}) 
    }
    if(isNaN(customer_id)){
        return res.status(400).json({success: false, message: 'Invalid customer ID'})
    }

    const customer = await prisma.customer.findUnique({where:{id: customer_id}})
    
    if(customer === null){
        return res.status(404).json({success: false, message: `Cannot find customer with id: ${customer_id}`})
    }

    const address = await prisma.customer_Address.create({
        data:{
            street_address: street_address,
            suburb: suburb,
            city: city,
            country: country, 
            postal_code: postal_code, 
            customer_id: customer_id
        }
    })

    logger.info(`Customer Address API -- Created id: ${address.id}, customer_id: ${customer_id}`)

    return res.status(201).json({success: true, message:{address_id: address.id}})
    
})

// *** Read ***
router.get('/address/get/:id', async (req, res)=>{
    const id = parseInt(req.params['id'])

    if(isNaN(id)){
        return res.status(400).json({success: false, message:"Invalid id"})
    }

    const address = await prisma.customer_Address.findUnique({
        where:{
            id: id
        }, 
        include:{
            Customer: true
        }
    })

    return res.status(200).json({success: true, message: address})
})

// *** Update ***
router.patch('/address/:id', async (req, res)=>{
    const id = parseInt(req.params['id'])
    const street_address = req.body.street_address
    const city = req.body.city
    const country = req.body.country
    const postal_code = req.body.postal_code

    if(street_address === undefined){
        return res.status(400).json({success: false, message: 'Missing Street Address in req body'}) 
    }
    if(city === undefined){
        return res.status(400).json({success: false, message: 'Missing City in req body'}) 
    }
    if(country === undefined){
        return res.status(400).json({success: false, message: 'Missing Country in req body'}) 
    }
    if(postal_code === undefined){
        return res.status(400).json({success: false, message: 'Missing Postal Code in req body'}) 
    }

    if(isNaN(id)){
        return res.status(400).json({success: false, message:"Invalid id"})
    }

    const temp = await prisma.customer_Address.findUnique({
        where:{
            id: id
        }
    })

    if(temp === null){
        return res.status(404).json({success: false, message: `Address does not exist with id: ${id}`})
    }

    await prisma.customer_Address.update({
        where:{
            id: id
        }, 
        data:{
            street_address: street_address, 
            city: city, 
            country: country, 
            postal_code: postal_code, 
        }
    })

    logger.info(`Customer Address API -- Updated id: ${id}`)
    return res.status(200).json({success: true, message: `Success updated address id: ${id}`})
})

// Delete -- CHECK
router.delete('/address/:id', async(req, res)=>{
    const id = parseInt(req.params['id'])

    if(isNaN(id)){
        return res.status(400).json({success: false, message:"Invalid id"})
    }

    const temp = await prisma.customer_Address.findUnique({
        where:{
            id:id
        },
        include:{
            Customer: true
        }
    })

    if(temp === null){
        return res.status(400).json({success: false, message: `Address does not exist with id: ${id}`})
    }

    if(temp.Customer.id != req.customer_id){
        return res.status(401).json({success: false, message: 'Not Allowed to delete address that does not belong to current user'})
    }

    await prisma.customer_Address.delete({
        where:{
            id: id
        }
    })

    logger.info(`Customer Address API -- Deleted id: ${id}`)

    return res.status(200).json({success: true, message: `Success deleted address id: ${id}`})
})

module.exports = router