import { parseJSONBody } from '../parseJSONBody.js'
import { sendJSONResponse } from '../sendJSONResponse.js'
import { editPotInDb } from '../editPotInDb.js'
import { sanitizeInput } from '../sanitizeInput.js'

export async function handlePotPut(req,res) {
    try {
        const parsedBody = await parseJSONBody(req) 
        const sanitizedBody = sanitizeInput(parsedBody)

        await editPotInDb(sanitizedBody)
        sendJSONResponse(res, 201, 'application/json', JSON.stringify(sanitizedBody))
    }
    catch(err) {
        sendJSONResponse(res, 400, 'application/json', JSON.stringify({error: err.message}))
    }

}