const {Router} = require('express')
const router = new Router()
const logger = require('../helpers/logger')
const prisma = require('../prisma/client')
const formidable = require('formidable')
const fileSystem = require('fs')
const path = require('path')
const {compressImages, compressImage} = require('../helpers/compressImages')

// *** Create ***

router.post('/', async (req, res) =>{
    try{
        const form = formidable({})
        form.parse(req, async (err, fields, files)=>{
            if(err){
                logger.error(`Error encountered with creating product in formidable: ${err.message}`)
                return res.status(500).send('Internal server error')
            }
    
            const name = fields.name
            const price = parseInt(fields.price)
    
            if(isNaN(price)){
                return res.status(500).send('Invalid price format')
            }
    
            const description = fields.description
            let category = parseInt(fields.category)
            const new_category_bool = fields.new_category_bool
            const new_category_name = fields.new_category_name
            const dimension_height = fields.dimension_height
            const dimension_width = fields.dimension_width
            const dimension_length = fields.dimension_length
            let show
            if(fields.show === "true"){
                show = true
            }
            else{
                show = false
            }
    
    
            const image1 = files.image1
            const image2 = files.image2
            const image3 = files.image3
    
            if(new_category_bool === "true"){
                let new_category = await prisma.product_Category.create({
                    data:{
                        name: new_category_name
                    }
                })
    
                category = new_category.id
            }
    
            const new_product = await prisma.product.create({
                data:{
                    name:name,
                    price:price,
                    description: description, 
                    category_id: category, 
                    dimension_height: dimension_height, 
                    dimension_length: dimension_length,
                    dimension_width: dimension_width, 
                    show: show, 
                    sold: false
                }
            })
    
            const new_product_id = String(new_product.id)
    
            fileSystem.mkdirSync(path.join(__dirname, "../", "public", "product_images", new_product_id), (err)=>{
                if(err){
                    logger.error(`Error creating new directory for images id: ${new_product_id}`)
                    return res.status(500).send('Internal Sever Error')
                }
            })
    
            var oldPath = image1.filepath
            var newPath = path.join(__dirname, "../", 'public', 'product_images', new_product_id) + "/" + "1.jpg"
            var rawData = fileSystem.readFileSync(oldPath)
            fileSystem.writeFileSync(newPath, rawData, function(err){
                if(err){
                    logger.error(`Error creating new image 1 for id: ${new_product_id}`)
                    return res.status(500).send('Internal Sever Error')
                }
            })
            oldPath = image2.filepath
            newPath = path.join(__dirname, "../", 'public', 'product_images', new_product_id) + "/" + "2.jpg"
            rawData = fileSystem.readFileSync(oldPath)
            fileSystem.writeFileSync(newPath, rawData, function(err){
                if(err){
                    logger.error(`Error creating new image 2 for id: ${new_product_id}`)
                    return res.status(500).send('Internal Sever Error')
    
                }
            })
    
    
            oldPath = image3.filepath
            newPath = path.join(__dirname, "../", 'public', 'product_images', new_product_id) + "/" + "3.jpg"
            rawData = fileSystem.readFileSync(oldPath)
            fileSystem.writeFileSync(newPath, rawData, function(err){
                if(err){
                    logger.error(`Error creating new image 3 for id: ${new_product_id}`)
                    return res.status(500).send('Internal Sever Error')
                }
            })
    
            compressImages(new_product_id)
    
            logger.info(`Product API -- Created id: ${new_product_id}`)
            return res.redirect('/dashboard/products')
        })
    }
    catch(err){
        logger.error(`Product API -- Something went wrong in create: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// *** Read ***
// Get By ID
router.get('/get/:id', async (req, res)=>{
    try{
        const id = parseInt(req.params['id'])
    
        if(isNaN(id)){
            return res.status(400).json({success: false, message:"Invalid ID"})
        }
        
        const product = await prisma.Product.findUnique({   
            where:{
                id: id
            }
        })
    
        if(product == null){
            return res.status(404).json({success: false, message: `Product does not exist with id: ${id}`})
        }
    
        return res.status(200).json({success: true, message: {product}})
    }
    catch(err){
        logger.error(`Product API -- Something went wrong in read: ${err.message}`)
    }
    
})

// Return all products that aren't sold
router.get('/notSold/all', async(req, res)=>{
    try{
        const products = await prisma.Product.findMany({
            include:{
                Product_Category: true
            },
            where:{
                sold: false,
                show: true
            }
        })
    
        return res.status(200).json({success: true, message:{products}})
    }
    catch(err){
        logger.error(`Product API -- Something went wrong in getting all products not sold`)
    }
    
})

// Return all products that aren't assigned to a category
router.get('/nullCategory', async (req, res)=>{
    try{
        const products = await prisma.product.findMany({
            where:{
                category_id: null
            }
        })
    
        return res.status(200).json({success: true, products})
    }
    catch(err){
        logger.error(`Product API -- Something went wrong in null category: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// Returns true or false if the item is sold
router.get('/isSold/:id', async(req, res)=>{
    try{
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
            }
        })
    
        if(product === null){
            return res.status(404).json({success: false, message: `Cannot find product with id: ${product_id}`})
        }
    
        if(product.sold){
            return res.status(200).json({success: true, sold: true})
        }
        else{
            return res.status(200).json({success: true, sold: false})
        }
    }
    catch(err){
        logger.error(`Product API -- Something went wrong in isSold: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// *** Update ***
router.post('/:id', async (req, res)=>{
    try{
        const product_id = parseInt(req.params['id'])

        if(isNaN(product_id)){
            return res.status(400).json({success: false, message:"Invalid ID"})
        }

        const product = await prisma.product.findUnique({
            where:{
                id: product_id
            }
        })

        if(product === null){
            return res.status(404).send(`Product with id: ${product_id} does not exist therefore cannot be updated`)
        }

        const form = formidable({})
        form.parse(req, async(err, fields, files)=>{
            if(err){
                logger.error(`Error encountered with creating product in formidable: ${err.message}`)
                return res.status(500).send('Internal server error')
            }

            const name = fields.name
            const price = parseInt(fields.price)

            if(isNaN(price)){
                return res.status(500).send('Invalid price format')
            }

            const description = fields.description
            let category = parseInt(fields.category)
            const dimension_height = fields.dimension_height
            const dimension_width = fields.dimension_width
            const dimension_length = fields.dimension_length
            let sold
            let show
            
            if(fields.sold === 'true'){
                sold = true
            }
            else{
                sold = false
            }

            if(fields.show === 'true'){
                show = true
            }
            else{
                show = false
            }

            const image1 = files.image1
            const image2 = files.image2
            const image3 = files.image3

            await prisma.product.update({
                data:{
                    name:name,
                    price:price,
                    description: description, 
                    category_id: category, 
                    dimension_height: dimension_height, 
                    dimension_length: dimension_length,
                    dimension_width: dimension_width, 
                    show: show, 
                    sold: sold
                }, 
                where:{
                    id: product_id
                }
            })

            var oldPath
            var newPath
            var rawData

            if(image1.size != 0){
                oldPath = image1.filepath
                newPath = path.join(__dirname, "../", 'public', 'product_images', String(product_id)) + "/" + "1.jpg"
                rawData = fileSystem.readFileSync(oldPath)
                fileSystem.writeFileSync(newPath, rawData, function(err){
                    if(err){
                        logger.error(`Error creating new image 1 for id: ${product_id}`)
                        return res.status(500).send('Internal Sever Error')
                    }
                    else{
                        compressImage(product_id, 1)
                    }
                })
            }
            
            if(image2.size != 0){
                oldPath = image2.filepath
                newPath = path.join(__dirname, "../", 'public', 'product_images', String(product_id)) + "/" + "2.jpg"
                rawData = fileSystem.readFileSync(oldPath)
                fileSystem.writeFileSync(newPath, rawData, function(err){
                    if(err){
                        logger.error(`Error creating new image 2 for id: ${product_id}`)
                        return res.status(500).send('Internal Sever Error')
                    }
                    else{
                        compressImage(product_id, 2)
                    }
                })
            }
            
            if(image3.size != 0){
                oldPath = image3.filepath
                newPath = path.join(__dirname, "../", 'public', 'product_images', String(product_id)) + "/" + "3.jpg"
                rawData = fileSystem.readFileSync(oldPath)
                fileSystem.writeFileSync(newPath, rawData, function(err){
                    if(err){
                        logger.error(`Error creating new image 3 for id: ${product_id}`)
                        return res.status(500).send('Internal Sever Error')
                    }
                    else{
                        compressImage(product_id, 3)
                    }
                })
            }
            
            logger.info(`Product API -- Edit id: ${product_id}`)
            return res.redirect('/dashboard/products')
        })
    }
    catch(err){
        logger.error(`Product API -- Something went wrong in update: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

router.patch('/assignCategory/:id', async(req, res)=>{
    try{
        const product_id = parseInt(req.params['id'])

        if(req.body.category_id === undefined){
            return res.status(400).json({success: false, message: "Category ID not in req body"})
        }
    
        const category_id = parseInt(req.body.category_id)
    
        if(isNaN(category_id)){
            return res.status(400).json({success: false, message: "Category ID invalid format"})
        }
    
        if(isNaN(product_id)){
            return res.status(400).json({success: false, message:"Invalid ID"})
        }
    
        const product = await prisma.product.findUnique({
            where:{
                id: product_id
            }
        })
    
        if(product === null){
            return res.status(404).send(`Product with id: ${product_id} does not exist therefore cannot be updated`)
        }
    
        await prisma.product.update({
            where:{
                id: product_id
            }, 
            data:{
                category_id: category_id
            }
        })
    
        return res.status(200).json({success: true})
    }
    catch(err){
        logger.error(`Product API -- Something went wrong in assign Category: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// *** Delete ***
router.delete('/:id', async (req, res)=>{
    try{
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
    
        const image_dir = path.join(__dirname, "../", "public", "product_images", String(id))
    
        fileSystem.rm(image_dir, {recursive: true},(err)=>{
            if(err){
                logger.error(`Error deleting product ${id} image directory`)
            }
        })
    
        logger.info(`Product API -- Deleted id: ${id}`)
    
        return res.status(200).json({success: true, message: `Product successfully deleted id: ${id}`})
    }
    catch(err){
        logger.error(`Product API -- Something went wrong in delete: ${err.message}`)
        return res.status(500).send('Something went wrong')
    }
    
})

// All
router.get('/all', async (req, res)=>{
    try{
        const products = await prisma.Product.findMany({ 
            orderBy:{
                created_at: "desc"
            }
        })
    
        return res.status(200).json({success: true, message:{products}})
    }
    catch(err){
        logger.error(`Product API -- Something went wrong in getting all products`)
        return res.status(500).send('Something went wrong')
    }
    
})

module.exports = router