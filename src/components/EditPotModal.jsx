import React from 'react'
import closeButtonImage from "/public/assets/icon-close-modal.svg"
import downArrowImage from "/public/assets/icon-caret-down.svg"

export default function EditPotModal({onClose, submitEditExistingPot, assignedThemes, currentPot}) {
    const modalRef = React.useRef(null)
    const [selectedTarget, setSelectedTarget] = React.useState("")
    const [selectedTheme, setSelectedTheme] = React.useState(currentPot.theme)
    const [displayAddPotThemeDropdown, setDisplayAddPotThemeDropdown] = React.useState(false)

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

    function setTarget(e) {
        setSelectedTarget(e.target.value)
    }  

    let listOfThemes = [
        {colorName: "Teal", color :"#277C78"},
        {colorName: "Dolphin", color: "#82C9D7"},
        {colorName: "Desert Sand", color:"#F2CDAC"},
        {colorName: "Venus mist", color: "#626070"},
        {colorName: "Plum",color:"#dda0dd"},
        {colorName: "Purple", color: "#663399"},
        {colorName: "Royal Blue", color: "#4169e1"},
        {colorName: "Salmon", color: "#fa8072"},
        {colorName: "Tomato", color: "#ff6347"},
        {colorName: "Yellow Green", color: "#9acd32"},
        {colorName: "Pale Turquoise", color: "#afeeee"},
        {colorName: "Orange Red", color: "#ff4500"},
    ];

    function submitNewPotInfo() {
        if(selectedTarget !== "" && selectedTheme !== "") {
            submitEditExistingPot(currentPot.name, selectedTarget, currentPot.total, selectedTheme)
        } else {
            setDisplayError(true)
        }
    }

    function currentPotThemeColorName(color) {
        const result = listOfThemes.find(theme => theme.color === color)
        return result.colorName
    }

    return (
        <div ref={modalRef} className="new-budget-modal">
            <div className="add-new-budget-modal-header">
                <h2>Edit Pot</h2>
                <button 
                    className="close-button"
                    onClick={onClose}
                >
                <img src={closeButtonImage} alt="click to close add budget" />
                </button>
            </div>
            <p>If your saving targets change, feel free to update your pots.
            </p>

            {displayError && <p style={{textAlign:"center", color: "red"}}>Enter all the fields to Edit the existing Pot</p>}
            <div className="add-budget-modal-category-section">
                <p>Pot Name</p>

                <input 
                    name="potName"
                    className="budget-input-field"
                    type="text"   
                    value={currentPot.name}
                    disabled={true}
                >
                </input>
        
            </div>
            
            <div className="add-budget-modal-maximum-section">
                <p>Target</p>

                <input 
                    name="target"
                    className="budget-input-field max-spend"
                    type="number" 
                    placeholder="e.g. 2000"
                    value={selectedTarget}
                    onChange={(e) => setTarget(e)}
                />
                <span className="set-amount-dollar-sign">$</span>
            </div>

            <div className="add-budget-modal-theme-section">
                <p>Theme</p>
                <button 
                    className="budget-input-field"
                    onClick={() => {
                        setDisplayAddPotThemeDropdown(prev => !prev)
                    }}
                >

                  <div style={{display:"flex", gap:"1rem"}}>
                            <div className="theme-selection-color-block" style={{backgroundColor : `${selectedTheme}`}}></div>
                            <p style={{color: "var(--grey-900)"}}>{currentPotThemeColorName(selectedTheme)}</p>
                    </div>
                
                    <img 
                        className="down-arrow"
                        src={downArrowImage} alt="click to view options of category" />
                </button>
        
                {displayAddPotThemeDropdown && 
                <div className="add-budget-theme-dropdown-menu">
                {listOfThemes.map(theme => (
                    <button 
                        name="theme"
                        key={theme.color} 
                        value={theme.color}
                        disabled={assignedThemes.includes(theme.color)}
                        onClick={() => {
                            setSelectedTheme(theme.color)
                            setDisplayAddPotThemeDropdown(false)
                        }}
                        className="add-budget-category-dropdown-menu-individual-category select-theme-button"
                    >
                        <div>
                            <div className="theme-selection-color-block" style={{backgroundColor : `${theme.color}`}}></div>
                            <p>{theme.colorName}</p>
                            
                        </div>
                        <div>
                            {assignedThemes.includes(theme.color) ? <p style={{color: "var(--grey-900)"}}>Already used</p> : null}
                        </div>
                    </button>
                ))}
                </div>
            }

            </div>

            <button 
                className="add-new-budget-submit-button"
                onClick={() => submitNewPotInfo()}>Save Changes
            </button>
        </div> 
    )
}

/* 
                         <div style={{display:"flex", gap:"1rem"}}>
                            <div className="theme-selection-color-block" style={{backgroundColor : `${selectedTheme.color}`}}></div>
                            <p style={{color: "var(--grey-900)"}}>{selectedTheme.colorName}</p>
                        </div> : <div style={{display:"flex", gap:"1rem"}}>
                            <div className="theme-selection-color-block" style={{backgroundColor : `${currentPot.theme}`}}></div>
                            <p style={{color: "var(--grey-900)"}}>{currentPotThemeColorName(currentPot.theme)}</p>
                        </div>



*/