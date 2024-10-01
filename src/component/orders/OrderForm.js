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
const [overallTotalAmount, setOverallTotalAmount] = useState(0);

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
      // You can call other functions that depend on customerIds here
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
        shipping_address: shippingaddressorder
    };

    console.log(data, "Formatted Data");

    try {
        // First API call to save customer data
        const response = await axios({
            url: `${process.env.REACT_APP_BASE_URL}/api/customer/save`,
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

  // const TakeFullPaymemt=async()=>{
  //   logDetails()
  //   const invoiceResponse = await createInvoice();
  //   console.log("Invoice created successfully:", invoiceResponse.data);
  //   // const subscriptionResponse = await createSubscription(invoiceResponse.data);
  //   // console.log("Subscription created successfully:", subscriptionResponse);
  //   // try {
  //   //   //   First, send the order data to your backend
  //   //   const orderResults = await processAllOrders(savedItems);
  //   //   console.log("All orders processed:", orderResults);
  //   // }catch(error){
  //   //   console.log(error,"Error occured while hitting the api in our backend")
  //   // }
  // }
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
        console.log('Payment Link Created:', response.data);
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
        contact: "9892215848"
      };
    
      try {
        const response = await axios.post(`${process.env.REACT_APP_RAZORPAY}/create-payment-link`, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Payment Link Created:', response.data);
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
const createInvoice = async () => {
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
    document_type: 'invoice',
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

    const paymentData = {
      amount: totalAmount,
      payment_mode: 'Cash',
      customer: CustomerIds,
      payment_date: currentDate,
      documents: [
        {
          hash_id: hashId,
          amount_paying: totalAmount,
        },
      ],
    };

    await axios.post(
      'https://app.getswipe.in/api/partner/v1/payment',
      paymentData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${process.env.REACT_APP_SWIPE_TOKEN}`,
        },
      }
    );

    const paymentbackenddata = {
      invoiceid: hashId,
      date: currentDate,
      price: totalAmount,
    };

    await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/customer/${CustomerIds}`,
      paymentbackenddata
    );
  return response;
  } catch (error) {
    console.error('Error creating invoice or processing payment:', error);
    throw error;
  }
};

//Subscription Plan
const createSubscription = async () => {
  if (!gstin.name ) {
    throw new Error("Missing customer or shipping details.");
  }

  const currentDate = formatDate(new Date());
  const nextMonthDate = new Date();
  const nextMonthDatefor3 = new Date();
  nextMonthDatefor3.setMonth(nextMonthDate.getMonth() + 2);

  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  
  const createSubscriptionData = (items, startDate, endDate) => ({
    document_type: "subscription",
    document_date: currentDate,
    customer: {
      id: CustomerIds,
      name: gstin.name,
    },
    items: items,
    customer_shipping_address: {
      address_line1: selectedShippingAddress.line1,
      address_line2: selectedShippingAddress.line2,
      pincode: selectedShippingAddress.pincode,
      city: selectedShippingAddress.city,
      country: "India",
      state: selectedShippingAddress.state?.toUpperCase(),
    },
    round_off: true,
    is_subscription: true,
    subscription_details: {
      start_time: formatDate(startDate),
      end_time: formatDate(endDate),
      repeat: 1,
      repeat_type: "months",
    },
  });

  try {
    const subscriptions = [];

    // Check if all items have a 5-year plan
    const allItemsAre5Year = savedItems.every(item => item.plan === "5years");

    if (allItemsAre5Year) {
      // Create only the 5-year subscription
      const fiveYearStartDate = new Date(nextMonthDate);
      const fiveYearEndDate = new Date(fiveYearStartDate);
      fiveYearEndDate.setFullYear(fiveYearEndDate.getFullYear() + 5);

      const fiveYearSubscriptionItems = savedItems.map(item => mapProduct(item.ton, item));
      const fiveYearSubscriptionData = createSubscriptionData(fiveYearSubscriptionItems, fiveYearStartDate, fiveYearEndDate);

      const response = await axios.post(
        `https://app.getswipe.in/api/partner/v1/doc`,
        fiveYearSubscriptionData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${process.env.REACT_APP_SWIPE_TOKEN}`,
          },
        }
      );
      subscriptions.push(response.data);
      console.log("5-year subscription created:", response.data);
    } else {
      // Existing flow for non-5-year plans
      const subscriptionItems = savedItems.map((item) => mapProduct(item.ton, item));

      // Initial subscription for all items
      const initialEndDate = new Date(nextMonthDate);
      initialEndDate.setFullYear(initialEndDate.getFullYear() + parseInt(acDetails.plan));
      const initialSubscriptionData = createSubscriptionData(subscriptionItems, nextMonthDate, initialEndDate);
      const response1 = await axios.post(
        `https://app.getswipe.in/api/partner/v1/doc`,
        initialSubscriptionData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${process.env.REACT_APP_SWIPE_TOKEN}`,
          },
        }
      );
      subscriptions.push(response1.data);
      console.log("Initial subscription created:", response1.data);

      // Check for 3+2year plan items
      const threePlusTwoYearItems = savedItems.filter(item => item.plan === "3+2year");
      if (threePlusTwoYearItems.length > 0) {
        const modifiedStartTime = new Date(nextMonthDatefor3);
        modifiedStartTime.setFullYear(modifiedStartTime.getFullYear() + 3);
        const modifiedEndTime = new Date(nextMonthDate);
        modifiedEndTime.setFullYear(modifiedEndTime.getFullYear() + 5);

        const modifiedItems = threePlusTwoYearItems.map(item => {
          const tonValues = {
            "10": { total_amount: 799, unit_price: 624.28, net_amount: 624.28, price_with_tax: 799, id: "mlmc_2y_10t", name: "Monthly Leasing and Maintenance charges of Air Conditioner - 2Y 10T" },
            "15": { total_amount: 899, unit_price: 702.34, net_amount: 702.34, price_with_tax: 899, id: "mlmc_2y_15t", name: "Monthly Leasing and Maintenance charges of Air Conditioner - 2Y 15T" },
            "20": { total_amount: 1099, unit_price: 858.59, net_amount: 858.59, price_with_tax: 1099, id: "mlmc_2y_20t", name: "Monthly Leasing and Maintenance charges of Air Conditioners - 2Y 20T" },
          };

          if (item.acType === "Cassette") {
            tonValues["20"] = { total_amount: 1499, unit_price: 1499 / 1.28, net_amount: 1499 / 1.28, price_with_tax: 1499, id: "mlcmc_3y_20t", name: "Monthly Leasing and Maintenance charges of Air Conditioner - 3Y 20T" };
            tonValues["30"] = { total_amount: 1999, unit_price: 1999 / 1.28, net_amount: 1999 / 1.28, price_with_tax: 1999, id: "mlcmc_3y_30t", name: "Monthly Leasing and Maintenance charges of Air Conditioner (Cassette) - 3Y 30T" };
          }

          const { total_amount, unit_price, net_amount, price_with_tax, id, name } = tonValues[item.ton];
          const quantity = item.quantity || 1;

          return {
            id, name,
            total_amount: total_amount * quantity,
            unit_price, net_amount: net_amount * quantity,
            price_with_tax: price_with_tax * quantity,
            quantity, item_type: "Service", tax_rate: 28
          };
        });

        const modifiedSubscriptionData = createSubscriptionData(modifiedItems, modifiedStartTime, modifiedEndTime);
        const response2 = await axios.post(
          `https://app.getswipe.in/api/partner/v1/doc`,
          modifiedSubscriptionData,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${process.env.REACT_APP_SWIPE_TOKEN}`,
            },
          }
        );
        subscriptions.push(response2.data);
        console.log("Second subscription created for 3+2 years plan:", response2.data);
      }
    }

    return subscriptions;
  } catch (error) {
    console.error("Error creating subscription:", error);
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
        setShippingAddressorder={setShippingAddressorder}
        shippingaddressorder={shippingaddressorder}
      />
      <div className="space-x-4">
      <button 
        onClick={TakeFullPaymemt} 
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
        <button className='bg-white text-primary py-2 px-4 border border-primary' onClick={RazorpayTokenPayment }>
        {/*  */}
          Take Token
        </button>
        <button className='bg-white text-primary py-2 px-4 border border-primary'>Request Site Visit</button>
      </div>
    </div>
  );
}