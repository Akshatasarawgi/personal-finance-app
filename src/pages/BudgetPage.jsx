import React from "react"
import { getData, addBudgetToDb, editExistingBudgetToDb, deleteBudgetFromDb } from '../../utils/api.js'
import { useLoaderData , Link, useFetcher} from 'react-router-dom'
import {ResponsiveContainer, PieChart, Pie, Cell, Legend} from 'recharts'
import AddBudgetModal  from '../components/AddBudgetModal.jsx'
import BudgetPageCategory from "../components/BudgetPageCategory"
import ConfirmationBudgetAdded from '../components/ConfirmationBudgetAdded.jsx'

export async function loader() {
    return await getData()    
}
export async function action( {request} ) {
    const formData = await request.formData()
    const category = formData.get("category")
    const maximumString = formData.get("maximum")
    const maximum = Number(maximumString)
    const theme = formData.get("theme")

let data 
    if(request.method === 'POST') {
        data = await addBudgetToDb({category, maximum, theme})
    } 
    if(request.method === 'PUT') {
        data = await editExistingBudgetToDb({category, maximum, theme})
    }
    if(request.method === 'DELETE') {
        data = await deleteBudgetFromDb({category, maximum, theme})
    }

   return data
}

function BudgetPage() {
    const [displayAddNewBudgetModal, setDisplayAddNewBudgetModal] = React.useState(false)
    const [showAddBudgetConfirmation, setShowAddBudgetConfirmation] = React.useState(false)  
    const data = useLoaderData()
    const fetcher = useFetcher()

    function displayAddBudgetModal() {
        setDisplayAddNewBudgetModal(true)
     
    }

    function closeAddBudgetModal() {
        setDisplayAddNewBudgetModal(false)
    }

    function submitNewAddedBudget(category, maximum, theme) {
            fetcher.submit(
                {
                    category,
                    maximum, 
                    theme
                },
                {
                    method: 'POST'
                }
        )
            closeAddBudgetModal()
        }

 

        React.useEffect(() => {
        if(fetcher.data && fetcher.formMethod === 'POST') {
            setShowAddBudgetConfirmation(true)
        }
    
        const timer = setTimeout(() => {
            setShowAddBudgetConfirmation(false)
            
        }, 5000)
        return () => clearTimeout(timer)
        
    }, [fetcher.data, fetcher.formMethod])     
    
    let categories = [];
        data.transactions.forEach(transaction => {
                if(!categories.includes(transaction.category)) {
                categories.push(transaction.category)
            }
        })

    let assignedThemes = data.budgets.map(budget => budget.theme)

    let existingBudgets = data.budgets.map(budget => {

        return {
            category: budget.category,
            maximum: budget.maximum
        }
    })
          

    const spendingByCategory = data.budgets.map(budget => {
        const spent = data.transactions.filter(transaction => 
            transaction.category.toLowerCase() === budget.category.toLowerCase() && transaction.amount < 0
        ).reduce((total,transaction) => {
            return total + Math.abs(transaction.amount)
        },0
        )
        return {
            category: budget.category,
            spent,
            maximum: budget.maximum,
            theme: budget.theme
        }
    })

    const totalSpent = spendingByCategory.reduce((total,budget) => total + budget.spent, 0);
    const totalLimit = data.budgets.reduce((total,budget) =>  total + budget.maximum ,0)

    const pieChartData = data.budgets.map(obj => {
        return {
            category: obj.category,
            budget: obj.maximum
        }
    })
    const pieChartColors = data.budgets.map(obj => obj.theme)

    const budgetOverview = spendingByCategory.map(budget => (
                    <div key={budget.category} className="budget-page-budget-chart-container-category-summary-individual-card">
                        <div>
                            <div style={{backgroundColor: budget.theme}} className="individual-theme-color"></div>
                            <p className="transaction-type">{budget.category}</p>
                        </div>
                  
                        <div>
                            <p><span className="budget-page-chart-container-spent-amount">${budget.spent.toFixed(2)}</span>
                                <span className="budget-page-chart-container-budget-amount"> of ${budget.maximum}</span></p>
                        </div> 
                    </div>
        ))

    return (
        <section className="budget-page">

            <div className="budget-page-header">
              <h1 className="page-head">Budgets</h1>
                <button 
                    className="add-new-info-button"
                    onClick={() => 
                        displayAddBudgetModal()}
                >
                    + Add New Budget
                </button>
            </div> 

            {displayAddNewBudgetModal && 
                <AddBudgetModal 
                    categories={categories}
                    assignedThemes={assignedThemes}
                    existingBudgets={existingBudgets}                
                    submitNewAddedBudget={submitNewAddedBudget}
                    onClose = {() => setDisplayAddNewBudgetModal(false)}
                    />
            }

            {showAddBudgetConfirmation && 
            <ConfirmationBudgetAdded 
                category={fetcher.data.category} 
                maximum={fetcher.data.maximum}/>
            }


              <div className="budget-page-container">
                
                <div className="budget-page-chart-container">

                    <div className="budget-page-chart" style={{width: "100%", height: "300px"}}>
                            <ResponsiveContainer>
                            <PieChart>
                                <Pie 
                                    data={pieChartData}
                                    isAnimationActive={false}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    innerRadius={80}
                                    outerRadius={130}
                                    fill="#8884d8"
                                    dataKey="budget"
                                    nameKey="category"
                                    >
                                        {pieChartData.map((entry,index) => (
                                            <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                                        ))}
                                </Pie>

                                <text
                                    x = "50%"
                                    y = "47%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#222"
                                    fontSize="24"
                                    fontWeight="700"
                                >
                                  {`$${totalSpent.toFixed(2)}`}  
                                </text>

                                <text
                                    x="50%"
                                    y="59%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#777"
                                    fontSize="18"
                                >
                                of {`$${totalLimit}`} limit                             
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="budget-page-chart-container-summary">
                        <h2>Spending Summary</h2>
                        <div className="budget-page-budget-chart-container-category-summary">
                            {budgetOverview}
                        </div>
                    </div>
                </div>

                <div className="budget-page-category-details-container">
                    {spendingByCategory.map(budget => (
                         <BudgetPageCategory 
                            key={budget.category}
                            data={data}
                            fetcher={fetcher}
                            budget={budget}
                            assignedThemes={assignedThemes}
                            existingBudgets={existingBudgets}  
                           
                        />
                    ))}
                </div>

              </div>
        </section>
    )
}

export default BudgetPage


/* Note -  

    Dropdowns should close on clicking outside.

    Edit Budget should let the user stay with the current theme that was selected previously. not to force to select a new theme.
*/