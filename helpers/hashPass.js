require('dotenv').config()

const bcrypt = require('bcrypt')
const saltRounds = parseInt(process.env.SALTROUNDS)

async function generateHash(password){
    const hash = bcrypt.hashSync(password, saltRounds)
    return hash
}

async function comparePassword(password, hash){
    return bcrypt.compareSync(password, hash)
}

module.exports = {generateHash, comparePassword}