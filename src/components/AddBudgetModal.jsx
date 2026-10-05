import React from 'react'
import closeButtonImage from "/public/assets/icon-close-modal.svg"
import downArrowImage from "/public/assets/icon-caret-down.svg"
import selectedImageIcon from "/public/assets/icon-selected.svg"

function AddBudgetModal( {categories, submitNewAddedBudget, onClose ,assignedThemes, existingBudgets} ) {

    const [selectedCategory, setSelectedCategory] = React.useState("")
    const [selectedMaxSpend, setSelectedMaxSpend] = React.useState("")
    const [selectedTheme, setSelectedTheme] = React.useState("")
    const [displayAddBudgetCategoryDropDown, setDisplayAddBudgetCategoryDropdown] = React.useState(false)
    const [displayAddBudgetThemeDropdown, setDisplayAddBudgetThemeDropdown] = React.useState(false)
    const [displayError, setDisplayError] = React.useState(false)

    const modalRef = React.useRef(null)

    React.useEffect(() => {
        function handleClickOutside(event) {
            if(modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside)

        return () => document.removeEventListener('mousedown', handleClickOutside)
    },[onClose])

    const existingCategories = existingBudgets.map(budget => budget.category);

    function setMaxSpend(e) {
        setSelectedMaxSpend(e.target.value)
    }    

    function submitNewBudgetInfo() {
        if(selectedCategory !== "" && selectedMaxSpend !== "" && selectedTheme !== "") {
            submitNewAddedBudget(selectedCategory, selectedMaxSpend, selectedTheme.color)
        } else {
            setDisplayError(true)
        }
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

    return (
        <div ref={modalRef} className="new-budget-modal">
            <div className="add-new-budget-modal-header">
                <h2>Add New Budget</h2>
                <button 
                    className="close-button"
                    onClick={onClose}
                >
                <img src={closeButtonImage} alt="click to close add budget" />
                </button>
            </div>
            <p>Choose a category to set a spending budget. These categories can help you
                monitor spending.
            </p>
            {displayError && <p style={{textAlign:"center", color: "red"}}>Enter all the fields to Add a new Budget</p>}
            <div className="add-budget-modal-category-section">
                <p>Budget Category</p>

                <button 
                    className="budget-input-field"
                    onClick={() => {
                        setDisplayAddBudgetThemeDropdown(false)
                        setDisplayAddBudgetCategoryDropdown(prev => !prev)
                    }}
                >
                    { selectedCategory ? selectedCategory : 
                    "--Select a category--"}
                    <img 
                        className="down-arrow"
                        src={downArrowImage} alt="click to view options of category" />
                </button>
        
                {displayAddBudgetCategoryDropDown && 
                <div className="add-budget-category-dropdown-menu">
                {categories.map(category => (
                    <button 
                        name="category"
                        key={category} 
                        disabled={existingCategories.includes(category)}
                        value={category}
                        onClick={() => {
                            setSelectedCategory(category)
                            setDisplayAddBudgetCategoryDropdown(false)
                        }
                        }
                        className={selectedCategory.toLowerCase() === category.toLowerCase() ?
                            "add-budget-category-dropdown-menu-individual-category selected-category"
                            :"add-budget-category-dropdown-menu-individual-category"}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                        {selectedCategory.toLowerCase() === category.toLowerCase() && 
                        <img src={selectedImageIcon} className="selected-icon"/>} 
                    </button>
                ))}
                </div>
            }
            </div>
            
            <div className="add-budget-modal-maximum-section">
                <p>Maximum Spend</p>

                <input 

                    name="maxSpend"
                    className="budget-input-field max-spend"
                    type="number" 
                    placeholder="e.g. 2000"
                    value={selectedMaxSpend}
                    onChange={(e) => setMaxSpend(e)}
                />
                <span className="set-amount-dollar-sign">$</span>
            </div>

            <div className="add-budget-modal-theme-section">
                <p>Theme</p>
                <button 
                    className="budget-input-field"
                    onClick={() => {
                        setDisplayAddBudgetThemeDropdown(prev => !prev)
                        setDisplayAddBudgetCategoryDropdown(false)
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
        
                {displayAddBudgetThemeDropdown && 
                <div className="add-budget-theme-dropdown-menu">
                {listOfThemes.map(theme => (
                    <button 
                        name="theme"
                        key={theme.color} 
                        value={theme.color}
                        disabled={assignedThemes.includes(theme.color)}
                        onClick={() => {
                            setSelectedTheme(theme)
                            setDisplayAddBudgetThemeDropdown(false)
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
                onClick={() => submitNewBudgetInfo()}>Add Budget
            </button>
        </div> 
    )
}

export default AddBudgetModal
