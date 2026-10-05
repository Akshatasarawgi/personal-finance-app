import React from 'react'

export default function ConfirmationBudgetAdded({category, maximum}) {
    return (
        <div className="confimation-modal-budget-added">
            <h3>Added '{category}' to your Budgets.</h3>
            <p>Maximum Budget set for {category} :  <span className="transaction-amount">${maximum}. </span></p>
        </div>
    )
}

   //  <h3>Added '{category}' to your Budgets</h3>