const validator = require('email-validator')

function checkEmail(email){
    return validator.validate(email)
}

module.exports = {checkEmail}