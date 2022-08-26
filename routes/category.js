const {Router} = require('express')
const logger = require('../helpers/logger')
const prisma = require('../prisma/client')
const router = new Router()

// Create -- DONE
router.post('/', async (req, res)=>{
    try{
        const name = req.body.name

        if(name === undefined){
            return res.status(400).json({success: false, message: 'Missing Name in req body'})
        }
    
        const category = await prisma.product_Category.create({
            data:{
                name: name
            }
        })
    
        logger.info(`Category API -- Created id: ${category.id}`)
        return res.status(201).json({success: true, message:{category}})
    }
    catch(err){
        logger.error(`Category API -- Something went wrong trying to create category: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// Read -- DONE
router.get('/get/:id', async (req, res)=>{
    try{
        const id = parseInt(req.params['id'])
    
        if(isNaN(id)){
            return res.status(400).json({success: false, message:"Invalid ID"})
        }
    
        const category = await prisma.product_Category.findUnique({
            where:{
                id: id
            }, 
            include:{
                Product: {
                    where:{
                        sold: false, 
                        show: true
                    }
                }
            }
        })
    
        if(category === null){
            return res.status(404).json({success: false, message: `Category does not exist with id: ${id}`})
        }
    
        return res.status(200).json({success: true, message:{category}})
    }
    catch(err){
        logger.error(`Category API -- Something went wrong in reading category: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// Update -- DONE
router.patch('/:id', async (req, res)=>{
    try{
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
    
        logger.info(`Category API -- Updated id: ${id}`)
    
        return res.status(200).json({success: true, message: {category}})
    }
    catch(err){
        logger.error(`Category API -- Something went wrong in updating category: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// Delete -- Done
router.delete('/:id', async (req, res)=>{
    try{
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
    
        logger.info(`Category API -- Delete id: ${id}`)
    
        return res.status(200).json({success: true})
    }
    catch(err){
        logger.error(`Category API -- Something went wrong deleting category: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
   
})

// All -- DONE
router.get('/all', async (req, res)=>{
    try{
        const categories = await prisma.product_Category.findMany({
            include:{
                Product: true
            }
        })
    
        return res.status(200).json({success: true, categories})
    }
    catch(err){
        logger.error(`Category API -- Something went wrong trying to get all categories: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

module.exports = router