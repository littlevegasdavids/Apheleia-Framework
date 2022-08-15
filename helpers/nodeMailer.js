require('dotenv').config()
const nodemailer = require('nodemailer')
let logger = require('./logger')
const Handlebars = require('handlebars')
const fileSystem = require('fs')
const path = require('path')

const app_heading = 'App Heading'
const support_email = 'support@test.com'

async function createMailTransport(){
    try{
        let testAccount = await nodemailer.createTestAccount()

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email", 
            port: 587,
            secure: false, 
            auth:{
                user: testAccount.user, 
                pass: testAccount.pass
            }
        })
        return transporter
    }
    catch(err){
        logger.error(`Error creating email transport: ${err.message}`)
    }
    
}

async function order_confirmed_email(customer_email, order_number, customer_name, order_date, shipping_address, link){
    let transporter = await createMailTransport()
    
    try{
        const filePath = path.join(__dirname, '../email_templates/order_confirmed.html')
        const source = fileSystem.readFileSync(filePath, 'utf-8').toString()
        const template = Handlebars.compile(source)
        const replace = {
            order_number: String(order_number), 
            customer_name: String(customer_name), 
            order_date: String(order_date), 
            shipping_address: String(shipping_address), 
            app_heading: app_heading, 
            link: String(link)
        }
        const htmlSend = template(replace)
        transporter.sendMail({
            from: `${app_heading} <testmail@example.com>`, 
            to: String(customer_email),
            subject: `Order #${order_number} confirmed`, 
            html: htmlSend
        }).then(info=>{
            logger.info(`Sent order confirmed mail: ${nodemailer.getTestMessageUrl(info)}`)
        })
    }
    catch(err){
        logger.error(`Error sending order confirmed email: ${err.message}`)
    }
}

async function order_shipped_email(customer_email, order_number, customer_name, order_date, shipping_address, link){
    let transporter = await createMailTransport()
    
    try{
        const filePath = path.join(__dirname, '../email_templates/order_shipped.html')
        const source = fileSystem.readFileSync(filePath, 'utf-8').toString()
        const template = Handlebars.compile(source)
        const replace = {
            order_number: String(order_number), 
            customer_name: String(customer_name),
            order_date: String(order_date), 
            shipping_address: String(shipping_address), 
            app_heading: app_heading, 
            link: String(link)
        }
        const htmlSend = template(replace)
        transporter.sendMail({
            from: `${app_heading} <testmail@example.com>`, 
            to: String(customer_email),
            subject: `Order #${order_number} shipped`, 
            html: htmlSend
        }).then(info=>{
            logger.info(`Sent order shipped mail: ${nodemailer.getTestMessageUrl(info)}`)
        })
    }
    catch(err){
        logger.error(`Error sending order confirmed email: ${err.message}`)
    }
}

async function changed_password_email(customer_email, customer_name){
    let transporter = await createMailTransport()
    
    try{
        const filePath = path.join(__dirname, '../email_templates/changed_password.html')
        const source = fileSystem.readFileSync(filePath, 'utf-8').toString()
        const template = Handlebars.compile(source)
        const replace = {
            customer_name: String(customer_name),
            app_heading: app_heading, 
            support_email: support_email
        }
        const htmlSend = template(replace)
        transporter.sendMail({
            from: `${app_heading} <testmail@example.com>`, 
            to: String(customer_email),
            subject: `Changed password`, 
            html: htmlSend
        }).then(info=>{
            logger.info(`Sent changed password mail: ${nodemailer.getTestMessageUrl(info)}`)
        })
    }
    catch(err){
        logger.error(`Error sending order confirmed email: ${err.message}`)
    }
}

async function new_account_email(customer_email, customer_name){
    let transporter = await createMailTransport()
    const link = 'http://localhost:9000/customer'
    try{
        const filePath = path.join(__dirname, '../email_templates/new_account.html')
        const source = fileSystem.readFileSync(filePath, 'utf-8').toString()
        const template = Handlebars.compile(source)
        const replace = {
            customer_name: String(customer_name),
            app_heading: app_heading, 
            link: link
        }
        const htmlSend = template(replace)
        transporter.sendMail({
            from: `${app_heading} <testmail@example.com>`, 
            to: String(customer_email),
            subject: `Welcome to ${app_heading}`, 
            html: htmlSend
        }).then(info=>{
            logger.info(`Sent test mail: ${nodemailer.getTestMessageUrl(info)}`)
        })
    }
    catch(err){
        logger.error(`Error sending order confirmed email: ${err.message}`)
    }
}

// Do not forget to change the domain
async function forgot_password_email(customer_email, customer_name, link){
    let transporter = await createMailTransport()
    
    try{
        const filePath = path.join(__dirname, '../email_templates/forgot_password.html')
        const source = fileSystem.readFileSync(filePath, 'utf-8').toString()
        const template = Handlebars.compile(source)
        const replace = {
            customer_name: String(customer_name),
            app_heading: app_heading, 
            link: link
        }
        const htmlSend = template(replace)
        transporter.sendMail({
            from: `${app_heading} <testmail@example.com>`, 
            to: String(customer_email),
            subject: `Reset Password`, 
            html: htmlSend
        }).then(info=>{
            logger.info(`Sent test mail: ${nodemailer.getTestMessageUrl(info)}`)
        })
    }
    catch(err){
        logger.error(`Error sending order confirmed email: ${err.message}`)
    }
}


module.exports = {order_confirmed_email, order_shipped_email, changed_password_email, new_account_email, forgot_password_email}