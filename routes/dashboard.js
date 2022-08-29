require('dotenv').config()
const prisma = require('../prisma/client')
const {Router} = require('express')
const router = new Router()
const path = require('path')
const secrete = process.env.TOKEN_SECRETE
const jwt = require('jsonwebtoken')

function checkAdminCookie(req, res, next){
    const adminCookie = req.cookies.adminDashboard
    if(adminCookie === undefined){
        return res.redirect('/dashboard/login')
    }

    jwt.verify(adminCookie, secrete, async(err, data)=>{
        if(err){
            res.clearCookie('adminDashboard')
            return res.redirect('/dashboard/login')
        } 
    })

    next()
}

router.get('/', checkAdminCookie, (req, res)=>{
    let path_dir = path.join(__dirname + "/../public/index.html")
    return res.sendFile(path_dir) 
})

router.get('/login', (req, res)=>{
    const adminCookie = req.cookies.adminDashboard
    if(adminCookie != undefined){
        return res.redirect('/dashboard')
    }

    let path_dir = path.join(__dirname + "/../public/index.html")
    return res.sendFile(path_dir) 
})

router.post('/login', (req, res)=>{
    const username = req.body.username
    const password = req.body.password

    if(username != process.env.DASHBOARD_USER_NAME || password != process.env.DASHBOARD_PASSWORD){
        return res.status(400).json({success: false, message: "Invalid login details"})
    }

    const token = jwt.sign({}, secrete, {expiresIn: '7d'})
    res.cookie('adminDashboard', token)

    return res.status(200).json({success: true})
})

router.get('/logout', (req, res)=>{
    res.clearCookie('adminDashboard')

    return res.redirect('/dashboard/login')
})

router.get('/orders', checkAdminCookie, (req, res)=>{

    let path_dir = path.join(__dirname + "/../public/index.html")
    return res.sendFile(path_dir) 
})

router.get('/products', checkAdminCookie, (req, res)=>{

    let path_dir = path.join(__dirname + "/../public/index.html")
    return res.sendFile(path_dir) 
})

router.get('/newProduct', checkAdminCookie, (req, res)=>{

    let path_dir = path.join(__dirname + "/../public/index.html")
    return res.sendFile(path_dir) 
})

router.get('/editProduct/:product_id', checkAdminCookie, async (req, res)=>{
    const product_id = parseInt(req.params['product_id'])

    if(isNaN(product_id)){
        return res.status(400).send('Product ID invalid format')
    }

    const product = await prisma.product.findUnique({
        where:{
            id: product_id
        }
    })

    if(product === null){
        return res.status(404).send('Product not found')
    }

    let path_dir = path.join(__dirname + "/../public/index.html")
    return res.sendFile(path_dir)
})

router.get('/categories', checkAdminCookie, (req, res)=>{
    let path_dir = path.join(__dirname + "/../public/index.html")
    return res.sendFile(path_dir)
})

router.get('/newCategory', checkAdminCookie, (req,res)=>{
    let path_dir = path.join(__dirname + "/../public/index.html")
    return res.sendFile(path_dir)
})

router.get('/editCategory/:category_id', checkAdminCookie, async (req, res)=>{
    const category_id = parseInt(req.params['category_id'])

    if(isNaN(category_id)){
        return res.status(400).send('Product ID invalid format')
    }

    const category = await prisma.product_Category.findUnique({
        where:{
            id: category_id
        }
    })

    if(category === null){
        return res.status(404).send('Product not found')
    }

    let path_dir = path.join(__dirname + "/../public/index.html")
    return res.sendFile(path_dir)
})

router.get('/assignCategory', checkAdminCookie, async(req, res)=>{
    let path_dir = path.join(__dirname + "/../public/index.html")
    return res.sendFile(path_dir)
})

module.exports = router