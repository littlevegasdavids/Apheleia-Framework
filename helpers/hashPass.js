require('dotenv').config()

const bcrypt = require('bcrypt')
const saltRounds = parseInt(process.env.SALTROUNDS)
const logger = require('./logger')

async function generateHash(password){
    try{
        const hash = bcrypt.hashSync(password, saltRounds)
        return hash
    }
    catch(err){
        logger.error(`HashPass -- Something went wrong trying to hash password: ${err.message}`)
    }
}

async function comparePassword(password, hash){
    try{
        return bcrypt.compareSync(password, hash)
    }
    catch(err){
        logger.error(`HashPass -- Something went wrong trying to compare passwords: ${err.message}`)
    }
}

module.exports = {generateHash, comparePassword}