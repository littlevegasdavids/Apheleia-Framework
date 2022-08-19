require('dotenv').config()
const {Router} = require('express')
const router = new Router()
const axios = require('axios')
const asyncHandler = require('express-async-handler')
const logger = require('../helpers/logger')

const yocoSecrete = process.env.YOCO_SECRETE_KEY_TEST

router.post('/yocoPayment', asyncHandler (async(req, res)=>{
    const token_id = req.body.token_id
    const total = parseInt(req.body.total)
    axios.post(
        'https://online.yoco.com/v1/charges/',
        {
          token: token_id,
          amountInCents: total,
          currency: 'ZAR',
        },
        {
          headers: {
            'X-Auth-Secret-Key': yocoSecrete,
          },
        },
      )
      .then(result => {
        if(result.status === 201){
            return res.status(200).json({success: true})
        }
        else if(result.status === 400){
            return res.status(400).json({success: false, message: "Card declined"})
        }
        else if(result.status === 500){
            return res.status(500).json({success: false, message: 'Yoco Error'})
        }
      })
      .catch(error => {
        logger.error(`Caught Yoco payment error: ${error}`)
        return res.status(400).json({success: false, message: 'Internal server error'})
      })
}))

module.exports = router