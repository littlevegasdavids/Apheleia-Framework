const {Router} = require('express')
const logger = require('../helpers/logger')
const prisma = require('../prisma/client')
const router = new Router()

// Create -- DONE
router.post('/', async (req, res)=>{
    const name = req.body.name

    if(name === undefined){
        return res.status(400).json({success: false, message: 'Missing Name in req body'})
    }

    const category = await prisma.product_Category.create({
        data:{
            name: name
        }
    })

    logger.info(`Created new category ${category.id}`)
    return res.status(201).json({success: true, message:{category}})
})

// Read -- DONE
router.get('/get/:id', async (req, res)=>{
    const id = parseInt(req.params['id'])
    
    if(isNaN(id)){
        return res.status(400).json({success: false, message:"Invalid ID"})
    }

    const category = await prisma.product_Category.findUnique({
        where:{
            id: id
        }, 
        include:{
            Product: true
        }
    })

    if(category === null){
        return res.status(404).json({success: false, message: `Category does not exist with id: ${id}`})
    }

    return res.status(200).json({success: true, message:{category}})
})

// Update -- DONE
router.patch('/:id', async (req, res)=>{
    const name = req.body.name
    const id = parseInt(req.params['id'])

    if(name === undefined){
        return res.status(400).json({success: false, message: 'Missing Name in req body'})
    }

    if(isNaN(id)){
        return res.status(400).json({success: false, message:"Invalid ID"})
    }

    const temp = await prisma.product_Category.findUnique({
        where:{
            id: id
        }
    })

    if(temp === null){
        return res.status(404).json({success: false, message: `Category does not exist with id: ${id}`})
    }

    const category = await prisma.product_Category.update({
        where:{
            id: id
        }, 
        data:{
            name: name
        }
    })

    logger.info(`Update category id: ${id}`)

    return res.status(200).json({success: true, message: {category}})
})

router.delete('/:id', async (req, res)=>{
    const id = parseInt(req.params['id'])

    if(isNaN(id)){
        return res.status(400).json({success: false, message:"Invalid id"})
    }

    const temp = await prisma.product_Category.findUnique({
        where:{
            id: id
        }
    })

    if(temp === null){
        return res.status(400).json({success: false, message: `Category does not exist with id: ${id}`})
    }

    await prisma.product_Category.delete({
        where:{
            id: id
        }
    })
})


// All -- DONE
router.get('/all', async (req, res)=>{
    const categories = await prisma.product_Category.findMany({
        include:{
            Product: true
        }
    })

    return res.status(200).json({success: true, categories})
})

module.exports = router