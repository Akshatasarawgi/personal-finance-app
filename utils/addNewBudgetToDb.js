import { getDataFromDb } from './getDataFromDb.js'
import path from 'node:path'
import fs from 'node:fs/promises'

export async function addNewBudgetToDb(newData) {

    try {
        const dataInDb = await getDataFromDb()

        if(!Array.isArray(dataInDb.budgets)) {
            throw new Error('Databse does not contain a budgets array')
        }

        dataInDb.budgets.push(newData)
        const pathToDb = path.join('database', 'data.json');
        await fs.writeFile(pathToDb, JSON.stringify(dataInDb, null, 2), 'utf8')
    }
    catch(err) {
        console.log(err)
    }

}