import React from 'react'
import closeButtonImage from "/public/assets/icon-close-modal.svg"

export default function DeletePotModal({ potToDelete, submitDeletePot, onClose}) {
    const modalRef = React.useRef(null)

    React.useEffect(() => {
        function handleClickOutside(event) {
            if(modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    },[onClose])

    function deletePot({name, target, total, theme}) {
        submitDeletePot(name, target, total, theme)
    }

   
    return (
        <div ref={modalRef} className="delete-budget-modal">
            <div className="add-new-budget-modal-header">
                <h2>Delete '{potToDelete.name}'?</h2>
                <button 
                    className="close-button"
                    onClick={onClose}
                >
                <img src={closeButtonImage} alt="click to close add budget" />
                </button>
            </div>

            <p className="delete-budget-modal-paragraph">Are you sure you want to delete this pot? This action cannot be reversed, and 
                all the data inside it will be removed forever.
            </p>
            <button 
                className="red-delete-button"
                onClick={() => deletePot(potToDelete)}
            >
                Yes, Confirm Deletion
            </button>
            <button 
                onClick={onClose}
                className="grey-go-back-button"
            >
                No, Go Back
            </button>
        </div>
    )
}