import React from "react"
import { Link } from "react-router-dom"
import arrowRight from '/public/assets/icon-caret-right.svg';
import EditBudgetModal from '../components/EditBudgetModal.jsx';
import DeleteBudgetModal from '../components/DeleteBudgetModal.jsx';
import ConfirmationBudgetEdited from '../components/ConfirmationBudgetEdited.jsx'
import ConfirmationBudgetDeleted from '../components/ConfirmationBudgetDeleted.jsx'

export default function BudgetPageCategory({data, 
        budget, 
        fetcher,
        assignedThemes,
        existingBudgets 
    }) {

    const [displayEditDeleteDropdown, setDisplayEditDeleteDropdown] = React.useState(false)
    const [displayEditBudgetModal, setDisplayEditBudgetModal]= React.useState(false)
    const [displayDeleteBudgetModal, setDisplayDeleteBudgetModal] = React.useState(false)
    const [showEditedBudgetConfirmation, setShowEditedBudgetConfirmation] = React.useState(false)
    const [showDeletedBudgetConfirmation, setShowDeletededBudgetConfirmation] = React.useState(false)
    const dropdownRef = React.useRef(null)

      function closeEditBudgetModal() {
        setDisplayEditBudgetModal(false)
    }
   
    function closeDeleteBudgetModal() {
        setDisplayDeleteBudgetModal(false)
    }

    function setEditBudgetModal() {
        setDisplayEditDeleteDropdown(false)
        setDisplayEditBudgetModal(true)
        setDisplayDeleteBudgetModal(false)
    }

    function setDeleteBudgetModal() {
        setDisplayEditDeleteDropdown(false)
        setDisplayDeleteBudgetModal(true)
        setDisplayEditBudgetModal(false)
    }

       function submitEditExistingBudget(category, maximum, theme) {
            fetcher.submit(
                {
                    category,
                    maximum,
                    theme
                },
                {
                    method: 'PUT'
                }
            )
            closeEditBudgetModal()
        }
    
        function submitDeleteBudget(category, maximum, theme) {
            fetcher.submit(
                {
                    category,
                    maximum,
                    theme
                },
                {
                    method: 'DELETE'
                }
            )
    
            closeDeleteBudgetModal()
        }


        React.useEffect(() => {
        
                if(fetcher.data && fetcher.formMethod === 'PUT') {
                    setShowEditedBudgetConfirmation(true)
                }
                if(fetcher.data && fetcher.formMethod === 'DELETE') {
                    setShowDeletededBudgetConfirmation(true)
                }
                const timer = setTimeout(() => {
                    
                     setShowEditedBudgetConfirmation(false)
                    setShowDeletededBudgetConfirmation(false)
                }, 5000)
                return () => clearTimeout(timer)
                
            }, [fetcher.data, fetcher.formMethod])

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
 
         <div className="budget-page-category-details-individual-category">
                    {displayEditBudgetModal && 
                        <EditBudgetModal 
                            currentBudget={budget}
                            assignedThemes={assignedThemes}
                            existingBudgets={existingBudgets}  
                            submitEditExistingBudget={submitEditExistingBudget}
                            onClose = {() => setDisplayEditBudgetModal(false)}
                        />
                    } 

                        {showEditedBudgetConfirmation && 
                            <ConfirmationBudgetEdited 
                                category={fetcher.data.category} 
                                maximum={fetcher.data.maximum}/>                
                        }

                        {displayDeleteBudgetModal && 
                        <DeleteBudgetModal 
                            budgetToDelete={budget}
                            submitDeleteBudget={submitDeleteBudget}
                            onClose={() => setDisplayDeleteBudgetModal(false)}
                        />
                        } 
                                
                        {showDeletedBudgetConfirmation && 
                            <ConfirmationBudgetDeleted 
                                category={fetcher.data.category} 
                            />                
                        }
                        
                        <div className="details-individual-header">    
                            <div style={{display: "flex", alignItems: "center"}}>
                                <div className="category-circle" style={{backgroundColor: budget.theme, marginRight: "13px"}}></div>
                                <h2>{budget.category}</h2>
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
                                           onClick={() => setEditBudgetModal()}>
                                            Edit Budget
                                        </button>
                                        <button 
                                            className="delete-budget-btn"
                                            onClick={() => setDeleteBudgetModal()}>
                                            Delete Budget
                                        </button>
                                </div>
                            }
                            </div>
                        </div>   

                        <p style={{color: "var(--grey-500)"}}>Maximum of ${budget.maximum}</p>

                        <div className="budget-page-category-details-individual-budget-percentage">
                            <div 
                                className="budget-page-category-details-individual-spent-percentage"
                                style={{backgroundColor: budget.theme, width: `${(budget.spent / budget.maximum) * 100}%`  }}
                            >
                            </div>
                        </div>

                        <div className="budget-page-category-details-individual-category-budget-detail">

                            <div className="budget-page-category-details-individual-category-budget-detail-spent-section">
                                <div style={{backgroundColor: budget.theme}} className="individual-theme-color"></div>
                                <div className="budget-page-category-details-individual-category-budget-detail-spent">
                                    <p className="transaction-type">Spent</p>
                                    <p className="budget-page-chart-container-spent-amount">${(budget.spent).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="budget-page-category-details-individual-category-budget-detail-spent-section">
                                <div style={{backgroundColor: "var(--background-Color"}} className="individual-theme-color"></div>
                                <div className="budget-page-category-details-individual-category-budget-detail-remaining">
                                    <p className="transaction-type">Remaining</p>
                                    <p className="budget-page-chart-container-spent-amount">{budget.maximum - budget.spent < 0 ?
                                        `-$${Math.abs(budget.maximum - budget.spent).toFixed(2)}` : 
                                        `$${(budget.maximum - budget.spent).toFixed(2)}`}</p>
                                </div>
                            </div>

                        </div>

                        <div className="budget-page-category-details-individual-category-budget-detail-spending-list">
                            <div className="component-info">
                                <h3 className="overview-page-individual-heading">Latest Spending</h3>
                                <Link to={`/transactions?category=${budget.category.toLowerCase()}`} className="see-details-link">
                                    See Details<img className="right-arrow" src={arrowRight} alt="more details arrow" />
                                </Link>
                            </div>

                            {data.transactions.filter(transaction => 
                                transaction.category.toLowerCase() === budget.category.toLowerCase()
                            ).slice(0,3).map(obj => (
                                <div key={obj.date}
                                    className="budget-page-category-details-individual-category-individual-transaction"
                                >
                                    <div className="transactions-recipient-sender-details">
                                        <img 
                                            src={obj.avatar} 
                                            alt={`image of ${obj.name}`}
                                            className="recipient-sender-image"/>
                                        <p>{obj.name}</p>
                                    </div>    

                                    <div className="transactions-recipient-sender-transaction-details">  
                                        <p className="budget-page-chart-container-spent-amount">-${Math.abs(obj.amount)}</p>
                                        <p className="transaction-date">{new Date(obj.date).toLocaleDateString('en-GB', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                        })}</p>
                                    </div>    
                                </div>
                            ))}                            
                        </div>
                    </div>
    )
}