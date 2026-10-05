import React from "react"
import { useLoaderData } from 'react-router-dom'
import searchImage from "/public/assets/icon-search.svg"
import billsImage from '/public/assets/icon-recurring-bills.svg'
import mobileSortFilter from "/public/assets/icon-sort-mobile.svg"
import downArrowImage from "/public/assets/icon-caret-down.svg"
import { getData } from '../../utils/api.js'
import { useReactTable, createColumnHelper, flexRender , getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'

export async function loader(){
    return await getData()
}

const columnHelper = createColumnHelper()

const columns = [
    columnHelper.accessor("name", {
        cell: (info) => {
            const company = info.row.original;

            return (
                <div className="recipient-cell">
                    <img src={company.avatar}
                    alt={company.name}
                    className="avatar"
                    />
                    <span>{company.name}</span>
                </div>
            )
        },
        header: () => "Bill Title"
    }),

    columnHelper.accessor("date", {
        cell: (info) => {
            const date = new Date(info.getValue())
            const day = date.getDate()

            function getOrdinalSuffix(day) {
                if(day > 3 && day < 21) return 'th';
                switch(day % 10) {
                    case 1: return "st";
                    case 2: return "nd";
                    case 3: return "rd";
                    default: return "th";
                }
            }

            function checkDate(day) {
                if(day >= 15 && day <= 25) {
                    return  "date-due-red"
                } else if(day < 15) {
                    return "date-paid-green"
                } else {
                    return ""
                }
            }

            return (
                <div className="date">
                    <span
                        className={ checkDate(day) }>
                        {`Monthly-${day}${getOrdinalSuffix(day)}`}
                    </span>
                </div>
            )
        },
        header: () => "Due Date",
        sortingFn: (rowA, rowB, columnId) => {
            const dateA = new Date(rowA.getValue(columnId))
            const dateB = new Date(rowB.getValue(columnId))

            return dateB.getDate() - dateA.getDate()
        }
    }),

    columnHelper.accessor("amount", {
        cell: (info) => {
            const bill = info.row.original
            const day = new Date(bill.date).getDate()

            return (
                <div className={day >= 15 && day <= 25 ? "red-due-soon-amount" : "transaction-amount"}>
                    <span>${Math.abs(info.getValue()).toFixed(2)}</span>
                </div>
            )
        },
        header: () => "Amount",
    })
]

function RecurringBillsPage() {
    const data = useLoaderData()
    const [sorting, setSorting] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [displaySortFilterDropdown, setDisplaySortFilterDropdown] = React.useState(false)  
    const recurringBillsFromDb = React.useMemo(() => data.transactions.filter(tran => tran.recurring === true), [data.transactions])
    const total = recurringBillsFromDb.reduce((total,cur) => total + Math.abs(cur.amount),0).toFixed(2)
    const desktopSortModalRef = React.useRef(null)
    const mobileSortModalRef = React.useRef(null)
    
        const sortingOptions = [
        {
            value: "date:desc",
            label: "Latest"
        },
        {
            value: "date:asc",
            label: "Oldest", 
        },
        {
            value: "name:asc",
            label: "A to Z"
        },
        {
            value:"name:desc",
            label: "Z to A" 
        },
        {
            value: "amount:desc",
            label : "Highest"
        },
        {
            value: "amount:asc",
            label: "Lowest"
        }
    ]

    const table = useReactTable({
            data: recurringBillsFromDb,
            columns,
            state: {
                sorting,
                globalFilter
            },
            getCoreRowModel: getCoreRowModel(),
            onSortingChange: setSorting,
            getSortedRowModel: getSortedRowModel(),
            onGlobalFilterChange: setGlobalFilter,
            getFilteredRowModel: getFilteredRowModel()
          
})

    function handleSortChange(option) {
        const [id, direction] = option.value.split(":")
        console.log(id)
    
        setSorting([
            {
                id,
                desc: direction === "desc"
            }
        ])

        setDisplaySortFilterDropdown(false)
    }
    const paidBills = React.useMemo(() => recurringBillsFromDb.filter(bill => {
        const dateObj = new Date(bill.date)
        return dateObj.getDate() < 15
    }
    ),[recurringBillsFromDb])

    const billsPaidTotal = Math.abs(paidBills.reduce((total,cur) => total + cur.amount, 0)).toFixed(2)

    const upcomingBills = React.useMemo(() => recurringBillsFromDb.filter(bill => {
        const dateObj = new Date(bill.date)
        return dateObj.getDate() >= 15
    }),[recurringBillsFromDb])

    const upcomingBillsTotal =  Math.abs(upcomingBills.reduce((total,cur) => total + cur.amount, 0)).toFixed(2)

    const dueSoonBills = React.useMemo(() => recurringBillsFromDb.filter(bill => {
        const dateObj = new Date(bill.date)
        return dateObj.getDate() >= 15 && dateObj.getDate() <= 25
    }),[recurringBillsFromDb])

    const dueSoonTotal =  Math.abs(dueSoonBills.reduce((total,cur) => total + cur.amount, 0)).toFixed(2)

    function isSelectedSort(option) {
        const [id, direction] = option.value.split(":")

        return (
            sorting[0]?.id === id &&
                sorting[0]?.desc === (direction === "desc")
        )
    }

    React.useEffect(() => {
        function handleClickOutside(event) {
            const desktopSort = desktopSortModalRef.current?.contains(event.target)
            const mobileSort = mobileSortModalRef.current?.contains(event.target)

            if(!desktopSort && !mobileSort) {
                setDisplaySortFilterDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)

        return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    return (
        <section className="recurring-bills-page">
            <h1 className="page-head">Recurring Bills</h1>

            <div className="recurring-bills-page-container">

                <div className="recurring-bills-page-summary-container">
                    <div className="recurring-bills-page-summary-card">
                        <img 
                            src={billsImage} 
                            alt="recurring bills image" 
                            className="recurring-bills-image"/>
                         <div className="recurring-bills-page-summary-card-div">    
                            <p>Total Bills</p>
                            <p className="recurring-bills-total-amount">${total}</p>
                        </div>
                    </div>

                    <div className="recurring-bills-page-summary-details">
                        <h2>Summary</h2>
                        <div className="recurring-bills-page-individual-summary-container">
                            <div className="recurring-bills-page-individual-detail">
                                <p>Paid Bills</p>
                                <p className="transaction-amount">${billsPaidTotal}</p>
                            </div>
                            <div className="recurring-bills-page-individual-detail">
                                <p>Total Upcoming</p>
                                <p className="transaction-amount">${upcomingBillsTotal}</p>
                            </div>
                            <div className="recurring-bills-page-individual-detail">
                                <p 
                                    className="transaction-amount red-due-soon-amount" 
                                    style={{fontWeight: "400"}}
                                >
                                    Due Soon
                                </p>
                                <p className="transaction-amount red-due-soon-amount">${dueSoonTotal}</p>
                            </div>
                        </div>
                    </div>

                </div>
            
            <div className="recurring-bills-page-details-container">

                <div className="recurring-bills-main-container-header">
                    <div className="recurring-bills-search-section">
                        <input
                            className="search-input-field"
                            type="text"
                            value={globalFilter}
                            name="search"
                            placeholder="Search bills"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />    
                        <img src={searchImage} alt="search icon" className="search-icon"/>                        
                    </div>

                    <div
                         ref={desktopSortModalRef} 
                        className="recurring-bills-sort-section"
                    >
                        <div 
                            className="dropdown-button">
                            <button 
                                type="button"
                                className="sort-filter-button"
                                onClick={() => setDisplaySortFilterDropdown(prev => !prev)}
                            >{sortingOptions.find(isSelectedSort)?.label ?? "Sort By"}
                            <img 
                                src={downArrowImage} 
                                alt="open sort options" 
                                className={displaySortFilterDropdown ? "reverse-down-arrow" : "down-arrow"}
                            />                             
                            </button>    
                        </div>

                        {displaySortFilterDropdown && (
                            <div 
                                className="sort-filter-dropdown-menu">
                                {sortingOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`sort-option ${isSelectedSort(option)? "selected" : ""}`}
                                        onClick={() => handleSortChange(option)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div
                        ref={mobileSortModalRef} 
                        className="mobile-sort-filter"
                    >
                        <button 
                            type="button"
                            className="mobile-sort-filter-button"
                            onClick={() => setDisplaySortFilterDropdown(prev => !prev)}
                        >
                            <img 
                                src={mobileSortFilter}
                                alt="open sort options"
                            />    
                        </button>   

                        {displaySortFilterDropdown && (
                            <div className="dropdown-menu">
                                 <button disabled={true} className="disabled-option">Sort by</button>
                                {sortingOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`sort-option ${isSelectedSort(option)? "selected" : ""}`}
                                        onClick={() => handleSortChange(option)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                    <table className="transactions-table">
                        <thead className="table-head">
                            {table.getHeaderGroups().map((headerGroup) => 
                                 <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th className={`table-header table-${header.id}`} key={header.id} style={{width: header.getSize()}}>
                                            <p>
                                                {flexRender(header.column.columnDef.header,
                                                     header.getContext()
                                                )}
                                            </p>
                                        </th>
                                    ))
                                    }
                                </tr>
                            )}
                        </thead>
                        <tbody className="table-body">
                            {
                                table.getRowModel().rows.map(row => (
                                    <tr className="data-grid" key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                             <td 
                                                key={cell.id}
                                                className={cell.id.slice(2)}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            }
                        </tbody> 
                    </table>
            </div>

            </div>
        </section>
    )
}

export default RecurringBillsPage


/* 
Check figma design for completing Pot modals information .

Add selected tick mark fro existing theme


  getPaginationRowModel: getPaginationRowModel(),

,
            initialState: {
                pagination: {
                    pageSize: 10,
                },
            },



import mobileSortFilter from "/public/assets/icon-sort-mobile.svg"
                    <div className="mobile-sort-filter">
                        <button 
                            type="button"
                            className="mobile-sort-filter-button"
                            onClick={() => {
                                setDisplaySortFilterDropdown(prev => !prev)
                            }}
                        >
                            <img 
                                src={mobileSortFilter}
                                alt="open sort options"
                            />    
                        </button>   
                    
                        {displaySortFilterDropdown && (
                            <div className="dropdown-menu">
                                 <button disabled={true} className="disabled-option">Sort by</button>
                                {sortingOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`sort-option ${sorting === option.value ? "selected" : ""}`}
                                        onClick={() => handleSortChange(option)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>




*/