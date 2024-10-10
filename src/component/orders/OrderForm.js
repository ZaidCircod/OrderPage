import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import ACdetails from './ACdetails';
import OrgDetails from './OrgDetails';
import ShippingAddressFile from './ShippingAddressFile';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
import SitesSurvery from './SitesSurvery';
export default function OrderForm() {
  const navigate=useNavigate()
  const [customer, setCustomer] = useState([]);
  const [CustomerData,setCustomerData] = useState();
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [selectedOrgData, setSelectedOrgData] = useState(null);
  const [transformedAddress, setTransformedAddress] = useState(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [shippingaddressorder,setShippingAddressorder]=useState()
  const [CustomerIds, setCustomerIds] = useState(null);
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
    totalAmount: 8898
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
const [billingAddress, setBillingAddress] = useState({
  line1: '',
  line2: '',
  pincode: '',
  city: '',
  state: '',
});

const [overallTotalAmount, setOverallTotalAmount] = useState(0);
const [showPaymentPopup, setShowPaymentPopup] = useState(false);
const [isFullPaymentModal,setisFullPaymentModal]=useState(false)
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState('generate');
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFullPaymentModal = () => setisFullPaymentModal(true);
  const handleFullPaymentModalClose = () =>{ 
    setisFullPaymentModal(false)
    setSelectedFile(null)
  };
  const [isChecked, SetisChecked] = useState(false);
  const [orderData, setOrderData] = useState({
    // ... other order fields
    siteSurvey: {}
});



  const fileInputRef = useRef(null);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('YOUR_UPLOAD_API_ENDPOINT', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded successfully');
        handleFullPaymentModalClose();
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const handleSubmit = () => {
    if (selectedOption === 'upload') {
      handleUpload();
    } else {
      RazorpayFulllPayment()
    }
  };

    const handleProceedToPayment=async()=>{
      const data = {
        description: "Circolife AC ",
        amount: paymentAmount,
        name: gstin.name,
        contact: gstin.phoneNumber
      };
    
      try {
        const response = await axios.post(`${process.env.REACT_APP_RAZORPAY}/create-payment-link`, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        handleFullPaymentModalClose()
        alert('Payment Link Send Sucessfully:', response.data);
        return response.data; 
        
      } catch (error) {
        console.error('Error creating payment link:', error);
        throw error;
      }
    }
    const handlePaymentAmountChange = (e) => {
      const amount = parseFloat(e.target.value);
      if (isNaN(amount)) {
          setPaymentAmount('');
      } else if (amount > overallTotalAmount) {
          alert(`The payment amount cannot exceed the overall amount of ${overallTotalAmount}`);
          setPaymentAmount('');
      } else {
          setPaymentAmount(amount);
      }
  };
const custoemeriddefine = async () => {
  const token = `${process.env.REACT_APP_SWIPE_TOKEN}`
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
  const handleCustomerIdGeneration = async () => {
    try {
      const generatedCustomerId = await generateCustomerId(gstin.name);
      console.log("Fetched CustomerID:", generatedCustomerId);
      setCustomerIds(generatedCustomerId);
    } catch (error) {
      console.log(error.message, "Error generating customerId");
    }
  };

  useEffect(() => {
    handleCustomerIdGeneration();
  }, [gstin.name]); // Run when gstin.name changes

  useEffect(() => {
    if (CustomerIds) {
      console.log("CustomerID updated:", CustomerIds);
    }
  }, [CustomerIds]);
  const backendcustomercreation = async () => {
    console.log("Selected Organization Data:", gstin);
    console.log("Shipping Address:", selectedShippingAddress);

    const data = {
        name: gstin.name,
        customer_id: CustomerIds,
        userid: null,
        superadminphone: gstin.phoneNumber,
        superadminname: gstin.name,
        gstin: {
            number: gstin.number,
            billingName: gstin.billingName,
            billingAddress: gstin.billingAddress,
        },
        shipping_address: shippingaddressorder,
    };

    console.log(data, "Formatted Data");

    try {
        // First API call to save customer data
        const response = await axios({
            // url: `${process.env.REACT_APP_BASE_URL}/api/customer/save`,
            url:"http://localhost:8080/api/sales/web",
            method: "POST",
            data: data,
        });
        console.log("Response from first API:", response.data);
        
        // Proceed to the second API call if the first one is successful
        try {
            const formattedData = formatDataForSecondAPI(data);
            console.log("Formatted Data for second API:", formattedData);

            const secondApiResponse = await axios.post(
                `https://app.getswipe.in/api/partner/v1/customer`,
                formattedData,
                {
                    headers: {
                        'Authorization': `${process.env.REACT_APP_SWIPE_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Response from Swipe API:", secondApiResponse.data);
        } catch (secondApiError) {
            console.error("Error in Swipe API call:", secondApiError.message);
        }
    } catch (firstApiError) {
        console.error("Error in first API call:", firstApiError.message);
    }
};

  const RazorpayFulllPayment=async()=>{
      const data = {
        description: "Circolife AC ",
        amount: overallTotalAmount,
        name: gstin.name,
        contact: gstin.phoneNumber
      };
    
      try {
        const response = await axios.post(`${process.env.REACT_APP_RAZORPAY}/create-payment-link`, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        alert('Payment Link Send Sucessfully:', response.data);
        handleFullPaymentModalClose()
        return response.data;  // Return the response if needed
      } catch (error) {
        console.error('Error creating payment link:', error);
        throw error;
      }
    };
    const RazorpayTokenPayment=async()=>{
      const data = {
        description: "Circolife AC ",
        amount: Price,
        name: gstin.name,
        contact: gstin.phoneNumber
      };
    
      try {
        const response = await axios.post(`${process.env.REACT_APP_RAZORPAY}/create-payment-link`, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        alert('Payment Link Send Sucessfully:', response.data);
        return response.data;  // Return the response if needed
      } catch (error) {
        console.error('Error creating payment link:', error);
        throw error;
      }
    };
  const TakeFullPaymemt=async()=>{
    RazorpayFulllPayment()
    backendcustomercreation()
    // const invoiceResponse = await createInvoice();
    // console.log("Invoice created successfully:", invoiceResponse.data);
    // const subscriptionResponse = await createSubscription(invoiceResponse.data);
    // console.log("Subscription created successfully:", subscriptionResponse);
  
  }

  const calculateTotalQuantityForToken = (items) => {
    return items.reduce((total, item) => {
      // Ensure the quantity is a number and add it to the total
      const quantity = Number(item.quantity) || 0;
      return total + quantity;
    }, 0);
  };
  const quanityfortoken = calculateTotalQuantityForToken(savedItems);
  const Price=quanityfortoken*1000
  console.log(Price,"Price for the quantity")

  const formatDataForSecondAPI = (data) => {
    return {
      customer_id: CustomerIds, // Make sure this is correctly passed from the data
      name: data.name,
      gstin: data.gstin.number || "", // Correctly access the GSTIN number if available
      company_name: data.gstin.billingName || "", // Ensure company_name is accessed correctly
      phone: data.superadminphone,
      billing_address: [{
        line1: data.gstin.billingAddress.line1 || "", // Access billing address directly
        line2: data.gstin.billingAddress.line2 || "", // Provide default value if necessary
        pincode: data.gstin.billingAddress.pincode?.toString() || "", // Ensure pincode is a string
        city: data.gstin.billingAddress.city || "",
        state1: "", // Or use a default value if necessary
        state: data.gstin.billingAddress.state || ""
      }],
      shipping_address: Array.isArray(data.shipping_address) ? data.shipping_address.map(address => ({
        line1: address.line1 || "",
        line2: address.line2 || "",
        pincode: address.pincode || "",
        city: address.city || "",
        state1: "", // Or use a default value if necessary
        state: address.state
        ? address.state.toUpperCase() // Apply the same logic for the shipping address state
        : ""
    })) : [] // Provide a default empty array if shipping_address is not an array
  };
}
const createOrderData = (acDetails) => {
  const acTypeSuffix = acDetails.acType === 'Split' ? 'S' : acDetails.acType === 'Cassette' ? 'C' : '';
  return {
    company_name: gstin?.billingName,
    billing_address: gstin?.billingAddress,
    gst: gstin?.number,
    address: `${selectedShippingAddress?.line1},${selectedShippingAddress?.line2}`,
    pincode: selectedShippingAddress?.pincode,
    state: selectedShippingAddress?.state,
    city: selectedShippingAddress?.city,
    customer_id: CustomerIds,
    orderingDate: new Date().toISOString(),
    appointmentDate: new Date().toISOString(),
    Fullname: CustomerData?.user?.Fullname,
    ac_type: acDetails.acType, 
    model: `${acTypeSuffix}${acDetails.ton}`,
    plan_year: acDetails.plan === '3+2year' ? 3.2 :
         acDetails.plan === '5years' ? 5 :
         acDetails.plan === '3year' ? 3 :
         acDetails.plan,
    monthlyPayment_amount: parseInt(acDetails.subscription_plan),
    quantity: parseInt(acDetails.quantity) || 1,
    addressid: selectedShippingAddress._id,
    payment_amount: parseInt(acDetails.totalAmount),
    priceAtRenewal:parseInt(acDetails.totalAfter3Years)
  };
};

const sendOrderToBackend = async (orderData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/orders/web`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    console.log("Order sent to backend successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending order to backend:", error);
    throw error;
  }
};
const processAllOrders = async (savedItems) => {
  const results = [];
  for (const item of savedItems) {
    try {
      const orderData = createOrderData(item);
      const result = await sendOrderToBackend(orderData);
      results.push(result);
    } catch (error) {
      console.error(`Error processing order for item:`, item, error);
      results.push({ error: error.message, item });
    }
  }
  return results;
};
  
//Invoice creation
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
const mapProduct = (acModel, item) => {
  const models = {
    '10': {
      id: 'mlmc_3y_1t',
      name: 'Monthly Leasing and Maintenance charges of Air Conditioner - 3Y 1T',
      unitPrice: 1014.84,
      priceWithTax: 1299,
    },
    '15': {
      id: 'mlmc_3y_1.5t',
      name: 'Monthly Leasing and Maintenance charges of Air Conditioner - 3Y 1.5T',
      unitPrice: 1092.97,
      priceWithTax: 1399,
    },
    '20': {
      id: 'mlmc_3y_2t', // Default for Split
      name: 'Monthly Leasing and Maintenance charges of Air Conditioner - 3Y 2T',
      unitPrice: 1327.34,
      priceWithTax: 1699,
    },
    '30': {
      id: 'mlcmc_2y_3t',
      name: 'Monthly Leasing and Maintenance charges of Air Conditioner - 2Y 30T',
    }
  };

  // Modify model for Cassette type
  if (item.acType === 'Cassette') {
    models['20'] = {
      id: 'mlcmc_2y_2t',
      name: 'Monthly Leasing and Maintenance charges of Air Conditioner - 2Y 20T',
      unitPrice: 1952.34,
      priceWithTax: 2499,
    };
  }

  // Get the appropriate model based on acModel
  const model = models[acModel];

  if (!model) {
    throw new Error('Invalid acModel provided.');
  }

  // Construct and return the final product object
  return {
    id: model.id,
    name: model.name,
    quantity: item.quantity,
    unit_price: item.subscription_plan / 1.28,
    tax_rate: 28,
    price_with_tax: item.totalSubscription,
    item_type: 'Service',
    net_amount: item.totalSubscription / 1.28,
    total_amount: item.totalSubscription,
    // extra_discount: item.extra_discount // Default to 0 if undefined
  };
};
const createPIInvoice = async () => {
  // if (!selectedOrgData) {
  //   throw new Error('Please select an organization.');
  // }

  const currentDate = formatDate(new Date());
  const futureDate = formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 3)));

  // Map over savedItems to create the product lines in the invoice
  const invoiceItems = savedItems.map((item) => {
    return mapProduct(item.ton, item);
  });

  // Calculate total quantity of all products
  const splitItems = savedItems.filter(item => item.acType === "Split");
const cassetteItems = savedItems.filter(item => item.acType === "Cassette");

// Calculate total quantity of Split and Cassette items separately
const totalSplitQuantity = splitItems.reduce((sum, item) => sum + item.quantity, 0);
const totalCassetteQuantity = cassetteItems.reduce((sum, item) => sum + item.quantity, 0);

// Add a Split installation item if Split items are present
if (totalSplitQuantity > 0) {
  const splitInstallationItem = {
    id: 'install_split_1500',
    name: 'Installation (Split AC)',
    quantity: totalSplitQuantity,
    unit_price: 1406.25,
    tax_rate: 28,
    price_with_tax: 1800,
    item_type: 'Service',
    net_amount: 1406.25 * totalSplitQuantity,
    total_amount: 1800 * totalSplitQuantity,
  };
  invoiceItems.push(splitInstallationItem);
}

// Add a Cassette installation item if Cassette items are present
if (totalCassetteQuantity > 0) {
  const cassetteInstallationItem = {
    id: 'install_cassette_1500',
    name: 'Installation (Cassette AC)',
    quantity: totalCassetteQuantity,
    unit_price: 2734.37,
    tax_rate: 28,
    price_with_tax: 3500,
    item_type: 'Service',
    net_amount: 2734.37 * totalCassetteQuantity,
    total_amount: 3500 * totalCassetteQuantity,
  };
  invoiceItems.push(cassetteInstallationItem);
}
  

  const invoice = {
    document_type: 'pro_forma_invoice',
    document_date: currentDate,
    customer: {
      id: CustomerIds,
      name: gstin.name,
    },
    items: invoiceItems,
    customer_shipping_address: {
      address_line1: selectedShippingAddress?.line1,
      address_line2: selectedShippingAddress?.line2,
      pincode: selectedShippingAddress?.pincode,
      city: selectedShippingAddress?.city,
      country: 'India',
      state: selectedShippingAddress?.state?.toUpperCase(),
    },
    notes: `Start Date : ${currentDate} End Date: ${futureDate}`,
    round_off: true,
  };

  console.log('DATA SENT FOR INVOICE >>', JSON.stringify(invoice));
  console.log(acDetails, "Acdetails");

  try {
    const response = await axios.post(
      'https://app.getswipe.in/api/partner/v1/doc',
      invoice,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${process.env.REACT_APP_SWIPE_TOKEN}`,
        },
      }
    );

    const hashId = response.data.hashId;

    const totalAmount = invoice.items.reduce((sum, item) => sum + item.total_amount, 0);
    const pdfResponse = await axios.get(
      `https://app.getswipe.in/api/partner/v1/doc/pdf/${hashId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${process.env.REACT_APP_SWIPE_TOKEN}`,
        },
        responseType: 'arraybuffer'  // This is important for receiving binary data
      }
    );

    // Convert the PDF to a Blob
    const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });

    // Create FormData to send the PDF
    const formData = new FormData();
    formData.append('pro_forma_invoice', pdfBlob, `invoice_${hashId}.pdf`);
    formData.append('customername', gstin.name);
    formData.append('customeremail', gstin.email);

    // Send the PDF to another API
    const pdfUploadResponse = await axios.post(
      `http://localhost:8080/api/generatePi/send-invoice`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('PDF uploaded successfully:', pdfUploadResponse.data);
    alert("Pdf is send succesfully to the email")
    return response;
  } catch (error) {
    console.error('Error creating invoice or processing payment:', error);
    throw error;
  }
};

const sumTotalAmounts = (savedItems) => {
  return savedItems.reduce((total, item) => {
    // Ensure totalAmount is a number and add it to the total
    const itemTotal = Number(item.totalAmount) || 0;
    return total + itemTotal;
  }, 0);
};

// Example usage with React state:
const updateOverallTotal = () => {
  const newOverallTotal = sumTotalAmounts(savedItems);
  setOverallTotalAmount(newOverallTotal);
};

// You can call this function whenever savedItems changes
useEffect(() => {
  updateOverallTotal();
}, [savedItems]);

const handleCustomizePayment=()=>{
  setShowPaymentPopup(true)
}
const handleGeneratePI = async ()=>{
  // backendcustomercreation()
  // createPIInvoice()
  const orderResults = await processAllOrders(savedItems);
  console.log("All orders processed:", orderResults);


}
const handleSiteSurveyChange = (newSiteSurveyData) => {
  setOrderData(prevData => ({
      ...prevData,
      siteSurvey: newSiteSurveyData
  }));
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
        isChecked={isChecked}
        SetisChecked={SetisChecked}
        billingAddress={billingAddress}
        setBillingAddress={setBillingAddress}
      />
      <ShippingAddressFile 
        selectedOrgId={selectedOrgId} 
        onSelectAddress={handleShippingAddressSelect}
        onCustomerData={handleCustomerData}
        shippingAddress={shippingAddress}
        setShippingAddress={setShippingAddress}
        onTransformedAddress={handleTransformedAddress}
        copiedShippingAddress={copiedShippingAddress}
        setShippingAddressorder={setShippingAddressorder}
        shippingaddressorder={shippingaddressorder}
      />
       <SitesSurvery onSiteSurveyChange={handleSiteSurveyChange} />
      <div className="space-x-4">
      <button 
        onClick={handleFullPaymentModal}
        className="text-white bg-primary py-2 px-4 border border-primary"
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
        <button className='bg-white text-primary py-2 px-4 border border-primary' onClick={RazorpayTokenPayment }>
        {/*  */}
          Take Token
        </button>
        {isFullPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Payment Options</h2>
            <p className="mb-4">Please select a payment option:</p>
            
            <div className="space-y-2 mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="generate"
                  checked={selectedOption === 'generate'}
                  onChange={() => handleOptionChange('generate')}
                  className="form-radio text-primary"
                />
                <span>Generate Link</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="upload"
                  checked={selectedOption === 'upload'}
                  onChange={() => handleOptionChange('upload')}
                  className="form-radio text-primary"
                />
                <span>Upload Proof of Payment</span>
              </label>
            </div>
            
            {selectedOption === 'upload' && (
              <div className="mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,application/pdf"
                />
                <div className='flex'>
                <button 
                  onClick={handleFileSelect}
                  className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                {selectedFile && (
                  <p className="mt-2 ml-3 text-sm text-primary">
                    {selectedFile.name}
                  </p>
                )}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={handleFullPaymentModalClose}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="bg-white text-primary py-2 px-4 border border-primary"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
        <button className='bg-white text-primary py-2 px-4 border border-primary'  onClick={handleCustomizePayment}> Customize Payment</button>
        <button className='bg-white text-primary py-2 px-4 border border-primary' onClick={handleGeneratePI}> Generate PI</button>
        <button className='bg-white text-primary py-2 px-4 border border-primary' onClick={backendcustomercreation}>Request Site Visit</button>
      </div>
      {showPaymentPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Customize Payment</h2>
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={handlePaymentAmountChange}
                          className="border-2 border-gray-300 p-2 rounded mb-4 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Enter amount"
                          />
                        <div className="flex justify-between gap-4">
                            <button 
                                className="bg-primary text-white px-4 py-2 rounded"
                                onClick={handleProceedToPayment}
                            >
                                Proceed to Pay
                            </button>
                            <button 
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                                onClick={() => setShowPaymentPopup(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
    </div>
  );
}