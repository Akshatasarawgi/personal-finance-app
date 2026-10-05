import React from 'react'

export default function ConfirmationBudgetEdited({category, maximum}) {
    return (
        <div className="confimation-modal-budget-added">
            <h3>Updated '{category}' in your Budgets.</h3>
            <p>Maximum Budget set for {category} :  <span className="transaction-amount">${maximum}. </span></p>
        </div>
    )
}