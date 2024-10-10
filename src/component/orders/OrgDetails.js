import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";

export default function OrgDetails({ customer, onOrgSelect, gstin, setgstin, onCopyToShipping, onTransformedAddress, isChecked, SetisChecked }) {
    const [shippingAddress, setShippingAddress] = useState({
        line1: '',
        line2: '',
        pincode: '',
        city: '',
        state: '',
    });

    const [billingAddress, setBillingAddress] = useState({
        line1: '',
        line2: '',
        pincode: '',
        city: '',
        state: '',
    });
    const [isExistingCustomer, setIsExistingCustomer] = useState(false);
    const [searchOrg, setSearchOrg] = useState('');
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [filteredOrgs, setFilteredOrgs] = useState([]);
    const [showOrgDropdown, setShowOrgDropdown] = useState(false);
    const [showGstinDropdown, setShowGstinDropdown] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isExistingCustomer && searchOrg) {
            const filtered = customer.filter(org =>
                org.name.toLowerCase().includes(searchOrg.toLowerCase())
            );
            setFilteredOrgs(filtered);
            setShowOrgDropdown(true);
        } else {
            clearAllFields();
        }
    }, [searchOrg, customer, isExistingCustomer]);
    
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
            name: ''
        });
        setFilteredOrgs([]);
        setShowOrgDropdown(false);
        setShowGstinDropdown(false);
    };

    const handleExistingCustomerChange = (e) => {
        setIsExistingCustomer(e.target.checked);
        if (!e.target.checked) {
            clearAllFields();
            setSearchOrg('');
        }
    };

    const handleSearchOrgChange = (e) => {
        setSearchOrg(e.target.value);
        if (isExistingCustomer) {
            setShowOrgDropdown(true);
        }
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
            name: org.name
        });
    };

    const handleGstinSelect = (selectedGstin) => {
        const { location, city, state, pin } = selectedGstin.address;
    
        // Format the billing address
        const formattedBillingAddress = `${location}, ${city}, ${state}, ${pin}`;
    
        // Update gstin state
        setgstin({
            number: selectedGstin.number,
            billingName: selectedGstin.billingname,
            billingAddress: formattedBillingAddress, // Use the formatted address
        });
    
        // Split the address into parts for setBillingAddress
        setBillingAddress({
            line1: location || '',
            line2: '',  // Set line2 empty or as per your structure
            city: city || '',
            state: state || '',
            pincode: pin || '',
        });
    
        // Hide the dropdown after selecting the GSTIN
        setShowGstinDropdown(false);
    };
    

    const handleSearchOrgFocus = () => {
        if (isExistingCustomer && searchOrg) {
            setShowOrgDropdown(true);
        }
    };

    const handleSearchOrgBlur = () => {
        setTimeout(() => {
            setShowOrgDropdown(false);
        }, 200);
    };

    const handleGstinNumberClick = () => {
        if (selectedOrg && selectedOrg.gstin) {
            setShowGstinDropdown(!showGstinDropdown);
        }
    };

    const handleGstinBlur = () => {
        setTimeout(() => {
            setShowGstinDropdown(false);
        }, 200);
    };


    const handleCheckboxChange = (e) => {
        SetisChecked(e.target.checked);
        if (e.target.checked) {
            console.log("Checkbox selected");
            setShippingAddress({
                line1: '',
                line2: '',
                pincode: '',
                city: '',
                state: '',
            });
            setgstin({
                name: '',
                number: '',
                billingName: '',
                billingAddress: '',
                phoneNumber: ''
            });
            setBillingAddress({
                line1: '',
                line2: '',
                pincode: '',
                city: '',
                state: '',
            });
        } else {
            console.log("Checkbox unselected");
        }
    };
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
                        'Authorization': `${process.env.REACT_APP_SWIPE_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const billingData = response.data.response.billing;
            const transformedAddress = {
                line1: billingData.address_1,
                line2: billingData.address_2,
                city: billingData.city,
                pincode: billingData.pincode,
                state: billingData.state.slice(3).toUpperCase()
            };

            setShippingAddress(transformedAddress);
            setBillingAddress(transformedAddress);
            onTransformedAddress(transformedAddress);

            if (response.data && response.data.response && response.data.response.billing) {
                setgstin((prevGstin) => ({
                    ...prevGstin,
                    billingName: response.data.response.company_name || "",
                    billingAddress: transformedAddress,
                }));
            } else {
                alert("Failed to fetch billing details. Please check the GSTIN number.");
            }
        } catch (error) {
            console.error("Error fetching GST:", error);
            alert("Failed to fetch GST details. Please try again.");
        }
    };

    const handleCopyToShipping = () => {
        if (!billingAddress.line1) {
            alert("Please enter the billing address.");
            return;
        }

        const billingData = {
            line1: billingAddress.line1,
            line2: billingAddress.line2,
            city: billingAddress.city,
            pincode: billingAddress.pincode,
            state: billingAddress.state,
        };

        if (onCopyToShipping) {
            onCopyToShipping(billingData);
        }
    };
    console.log(isChecked, "checkbox status")
    const handlegstinSelect = (selectedgstin) => {
        const formattedBillingAddress = `${selectedgstin.address.location}, ${selectedgstin.address.city}, ${selectedgstin.address.state}, ${selectedgstin.address.pin}`;
        setgstin({
          number: selectedgstin.number,
          billingName: selectedgstin.billingname,
          billingAddress: `${selectedgstin.address.location}, ${selectedgstin.address.city}, ${selectedgstin.address.state}, ${selectedgstin.address.pin}`
        });
        setBillingAddress(formattedBillingAddress)
        setShowGstinDropdown(false);
      };

    return (
        <div className="bg-white shadow-md rounded-xl border-2 p-6">
            <div className='flex justify-between items-center mb-4'>
                <h1 className="font-medium text-lg">Order Details</h1>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="existingCustomer"
                        className="mr-2"
                        checked={isExistingCustomer}
                        onChange={handleExistingCustomerChange}
                    />

                    <label htmlFor="existingCustomer" className="font-semibold">Existing Customer</label>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col w-full sm:w-[45%] relative">
                        <label htmlFor="customerName" className="mb-2 font-medium">Customer Name:</label>
                        <div className="relative">
            {isExistingCustomer ? (
              <input
                ref={inputRef}
                id="searchOrg"
                className="border-2 border-gray-400 p-2 rounded w-full"
                placeholder="Search Existing Customer"
                value={searchOrg}
                onChange={handleSearchOrgChange}
                onFocus={handleSearchOrgFocus}
                onBlur={handleSearchOrgBlur}
              />
            ) : (
              <input
                id="customerName"
                className="border-2 border-gray-400 p-2 rounded w-full"
                placeholder="Enter Customer Name"
                value={gstin.name}
                onChange={(e) =>
                  setgstin((prevGstin) => ({
                    ...prevGstin,
                    name: e.target.value
                  }))
                }
              />
            )}
            {showOrgDropdown && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded shadow-md">
                {filteredOrgs.map((org) => (
                  <li
                    key={org.customer_id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOrgSelect(org)}
                  >
                    {org.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
                    </div>
                    <div className="flex flex-col w-full sm:w-[45%] ml-auto">
                        <label htmlFor="email" className="mb-2 font-medium">Email:</label>
                        <input
                            id="email"
                            type="email"
                            className="border-2 border-gray-300 p-2 rounded"
                            placeholder="Email Address"
                            value={gstin.email || ''}
                            onChange={(e) =>
                                setgstin((prevGstin) => ({
                                    ...prevGstin,
                                    email: e.target.value
                                }))
                            }
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col w-full sm:w-[45%] relative">
                    <label htmlFor="gstinNumber" className="mb-2 font-medium">GSTIN:</label>
                    <div className="flex relative">
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
                            className="flex-grow p-2 border rounded-l w-28"
                            placeholder="Enter the GSTIN number"
                            onClick={handleGstinNumberClick}
                        />
                        <button
                            className="bg-primary text-white px-4 rounded-r"
                            onClick={handleFetchGST}
                        >
                            Fetch Details
                        </button>
                        {showGstinDropdown && selectedOrg && selectedOrg.gstin && (
                            <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto top-full left-0 shadow-md">
                                {selectedOrg.gstin.map((gstinItem) => (
                                    <li
                                        key={gstinItem.number}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onMouseDown={() => handleGstinSelect(gstinItem)}
                                    >
                                        {gstinItem.number}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                    <div className="flex flex-col w-full sm:w-[45%] ml-auto">
                        <label htmlFor="phoneNumber" className="mb-2 font-medium">Phone Number:</label>
                        <input
                            id="phoneNumber"
                            className="border-2 border-gray-300 p-2 rounded"
                            placeholder="Phone Number"
                            value={gstin.phoneNumber}
                            onChange={(e) => {
                                const input = e.target.value;
                                if (/^\d{0,10}$/.test(input)) {
                                    setgstin((prevGstin) => ({
                                        ...prevGstin,
                                        phoneNumber: input
                                    }));
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col w-full sm:w-[45%]">
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
                    <div className="flex flex-col w-full sm:w-[45%] ml-auto">
                        <label htmlFor="billingAddress" className="mb-2 font-medium">Billing Address:</label>
                        <textarea
                            id="billingAddress"
                            className="border-2 border-gray-300 p-2 rounded h-24 resize-none"
                            placeholder="Billing Address"
                            value={
                                `${billingAddress.line1 || ''}\n` +
                                `${billingAddress.line2 || ''}\n` +
                                `${billingAddress.city || ''}\n` +
                                `${billingAddress.state || ''}\n` +
                                `${billingAddress.pincode || ''}`
                            }
                            onChange={(e) => {
                                const lines = e.target.value.split('\n');
                                setBillingAddress({
                                    line1: lines[0] || '',
                                    line2: lines[1] || '',
                                    city: lines[2]?.split(',')[0]?.trim() || '',
                                    state: lines[2]?.split(',')[1]?.split('-')[0]?.trim() || '',
                                    pincode: lines[2]?.split('-')[1]?.trim() || '',
                                });
                            }}
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        className="text-primary border border-primary bg-white px-4 py-2 rounded"
                        onClick={handleCopyToShipping}
                    >
                        Copy to Shipping Address
                    </button>
                </div>
            </div>
        </div>
    );
}