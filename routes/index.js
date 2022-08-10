const product = require('./product')
const customer = require('./customer')
const category = require('./category')
const cart = require('./cart')
const order = require('./order')
const payment = require('./payment')
const address = require('./address')
const dashboard = require('./dashboard')

module.exports = (app) => {
    app.use('/api/product', product)
    app.use('/api/customer', customer)
    app.use('/api/customer', address)
    app.use('/api/category', category)
    app.use('/api/cart', cart)
    app.use('/api/order', order)
    app.use('/api/payment', payment)
    app.use('/dashboard', dashboard)
}