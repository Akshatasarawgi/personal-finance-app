import React from 'react'

export default function IndividualPot({pot, displayEditExistingPotModal,displayDeleteExistingPotModal, displayAddMoneyToPotModal, displayWithdrawMoneyFromPotModal}) {

    const [displayEditDeleteDropdown, setDisplayEditDeleteDropdown] = React.useState(false)
    const dropdownRef = React.useRef(null)

    function editPot(value) {
        displayEditExistingPotModal(value)
        setDisplayEditDeleteDropdown(false)
    }    

    function deletePot(value) {
        displayDeleteExistingPotModal(value)
        setDisplayEditDeleteDropdown(false)
    }

    function addMoneyToPot(value) {
        displayAddMoneyToPotModal(value)
    }

    function withdrawMoneyFromPot(value) {
        displayWithdrawMoneyFromPotModal(value)
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

    return (
        <div className="individual-pot-container">
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
                    onClick={() => addMoneyToPot(pot)}
                    className="pots-add-withdraw-btn"
                >+ Add Money
                </button>
                <button
                    onClick={() => withdrawMoneyFromPot(pot)} 
                    className="pots-add-withdraw-btn"
                >Withdraw
                </button>
            </div>
        </div>
    )
}

/* 
    {
      "name": "Savings",
      "target": 2000,
      "total": 159,
      "theme": "#277C78"
    },

*/