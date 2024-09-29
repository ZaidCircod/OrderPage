import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ACdetails from './ACdetails';
import OrgDetails from './OrgDetails';
import ShippingAddressFile from './ShippingAddressFile';
import { useNavigate } from 'react-router-dom';
import loadingGif from '../../assets/white gif.gif'; 
export default function OrderForm() {
  const navigate=useNavigate()
  const [customer, setCustomer] = useState([]);
  const [CustomerData,setCustomerData] = useState();
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [selectedOrgData, setSelectedOrgData] = useState(null);
  const [transformedAddress, setTransformedAddress] = useState(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [acDetails, setACDetails] = useState({
    acType: "Split",
    ton: "10",  // Updated to user-friendly labels
    plan: "3+2year",
    quantity: 1,
    subscription_plan: 1299,
    depositamount: 5000,
    installetionCharge: 1500.00,
    extraCharge: 349,
    itemId: "mc_3y_1.0",
    totalSubscription: 1299,
    totalDeposit: 5000,
    totalInstallation: 1500.00,
    priceAfter3Years: 799,
    totalAfter3Years: 799,
  });
  const [savedItems, setSavedItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    line1: '',
    line2: '',
    pincode: '',
    city: '',
    state: '',
  });
  const [copiedShippingAddress, setCopiedShippingAddress] = useState(null);

  const handleCopyToShipping = (billingData) => {
    console.log("Received billing data in OrderForm:", billingData);
    setCopiedShippingAddress(billingData);
  };
  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/customers/getall`);
      const fetchedData = Array.isArray(response.data) ? response.data : [response.data];
      setCustomer(fetchedData);
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };
  const handleTransformedAddress = (address) => {
    setTransformedAddress(address);
  };

  const handleACDetailsChange = (newDetails) => {
    setACDetails((prevDetails) => ({ ...prevDetails, ...newDetails }));
  };

  const handleCustomerData = (data) => {
    setCustomerData(data);
  };

  const handleOrgSelect = (orgId, orgData) => {
    setSelectedOrgId(orgId);
    setSelectedOrgData(orgData);
  };

  const handleShippingAddressSelect = (address) => {
    setSelectedShippingAddress(address);
  };

  const handleClearSearch = () => {
    setSelectedOrgId(null);
    setSelectedOrgData(null);
    setSelectedShippingAddress(null);
  };

  return (
    <div className='space-y-6 p-6 bg-secondary min-h-screen justify-start block'>
      <h1 className="text-2xl font-bold">Order Details</h1>
      <ACdetails onACDetailsChange={handleACDetailsChange} acDetails={acDetails} setACDetails={setACDetails} savedItems={savedItems} setSavedItems={setSavedItems}/>
      <OrgDetails
        customer={customer}
        onOrgSelect={handleOrgSelect}
        onClearSearch={handleClearSearch}
        onCopyToShipping={handleCopyToShipping}
        onTransformedAddress={handleTransformedAddress}
      />
      <ShippingAddressFile 
        selectedOrgId={selectedOrgId} 
        onSelectAddress={handleShippingAddressSelect}
        onCustomerData={handleCustomerData}
        shippingAddress={shippingAddress}
        setShippingAddress={setShippingAddress}
        onTransformedAddress={handleTransformedAddress}
        copiedShippingAddress={copiedShippingAddress}
      />
      <div className="space-x-4">
      <button 
        // onClick={handleSubmit} 
        // disabled={isLoading}
        className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400"
      >
        Take Full Payment
      </button>
{/*       
      {isLoading && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-70 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="text-center">
            <img src={loadingGif} alt="Loading" className="h-20 w-20 mx-auto mb-4" />
            <p className="text-xl font-semibold text-primary">Loading...</p>
          </div>
        </div>
      )} */}
        <button className='bg-white text-primary py-2 px-4 border border-primary'>
        {/*  */}
          Take Token
        </button>
      </div>
    </div>
  );
}