require('dotenv').config()
const nodemailer = require('nodemailer')
let logger = require('./logger')
const Handlebars = require('handlebars')
const fileSystem = require('fs')
const path = require('path')
const support_email = 'support@shopemporium.com'

const order_password = process.env.ORDERS_EMAIL_PASSWORD
const customer_password = process.env.CUSTOMER_EMAIL_PASSWORD

async function createOrderMailTransport(){
    try{
        let transporter = nodemailer.createTransport({
            pool: true,
            host: "mail.shopemporium.co.za", 
            port: 465,
            secure: true, 
            auth:{
                user: "orders@shopemporium.co.za", 
                pass: order_password
            }
        })
        return transporter
    }
    catch(err){
        logger.error(`Nodemailer -- Error creating orders email transport: ${err.message}`)
    }
    
}

async function createCustomerMailTransport(){
    try{
        let transporter = nodemailer.createTransport({
            host: "mail.shopemporium.co.za", 
            port: 465,
            secure: true, 
            auth:{
                user: "customer@shopemporium.co.za", 
                pass: customer_password
            }
        })
        return transporter
    }
    catch(err){
        logger.error(`Nodemailer -- Error creating customer email transport: ${err.message}`)
    }
}

// New order and invoice mail
async function send_order_invoice(customer_email, invoice_path, link, order_number, customer_name){
    let transporter = await createOrderMailTransport()

    try{
        const filePath = path.join(__dirname, '../email_templates/order_new.html')
        const source = fileSystem.readFileSync(filePath, 'utf-8').toString()
        const template = Handlebars.compile(source)
        const replace = {
            customer_name: String(customer_name),
            link: link, 
            order_number: String(order_number) 
        }
        const htmlSend = template(replace)
        transporter.sendMail({
            from: `Emporium Of Curiosity<orders@shopemporium.co.za>`, 
            to: String(customer_email),
            subject: 'New Order', 
            html: htmlSend, 
            attachments:{
                filename: 'Invoice.pdf', 
                path: invoice_path
            }
        }).then(info=>{
            logger.info(`Nodemailer -- Sent new order invoice mail: ${customer_email}`)
        })
    }
    catch(err){
        logger.error(`Nodemailer -- Error sending new order invoice to ${customer_email}: ${err.message}`)
    }
}

// Order confirmed
async function order_confirmed_email(customer_email, order_number, customer_name, order_date, shipping_address, link){
    let transporter = await createOrderMailTransport()
    
    try{
        const filePath = path.join(__dirname, '../email_templates/order_confirmed.html')
        const source = fileSystem.readFileSync(filePath, 'utf-8').toString()
        const template = Handlebars.compile(source)
        const replace = {
            order_number: String(order_number), 
            customer_name: String(customer_name), 
            order_date: String(order_date), 
            shipping_address: String(shipping_address), 
            link: String(link)
        }
        const htmlSend = template(replace)
        transporter.sendMail({
            from: `Emporium Of Curiosity<orders@shopemporium.co.za>`, 
            to: String(customer_email),
            subject: `Order #${order_number} confirmed`, 
            html: htmlSend
        }).then(info=>{
            logger.info(`Nodemailer -- Sent order confirmed mail: ${customer_email}`)
        })
    }
    catch(err){
        logger.error(`Nodemailer -- Error sending order confirmed email to ${customer_email}: ${err.message}`)
    }
}

//Order shipped
async function order_shipped_email(customer_email, order_number, customer_name, order_date, shipping_address, link){
    let transporter = await createOrderMailTransport()
    
    try{
        const filePath = path.join(__dirname, '../email_templates/order_shipped.html')
        const source = fileSystem.readFileSync(filePath, 'utf-8').toString()
        const template = Handlebars.compile(source)
        const replace = {
            order_number: String(order_number), 
            customer_name: String(customer_name),
            order_date: String(order_date), 
            shipping_address: String(shipping_address), 
            link: String(link)
        }
        const htmlSend = template(replace)
        transporter.sendMail({
            from: `Emporium Of Curiosity<orders@shopemporium.co.za>`, 
            to: String(customer_email),
            subject: `Order #${order_number} shipped`, 
            html: htmlSend
        }).then(info=>{
            logger.info(`Nodemailer -- Sent order shipped mail: ${customer_email}`)
        })
    }
    catch(err){
        logger.error(`Nodemailer -- Error sending order shipped email to ${customer_email}: ${err.message}`)
    }
}

// Customer change password on portal
async function changed_password_email(customer_email, customer_name){
    let transporter = await createCustomerMailTransport()
    
    try{
        const filePath = path.join(__dirname, '../email_templates/changed_password.html')
        const source = fileSystem.readFileSync(filePath, 'utf-8').toString()
        const template = Handlebars.compile(source)
        const replace = {
            customer_name: String(customer_name),
            support_email: support_email
        }
        const htmlSend = template(replace)
        transporter.sendMail({
            from: `Emporium Of Curiosity<customer@shopemporium.co.za>`, 
            to: String(customer_email),
            subject: `Changed password`, 
            html: htmlSend
        }).then(info=>{
            logger.info(`Nodemailer -- Sent changed password mail: ${customer_email}`)
        })
    }
    catch(err){
        logger.error(`Nodemailer -- Error sending changed password email to ${customer_email}: ${err.message}`)
    }
}

// Newly created account
async function new_account_email(customer_email, customer_name){
    let transporter = await createOrderMailTransport()
    const link = 'http://localhost:9000/customer'
    try{
        const filePath = path.join(__dirname, '../email_templates/new_account.html')
        const source = fileSystem.readFileSync(filePath, 'utf-8').toString()
        const template = Handlebars.compile(source)
        const replace = {
            customer_name: String(customer_name),
            link: link
        }
        const htmlSend = template(replace)
        transporter.sendMail({
            from: `Emporium Of Curiosity <customer@shopemporium.co.za>`, 
            to: String(customer_email),
            subject: `Welcome to Emporium Of Curiosity`, 
            html: htmlSend
        }).then(info=>{
            logger.info(`Nodemailer -- Sent new account mail: ${customer_email}`)
        })
    }
    catch(err){
        logger.error(`Nodemailer -- Error sending new account email to ${customer_email}: ${err.message}`)
    }
}

// Password reset link
async function forgot_password_email(customer_email, customer_name, link){
    let transporter = await createCustomerMailTransport()
    
    try{
        const filePath = path.join(__dirname, '../email_templates/forgot_password.html')
        const source = fileSystem.readFileSync(filePath, 'utf-8').toString()
        const template = Handlebars.compile(source)
        const replace = {
            customer_name: String(customer_name),
            link: link
        }
        const htmlSend = template(replace)
        transporter.sendMail({
            from: `Emporium Of Curiosity<customer@shopemporium.co.za>`, 
            to: String(customer_email),
            subject: `Reset Password`, 
            html: htmlSend
        }).then(info=>{
            logger.info(`Nodemailer -- Sent reset password link mail: ${nodemailer.getTestMessageUrl(info)}`)
        })
    }
    catch(err){
        logger.error(`Nodemailer -- Error sending order confirmed email to ${customer_email}: ${err.message}`)
    }
}

module.exports = {send_order_invoice, order_confirmed_email, order_shipped_email, changed_password_email, new_account_email, forgot_password_email}