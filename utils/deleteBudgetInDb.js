import { getDataFromDb } from './getDataFromDb.js'
import path from 'node:path'
import fs from 'node:fs/promises'

export async function deleteBudgetInDb(newData) {
    try {
        const dataInDb = await getDataFromDb()

        if(!Array.isArray(dataInDb.budgets)) {
            throw new Error('Database does not contain a budgets array')
        }

        const updatedBudgetsData = dataInDb.budgets.filter(budget => budget.category.toLowerCase() !== newData.category.toLowerCase())
        dataInDb.budgets = updatedBudgetsData

        const pathToDb = path.join('database', 'data.json');
        await fs.writeFile(pathToDb, JSON.stringify(dataInDb, null, 2), 'utf8')
    }
    catch(err) {
        return err
    }
}