const winston = require('winston')

const logFormat = winston.format.combine(
    winston.format.colorize(), 
    winston.format.timestamp(), 
    winston.format.align(), 
    winston.format.printf(
        info => `${info.level} - ${info.timestamp.split('T')[1].split('.')[0]}(UTC): ${info.message}`
    )
)

const logger = winston.createLogger({
    format: logFormat, 
    transports:[
        new winston.transports.Console({
            level: 'info'
        })
    ]
})

module.exports = logger