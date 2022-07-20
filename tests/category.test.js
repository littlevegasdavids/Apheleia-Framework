const request = require('supertest')
const app = require('../server')
const prisma = require('../prisma/client')
const { response } = require('../server')

let readCategory
let updateCategory
let updateUrl
let deleteCategory
let deleteUrl

beforeAll(async ()=>{
    readCategory = await prisma.product_Category.create({
        data:{
            name: 'Read Category Name'
        }
    })

    updateCategory = await prisma.product_Category.create({
        data:{
            name: 'Update Category Name'
        }
    })
    updateUrl = `/category/${updateCategory.id}`

    deleteCategory = await prisma.product_Category.create({
        data:{
            name: 'Delete Category Name'
        }
    })
    deleteUrl = `/category/${deleteCategory.id}`
})

describe('Category API endpoint test', ()=>{
    describe('Create', ()=>{
        test('No errors --> 201 status code with category object', ()=>{
            return request(app).post('/category').send({
                name: 'Create Category Test'
            }).expect('Content-Type', /json/).expect(201).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true, 
                        message: expect.objectContaining({
                            category:{
                                id: expect.any(Number),
                                name: 'Create Category Test', 
                                created_at: expect.anything()
                            }
                        })
                    })
                )
            })
        })
        
        test('Name missing--> 400 status code with message "Name missing in req body"', ()=>{
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

    describe('Read', ()=>{
        test('No errors --> 200 with category', ()=>{
            const id = readCategory.id
            return request(app).get(`/category/get/${id}`).expect('Content-Type', /json/).expect(200).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.objectContaining({
                            category: expect.objectContaining({
                                id: id,
                                name: readCategory.name, 
                                created_at: expect.any(String), 
                                Product: expect.any(Object)
                            })
                        })
                    })
                )
            })
        })

        test('All --> 200 with categories', ()=>{
            return request(app).get('/category/all').expect('Content-Type', /json/).expect(200).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true, 
                        categories: expect.any(Array)
                    })
                )
            })
        })

        test('Invalid id --> 400 with message "Invalid ID"', ()=>{
            return request(app).get('/category/get/test').expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Invalid ID'
                    })
                )
            })
        })

        test('ID that does not exist --> 404 with message "Category does not exist"', ()=>{
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

    describe('Update', ()=>{
        test('No erorrs --> 200 with update category', ()=>{
            return request(app).patch(updateUrl).send({
                name: 'New Name'
            }).expect('Content-Type', /json/).expect(200).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true, 
                        message: expect.objectContaining({
                            category:{
                                id: updateCategory.id,
                                name: 'New Name', 
                                created_at: expect.any(String)
                            }
                        })
                    })
                )
            })
        })

        test('Category does not exist --> 404 status code with "Category does not exist"', ()=>{
            return request(app).patch('/category/999').send({
                name: 'New Name'
            }).expect('Content-Type', /json/).expect(404).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: "Category does not exist with id: 999"
                    })
                )
            })
        })

        test('Invalid ID --> 400 status code with "Invalid ID"', ()=>{
            return request(app).patch('/category/test').send({
                name: 'New Name'
            }).expect('Content-Type', /json/).expect(400).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Invalid ID'
                    })
                )
            })
        })
    })

    describe('Delete', ()=>{
        test('No errors --> 200 with deleted message', ()=>{
            return request(app).delete(deleteUrl).expect('Content-Type', /json/).expect(200).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true, 
                        message: `Category successfully deleted id: ${deleteCategory.id}`
                    })
                )
            })
        })

        test('ID does not exist --> 404 status code with "Category does not exist"', ()=>{
            return request(app).delete('/category/999').expect('Content-Type', /json/).expect(404).then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Category does not exist with id: 999'
                    })
                )
            })
        })

        test('Invalid ID format --> 400 status code with "Invalid ID"',()=>{
            return request(app).delete('/category/test').expect('Content-Type', /json/).expect(400).then((response)=>{
                expcet(response.body).toEqual(
                    expect.objectContaining({
                        success: false, 
                        message: 'Invalid ID'
                    })
                )
            })
        })
    })
})