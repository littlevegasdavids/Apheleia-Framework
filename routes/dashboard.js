require('dotenv').config()
const prisma = require('../prisma/client')
const {Router} = require('express')
const router = new Router()
const asyncHandler = require('express-async-handler')
const path = require('path')
const secrete = process.env.TOKEN_SECRETE
const jwt = require('jsonwebtoken')

router.get('/', (req, res)=>{
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

router.get('/orders', (req, res)=>{
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

    let path_dir = path.join(__dirname + "/../public/index.html")
    return res.sendFile(path_dir) 
})

router.get('/products', (req, res)=>{
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

    let path_dir = path.join(__dirname + "/../public/index.html")
    return res.sendFile(path_dir) 
})

router.get('/newProduct', (req, res)=>{
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

    let path_dir = path.join(__dirname + "/../public/index.html")
    return res.sendFile(path_dir) 
})

module.exports = router