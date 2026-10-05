import { getDataFromDb } from './getDataFromDb.js'
import path from 'node:path'
import fs from 'node:fs/promises'

export async function editPotInDb(newData) {
    try {
        const dataInDb = await getDataFromDb()

        if(!Array.isArray(dataInDb.pots)) {
            throw new Error('Database does not contain a pots array')
        }

        const updatedPotsData = dataInDb.pots.map(pot => 
            pot.name.toLowerCase() === newData.name.toLowerCase() ? 
            newData : pot  
        )
        dataInDb.pots = updatedPotsData

        const pathToDb = path.join('database', 'data.json');
        await fs.writeFile(pathToDb, JSON.stringify(dataInDb, null, 2), 'utf8')
    }
    catch(err) {
        console.log(err)
    }
}