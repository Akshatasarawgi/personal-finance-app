import { parseJSONBody } from "../parseJSONBody.js";
import { sanitizeInput } from "../sanitizeInput.js";
import { sendJSONResponse } from "../sendJSONResponse.js";
import { deletePotInDb } from '../deletePotInDb.js'

export async function handlePotDelete(req, res) {
    try {
        const parsedBody = await parseJSONBody(req)
        const sanitizedBody = sanitizeInput(parsedBody);

        await deletePotInDb(sanitizedBody)
        sendJSONResponse(res, 200, 'application/json', JSON.stringify(sanitizedBody))
    }
    catch(err) {
        sendJSONResponse(res, 400, 'application/json', JSON.stringify({error: err.message}))
    }
}