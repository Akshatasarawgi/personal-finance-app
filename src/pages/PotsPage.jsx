import React from "react"
import { useLoaderData, useFetcher } from 'react-router-dom'
import { getData , addPotToDb, editExistingPotToDb, deletePotFromDb}  from '../../utils/api.js'
import IndividualPot from "../components/IndividualPot"
import AddPotModal from '../components/AddPotModal.jsx'
import EditPotModal from '../components/EditPotModal.jsx'
import DeletePotModal from "../components/DeletePotModal.jsx"
import AddMoneyToPotModal from '../components/AddMoneyToPotModal.jsx'
import WithdrawMoneyFromPotModal from '../components/WithdrawMoneyFromPotModal.jsx'

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
    const [displayEditPotModal, setDisplayEditPotModal] = React.useState(false)
    const [displayDeletePotModal, setDisplayDeletePotModal] = React.useState(false) 
    const [displayAddMoneyPotModal, setDisplayAddMoneyPotModal] = React.useState(false)
    const [displayWithdrawMoneyPotModal, setDisplayWithdrawMoneyPotModal] = React.useState(false)
    
    const [currentPot, setCurrentPot] = React.useState("")   
    const data = useLoaderData()
    const fetcher = useFetcher()

    const assignedPotNames = data.pots.map(pot => pot.name)
    const assignedThemes = data.pots.map(pot => pot.theme)

    function closeAddBudgetModal() {
        setDisplayAddNewPotModal(false)
    }

    function closeEditBudgetModal() {
        setDisplayEditPotModal(false)
    }
   
    function closeDeleteBudgetModal() {
        setDisplayDeletePotModal(false)
    }

    function closeAddMoneyToPotModal() {
        setDisplayAddMoneyPotModal(false)
    }

    function closeWithdrawMoneyFromPotModal() {
        setDisplayWithdrawMoneyPotModal(false)       
    }

    function displayAddPotModal() {
        setDisplayAddNewPotModal(true)
        setDisplayEditPotModal(false)
        setDisplayDeletePotModal(false)
    }

    function displayEditExistingPotModal(value) {
        setCurrentPot(value) 
        setDisplayAddNewPotModal(false)
        setDisplayEditPotModal(true)
        setDisplayDeletePotModal(false) 
    }

    function displayDeleteExistingPotModal(value) {
        setCurrentPot(value) 
        setDisplayAddNewPotModal(false)
        setDisplayEditPotModal(false)
        setDisplayDeletePotModal(true)        
    }

    function displayAddMoneyToPotModal(value) {
        setCurrentPot(value)
        setDisplayAddMoneyPotModal(true)
        setDisplayAddNewPotModal(false)
        setDisplayEditPotModal(false)
        setDisplayDeletePotModal(false)            
    }

    function displayWithdrawMoneyFromPotModal(value) {
        setCurrentPot(value)
        setDisplayWithdrawMoneyPotModal(true)
        setDisplayAddMoneyPotModal(false)
        setDisplayAddNewPotModal(false)
        setDisplayEditPotModal(false)
        setDisplayDeletePotModal(false)       
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

    function submitEditExistingPot(name, target,total, theme) {
        fetcher.submit(
            {
                name,
                target,
                total,
                theme
            },
            {
                method: 'PUT'
            }
        )
        closeEditBudgetModal()
        closeAddMoneyToPotModal()
        closeWithdrawMoneyFromPotModal()
    }

    function submitDeletePot(name, target, total, theme) {
        fetcher.submit(
            {
                name,
                target,
                total,
                theme
            },
            {
                method: 'DELETE'
            }
        )
        closeDeleteBudgetModal()
        
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

            {displayEditPotModal && 
            <EditPotModal 
                submitEditExistingPot={submitEditExistingPot}
                assignedThemes={assignedThemes}
                currentPot={currentPot}
                onClose={() => setDisplayEditPotModal(false)}
            />
            }

            {displayDeletePotModal && 
            <DeletePotModal 
                potToDelete={currentPot}
                submitDeletePot={submitDeletePot}
                onClose={() => setDisplayDeletePotModal(false)}
                />}

            {displayAddMoneyPotModal &&
            <AddMoneyToPotModal 
                currentPot={currentPot}
                onClose={() => setDisplayAddMoneyPotModal(false)}   
                submitMoneyAddedToPot={submitEditExistingPot}        
            />
            }

            {displayWithdrawMoneyPotModal && 
            <WithdrawMoneyFromPotModal 
                onClose={() => setDisplayWithdrawMoneyPotModal(false)}
                submitMoneyWithdrawFromPot={submitEditExistingPot}
                currentPot={currentPot}
            />
            }

            <div className="pots-page-container">
                {data.pots.map(pot => 
                    <IndividualPot 
                        key={pot.name} 
                        pot={pot}
                        displayEditExistingPotModal={displayEditExistingPotModal}
                        displayDeleteExistingPotModal={displayDeleteExistingPotModal}
                        displayAddMoneyToPotModal={displayAddMoneyToPotModal}
                        displayWithdrawMoneyFromPotModal={displayWithdrawMoneyFromPotModal}
                    />)}
            </div>

        </section>
      
    )
}

export default PotsPage

/*
       fetcher.submit(
            {
                name,
                target,
                total, 
                theme
            },
            {
                method: 'DELETE',
            }
    )
*/
