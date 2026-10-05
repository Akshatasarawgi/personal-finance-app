export async function getData() {

    try {
        const response = await fetch("http://localhost:8000/api/allData")
      
        if(!response.ok) {
            throw {
                message: "Data could not be fetched",
                statusText: response.statusText,
                status: response.status,
        } 
    }
        const data = await response.json()
        return data
    }

    catch(error) {
        return { message: `Failed to fetch data. Error: ${error}` }
    }
}

export async function addBudgetToDb(formData) {
    try {
        const response = await fetch("http://localhost:8000/api/addBudget", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json()
        if(!response.ok) {
            throw new Error(data.error || 'Failed to add budget')
        }

        return data
    }
    catch(err) {
        console.error('Failed to add budget:', err)
        return null
    }
}

export async function editExistingBudgetToDb(formData) {

    try {
        const response = await fetch("http://localhost:8000/api/editBudget", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json()
        if(!response.ok) {
            throw new Error(data.error || 'Failed to edit existing budget')
        }
        return data
    }
    catch(err) {
        console.error('Failed to edit existing budget:' , err)
        return null
    }
}

export async function deleteBudgetFromDb(formData) {

    try {
        const response = await fetch("http://localhost:8000/api/deleteBudget", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
    })
    const data = response.json()
        if(!response.ok) {
            throw new Error(data.error || 'Failed to delete budget')
        }
        return data
    }

    catch(err) {
        console.error('Failed to delete budget: ', err)
        return null
    }
}

export async function addPotToDb(formData) {
    try {
        const response = await fetch("http://localhost:8000/api/addPot",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json()

        if(!response.ok) {
            throw new Error(data.error || 'Failed to add pot')
        }
    }
    catch(err) {
        console.error('Failed to add pot', err)
        return null
    }
}

export async function editExistingPotToDb(formData) {
    try {
        const response = await fetch("http://localhost:8000/api/editPot", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json()
        if(!response.ok) {
            throw new Error(data.error || 'Failed to edit pot')
        }
        
    }
    catch(err) {
        console.error('Failed to add pot', err)
        return null
    }
}

export async function deletePotFromDb(formData) {
    try {
        const response = await fetch("http://localhost:8000/api/deletePot", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json()

        if(!response.ok) {
            throw new Error(data.error || 'Failed to delete Pot')
        }
    }
    catch(err) {
        console.error('Failed to delete pot', err)
        return null
    }
}