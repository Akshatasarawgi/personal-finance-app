import React from "react"
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route} from "react-router-dom"
import Layout from "./components/Layout"
import OverviewPage , {loader as overviewLoader }from "./pages/OverviewPage"
import ErrorPage from './pages/ErrorPage'
import TransactionsPage, { loader as transactionLoader} from "./pages/TransactionsPage"
import BudgetPage, {loader as budgetLoader, action as addBudgetAction} from "./pages/BudgetPage"
import AddBudgetModal from './components/AddBudgetModal'
import PotsPage , {loader as potsLoader, action as potsAction} from "./pages/PotsPage"
import RecurringBillsPage, { loader as recurringBillsLoader} from "./pages/RecurringBillsPage"

const router = createBrowserRouter(createRoutesFromElements(
        <Route path="/" element={<Layout />} 
                errorElement={<ErrorPage />}>
            <Route index 
                element={<OverviewPage />} 
                loader={overviewLoader} />
            <Route 
                path="transactions" 
                element={<TransactionsPage />} 
                loader={transactionLoader}
            />
            <Route 
                path="budget" 
                element={<BudgetPage />} 
                loader={budgetLoader}
                action={addBudgetAction}
            />
            <Route 
                path="pots" 
                element={<PotsPage />}
                loader={potsLoader}
                action={potsAction}
            />
            <Route 
                path="recurringbills" 
                element={<RecurringBillsPage />} 
                loader={recurringBillsLoader}
            />
        </Route>
))

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}

