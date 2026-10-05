import React from "react"
import { getData } from '../../utils/api'
import { useLoaderData } from 'react-router-dom'
import { useReactTable, createColumnHelper, flexRender , getCoreRowModel, getSortedRowModel, getFilteredRowModel,
        getPaginationRowModel } from '@tanstack/react-table'
import searchImage from "/public/assets/icon-search.svg"
import leftArrowImage from "/public/assets/icon-caret-left.svg"
import rightArrowImage from "/public/assets/icon-caret-right.svg"
import downArrowImage from "/public/assets/icon-caret-down.svg"
import mobileSortFilter from "/public/assets/icon-sort-mobile.svg"
import mobileCategoryFilter from "/public/assets/icon-filter-mobile.svg"

export async function loader() {
    const dataReceived = await getData()
    return dataReceived.transactions
}

/* Tanstack table */
const columnHelper = createColumnHelper()

const columns = [

    columnHelper.accessor("name", {
        cell: (info) => {
            const person = info.row.original;
            
            return (
                <div className="recipient-cell">
                    <img
                        src={person.avatar}
                        alt={person.name}
                        className="avatar"
                    />    
                    <span>{person.name}</span>
                </div>
            )},
        header: () => "Recipient/Sender",
    }),

      columnHelper.accessor("category", {
        cell: (info) => {
            return <span className="category">{info.getValue()}</span>
        },
        header: () => "Category",


    }),

      columnHelper.accessor("date", {
        cell: (info) => {
            return (
                <div className="date">
                    <span>{new Date(info.getValue()).toLocaleDateString('en-GB',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        )}</span>
                </div>)},
        header: () => "Transaction Date",
   
    }), 

        columnHelper.accessor("amount", {
        cell: (info) => {
            if(info.getValue() < 0) {
                return <span className="debit-amount amount">-${Math.abs(info.getValue()).toFixed(2)}</span>
            } else {
                return <span className="credit-amount amount">+${Math.abs(info.getValue()).toFixed(2)}</span>
            }
        }
        ,
        header: () => "Amount",

    }),
]

