import { parseJSONBody } from '../parseJSONBody.js'
import { sendJSONResponse } from '../sendJSONResponse.js'
import { editBudgetInDb } from '../editBudgetInDb.js'
import { sanitizeInput } from '../sanitizeInput.js'

export async function handlePut(req,res) {
    try {
        const parsedBody = await parseJSONBody(req) 
        const sanitizedBody = sanitizeInput(parsedBody)

        await editBudgetInDb(sanitizedBody)
        sendJSONResponse(res, 201, 'application/json', JSON.stringify(sanitizedBody))
    }
    catch(err) {
        sendJSONResponse(res, 400, 'application/json', JSON.stringify({error: err.message}))
    }

}