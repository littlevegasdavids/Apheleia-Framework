const logger = require('./logger')

function compressImages(product_id){
    try{
        const spawn = require('node:child_process').spawn
        const process = spawn(`cd public/product_images/${product_id} && jpegoptim --size=15% *.jpg`, {shell: true})
        process.on('close', (code)=>{
            if(code === 0){
                logger.info(`Compress Images -- Successfully compressed images of product: ${product_id}`)
            }
            else{
                logger.error(`Compress Images -- Error exit code not successful: ${code}`)
            }
            
        })
    }
    catch(err){
        logger.error(`Compress images -- Something went wrong caught error product_id: ${product_id}: ${err.message}`)
    }
}

function compressImage(product_id, image_id){
    try{
        const spawn = require('node:child_process').spawn
        const process = spawn(`cd public/product_images/${product_id} && jpegoptim --size=15% ${image_id}.jpg`, {shell: true})

        process.on('close', (code)=>{
            if(code === 0){
                logger.info(`Compress Image -- Successfully compressed image #${image_id} of product: ${product_id}`)
            }
            else{
                logger.error(`Compress Image -- Error exit code not successful: ${code}`)
            }
            
        })
    }
    catch(err){
        logger.error(`Compress image -- Something went wrong caught error product_id: ${product_id}: ${err.message}`)
    }
}

module.exports = {compressImages, compressImage}