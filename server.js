import http from 'http'
import { sendAllData } from './utils/sendAllData.js'
import { handlePost } from './utils/routeHandlers/handlePost.js'
import { handlePut } from './utils/routeHandlers/handlePut.js'
import { handleDelete } from './utils/routeHandlers/handleDelete.js'
import { handlePotPost } from './utils/routeHandlers/handlePotPost.js'
import { handlePotPut } from './utils/routeHandlers/handlePotPut.js'
import { handlePotDelete } from './utils/routeHandlers/handlePotDelete.js'

const PORT = 8000

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if(req.method === 'OPTIONS') {
        res.statusCode = 204
        return res.end()
    }

    if(req.url === '/api/allData' && req.method === 'GET') {
        return await sendAllData(res) 
    }
    if(req.url === '/api/addBudget' && req.method === 'POST') {
        return await handlePost(req,res) 
    } 
    if(req.url === '/api/editBudget' && req.method === 'PUT') {
        return await handlePut(req,res)
    }
    if(req.url === '/api/deleteBudget' && req.method === 'DELETE') {
        return await handleDelete(req,res)
    }
    if(req.url === '/api/addPot' && req.method === 'POST') {
        return await handlePotPost(req,res)
    }
    if(req.url === '/api/editPot' && req.method === 'PUT') {
        return await handlePotPut(req,res)
    }
    if(req.url === '/api/deletePot' && req.method === 'DELETE') {
        return await handlePotDelete(req,res)
    }
})

server.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`))  