import path from 'node:path'
import fs from 'node:fs/promises'

export async function getDataFromDb() {
    const pathToDb = path.join('database','data.json')
    const content = await fs.readFile(pathToDb, 'utf8')

    return JSON.parse(content)
}