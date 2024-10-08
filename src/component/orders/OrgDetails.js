import React, { useState } from 'react';
import axios from "axios";

export default function OrgDetails({ gstin, setgstin, onCopyToShipping, onTransformedAddress,isChecked,SetisChecked }) {
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
    console.log(isChecked,"checkbox status")

    return (
        <div className="bg-white shadow-md rounded-xl border-2 p-6">
            <div className='flex justify-between items-center mb-4'>
                <h1 className="font-medium text-lg">Order Details</h1>
                <div className="flex items-center">
            <input
                type="checkbox"
                id="existingCustomer"
                className="mr-2"
                checked={isChecked}
                onChange={handleCheckboxChange}
            />
            <label htmlFor="existingCustomer" className="font-semibold">Existing Customer</label>
        </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col w-full sm:w-[45%] relative">
                        <label htmlFor="customerName" className="mb-2 font-medium">Customer Name:</label>
                        <input
                            id="customerName"
                            className="border-2 border-gray-400 p-2 rounded"
                            placeholder="Enter Customer Name"
                            value={gstin.name}
                            onChange={(e) =>
                                setgstin((prevGstin) => ({
                                    ...prevGstin,
                                    name: e.target.value
                                }))
                            }
                        />
                    </div>
                    <div className="flex flex-col w-full sm:w-[45%] ml-auto">
                        <label htmlFor="email" className="mb-2 font-medium">Email(Optional):</label>
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
                        <div className="flex">
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
                            />
                            <button
                                className="bg-primary text-white px-4 rounded-r"
                                onClick={handleFetchGST}
                            >
                                Fetch Details
                            </button>
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