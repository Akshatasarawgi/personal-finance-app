import { getDataFromDb } from './getDataFromDb.js'
import path from 'node:path'
import fs from 'node:fs/promises'


export async function addNewPotToDb(newData) {
    try{
        const existingData = await getDataFromDb()
        existingData.pots.push(newData)
        const pathToDb = path.join('database','data.json')
        await fs.writeFile(pathToDb, JSON.stringify(existingData, null,2),'utf8')
    }
    catch(err) {
        throw new Error('Could not add pot to the database:', err)
    }

}