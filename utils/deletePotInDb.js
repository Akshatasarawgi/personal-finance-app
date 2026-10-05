import { getDataFromDb } from "./getDataFromDb.js";
import path from 'node:path'
import fs from 'node:fs/promises'

export async function deletePotInDb(dataToDelete) {
    try {
        const dataInDb = await getDataFromDb()
        if(!Array.isArray(dataInDb.budgets)) {
            throw new Error('Database does not contain a pots array')
        }

        const updatedPotsData = dataInDb.pots.filter(pot => pot.name.toLowerCase() !== dataToDelete.name.toLowerCase())
        dataInDb.pots = updatedPotsData

        const pathToDb = path.join('database', 'data.json')
        await fs.writeFile(pathToDb, JSON.stringify(dataInDb, null, 2), 'utf8')
    }
    catch(err) {
        return err
    }
}