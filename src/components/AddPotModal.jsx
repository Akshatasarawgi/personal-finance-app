import React from 'react'
import closeButtonImage from "/public/assets/icon-close-modal.svg"
import downArrowImage from "/public/assets/icon-caret-down.svg"


export default function AddPotModal({onClose, submitNewAddedPot, assignedThemes, assignedPotNames}) {
    const modalRef = React.useRef(null)
    const [selectedPotName, setSelectedPotName] = React.useState("")
    const [selectedTarget, setSelectedTarget] = React.useState("")
    const [selectedTheme, setSelectedTheme] = React.useState("")
    const [displayAddPotThemeDropdown, setDisplayAddPotThemeDropdown] = React.useState(false)

    const [displayError, setDisplayError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    let total = 0


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
        if(assignedPotNames.map(potname=> potname.toLowerCase()).includes(selectedPotName.toLowerCase())) {
            setDisplayError(true)
            setErrorMessage("The Pot Name already exists.")
            return 
        }
        if(selectedPotName !== "" && selectedTarget !== "" && selectedTheme !== "") {
            submitNewAddedPot(selectedPotName, selectedTarget, selectedTheme.color, total)
        } else {
            setDisplayError(true)
            setErrorMessage("Enter all the fields to Add a new Pot")
        }
    }

    return (
        <div ref={modalRef} className="new-budget-modal">
            <div className="add-new-budget-modal-header">
                <h2>Add New Pot</h2>
                <button 
                    className="close-button"
                    onClick={onClose}
                >
                <img src={closeButtonImage} alt="click to close add budget" />
                </button>
            </div>
            <p>Create a pot to set savings targets. These can help keep you on track as you save for special purchases.
            </p>

            {displayError && <p style={{textAlign:"center", color: "red"}}>{errorMessage}</p>}
            <div className="add-budget-modal-category-section">
                <p>Pot Name</p>

                <input 
                    name="potName"
                    className="budget-input-field"
                    type="text"
                    placeholder='e.g. Rainy Days'
                    value={selectedPotName}
                    onClick={() => {
                        setDisplayAddPotThemeDropdown(false)
                    }}
                    onChange={(e) => setSelectedPotName(e.target.value)}
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
                    {selectedTheme ?
                         <div style={{display:"flex", gap:"1rem"}}>
                            <div className="theme-selection-color-block" style={{backgroundColor : `${selectedTheme.color}`}}></div>
                            <p style={{color: "var(--grey-900)"}}>{selectedTheme.colorName}</p>
                        </div> : 
                    "--Select a theme--"}
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
                            setSelectedTheme(theme)
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
                onClick={() => submitNewPotInfo()}>Add Pot
            </button>
        </div> 
    )
}