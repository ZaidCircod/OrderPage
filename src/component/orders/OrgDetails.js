import React, { useState, useEffect, useRef } from 'react';
import axios from "axios"

export default function OrgDetails({ customer, onOrgSelect, onClearSearch, onCopyToShipping,onTransformedAddress}) {
    const [searchOrg, setSearchOrg] = useState('');
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [gstin, setgstin] = useState({
        number: '',
        billingName: '',
        billingAddress: '',
        phoneNumber: '' // Added phone number field
    });
    const [filteredOrgs, setFilteredOrgs] = useState([]);
    const [showOrgDropdown, setShowOrgDropdown] = useState(false);
    const [showgstinDropdown, setShowgstinDropdown] = useState(false);
    const inputRef = useRef(null);
    const [copyshippingaddresstogst,setcopyshippingaddresstogst]=useState()
    const [shippingAddress, setShippingAddress] = useState({
        line1: '',
        line2: '',
        pincode: '',
        city: '',
        state: '',
      });
    
      const handleFetchGST = async () => {
        if (!gstin.number) {
          alert("Please enter a GSTIN number.");
          return;
        }
      
        try {
          const response = await axios.post(
            'https://app.getswipe.in/api/user/fetch_gst_details',
            { gstin: gstin.number },
            {
              headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjI2NzYzLCJuYW1lIjoiQVBJIFVzZXIiLCJjb21wYW55X2lkIjoxMTMwODc2LCJjb21wYW55X25hbWUiOiJDaXJjbyBMaWZlIEFQSSBUZXN0IiwiaWF0IjoxNzIzNTc0MzQwLCJ2ZXJzaW9uIjoyLCJwYXJ0bmVyIjp0cnVlfQ.kX1wTriKBzuINViIp7sVVx2daeAVMvFS0v4kGI0ShgQ`, // Replace with your actual token
                'Content-Type': 'application/json',
              },
            }
          );
      
          const billingData = response.data.response.billing;
  
          const transformedAddress = {
            line1: billingData.address_1, // Rename address_1 to line1
            line2: billingData.address_2, // Rename address_2 to line2
            city: billingData.city,
            pincode: billingData.pincode,
            state: billingData.state
          };
        
          // Set the transformed data into the state
          setcopyshippingaddresstogst(transformedAddress);
          onTransformedAddress(transformedAddress);
        
          // Log the transformed data directly
          console.log("Transformed Shipping Address:", transformedAddress);
          // Check if response contains the required billing details
          if (response.data && response.data.response && response.data.response.billing) {
            const billingData = response.data.response.billing;
      
            // Concatenate the address fields
            const billingAddress = [
              billingData.address_1 || "",
              billingData.address_2 || "",
              billingData.city || "",
              billingData.state ? billingData.state.substring(3) : "", // Get state name without state code
              billingData.pincode || ""
            ]
              .filter(Boolean)  // Removes any empty string values
              .join(", ");       // Joins non-empty parts with commas
      
            // Update GSTIN state with the company name and billing address
            setgstin((prevGstin) => ({
              ...prevGstin,
              billingName: response.data.response.company_name || "",
              billingAddress: billingAddress,
            }));
          } else {
            alert("Failed to fetch billing details. Please check the GSTIN number.");
          }
        } catch (error) {
          console.error("Error fetching GST:", error);
          alert("Failed to fetch GST details. Please try again.");
        }
      };
    useEffect(() => {
        if (searchOrg) {
            const filtered = customer.filter(org =>
                org.name.toLowerCase().includes(searchOrg.toLowerCase())
            );
            setFilteredOrgs(filtered);
            setShowOrgDropdown(true);
        } else {
            clearAllFields();
        }
    }, [searchOrg, customer]);

    useEffect(() => {
        if (selectedOrg) {
            onOrgSelect(selectedOrg.customer_id, {
                name: selectedOrg.name,
                ...gstin
            });
        }
    }, [selectedOrg, gstin]);

    const clearAllFields = () => {
        setSelectedOrg(null);
        setgstin({
            number: '',
            billingName: '',
            billingAddress: '',
            phoneNumber: '' // Clear phone number
        });
        setFilteredOrgs([]);
        setShowOrgDropdown(false);
        setShowgstinDropdown(false);
        onClearSearch();
    };

    const handleSearchOrgChange = (e) => {
        setSearchOrg(e.target.value);
        setShowOrgDropdown(true);
        if (!e.target.value) {
            clearAllFields();
        }
    };

    const handleOrgSelect = (org) => {
        setSearchOrg(org.name);
        setSelectedOrg(org);
        setShowOrgDropdown(false);
        setgstin({
            number: '',
            billingName: '',
            billingAddress: '',
            phoneNumber: '' // Reset phone number
        });
    };



    const handleSearchOrgFocus = () => {
        if (searchOrg) {
            setShowOrgDropdown(true);
        }
    };

    const handleSearchOrgBlur = () => {
        setTimeout(() => {
            setShowOrgDropdown(false);
        }, 200);
    };

    const handlegstinNumberClick = () => {
        if (selectedOrg && selectedOrg.gstin) {
            setShowgstinDropdown(!showgstinDropdown);
        }
    };

    const handlegstinBlur = () => {
        setTimeout(() => {
            setShowgstinDropdown(false);
        }, 200);
    };

    const handleCopyToShipping = () => {
        // Use the current gstin state to populate the shipping address
        const billingAddressParts = gstin.billingAddress.split(", ");
    
        const billingData = {
          line1: billingAddressParts[0] || '',
          line2: billingAddressParts[1] || '',
          city: billingAddressParts[2] || '',
          state: billingAddressParts[3] || '',
          pincode: billingAddressParts[5] || '',
        };
    
        // Log the billing data to check its content
        console.log("Billing Data:", billingData);
    
        // Call the onCopyToShipping prop function with the billing data
        if (onCopyToShipping) {
          onCopyToShipping(billingData);
        }
      };


    return (
        <div className="bg-white shadow-md rounded-xl border-2 p-6">
            <h1 className="font-semibold text-lg mb-4">Order Details</h1>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col w-full sm:w-[45%] relative">
                        <label htmlFor="searchOrg" className="mb-2 font-medium">Enter Customer Name:</label>
                        <input
                            ref={inputRef}
                            id="searchOrg"
                            className="border-2 border-gray-400 p-2 rounded"
                            placeholder="Enter Customer Name"
                            value={searchOrg}
                            onChange={handleSearchOrgChange}
                            onFocus={handleSearchOrgFocus}
                            onBlur={handleSearchOrgBlur}
                        />
                        {showOrgDropdown && filteredOrgs.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto top-full left-0 shadow-md">
                                {filteredOrgs.map((org) => (
                                    <li
                                        key={org._id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onMouseDown={() => handleOrgSelect(org)}
                                    >
                                        {org.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="flex flex-col w-full sm:w-[45%] ml-auto">
                    <label htmlFor="phoneNumber" className="mb-2 font-medium">Phone Number:</label>
                        <input
                            id="phoneNumber"
                            className="border-2 border-gray-300 p-2 rounded"
                            placeholder="Phone Number"
                            value={gstin.phoneNumber}
                            onChange={(e) =>
                                setgstin((prevGstin) => ({
                                  ...prevGstin,
                                  phoneNumber: e.target.value
                                }))
                              }
                        />
                        
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col w-full sm:w-[45%] relative">
                        <label htmlFor="gstinNumber" className="mb-2 font-medium">Gstin:</label>
                        <div className="flex mb-4 md:mb-0">
                            <input
                                type="text"
                                value={gstin.number}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    const formattedInput = input.toUpperCase().replace(/\s+/g, "");
                                    if (formattedInput.length <= 15) {
                                        setgstin((prevGstin) => ({
                                            ...prevGstin,
                                            number: formattedInput
                                        }));
                                    }
                                }}
                                className="flex-grow p-2 border rounded-l w-28 mb-2"
                                placeholder="Enter the GSTIN number"
                            />
                            <button
                                className="bg-primary text-white px-4 rounded-r mb-2"
                                onClick={handleFetchGST}
                            >
                                Fetch Details
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col w-full sm:w-[45%] ml-auto">
                    <label htmlFor="billingName" className="mb-2 font-medium">Billing Name:</label>
                        <input
                            id="billingName"
                            className="border-2 border-gray-300 p-2 rounded"
                            placeholder="Billing Name"
                            value={gstin.billingName}
                            onChange={(e) =>
                                setgstin((prevGstin) => ({
                                  ...prevGstin,
                                  billingName: e.target.value
                                }))
                              }
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col w-full sm:w-1/2">
                    <label htmlFor="billingAddress" className="mb-2 font-medium">Billing Address:</label>
                        <textarea
                            id="billingAddress"
                            className="border-2 border-gray-300 p-2 rounded h-24 resize-none"
                            placeholder="Billing Address"
                            value={gstin.billingAddress}
                            onChange={(e) =>
                                setgstin((prevGstin) => ({
                                  ...prevGstin,
                                  billingAddress: e.target.value
                                }))
                              }
                        />
                    </div>
                    <div className="flex items-end w-full sm:w-1/2">
                        <button
                            className="bg-primary text-white px-4 py-2 rounded w-full sm:w-auto"
                            onClick={handleCopyToShipping}
                        >
                            Copy to Shipping Address
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}