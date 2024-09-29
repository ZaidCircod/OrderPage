import React from 'react';
import Popup from 'reactjs-popup'; // Make sure to import this

function ShippingAddressPopup({ 
  isOpen, 
  onClose, 
  editMode, 
  shippingAddress, 
  handleInputChange, 
  handleFormSubmit, 
  errors,
  STATES // Assuming STATES is defined elsewhere
}) {
  return (
    
    <Popup
    open={isOpen}
    onClose={onClose}
    modal
    nested
    closeOnDocumentClick={false}
    overlayStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
    contentStyle={{
      border: "3px solid #A14996",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      maxWidth: "500px",
      width: "100%",
    }}
    overlayClassName="popup-overlay"
  >
      {(close) => (
        <>
          <h2 className="text-lg font-bold mb-4">
            {editMode ? "Edit Shipping Address" : "Add Shipping Address"}
          </h2>
          {/* <form onSubmit={handleFormSubmit}> */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                <span className="text-red-700">*</span>Address Line 1:
              </label>
              <input
                type="text"
                name="line1"
                value={shippingAddress.line1}
                onChange={handleInputChange}
                placeholder="Enter address line 1"
                className={`border p-2 w-full rounded ${
                  errors.line1
                    ? "border-red-500"
                    : "hover:border-primary focus:border-primary outline-primary"
                }`}
              />
              {errors.line1 && (
                <p className="text-red-500 text-xs mt-1">
                  Address Line 1 is required
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                <span className="text-red-700">*</span>Address Line 2:
              </label>
              <input
                type="text"
                name="line2"
                value={shippingAddress.line2}
                onChange={handleInputChange}
                placeholder="Enter address line 2"
                className="border p-2 w-full rounded hover:border-primary focus:border-primary outline-primary"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                <span className="text-red-700">*</span>Pin:
              </label>
              <input
                type="text"
                name="pincode"
                value={shippingAddress.pincode}
                onChange={handleInputChange}
                placeholder="Enter pin"
                className={`border p-2 w-full rounded ${
                  errors.pin
                    ? "border-red-500"
                    : "hover:border-primary focus:border-primary outline-primary"
                }`}
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">
                  Pin is required
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                <span className="text-red-700">*</span>City:
              </label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                className={`border p-2 w-full rounded ${
                  errors.city
                    ? "border-red-500"
                    : "hover:border-primary focus:border-primary outline-primary"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">
                  City is required
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="state"
                className="block text-gray-700 font-semibold mb-2"
              >
                State
              </label>
              <select
                id="state"
                name="state"
                value={shippingAddress.state}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select State</option>
                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">
                  State is required
                </p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="mr-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {editMode ? "Update Address" : "Add Address"}
              </button>
            </div>
          {/* </form> */}
        </>
      )}
    </Popup>
  );
}

export default ShippingAddressPopup;