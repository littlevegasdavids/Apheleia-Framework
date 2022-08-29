const validator = require('email-validator')
const logger = require('./logger')

function checkEmail(email){
    try{
        return validator.validate(email)
    }
    catch(err){
        logger.error(`Something went wrong trying to validate email: ${err.message}`)
    }
}

module.exports = {checkEmail}