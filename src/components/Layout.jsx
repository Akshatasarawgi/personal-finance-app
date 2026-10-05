import React from "react"
import {Outlet} from "react-router-dom"
import NavigationBar from "./NavigationBar"

export default function Layout() {
    return (
        <div className="container">
            <NavigationBar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}