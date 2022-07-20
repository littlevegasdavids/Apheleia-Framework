require('dotenv').config()
const nodemailer = require('nodemailer')
let password = process.env.MAILPASSWORD
let logger = require('./logger')
const {google} = require('googleapis')
const client_id = process.env.MAIL_CLIENT_ID
const client_secrete = process.env.MAIL_CLIENT_SECRETE
const redirect_uri = process.env.MAIL_REDIRECT_URI
const refresh_token = process.env.MAIL_REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(client_id, client_secrete, redirect_uri)
oAuth2Client.setCredentials({refresh_token: refresh_token})

let details = {
    from: 'apheleiaframework@gmail.com', 
    to: 'rdavids963@outlook.com', 
    subject: 'Test Mail', 
    text: "Testing Node Mailer"
}

let accessToken
let mailTransporter

async function setUp(){
    accessToken = await oAuth2Client.getAccessToken()
    mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'apheleiaframework@gmail.com', 
            clientId: client_id,
            clientSecret: client_secrete, 
            refreshToken: refresh_token, 
            accessToken: accessToken
        }
    })
}


async function sendMail(){
    try{
        await setUp()
        mailTransporter.sendMail(details)
        logger.info('Mail Sent')
    }
    catch(err){
        logger.error(err.message)
    }
}

// Do not forget to change the domain
async function sendForgotPassword(sendToMail, link){
    try{
        await setUp()
        mailTransporter.sendMail({
            from: 'apheleiaframework@gmail.com', 
            to: sendToMail,
            subject: 'Forgot Password Link', 
            text: link
        })
        logger.info(`Sent Forgot Password Link to ${sendToMail}`)
    }
    catch(err){
        logger.error(err.message)
    }
}

module.exports = {sendMail, sendForgotPassword}