import React from "react"
import {Link, NavLink} from "react-router-dom"
import fullLogo from "/public/assets/logo-large.svg"
import shortLogo from "/public/assets/logo-small.svg"
import navOverviewIcon from "/public/assets/icon-nav-overview.svg"
import navTransactionsIcon from "/public/assets/icon-nav-transactions.svg"
import navBudgetsIcon from "/public/assets/icon-nav-budgets.svg"
import navPotsIcon from "/public/assets/icon-nav-pots.svg"
import navRecurringBillsIcon from "/public/assets/icon-nav-recurring-bills.svg"
import minimizeMenuIcon from "/public/assets/icon-minimize-menu.svg"


function NavigationBar() {
    const [showMenu, setShowMenu] = React.useState(true)


    function toggleMenu() {
        setShowMenu(prevState => !prevState)
    }
    
    return (
            <section className="navigation-bar">
            {showMenu ?
                <div className="fullMenu">
                    <div className="long-company-logo">
                        <Link to="/"><img src={fullLogo} alt="finance logo" /></Link>
                    </div>
                
                    <nav className="menu-nav">
                        <NavLink to="/" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navOverviewIcon} alt="" />Overview</NavLink>
                        <NavLink to="/transactions" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navTransactionsIcon} alt="" />Transactions</NavLink>
                        <NavLink to="/budget" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navBudgetsIcon} alt="" />Budgets</NavLink>
                        <NavLink to="/pots" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navPotsIcon} alt="" />Pots</NavLink>
                        <NavLink to="/recurringbills" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navRecurringBillsIcon} alt="" />Recurring Bills</NavLink>
                    </nav>
    
                    <button className="toggle-navigation-bar" onClick={toggleMenu}>
                            <img src={minimizeMenuIcon} alt="click to minimize side bar"/>
                            Minimize Menu
                    </button>
                </div>  
               :   
                <div className="smallMenu">
                    <div className="short-company-logo">
                        <Link to="/"><img src={shortLogo} alt="finance logo" /></Link>
                    </div>

                    <nav className="menu-nav">
                        <NavLink to="/" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navOverviewIcon} alt="Overview"/></NavLink>
                        <NavLink to="/transactions" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navTransactionsIcon} alt="Transactions" /></NavLink>
                        <NavLink to="/budget" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navBudgetsIcon} alt="Budget" /></NavLink>
                        <NavLink to="/pots" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navPotsIcon} alt="Pots" /></NavLink>
                        <NavLink to="/recurringbills" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navRecurringBillsIcon} alt="Recurring Bills" /></NavLink>
                    </nav>

                    <button className="toggle-navigation-bar" onClick={toggleMenu}>
                        <img src={minimizeMenuIcon} className="maximize-menu-bar-icon" alt="click to maximize side bar"/>
                    </button>
                </div>
            }          

            <nav className="tablet-footer">
                        <NavLink to="/" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navOverviewIcon} alt="Overview"/>Overview</NavLink>
                        <NavLink to="/transactions" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navTransactionsIcon} alt="Transactions" />Transactions</NavLink>
                        <NavLink to="/budget" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navBudgetsIcon} alt="Budget" />Budgets</NavLink>
                        <NavLink to="/pots" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navPotsIcon} alt="Pots" />Pots</NavLink>
                        <NavLink to="/recurringbills" className={({isActive}) => isActive ? "active-link link" : "link"}><img src={navRecurringBillsIcon} alt="Recurring Bills" />Recurring Bills</NavLink>
            </nav> 
        </section>
        )
        }
      
   

    


export default NavigationBar