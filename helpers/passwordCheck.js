var Checker = require('password-checker')
const logger = require('./logger')
var checker = new Checker()

checker.min_length = 8
checker.requireLetters(true)
checker.requireNumbers(true)

function checkPassword(password){
    try{
        return checker.check(password)
    }
    catch(err){
        logger.error(`PasswordCheck -- Something went wrong trying to check password: ${err.message}`)
    }
    
}

module.exports = {checkPassword}