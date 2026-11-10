import React from 'react'
import EditPotModal from '../components/EditPotModal.jsx'
import DeletePotModal from "../components/DeletePotModal.jsx"
import AddMoneyToPotModal from '../components/AddMoneyToPotModal.jsx'
import WithdrawMoneyFromPotModal from '../components/WithdrawMoneyFromPotModal.jsx'

export default function IndividualPot({pot, assignedThemes, fetcher}) {

    const [displayEditDeleteDropdown, setDisplayEditDeleteDropdown] = React.useState(false)
    const [displayEditPotModal, setDisplayEditPotModal] = React.useState(false)
    const [displayDeletePotModal, setDisplayDeletePotModal] = React.useState(false) 
    const [displayAddMoneyPotModal, setDisplayAddMoneyPotModal] = React.useState(false)
    const [displayWithdrawMoneyPotModal, setDisplayWithdrawMoneyPotModal] = React.useState(false)
    const dropdownRef = React.useRef(null)

    function editPot() {
        displayEditExistingPotModal()
        setDisplayEditDeleteDropdown(false)
    }    

    function deletePot() {
        displayDeleteExistingPotModal()
        setDisplayEditDeleteDropdown(false)
    }

    function addMoneyToPot() {
        displayAddMoneyToPotModal()
    }

    function withdrawMoneyFromPot() {
        displayWithdrawMoneyFromPotModal()
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

    function displayEditExistingPotModal() {
        setDisplayEditPotModal(true)
        setDisplayDeletePotModal(false) 
    }

    function displayDeleteExistingPotModal() {
        setDisplayEditPotModal(false)
        setDisplayDeletePotModal(true)        
    }

    function displayAddMoneyToPotModal() {
        setDisplayAddMoneyPotModal(true)
        setDisplayEditPotModal(false)
        setDisplayDeletePotModal(false)            
    }

    function displayWithdrawMoneyFromPotModal() {
        setDisplayWithdrawMoneyPotModal(true)
        setDisplayAddMoneyPotModal(false)
        setDisplayEditPotModal(false)
        setDisplayDeletePotModal(false)       
    }

        React.useEffect(() => {
            function handleClickOutside(event) {
                if(dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setDisplayEditDeleteDropdown(false)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
    
            return () => document.removeEventListener('mousedown', handleClickOutside)
        },[displayEditDeleteDropdown])

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
        <div className="individual-pot-container">

            {displayEditPotModal && 
            <EditPotModal 
                submitEditExistingPot={submitEditExistingPot}
                assignedThemes={assignedThemes}
                currentPot={pot}
                onClose={() => setDisplayEditPotModal(false)}
            />
            }

            {displayDeletePotModal && 
            <DeletePotModal 
                potToDelete={pot}
                submitDeletePot={submitDeletePot}
                onClose={() => setDisplayDeletePotModal(false)}
                />}

            {displayAddMoneyPotModal &&
            <AddMoneyToPotModal 
                currentPot={pot}
                onClose={() => setDisplayAddMoneyPotModal(false)}   
                submitMoneyAddedToPot={submitEditExistingPot}        
            />
            }

            {displayWithdrawMoneyPotModal && 
            <WithdrawMoneyFromPotModal 
                onClose={() => setDisplayWithdrawMoneyPotModal(false)}
                submitMoneyWithdrawFromPot={submitEditExistingPot}
                currentPot={pot}
            />
            }
            <div className="details-individual-header">
                <div style={{display: "flex", alignItems: "center", marginBottom: "1rem"}}>
                    <div className="category-circle" style={{backgroundColor: pot.theme, marginRight: "13px"}}></div>
                    <h2>{pot.name}</h2>
                </div>
                <div
                    ref={dropdownRef}
                    className="edit-delete-dropdown-container">
                    <button 
                        className="edit-delete-btn"
                        onClick={() => setDisplayEditDeleteDropdown(prev => !prev)}
                    >
                    ...
                    </button>
                    {displayEditDeleteDropdown && 
                        <div className="edit-delete-dropdown-menu">
                                <button      
                                    className="edit-budget-btn"
                                    onClick={() => editPot(pot)}>
                                    Edit Pot
                                </button>
                                <button 
                                    className="delete-budget-btn"
                                    onClick={() => deletePot(pot)}>
                                    Delete Pot
                                </button>
                        </div>
                    }
                    </div>
            </div>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <p style={{color: "var(--grey-500)"}}>Total Saved</p>
                <p>${pot.total}</p>
            </div>

            <div className="pots-page-details-percentage-container">
                <div 
                    className="budget-page-category-details-individual-spent-percentage"
                    style={{backgroundColor: pot.theme, width: `${(pot.total / pot.target) * 100}%`  }}
                >
                </div>
            </div>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <p>{`${((pot.total / pot.target) *100).toFixed(2)}%`}</p>
                <p>Target of ${pot.target}</p>
            </div>

            <div style={{width: "100%",display:"flex",justifyContent:"space-between",marginTop: "1.4rem"}}>
                <button 
                    onClick={() => addMoneyToPot()}
                    className="pots-add-withdraw-btn"
                >+ Add Money
                </button>
                <button
                    onClick={() => withdrawMoneyFromPot()} 
                    className="pots-add-withdraw-btn"
                >Withdraw
                </button>
            </div>
        </div>
    )
}
