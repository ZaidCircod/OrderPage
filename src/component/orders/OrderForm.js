import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ACdetails from './ACdetails';
import OrgDetails from './OrgDetails';
import ShippingAddressFile from './ShippingAddressFile';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
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
  const [gstin, setgstin] = useState({
    name: '',
    number: '',
    billingName: '',
    billingAddress: '',
    phoneNumber: '' // Added phone number field
});

const custoemeriddefine = async () => {
  const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjI2NzYzLCJuYW1lIjoiQVBJIFVzZXIiLCJjb21wYW55X2lkIjoxMTMwODc2LCJjb21wYW55X25hbWUiOiJDaXJjbyBMaWZlIEFQSSBUZXN0IiwiaWF0IjoxNzIzNTc0MzQwLCJ2ZXJzaW9uIjoyLCJwYXJ0bmVyIjp0cnVlfQ.kX1wTriKBzuINViIp7sVVx2daeAVMvFS0v4kGI0ShgQ`; // Bearer token from environment variable
  const apiUrl = 'https://app.getswipe.in/api/partner/v1/customer/list'; // API endpoint

  try {
    // Make the API request with Axios
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `${token}`
      }
    });

    // Extract data from the response
    const data1 = response.data.total_records;
    console.log('Data1:', data1); // Log the data for verification

    // Return the data
    return data1;

  } catch (error) {
    // Handle errors and return a default value or null if needed
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    // Return null or some default value in case of an error
    return null;
  }
};
const cleanName = (name) => {
  if (!name) return ''; // Return empty string if name is falsy
  // Remove special characters, keeping only alphanumeric and space
  return name.replace(/[^a-zA-Z0-9]/g, '').trim();
};
const generateCustomerId = async () => {
  const data1 = await custoemeriddefine(); // Retrieve the data from API

  // Use '27' as the GST value
  const gstCode = '27';
  const currentDate = moment().format('DDMMYY');
  const name = cleanName(gstin.name); // Replace with actual name or get it dynamically

  // Replace with '00' and the value of data1
  const nextCustomerNumber = data1 ? data1.toString().padStart(4, '0') : '0000'; // Ensure data1 is at least 4 digits
  const newCustomerId = `CL${name.substring(0, 3).toUpperCase()}${currentDate}${gstCode}${nextCustomerNumber}`;

  return newCustomerId;
};
  const handleCopyToShipping = (billingData) => {
    console.log("Received billing data in OrderForm:", billingData);
    setCopiedShippingAddress(billingData);
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
  const logDetails = async () => {
    const customerId = await generateCustomerId(gstin.name);
    console.log(customerId,"lllcustomer")
    console.log("Selected Organization Data:", gstin);
    console.log("Shipping Address:", selectedShippingAddress);
    const data = {
      name: gstin.name,
      // cin: {
      //   number: cin,
      //   url: cinFileUrl,
      // },
      // pan: {
      //   number: pan,
      //   url: panFileUrl,
      // },
      customer_id:customerId,
      userid:null,
      superadminphone: gstin.phoneNumber,
      gstin: {
        number: gstin.number,
        billingName: gstin.billingName,
        billingAddress: gstin.billingAddress,
    },
      shipping_address: {
        line1:selectedShippingAddress.line1,
        line2:selectedShippingAddress.line2,
        city:selectedShippingAddress.city,
        state:selectedShippingAddress.state,
        pincode:selectedShippingAddress.pincode
      },
      // superadminname:superadmin.username,
      // email:superadmin.email,
      // superadminphone:superadmin.phone
    };
    console.log(data,"llllfasd");
    try {
      let response
      axios({
        url:"http://35.154.99.308:3000/api/customer",
        method:"POST",
        data:data
      }).then(res=>{
        console.log(res.data)
      })
    } catch (error) {
      console.log(error.message,"error in api")
    }
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
        gstin={gstin}
        setgstin={setgstin}
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
        onClick={logDetails} 
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
        <button className='bg-white text-primary py-2 px-4 border border-primary'>Request Site Visit</button>
      </div>
    </div>
  );
}