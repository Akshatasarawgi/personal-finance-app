import React from 'react'
import closeButtonImage from "/public/assets/icon-close-modal.svg"

export default function AddMoneyToPotModal({onClose, submitMoneyAddedToPot, currentPot}) {
    const modalRef = React.useRef(null)
    const [addedTotal, setAddedTotal] = React.useState("")
    const [displayError, setDisplayError] = React.useState(false)
   

    React.useEffect(() => {
        function handleClickOutside(event) {
            if(modalRef.current && !modalRef.current.contains(event.target)) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    })

    function setTotal(e) {
        setAddedTotal(e.target.value)
    }  

    function submitNewPotInfo() {
        if(addedTotal !== "") {
            submitMoneyAddedToPot(
                currentPot.name,
                currentPot.target,
                Number(currentPot.total) + Number(addedTotal),
                currentPot.theme
            )
        } else {
            setDisplayError(true)
        }
    }

    return (
        <div ref={modalRef} className="new-budget-modal">
            <div className="add-new-budget-modal-header">
                <h2>{`Add to '${currentPot.name}'`}</h2>
                <button 
                    className="close-button"
                    onClick={onClose}
                >
                <img src={closeButtonImage} alt="click to close add budget" />
                </button>
            </div>
            <p>Add an additional amount to your existing {currentPot.name} Pot.
            </p>

            <div className="pot-add-money-details-new-amount-section">
                <p>New Amount</p>
                <p className="pots-add-money-new-amount">${Number(currentPot.total) + Number(addedTotal)}</p>
            </div>

            <div className="pots-add-new-money">
                <div 
                    className="budget-page-category-details-added-total-percentage"
                    style={{backgroundColor: "black", width: `${(currentPot.total / currentPot.target) * 100}%`}}
                >
                </div>
   
                {addedTotal &&
                <div 
                    className="budget-page-category-details-individual-spent-percentage"
                    style={{backgroundColor: "var(--green)", width: `${(Number(addedTotal) / currentPot.target) * 100}%`}} 
                > 
                </div>}
            </div>
            
            <div className="pot-add-money-details-new-amount-section">
                <p style={{color: "var(--green", fontWeight: "700"}}>{`${(((Number(currentPot.total) + Number(addedTotal)) / currentPot.target) * 100).toFixed(2)}%`}</p>
                <p>Target of ${currentPot.target}</p>
            </div>
            {displayError && <p style={{textAlign:"center", color: "red"}}>Enter the amount to be added.</p>}
            
            <div className="add-budget-modal-maximum-section">
                <p>Amount to Add</p>

                <input 
                    name="total"
                    className="budget-input-field max-spend"
                    type="number" 
                    placeholder="e.g. 2000"
                    value={addedTotal}
                    onChange={(e) => setTotal(e)}
                />
                <span className="set-amount-dollar-sign">$</span>
            </div>

            <button 
                className="add-new-budget-submit-button"
                onClick={submitNewPotInfo}>Confirm Addition
            </button>
        </div> 
    )
}