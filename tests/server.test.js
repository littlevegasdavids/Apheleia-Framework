
const request = require('supertest')
const app = require('../server')
const prisma = require('../prisma/client')

// Using postgres sql docker image to test the DB without using real DB

/*
1) Start the container and create the database -- npm run docker:up
2) Migrate the schema -- npm run migrate:test
3) Run the tests -- npm run test
4) Destroy the container -- npm run docker:down


// Create Variables
let createCategory
let createInventory
let createProduct
let createCustomer
let createAddress

// Read Variables
let readCategory
let readInventory
let readProduct
let readCustomer
let readAddress

// Edit Variables
let editCategory
let editInventory
let editProduct
let editCustomer
let editAddress
let updateProductUrl

// Delete Variables
let deleteCategory
let deleteInventory
let deleteProduct
let deleteCustomer
let deleteAddress
let deleteProductUrl


beforeAll(async ()=>{
    // Create Init
    createCategory = await prisma.product_Category.create({
        data:{
            name: 'Create Category Variable'
        }
    })

    createInventory = await prisma.product_Inventory.create({data:{}})

    createProduct = await prisma.product.create({
        data:{
            name: 'Create Product Variable', 
            price: 999, 
            description: 'Create Product VariableDescription',
            inventory_id: createInventory.id, 
            category_id: createCategory.id, 
        }
    })

    createCustomer = await prisma.customer.create({
        data:{              name: 'Create Customer Variable', 
            password: 'Hello123456', 
        }
    })

    createAddress = await prisma.customer_Address.create({
        data:{
            address_line1: "Create Address Variable", 
            address_line2: "999 Lane Avenue CoolSuburb",
            city: "New York", 
            postal_code: "4444", 
            customer_id: createCustomer.id
        }
    })

    // Read Init
    readCategory = await prisma.product_Category.create({
        data:{
            name: 'Read Category Variable'
        }
    })

    readInventory = await prisma.product_Inventory.create({data:{}})

    readProduct = await prisma.product.create({
        data:{
            name: 'Read Product Variable', 
            price: 999, 
            description: 'Read Product Description',
            inventory_id: readInventory.id, 
            category_id: readCategory.id 
        }
    })

    readCustomer = await prisma.customer.create({
        data:{
            name: 'Read Customer Variable', 
            password: 'Hello123456', 
        }
    })

    readAddress = await prisma.customer_Address.create({
        data:{
            address_line1: "Read Address variable", 
            address_line2: "999 Lane Avenue CoolSuburb", 
            city: "New York", 
            postal_code: "4444", 
            customer_id: readCustomer.id
        }
    })

    // Edit init
    editCategory = await prisma.product_Category.create({
        data:{
            name: 'Edit Category Variable'
        }
    })

    editInventory = await prisma.product_Inventory.create({data:{}})

    editProduct = await prisma.product.create({
        data:{
            name: 'Test Product', 
            price: 999, 
            description: 'Test Product Description',
            inventory_id: editInventory.id, 
            category_id: editCategory.id 
        }
    })

    editCustomer = await prisma.customer.create({
        data:{
            name: 'Edit Customer Variable', 
            password: 'Hello123456', 
        }
    })

    editAddress = await prisma.customer_Address.create({
        data:{
            address_line1: "Edit Address variable", 
            address_line2: "999 Lane Avenue CoolSuburb", 
            city: "New York", 
            postal_code: "4444", 
            customer_id: editCustomer.id
        }
    })
    updateProductUrl = `/product/${editProduct.id}`

    // Delete init
    deleteCategory = await prisma.product_Category.create({
        data:{
            name: 'Delete Category Variable'
        }
    })

    deleteInventory = await prisma.product_Inventory.create({data:{}})

    deleteProduct = await prisma.product.create({
        data:{
            name: 'Delete Product Variable', 
            price: 999, 
            description: 'Delete Product Description',
            inventory_id: deleteInventory.id, 
            category_id: deleteCategory.id 
        }
    })

    deleteCustomer = await prisma.customer.create({
        data:{
            name: 'Delete Customer Variable', 
            password: 'Hello123456', 
        }
    })

    deleteAddress = await prisma.customer_Address.create({
        data:{
            address_line1: "Delete Address variable", 
            address_line2: "999 Lane Avenue CoolSuburb", 
            city: "New York", 
            postal_code: "4444", 
            customer_id: deleteCustomer.id
        }
    })

    deleteProductUrl = `/product/${deleteProduct.id}`
})

afterAll(async ()=>{
    const delProduct = prisma.product.deleteMany({})
    const delInventory = prisma.product_Inventory.deleteMany({})
    const delCategory = prisma.product_Category.deleteMany({})
    const delAddress = prisma.customer_Address.deleteMany({})
    await prisma.$transaction([
        delProduct, 
        delInventory, 
        delCategory, 
        delAddress
    ])

    await prisma.$disconnect()
})

describe('Product', ()=>{
    // Create
    describe('Create', ()=>{
        test('POST /product --> 201 status code with product object', ()=>{
            return request(app).post('/product/').send({
                name: 'Product Name', 
                price: 999, 
                description: 'Product Description', 
                category_id: createCategory.id,

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
                                created_at: expect.anything(),
                                category_id: createCategory.id, 
                                inventory_id: expect.any(Number) 
                            })
                        })
                    })
                )
                
            })
        })

        test('POST /product with name missing --> 400 status code with message saying "Missing name"', ()=>{
            return request(app).post('/product').send({
                price: 999, 
                description: 'Product Description', 
                category_id: createCategory.id
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Name in req body'
                    })
                )
            })
        })

        test('POST /product with description missing --> 400 status code with message saying "Missing description"', ()=>{
            return request(app).post('/product').send({
                name: 'Product Name',
                price: 999,
                category_id: createCategory.id
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Description in req body'
                    })
                )
            })
        })

        test('POST /product with price missing --> 400 status code with message saying "Missing price"', ()=>{
            return request(app).post('/product').send({
                name: 'Product Name',
                description: 'Product Description', 
                category_id: createCategory.id
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Price in req body'
                    })
                )
            })
        })

        test('POST /product with category_id missing --> 400 status code with message saying "Missing CategoryID"', ()=>{
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

        test('POST /product with price invalid format --> 400 status code with message saying "Price Invalid Format"', ()=>{
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

    // Read
    describe('Read', ()=>{
        test('GET /product/get/:id --> 200 status code with product object', ()=>{
            const id = readProduct.id
            return request(app).get(`/product/get/${id}`).expect('Content-Type', /json/).expect(200).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true, 
                        message: {
                            product: expect.any(Object)
                        }
                    })
                )
            })
        })

        test('GET /product/get/:id with non-existing id --> 404 status code with "Product does not exist with id"', ()=>{
            return request(app).get('/product/get/999').expect('Content-Type', /json/).expect(404).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Product does not exist with id: 999'
                    })
                )
            })
        })

        test('GET /product/get/:id with invalid id --> 400 status code with "Invalid id"', ()=>{
            return request(app).get('/product/get/test').expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Invalid ID'
                    })
                )
            })
        })

        test('GET /product/all --> 200 status code with product arrays', ()=>{
            return request(app).get('/product/all').expect('Content-Type', /json/).expect(200).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true, 
                        message:{
                            products: expect.any(Object)
                        }
                    })
                )
            })
        })
    })

    // Update
    describe('Update', ()=>{
        test('PATCH /product/:id --> 200 status code with updated product', ()=>{
            return request(app).patch(updateProductUrl).send({
                name: 'Product Name', 
                price: 999, 
                description: 'Product Description', 
                category_id: editProduct.category_id
            }).expect('Content-Type', /json/).expect(200).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true, 
                        message: expect.objectContaining({
                            product:{
                                id: editProduct.id, 
                                name: 'Product Name', 
                                price: 999, 
                                description: 'Product Description', 
                                created_at: expect.anything(),
                                category_id: editProduct.category_id,
                                inventory_id: editProduct.inventory_id
                            }
                        })
                    })
                )
            })
        })

        test('PATCH /product/:id invalid id --> 400 with message "Invalid ID"', ()=>{
            return request(app).patch('/product/test').send({
                name: 'Product Name', 
                price: 999, 
                description: 'Product Description', 
                category_id: editProduct.category_id
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'Invalid ID'
                    })
                )
            })
        })

        test('PATCH /product/:id with name missing --> 400 with message "Missing name"', ()=>{
            return request(app).patch(updateProductUrl).send({
                price: 999, 
                description: 'Product Description', 
                category_id: editProduct.category_id
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Name in req body'
                    })
                )
            })
        })

        test('PATCH /product/:id with price missing --> 400 with message "Missing Price"', ()=>{
            return request(app).patch(updateProductUrl).send({
                name: 'Product Name',
                description: 'Product Description', 
                category_id: editProduct.category_id
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Price in req body'
                    })
                )
            })
        })

        test('PATCH /product/:id with description missing --> 400 with message "Missing description"', ()=>{
            return request(app).patch(updateProductUrl).send({
                name: 'Product Name', 
                price: 999, 
                category_id: editProduct.category_id
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Description in req body'
                    })
                )
            })
        })

        test('PATCH /product/:id with category id missing --> 400 with message "Missing Category ID"', ()=>{
            return request(app).patch(updateProductUrl).send({
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

        test('PATCH /product/:id with product id that does not exist --> 404 with message "Product ID does not exist"', ()=>{
            return request(app).patch('/product/999').send({
                name: 'Product Name', 
                price: 999, 
                description: 'Product Description', 
                category_id: editProduct.category_id
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Product does not exist with id: 999'
                    }) 
                )
            })
        })

        test('PATCH /product/:id with category id that does not exist --> 404 with message "Category ID Does not exist"', ()=>{
            return request(app).patch(updateProductUrl).send({
                name: 'Product Name', 
                price: 999, 
                description: 'Product Description', 
                category_id: 999
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
    
    // Delete
    describe('Delete', ()=>{
        test('DELETE /product/:id --> 200 status code with deleted message', ()=>{
            const id = deleteProduct.id
            return request(app).delete(deleteProductUrl).expect('Content-Type', /json/).expect(200).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: `Product successfully deleted id: ${id}`
                    })
                )
            })
        })

        test('DELETE /product/:id with invalid id --> 400 status code with "Invalid ID"', ()=>{
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
            const id = deleteProduct.id
            return request(app).delete(deleteProductUrl).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: `Product does not exist with id: ${id}` 
                    })
                )
            })
        })
    })
})

describe('Category', ()=>{
    // Create
    describe('Create', ()=>{
        test('POST /category --> 201 status code with newly created category', ()=>{
            return request(app).post('/category').expect('Content-Type', /json/).expect(201).send({
                    name: 'Test Category'
                }
            ).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true, 
                        message: expect.objectContaining({
                            category:{
                                id: expect.any(Number), 
                                name: 'Test Category',
                                created_at: expect.anything()
                            }
                        })
                    })
                )
            })
        })

        test('POST /category with name missing--> 400 status code with message "Name missing in req body"', ()=>{
            return request(app).post('/category').expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Missing Name in req body'
                    })
                )
            })
        })
    })

    // Read
    describe('Read', ()=>{
        test('GET /category/get/:id --> 200 with category', ()=>{
            const id = readCategory.id
            return request(app).get(`/category/get/${id}`).expect('Content-Type', /json/).expect(200).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.objectContaining({
                            category: expect.objectContaining({
                                id: id,
                                name: readCategory.name, 
                                created_at: expect.anything(), 
                                Product: expect.anything()
                            })
                        })
                    })
                )
            })
        })

        test('GET /category/get/:id with invalid id --> 400 with message "Invalid ID"', ()=>{
            return request(app).get('/category/get/test').expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Invalid ID'
                    })
                )
            })
        })

        test('GET /category/get/:id with id that does not exist --> 404 with message "Category does not exist"', ()=>{
            return request(app).get('/category/get/999').expect('Content-Type', /json/).expect(404).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Category does not exist with id: 999'
                    })
                )
            })
        })
    })

    // Update 

    // Delete - How are we gonna delete this ?
})

describe('Customer', ()=>{
    // Create

    // Read

    // Update

    // Delete
})

describe('Customer Address', ()=>{
    // Create

    // Read

    // Update

    // Delete
})
*/

test('Test', ()=>{

})