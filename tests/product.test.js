const request = require('supertest')
const app = require('../server')
const prisma = require('../prisma/client')

let testCategory
let readProduct
let readInventory 
let editProduct
let editInvetory
let editUrl
let deleteProduct
let deleteInventory
let deleteUrl

beforeAll(async ()=>{
    testCategory = await prisma.product_Category.create({
        data:{
            name: 'Test Category Var'
        }
    })

    readInventory = await prisma.product_Inventory.create({data:{}})

    readProduct = await prisma.product.create({
        data:{
            name: 'Read Product Var', 
            price: 999, 
            description: 'Read Product Description',
            inventory_id: readInventory.id, 
            category_id: testCategory.id 
        }
    })

    editInvetory = await prisma.product_Inventory.create({data:{}})

    editProduct = await prisma.product.create({
        data:{
            name: 'Edit Product Var', 
            price: 999, 
            description: 'Edit Product Description', 
            inventory_id: editInvetory.id, 
            category_id: testCategory.id
        }
    })

    editUrl = `/product/${editProduct.id}`

    deleteInventory = await prisma.product_Inventory.create({data:{}})

    deleteProduct = await prisma.product.create({
        data:{
            name: 'Delete Product Variable', 
            price: 999, 
            description: 'Delete Product Description', 
            inventory_id: deleteInventory.id,
            category_id: testCategory.id
        }
    })

    deleteUrl = `/product/${deleteProduct.id}`
})

afterAll(async ()=>{
    
})