/* Tanstack table */

 function TransactionsPage() {
    const data = useLoaderData()
    const [dataState] = React.useState(() => [...data])
    const [sorting, setSorting] = React.useState([])
    const [search, setSearch] = React.useState("")
    const [sortBy, setSortBy] = React.useState("date:desc")
    const [sortValue, setSortValue] = React.useState("Latest")
    const [categoryValue, setCategoryValue] = React.useState("All Transactions")
    const [categoryBy, setCategoryBy] = React.useState("all transactions")
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [displaySortFilter, setDisplaySortFilter] = React.useState(false)
    const [displayCategoryFilter, setDisplayCategoryFilter] = React.useState(false)
    const desktopSortFilterRef = React.useRef(null)
    const mobileSortFilterRef = React.useRef(null)
    const desktopCategoryFilterRef = React.useRef(null)
    const mobileCategoryFilterRef = React.useRef(null)

    React.useEffect(() => {
        function handleClickOutside(event) {
           const desktopSort = desktopSortFilterRef.current?.contains(event.target)
           const mobileSort = mobileSortFilterRef.current?.contains(event.target)

           const desktopCategory = desktopCategoryFilterRef.current?.contains(event.target)
           const mobileCategory = mobileCategoryFilterRef.current?.contains(event.target)

           if(!desktopSort && !mobileSort) {
            setDisplaySortFilter(false)
           }
           if(!desktopCategory && !mobileCategory) {
            setDisplayCategoryFilter(false)
           }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    },[])


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

    function handleSortChange(option) {
        setSortBy(option.value)
        const [id, direction] = option.value.split(":")

        setSortValue(option.label)
        setSorting([
            {
                id,
                desc: direction === "desc"
            }
        ])

        setDisplaySortFilter(false)
    }

    function handleCategoryChange(category) {

        if(category === "All Transactions") {
            setCategoryBy("")
            setGlobalFilter("")
            setCategoryValue(category)
        } 
        else {
            setCategoryBy(category.toLowerCase())
            setGlobalFilter(category.toLowerCase())
            setCategoryValue(category)
        }

        setDisplayCategoryFilter(false)
    }
    
    const table = useReactTable({
        data: dataState,
        columns,
        state: {
            sorting,
            globalFilter
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),

        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

        let categories = []
            data.forEach(transaction => {
                if(!categories.includes(transaction.category)) {
                categories.push(transaction.category)
            }
        })

    return (
        <section className="transactions-page">
            <h1 className="page-head">Transactions</h1>

        <div className="transaction-page-header"> 
            <div className="transactions-page-search-section">
                <input 
                    className="search-input-field"
                    type="text" 
                    value={search} 
                    name="search"
                    placeholder="Search transaction" 
                    onChange={(e) => {
                        const value = e.target.value
                        setSearch(value)
                        setGlobalFilter(value)}
                    }
                />
                <img src={searchImage} alt="search icon" className="search-icon"/>
            </div>

            <div className="transaction-page-filter-section">
                    <div 
                        className="sort-filter"
                        ref={desktopSortFilterRef}
                    >
                        <div 
                            className="dropdown-button"
                        >
                            <p>Sort by</p>
                            <button 
                                type="button"
                                className="sort-filter-button"
                                onClick={() => {
                                    setDisplayCategoryFilter(false)
                                    setDisplaySortFilter(prev => !prev)}
                                }
                            >  
                            {sortValue}
                            <img 
                                src={downArrowImage} 
                                alt="open sort options" 
                                className={displaySortFilter ? "reverse-down-arrow" : "down-arrow"}
                            /> 
                            </button>
                        </div>

                        {displaySortFilter && (
                            <div 
                                className="sort-filter-dropdown-menu">
                                {sortingOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`sort-option ${sortBy === option.value ? "selected" : ""}`}
                                        onClick={() => handleSortChange(option)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div> 


                    <div className="mobile-sort-filter" ref={mobileSortFilterRef}>
                        <button 
                            type="button"
                            className="mobile-sort-filter-button"
                            onClick={() => {
                                setDisplaySortFilter(prev => !prev)
                                setDisplayCategoryFilter(false)
                            }}
                        >
                            <img 
                                src={mobileSortFilter}
                                alt="open sort options"
                            />    
                        </button>   

                        {displaySortFilter && (
                            <div className="dropdown-menu">
                                 <button disabled={true} className="disabled-option">Sort by</button>
                                {sortingOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`sort-option ${sortBy === option.value ? "selected" : ""}`}
                                        onClick={() => handleSortChange(option)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                  
                <div className="category-filter" ref={desktopCategoryFilterRef}>
                    <div className="dropdown-button">
                        <p>Category</p>
                            <button 
                                type="button"
                                className="category-filter-button"
                                onClick={() => {
                                    setDisplayCategoryFilter(prev => !prev)
                                    setDisplaySortFilter(false)
                                }}
                            >  
                            {categoryValue}
                            <img 
                                src={downArrowImage} 
                                alt="open category options" 
                                className={displayCategoryFilter ? "reverse-down-arrow" : "down-arrow"}
                            /> 
                            </button>
                    </div>

                        {displayCategoryFilter && (
                            <div className="category-filter-dropdown-menu">
                                    <button 
                                        key="all transactions"
                                        type="button"
                                        className={`sort-option ${categoryBy === "all transactions" ? "selected" : ""}`}
                                        onClick={() => handleCategoryChange("All Transactions")}
                                    >All Transactions 
                                    </button>    
                                {categories.map(category => (
                                    <button
                                        key={category.toLowerCase()}
                                        type="button"
                                        className={`sort-option ${categoryBy === category.toLowerCase() ? "selected" : ""}`}
                                        onClick={() => handleCategoryChange(category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        )}
                </div>

                    <div className="mobile-category-filter" ref={mobileCategoryFilterRef}>
                            <button 
                                type="button"
                                className="mobile-category-filter-button"
                                onClick={() => {
                                    setDisplayCategoryFilter(prev => !prev)
                                    setDisplaySortFilter(false)
                                }}
                            >  
                            <img 
                                src={mobileCategoryFilter} 
                                alt="open category options"
                            /> 
                            </button>

                        {displayCategoryFilter && (
                            <div className="dropdown-menu">
                                <button disabled={true} className="disabled-option">Category by</button>
                                    <button 
                                        key="all transactions"
                                        type="button"
                                        className={`sort-option ${categoryBy === "all transactions" ? "selected" : ""}`}
                                        onClick={() => handleCategoryChange("")}
                                    >All Transactions 
                                    </button>  
                                {categories.map(category => (
                                    <button
                                        key={category.toLowerCase()}
                                        type="button"
                                        className={`sort-option ${categoryBy === category.toLowerCase() ? "selected" : ""}`}
                                        onClick={() => handleCategoryChange(category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>


                </div>
            </div>

            <table className="transactions-table">
               <thead className="table-head">
                    {table.getHeaderGroups().map((headerGroup) => 
                        <tr>
                            {headerGroup.headers.map((header) => (
                                <th className={`table-header table-${header.id}`} key={header.id}>
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
                                    <td className={cell.id.slice(2)}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    }
                </tbody> 
            </table>
            
            <div>
                 <div className="page-navigation">
                    <button 
                            className="navigate-btn"
                            onClick={() => table.previousPage()}
                            disabled = {!table.getCanPreviousPage()}> <img src={leftArrowImage} alt="click to move to previous page"
                            className="navigate-btn-arrow-right" /><span className="navigate-btn-text">Prev</span>
                    </button>  
               
                    <div className="navigate-btn-pages">
                        <button 
                            className="page-button"
                            style={table.getState().pagination.pageIndex === 0 ? {backgroundColor: "#201F24", color: "#FFFFFF"} : null}
                            onClick={() => {
                                const page = 0
                                table.setPageIndex(page)
                            }}>
                            1
                        </button>
                         <button 
                            className="page-button"
                            style={table.getState().pagination.pageIndex === 1 ? {backgroundColor: "#201F24", color: "#FFFFFF"} : null}
                            onClick={() => {
                                const page = 1
                                table.setPageIndex(page)
                            }}>
                            2
                        </button>
                         <button 
                            className="page-button"
                            style={table.getState().pagination.pageIndex === 2 ? {backgroundColor: "#201F24", color: "#FFFFFF"} : null}
                            onClick={() => {
                                const page = 2
                                table.setPageIndex(page)
                            }}>
                            3
                        </button>
                        <button 
                            className="page-button"
                            style={table.getState().pagination.pageIndex === 3 ? {backgroundColor: "#201F24", color: "#FFFFFF"} : null}
                            onClick={() => {
                                const page = 3
                                table.setPageIndex(page)
                            }}>
                            4
                        </button>
                        <button 
                            className="page-button"
                            style={table.getState().pagination.pageIndex === 4 ? {backgroundColor: "#201F24", color: "#FFFFFF"} : null}
                            onClick={() => {
                                const page = 4
                                table.setPageIndex(page)
                            }}>
                            5
                        </button>

                    </div>

                    <button
                            className="navigate-btn"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}><span className="navigate-btn-text">Next</span><img src={rightArrowImage} alt="click to move to next page"
                            className="navigate-btn-arrow-left" /> 
                    </button>          
                 </div>
            </div>
        </section>
    )
     
 }


export default TransactionsPage