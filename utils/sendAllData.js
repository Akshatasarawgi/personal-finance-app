import { sendJSONResponse } from './sendJSONResponse.js'
import { getDataFromDb } from './getDataFromDb.js'

export async function sendAllData(res) {
    try {
        const dataFromDb = await getDataFromDb()
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        sendJSONResponse(res, 200, 'application/json', JSON.stringify(dataFromDb))
    } 
    catch(error) {
        res.end(JSON.stringify({errorMessage: "There was an error getting data from the database", error : error}))
    }
}