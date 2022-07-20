var Checker = require('password-checker')
var checker = new Checker()

checker.min_length = 8
checker.requireLetters(true)
checker.requireNumbers(true)

function checkPassword(password){
    return checker.check(password)
}

module.exports = {checkPassword}