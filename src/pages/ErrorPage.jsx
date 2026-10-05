import React from 'react'
import {Link, useRouteError} from 'react-router-dom'

function ErrorPage() {

    const error = useRouteError()
    console.log(error)
 
    return (
        <div className="error-page-section">
            <h1>Something's gone wrong!</h1>
            <h2>Try refreshing your page or return to home page.</h2>
            <Link to="/">PersonalFinanceApp</Link>
        </div>
    )
}

export default ErrorPage