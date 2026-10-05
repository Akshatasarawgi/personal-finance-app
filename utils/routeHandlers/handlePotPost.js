import { parseJSONBody } from '../parseJSONBody.js'
import { sanitizeInput } from '../sanitizeInput.js'
import { sendJSONResponse } from '../sendJSONResponse.js'
import { addNewPotToDb } from '../addNewPotToDb.js'

export async function handlePotPost(req, res) {
    try {
        const parsedBody = await parseJSONBody(req)
        const sanitizedInput = sanitizeInput(parsedBody)

        await addNewPotToDb(sanitizedInput)

        sendJSONResponse(res, 201, 'application/json', JSON.stringify(sanitizeInput))
    }
    catch(err) {
        sendJSONResponse(res, 400, 'application/json', JSON.stringify({error: err.message}))
    }
}