describe("Product API endpoint test", ()=>{
    describe("Create", ()=>{
        test('No erorrs --> 201 status code with product object', ()=>{
            return request(app).post('/product').send({
                name: 'Product Name', 
                price: 999, 
                description: 'Product Description', 
                category_id: testCategory.id
            }).expect('Content-Type', /json/).expect(201).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true, 
                        message: expect.objectContaining({
                            newProduct: expect.objectContaining({
                                id: expect.any(Number), 
                                name: 'Product Name', 
                                price: 999, 
                                description: 'Product Description', 
                                created_at: expect.any(String),
                                category_id: testCategory.id, 
                                inventory_id: expect.any(Number)
                            })
                        })
                    })
                )
            })
        })

        test('Missing name --> 400 status code with message "Missing name"', ()=>{
            return request(app).post('/product').send({
                price: 999, 
                description: 'Product Description', 
                category_id: testCategory.id
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Name in req body'
                    })
                )
            })
        })

        test('Missing Description --> 400 status code with message saying "Missing description"', ()=>{
            return request(app).post('/product').send({
                name: 'Product Name',
                price: 999,
                category_id: testCategory.id
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Description in req body'
                    })
                )
            })
        })

        test('Price missing --> 400 status code with message saying "Missing price"', ()=>{
            return request(app).post('/product').send({
                name: 'Product Name',
                description: 'Product Description', 
                category_id: testCategory.id
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Price in req body'
                    })
                )
            })
        })

        test('Category_id missing --> 400 status code with message saying "Missing CategoryID"', ()=>{
            return request(app).post('/product').send({
                name: 'Product Name',
                description: 'Product Description',
                price: 999
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Category ID in req body'
                    })
                )
            })
        })

        test('Price invalid format --> 400 status code with message saying "Price Invalid Format"', ()=>{
            return request(app).post('/product').send({
                name: 'Product Name',
                description: 'Product Description',
                price: "Test"
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Category ID in req body'
                    })
                )
            })
        })

        test('POST with category ID that does not exist --> 404 status code with "Category does not exist"', ()=>{
            return request(app).post('/product').send({
                name: 'Product Name', 
                price: 999, 
                description: 'Product Description', 
                category_id: 999
            }).expect('Content-Type', /json/).expect(404).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Category does not exist with id: 999'
                    })
                )
            })
        })
        
    })

    describe("Read", ()=>{
        test('No errors --> 200 status code with product object', ()=>{
            const id = readProduct.id
            return request(app).get(`/product/get/${id}`).expect('Content-Type', /json/).expect(200).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true, 
                        message: {
                            product: expect.objectContaining({
                                id: id, 
                                name: 'Read Product Var', 
                                price: 999, 
                                description: 'Read Product Description', 
                                created_at:  expect.any(String), 
                                category_id: testCategory.id,
                                inventory_id: readInventory.id, 
                                Product_Inventory: expect.objectContaining({
                                    id: readInventory.id, 
                                    sold: false
                                })
                            })
                        }
                    })
                )
            })
        })

        test('Non-existing ID --> 404 status code with "Product does not exist"', ()=>{
            return request(app).get('/product/get/999').expect('Content-Type', /json/).expect(404).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Product does not exist with id: 999'
                    })
                )
            })
        })

        test('Invalid ID format --> 400 status code with "Invalid ID"', ()=>{
            return request(app).get('/product/get/test').expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Invalid ID'
                    })
                )
            })
        })

        test('All products --> 200 status code with product array', ()=>{
            return request(app).get('/product/all').expect('Content-Type', /json/).expect(200).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true, 
                        message:{
                            products: expect.any(Array)
                        }
                    })
                )
            })
        })
    })

    describe("Update", ()=>{
        test('No errors --> 200 status code with updated product', ()=>{
            return request(app).patch(editUrl).send({
                name: 'Change Product Name', 
                price: 333, 
                description: 'Change Product Description', 
                category_id: testCategory.id, 
                sold: true
            }).expect('Content-Type', /json/).expect(200).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true, 
                        message: expect.objectContaining({
                            product:{
                                id: editProduct.id, 
                                name: 'Change Product Name', 
                                description: 'Change Product Description', 
                                category_id: testCategory.id, 
                                inventory_id: editInvetory.id,
                                created_at: expect.any(String),
                                price: 333, 
                                Product_Inventory: expect.objectContaining({
                                    id: editInvetory.id, 
                                    sold: true
                                })
                            }
                        })
                    })
                )
            })
        })

        test('Non-existing product --> 404 status code with "Product does not exist"', ()=>{
            return request(app).patch('/product/999').send({
                name: 'Product Name', 
                price: 999, 
                description: 'Product Description', 
                category_id: testCategory.id, 
                sold: false
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Product does not exist with id: 999'
                    }) 
                )
            })
        })

        test('Invalid ID Format --> 400 status code with "Invalid ID"', ()=>{
            return request(app).patch('/product/test').send({
                name: 'Product Name', 
                price: 999, 
                description: 'Product Description', 
                category_id: testCategory.id, 
                sold: false
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'Invalid ID'
                    })
                )
            })
        })

        test('Name missing --> 400 status code with "Missing Name"', ()=>{
            return request(app).patch(editUrl).send({
                price: 999, 
                description: 'Product Description', 
                category_id: testCategory.id, 
                sold: false
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Name in req body'
                    })
                )
            })
        })

        test('Price missing --> 400 status code with message "Missing Price"', ()=>{
            return request(app).patch(editUrl).send({
                name: 'Product Name',
                description: 'Product Description', 
                category_id: testCategory.id, 
                sold: false
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Price in req body'
                    })
                )
            })
        })

        test('Description missing --> 400 status code with message "Missing Description"', ()=>{
            return request(app).patch(editUrl).send({
                name: 'Product Name', 
                price: 999, 
                category_id: testCategory.id, 
                sold: false
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Description in req body'
                    })
                )
            })
        })

        test('Category ID missing --> 400 with message "Missing Category ID"', ()=>{
            return request(app).patch(editUrl).send({
                name: 'Product Name', 
                price: 999, 
                description: 'Product Description', 
                sold: false
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Category ID in req body'
                    })
                )
            })
        })

        test('Sold missing --> 400 status code with message "Missing Sold"', ()=>{
            return request(app).patch(editUrl).send({
                name: 'Product Name', 
                price: 999, 
                description: 'Product Description', 
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Category ID in req body'
                    })
                )
            })
        })

        test('Product ID that does not exist --> 404 with message "Product ID does not exist"', ()=>{
            return request(app).patch('/product/999').send({
                name: 'Product Name', 
                price: 999, 
                description: 'Product Description', 
                category_id: testCategory.id, 
                sold: false
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Product does not exist with id: 999'
                    }) 
                )
            })
        })

        test('Category ID that does not exist --> 404 with message "Category ID Does not exist"', ()=>{
            return request(app).patch(editUrl).send({
                name: 'Product Name', 
                price: 999, 
                description: 'Product Description', 
                category_id: 999, 
                sold: false
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Category does not exist with id: 999'
                    })   
                )
            })
        })
    })

    describe("Delete", ()=>{
        test('No errors --> 200 status code with deleted message', ()=>{
            const id = deleteProduct.id
            return request(app).delete(deleteUrl).expect('Content-Type', /json/).expect(200).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true, 
                        message: `Product successfully deleted id: ${id}`
                    })
                )
            })
        })

        test('Invalid ID format --> 400 status code with "Invalid ID"', ()=>{
            return request(app).delete('/product/test').expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Invalid ID'
                    })
                )
            })
        })

        test('DELETE /product/:id where product does not exist --> 400 status code with "Product does not exist"', ()=>{
            return request(app).delete('/product/999').expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: `Product does not exist with id: 999` 
                    })
                )
            })
        })
    })
})