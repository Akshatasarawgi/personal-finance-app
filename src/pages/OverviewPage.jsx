import React from "react"
import {ResponsiveContainer, PieChart, Pie, Cell, Legend} from 'recharts'
import { Link } from 'react-router-dom'
import savedAmountImage from '/public/assets/icon-nav-pots.svg'
import arrowRight from '/public/assets/icon-caret-right.svg'
import { getData } from '../../utils/api.js'
import { useLoaderData } from 'react-router-dom'

export async function loader() {
    const dataReceived = await getData()
    return dataReceived
}

function OverviewPage() {

    const data = useLoaderData()
    
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

    const spent = spendingByCategory.reduce((total,budget) => total + budget.spent, 0);
    const limit = data.budgets.reduce((total,budget) =>  total + budget.maximum ,0)

    const currentBalance = data.balance.current.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const income = data.balance.income.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const expenses = data.balance.expenses.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const totalSaved = data.pots.reduce((acc, curr) => {
        return acc + curr.total
    }, 0)

    const potsOverview = data.pots.slice(0,4).map(obj => (
                    <div className="overview-page-pots-component-details-individual-card">
                        <div style={{backgroundColor: obj.theme}} className="individual-theme-color"></div>
                        <div className="overview-page-pots-component-details-individual-card-section">
                            <p className="transaction-type">{obj.name}</p>
                            <p className="transaction-amount">${obj.total}</p>
                        </div>
                    </div>
    ))

    const transactionOverview = data.transactions.slice(0,5).map(obj => (
                        <div className="overview-page-transactions-component-details-individual-transaction">
                            <div className="transactions-recipient-sender-details">
                                <img src={obj.avatar} alt={`Image of ${obj.name}`} className="recipient-sender-image"/>
                                <p className="recipient-sender-name">{obj.name}</p>
                            </div>
                            <div className="transactions-recipient-sender-transaction-details">
                                <p className="transaction-amount" style={obj.amount < 0 ? {color: "#201F24",fontWeight: "600"} : {color: "#277C78",fontWeight: "600"}}>
                                    {obj.amount < 0 ? `-$${Math.abs(obj.amount).toFixed(2)}` : `+$${obj.amount.toFixed(2)}`}
                                </p>
                                <p className="transaction-date">{new Date(obj.date).toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                    })}</p>
                            </div>
                        </div>
    ))

    const budgetOverview = data.budgets.slice(0,4).map(obj => (
                    <div className="overview-page-budget-component-details-individual-card">
                        <div style={{backgroundColor: obj.theme, width: "6px"}} className="individual-theme-color"></div>
                        <div>
                            <p className="transaction-type">{obj.category}</p>
                            <p className="transaction-amount">${obj.maximum}</p>
                        </div>
                    </div>
    ))

    const pieChartData = data.budgets.map(obj => {
        return {
            category: obj.category,
            budget: obj.maximum
        }
       
    })

    const pieChartColors = data.budgets.map(obj => obj.theme)

    const recurringBills = data.transactions.filter(obj => obj.recurring === true).slice(0,3)
    
    const recurringBillsOverview = recurringBills.map(obj => (
                    <div className="overview-page-recurring-bills-component-details-individual-card">
                        <p className="heading-info-paragraph">{obj.name}</p>
                        <p className="heading-info-paragraph-amount"><span>$</span>{Number(obj.amount.toString().slice(1))}</p>                       
                    </div>  
    ))
   
    return (
        <section className="overview-page">
            <h1 className="page-head">Overview</h1>

            <div className="overview-page-current-info">
                <div className="overview-page-current-info-individual-card highlighted">
                    <p className="heading-info-paragraph">Current Balance</p>
                    <p className="heading-info-paragraph-amount"><span>$</span>{currentBalance}</p>
                </div>
                <div className="overview-page-current-info-individual-card">
                    <p className="heading-info-paragraph">Income</p>
                    <p className="heading-info-paragraph-amount"><span>$</span>{income}</p>
                </div>
                <div className="overview-page-current-info-individual-card">
                    <p className="heading-info-paragraph">Expenses</p>
                    <p className="heading-info-paragraph-amount"><span>$</span>{expenses}</p>
                </div>
            </div>

            <div className="overview-grid">
            <div className="overview-page-pots-component">
                <div className="component-info">
                    <h2 className="overview-page-individual-heading">Pots</h2>
                    <Link to="/pots" className="see-details-link">See Details<img className="right-arrow" src={arrowRight} alt="more details arrow" /></Link>
                </div>

                <div className="overview-page-pots-component-info">

                <div className="overview-page-pots-component-total-saved-card">
                    <img src={savedAmountImage} alt="total saved amount image" className="pots-image" />
                    <div style={{display: "flex",gap:"0.6rem", flexDirection: "column", padding: "1%"}}>
                        <p className="heading-info-paragraph">Total Saved</p>
                        <p className="heading-info-paragraph-amount"><span>$</span>{totalSaved}</p>
                    </div>
                </div>

                <div className="overview-page-pots-component-details">
                    {potsOverview}
                </div>
                </div>
            </div>

            <div className="overview-page-budgets-component">
                <div className="component-info">
                    <h2 className="overview-page-individual-heading">Budgets</h2>
                    <Link to="/budget" className="see-details-link">See Details<img className="right-arrow" src={arrowRight} alt="more details arrow" /></Link>
                </div>

                <div className="overview-page-budget-component-details">
                    <div style={{width: "100%", height: "350px"}}>
                         <ResponsiveContainer>
                            <PieChart>
                                <Pie 
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    isAnimationActive={false}
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
                                    y = "45%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#222"
                                    fontSize="24"
                                    fontWeight="700"
                                >
                                    {`$${spent.toFixed(2)}`}
                                </text>

                                <text
                                    x="50%"
                                    y="54%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#777"
                                    fontSize="18"
                                >
                                    of {`$${limit}`} limit
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="overview-page-budgets-category-list">
                    {budgetOverview}
                    </div>
                </div>
            </div>

            <div className="overview-page-transactions-component">
                <div className="component-info">
                    <h2 className="overview-page-individual-heading">Transactions</h2>
                    <Link to="/transactions" className="see-details-link">View All<img className="right-arrow" src={arrowRight} alt="more details arrow" /></Link>
                </div>

                <div className="overview-page-transactions-component-details">
                    {transactionOverview}                                         
                </div>   
            </div>

            <div className="overview-page-recurring-bills-component">
                <div className="component-info">
                    <h2 className="overview-page-individual-heading">Recurring Bills</h2>
                    <Link to="/recurringbills" className="see-details-link">See Details<img className="right-arrow" src={arrowRight} alt="more details arrow" /></Link>
                </div>

                <div className="overview-page-recurring-bills-component-details">
                  {recurringBillsOverview}
                </div>            
            </div>
        </div>
        </section>
    )
}

export default OverviewPage