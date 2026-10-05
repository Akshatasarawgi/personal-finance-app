import React from 'react'

export default function ConfirmationBudgetDeleted({category}) {
    return (
        <div className="confimation-modal-budget-added">
            <h3>Successfully removed '{category}' from your Budgets.</h3>
        </div>
    )
}