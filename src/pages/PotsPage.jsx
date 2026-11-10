import React from "react"
import { useLoaderData, useFetcher } from 'react-router-dom'
import { getData , addPotToDb, editExistingPotToDb, deletePotFromDb}  from '../../utils/api.js'
import IndividualPot from "../components/IndividualPot"
import AddPotModal from '../components/AddPotModal.jsx'


export async function loader() {
    return await getData()
}

export async function action({ request }) {
    const formData = await request.formData()
    const name = formData.get('name')
    const targetString = formData.get('target')
    const target = Number(targetString)
    const totalString = formData.get('total')
    const total = Number(totalString)
    const theme = formData.get('theme')

    let data 
        if(request.method === 'POST') {
            data = await addPotToDb({name, target, total, theme})
        } 
        if(request.method === 'PUT') {
            data = await editExistingPotToDb({name, target, total, theme})
        }
        if(request.method === 'DELETE') {
            data = await deletePotFromDb({name, target, total, theme})
        }
       return data 
}

function PotsPage() {
    const [displayAddNewPottModal, setDisplayAddNewPotModal] = React.useState(false)    
  
    const data = useLoaderData()
    const fetcher = useFetcher()

    const assignedPotNames = data.pots.map(pot => pot.name)
    const assignedThemes = data.pots.map(pot => pot.theme)

    function closeAddBudgetModal() {
        setDisplayAddNewPotModal(false)
    }

    function displayAddPotModal() {
        setDisplayAddNewPotModal(true)
    }

    function submitNewAddedPot(name, target, theme, total) {
        fetcher.submit(
            {
                name,
                target,
                total,
                theme
            },
            {
                method: 'POST'
            }
        )
        closeAddBudgetModal()
    }

    return (
        
        <section className="pots-page">
            <div className="budget-page-header">
              <h1 className="page-head">Pots</h1>
                <button 
                    className="add-new-info-button"
                    onClick={() => 
                        displayAddPotModal()}
                >
                    + Add New Pot
                </button>
            </div> 

            {displayAddNewPottModal && 
            <AddPotModal 
                onClose = {() => setDisplayAddNewPotModal(false)}
                submitNewAddedPot={submitNewAddedPot}
                assignedThemes={assignedThemes}
                assignedPotNames={assignedPotNames}
            />
            }


            <div className="pots-page-container">
                {data.pots.map(pot => 
                    <IndividualPot 
                        key={pot.name} 
                        pot={pot}
                        assignedThemes={assignedThemes}
                        fetcher={fetcher}
                    />)}
            </div>

        </section>
      
    )
}

export default PotsPage