import React, { useState, useEffect } from 'react';
import ShippingAddressPopup from './popupfoldier/ShippingAddressPopup.js';

export default function ShippingAddressFile({shippingaddressorder,setShippingAddressorder, selectedOrgId, onSelectAddress, onCustomerData, transformedAddress,copiedShippingAddress}) {
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    line1: '',
    line2: '',
    pincode: '',
    city: '',
    state: '',
  });
  const [errors, setErrors] = useState({});

  const handleDeleteAddress = (index) => {
    setShippingAddresses(prevAddresses => prevAddresses.filter((_, i) => i !== index));
    if (selectedAddressIndex === index) {
      setSelectedAddressIndex(null);
      onSelectAddress(null);
    }
  };
  useEffect(() => {
    if (selectedOrgId) {
      console.log("Selected Org ID in ShippingAddressFile:", selectedOrgId);
      // Instead of fetching, we could initialize with some dummy data if needed
      setShippingAddresses([]);
      setSelectedAddressIndex(null);
    }
  }, [selectedOrgId]);
  useEffect(() => {
    if (copiedShippingAddress) {
      setShippingAddress(copiedShippingAddress);
      // Optionally, you can add this new address to the shippingAddresses array
      const newAddress = {
        id: Date.now(),
        ...copiedShippingAddress
      };
      setShippingAddresses(prevAddresses => [...prevAddresses, newAddress]);
      
      // Optionally, select the new address
      setSelectedAddressIndex(shippingAddresses.length);
      onSelectAddress(newAddress);
    }
  }, [copiedShippingAddress]);

  const handleCheckboxChange = (index) => {
    if (selectedAddressIndex === index) {
      setSelectedAddressIndex(null);
      onSelectAddress(null);
    } else {
      setSelectedAddressIndex(index);
      onSelectAddress(shippingAddresses[index]);
    }
  };
  useEffect(()=>{
    setShippingAddressorder(shippingAddresses)
  })
  

  const handleAddShippingAddress = () => {
    setShippingAddress('');
    setIsPopupOpen(true);
  };

  useEffect(() => {
    if (transformedAddress) {
      setShippingAddress(transformedAddress);
      // Optionally, you can add this new address to the shippingAddresses array
      setShippingAddresses(prevAddresses => [...prevAddresses, { ...transformedAddress, id: Date.now() }]);
    }
  }, [transformedAddress]);
  console.log(shippingAddresses,"Shipping Address")
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setShippingAddress({
      line1: '',
      line2: '',
      pincode: '',
      city: '',
      state: '',
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      line1: !shippingAddress.line1?.trim(),
      line2: !shippingAddress.line2?.trim(),
      pincode: !shippingAddress.pincode?.trim(),
      city: !shippingAddress.city?.trim(),
      state: !shippingAddress.state?.trim(),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    const newAddress = {
      id: Date.now(), // Generate a unique ID
      line1: shippingAddress.line1.trim(),
      line2: shippingAddress.line2.trim(),
      pincode: shippingAddress.pincode.trim(),
      city: shippingAddress.city.trim(),
      state: shippingAddress.state.trim(),
    };

    setShippingAddresses(prevAddresses => [...prevAddresses, newAddress]);
    handleClosePopup();
  };

  const STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
    "Ladakh",
    "Jammu and Kashmir"
  ];

  // const handleCopyToShipping = (billingData) => {
  //   // Update your shipping address state or component with the billing data
  //   setShippingAddress(billingData);
  // };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Shipping Addresses</h3>
      <div className="flex flex-wrap">
        {shippingAddresses.length > 0 ? (
          shippingAddresses.map((address, index) => (
            <div
              key={address.id}
              className="mr-4 w-64 h-48 rounded overflow-hidden shadow-lg border-2 border-primary mb-6 flex flex-col"
            >
              <div className="px-6 py-4 flex-grow flex flex-col">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedAddressIndex === index}
                    onChange={() => handleCheckboxChange(index)}
                    className="mr-2"
                  />
                  <div className="font-bold text-xl mb-2">Shipping Address</div>
                </div>
                <p
                  className="text-gray-700 text-base overflow-hidden flex-grow"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {address.line1}, {address.line2}, {address.city}, {address.state} - {address.pincode}
                </p>
              </div>
              <div className=''>
              <button className='ml-4 p-3 text-red-600' onClick={() => handleDeleteAddress(index)} >Delete</button>
            </div>
          </div>
          ))
        ) : (
          <p className="text-gray-500 italic mb-4">No shipping addresses added yet.</p>
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={handleAddShippingAddress}
          className="bg-white text-primary border border-primary py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-primary hover:text-white transition-colors duration-300"
        >
          + Add Shipping Address
        </button>
        <ShippingAddressPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          editMode={false}
          shippingAddress={shippingAddress}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errors={errors}
          STATES={STATES}
        />
      </div>
    </div>
  );
}