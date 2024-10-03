import React, { useState, useEffect } from 'react';
import ShippingAddressPopup from './popupfoldier/ShippingAddressPopup.js';

export default function ShippingAddressFile({ shippingaddressorder, setShippingAddressorder, selectedOrgId, onSelectAddress, onCustomerData, transformedAddress, copiedShippingAddress }) {
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
  const [siteSurveyRequest, setSiteSurveyRequest] = useState('online');
  const [siteSurveyDate, setSiteSurveyDate] = useState('');
  const [installationDate, setInstallationDate] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [Source,setSource]=useState('');

    const handleSourceChange=(event)=>{
      setSource(event.target.value);
    }

    const handleBusinessTypeChange = (event) => {
        setBusinessType(event.target.value);
    };



  const handleSiteSurveyDateChange = (event) => {
      setSiteSurveyDate(event.target.value);
  };

  const handleInstallationDateChange = (event) => {
      setInstallationDate(event.target.value);
  };


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
  useEffect(() => {
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
  console.log(shippingAddresses, "Shipping Address")
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
  const handleChange = () => { }

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
  const handleSiteSurveyChange = (e) => {
    const { value } = e.target;
    setSiteSurveyRequest(value); // Update the state based on user selection
  };


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
        <div>
  <label className="block font-semibold mb-2 mt-6">Type of Site Survey:</label>
  <div className="flex flex-col mb-4">
    <div className="flex items-center mb-2">
      <input
        type="radio"
        id="online"
        name="siteSurveyRequest"
        value="online"
        className="hidden" // Hide the original radio button
        checked={siteSurveyRequest === 'online'}
        onChange={handleSiteSurveyChange}
      />
      <label
        htmlFor="online"
        className={`flex items-center cursor-pointer relative mr-2 gap-2`}
      >
        <span className={`h-5 w-5 border-2 border-gray-300 rounded-full flex items-center justify-center ${siteSurveyRequest === 'online' ? 'bg-primary' : 'bg-white'}`}>
          {siteSurveyRequest === 'online' && <span className="h-3 w-3 rounded-full bg-white"></span>} {/* Inner circle for checked state */}
        </span>
        Online
      </label>
    </div>
    
    <div className="flex flex-col items-start mb-2"> {/* Set flex-col for vertical layout */}
  <input
    type="radio"
    id="offline"
    name="siteSurveyRequest"
    value="offline"
    className="hidden mr-3" // Hide the original radio button
    checked={siteSurveyRequest === 'offline'}
    onChange={handleSiteSurveyChange}
  />
  <label
    htmlFor="offline"
    className={`flex items-center cursor-pointer relative mr-2 gap-2`}
  >
    <span className={`h-5 w-5 border-2 border-gray-300 rounded-full flex items-center justify-center ${siteSurveyRequest === 'offline' ? 'bg-primary' : 'bg-white'}`}>
      {siteSurveyRequest === 'offline' && <span className="h-3 w-3 rounded-full bg-white"></span>} {/* Inner circle for checked state */}
    </span>
    Offline
  </label>

  {/* Site Survey Date Field */}
  <div className="mb-4 mt-6">
    <label htmlFor="siteSurveyDate" className="block font-semibold mb-2">Site Survey Date</label>
    <input
      type="date"
      id="siteSurveyDate"
      className="w-full border-2 border-gray-300 rounded py-2 px-4"
      value={siteSurveyDate} // Replace with your state variable
      onChange={handleSiteSurveyDateChange} // Define this function
    />
  </div>

  {/* Installation Date Field */}
  <div className="mb-4">
    <label htmlFor="installationDate" className="block font-semibold mb-2">Installation Date</label>
    <input
      type="date"
      id="installationDate"
      className="w-full border-2 border-gray-300 rounded py-2 px-4"
      value={installationDate} // Replace with your state variable
      onChange={handleInstallationDateChange} // Define this function
    />
  </div>
  <div className="mb-4">
            <label htmlFor="businessType" className="block font-semibold mb-2">Type of Business</label>
            <select
                id="businessType"
                value={businessType}
                onChange={handleBusinessTypeChange}
                className="w-full border-2 border-gray-300 rounded py-2 px-4"
            >
                <option value="" disabled>Select a type</option>
                <option value="office_space">Office Space</option>
                <option value="pg_co_living_hostel">PG/Co-living/Hostel</option>
                <option value="clinic">Clinic</option>
                <option value="gym">Gym</option>
                <option value="Factory">Factory</option>
                <option value="Pharmacies">Pharamacies</option>
                <option value="cafe/Restro Bar">Cafe/Restro Bar</option>
                <option value="spa">Spa</option>
                <option value="coaching_center">Coaching_Center</option>
                <option value="school">School</option>
                <option value="salon">Saloon</option>
                <option value="retail_supermarket">Retail Supermarket</option>
                <option value="Independent_Shop">Independent Shop</option>
                <option value="hotel">Hotel</option>
                <option value="landury">Landury</option>
                <option value="College">College</option>
            </select>
        </div>
        <div className="mb-4">
            <label htmlFor="Source" className="block font-semibold mb-2">Source of Lead</label>
            <select
                id="Source"
                value={Source}
                onChange={handleSourceChange}
                className="w-full border-2 border-gray-300 rounded py-2 px-4"
            >
                <option value="" disabled>Select a type</option>
                <option value="office_space">Cold Visit</option>
                <option value="Employee Referral">Employee Referral</option>
                <option value="Customer Referral">Customer Referral</option>
            </select>
        </div>
</div>

  </div>
        </div>
      </div>
    </div>
  );
}