import React, { useState, useEffect } from "react";

export default function ACdetails({ onACDetailsChange, savedItems, setSavedItems }) {
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [modalACDetails, setModalACDetails] = useState(false);
  const [acDetails, setACDetails] = useState({
    acType: "Split",
    ton: "10",
    plan: "3+2year",
    quantity: 1,
    subscription_plan: 1299,
    depositamount: 5000,
    installetionCharge: 1800.00,
    extraCharge: 349,
    itemId: "mc_3y_1.0",
    totalSubscription: 1299,
    totalDeposit: 5000,
    totalInstallation: 1800.00,
    fixedPriceAfter3Years: 799,
    totalAfter3Years: 799,
    discountamount:"",
    discountpercent:"",
    approavalcode:""
  });


  useEffect(() => {
    updatePricing();
  }, [acDetails.acType, acDetails.ton, acDetails.plan, acDetails.quantity, acDetails.discountamount, acDetails.discountpercent]);
  
  const updatePricing = () => {
    let newSubscriptionPlan = 1299;
    let newDepositAmount = 5000;
    let newInstallationCharge = 1800;
    let newPriceAfter3Years = 0;

    if (acDetails.acType === "Split") {
      newInstallationCharge = 1800;
      if (acDetails.ton === "10") { // 1 ton
        if (acDetails.plan === "3year") {
          newSubscriptionPlan = 1299;
          newDepositAmount = 5000;
        } else if (acDetails.plan === "5years") {
          newSubscriptionPlan = 1099;
          newDepositAmount = 5000;
        } else if (acDetails.plan === "3+2year") {
          newSubscriptionPlan = 1299; // Assuming same as 3year plan
          newDepositAmount = 5000;
          newPriceAfter3Years = 799;
        }
      } else if (acDetails.ton === "15") { // 1.5 ton
        if (acDetails.plan === "3year") {
          newSubscriptionPlan = 1399;
          newDepositAmount = 6000;
        } else if (acDetails.plan === "5years") {
          newSubscriptionPlan = 1199;
          newDepositAmount = 6000;
        } else if (acDetails.plan === "3+2year") {
          newSubscriptionPlan = 1399; // Assuming same as 3year plan
          newDepositAmount = 6000;
          newPriceAfter3Years = 899;
        }
      } else if (acDetails.ton === "20") { // 2 ton
        if (acDetails.plan === "3year") {
          newSubscriptionPlan = 1699;
          newDepositAmount = 7000;
        } else if (acDetails.plan === "5years") {
          newSubscriptionPlan = 1499;
          newDepositAmount = 7000;
        } else if (acDetails.plan === "3+2year") {
          newSubscriptionPlan = 1699; // Assuming same as 3year plan
          newDepositAmount = 7000;
          newPriceAfter3Years = 1099;
        }
      }
    } else if (acDetails.acType === "Cassette") {
      if (acDetails.ton === "20") { // 2 ton
        newSubscriptionPlan = 2499;
        newDepositAmount = 12000;
        newPriceAfter3Years = 1499;
        newInstallationCharge=3500
      } else if (acDetails.ton === "30") { // 3 ton
        newSubscriptionPlan = 2999;
        newDepositAmount = 18000;
        newPriceAfter3Years = 1999;
        newInstallationCharge=3500
      }
    }

    const discountAmount = acDetails.discountamount ;
    const discountPercent = acDetails.discountpercent ;
  
    const totalSubscriptionBeforeDiscount = newSubscriptionPlan * acDetails.quantity;
    const totalSubscription = totalSubscriptionBeforeDiscount - discountAmount - (totalSubscriptionBeforeDiscount * (discountPercent / 100));
    
    const totalDeposit = newDepositAmount * acDetails.quantity;
    const totalInstallation = newInstallationCharge * acDetails.quantity;
  
    const itemId = `mc_${acDetails.plan === "3year" ? "3" : acDetails.plan === "5years" ? "5" : "3+2"}y_${acDetails.ton.replace(' ', '_')}`;

    const updatedDetails = {
      ...acDetails,
      subscription_plan: newSubscriptionPlan,
      depositamount: newDepositAmount,
      installetionCharge: newInstallationCharge,
      itemId: itemId,
      totalSubscription: totalSubscription,
      totalDeposit: totalDeposit,
      totalInstallation: totalInstallation,
      fixedPriceAfter3Years: newPriceAfter3Years,
      totalAfter3Years: newPriceAfter3Years * acDetails.quantity,
    };
  
    setACDetails(updatedDetails);
    onACDetailsChange(updatedDetails);
  };
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    let newValue = value;
  
    switch (id) {
      case "quantity":
        newValue = parseInt(value) || 1;
        break;
        case "discountamount":
          case "discountpercent":
            newValue = value === '' ? null : parseFloat(value);
            break;
      case "acType":
        newValue = value;
        setACDetails(prevDetails => ({
          ...prevDetails,
          [id]: newValue,
          ton: value === "Split" ? "10" : "20",
          plan: value === "Cassette" ? "3+2year" : "3year"
        }));
        return;
      default:
        break;
    }
  
    setACDetails(prevDetails => ({
      ...prevDetails,
      [id]: newValue,
    }));
  };
  
    
  const handleFocus = (e) => {
    if (e.target.value === '0' || e.target.value === 'null') {
      e.target.value = '';
    }
  };
  const handleSave = () => {
    const newSavedItems = [...savedItems, { ...acDetails, id: Date.now() }];
    setSavedItems(newSavedItems);
    setShowSavedItems(true);
    setModalACDetails(false);
    setACDetails({
      acType: "Split",
      ton: "10",
      plan: "3+2year",
      quantity: 1,
      subscription_plan: 1299,
      depositamount: 5000,
      installetionCharge: 1800.00,
      extraCharge: 349,
      itemId: "mc_3y_1.0",
      totalSubscription: 1299,
      totalDeposit: 5000,
      totalInstallation: 1800.00,
      priceAfter3Years: 799,
      totalAfter3Years: 799,
      discountamount:0,
      discountpercent:0,
      approavalcode:""
    });
    onACDetailsChange({
      acType: "Split",
      ton: "10",
      plan: "3+2year",
      quantity: 1,
      subscription_plan: 1299,
      depositamount: 5000,
      installetionCharge: 1800.00,
      extraCharge: 349,
      itemId: "mc_3y_1.0",
      totalSubscription: 1299,
      totalDeposit: 5000,
      totalInstallation: 1800.00,
      priceAfter3Years: 799,
      totalAfter3Years: 799,
      discountamount:0,
      discountpercent:0,
      approavalcode:""
    });
  };

  const handleRemove = (id) => {
    const updatedItems = savedItems.filter((item) => item.id !== id);
    setSavedItems(updatedItems);
  };

  const availableTons = acDetails.acType === "Split" 
    ? [
        { value: "10", label: "1.0" },
        { value: "15", label: "1.5" },
        { value: "20", label: "2.0" },
      ] 
    : [
        { value: "20", label: "2.0" },
        { value: "30", label: "3.0" },
      ];

  const availablePlans = acDetails.acType === "Cassette"
    ? [{ value: "3+2year", label: "3+2 Year" }]
    : [
        { value: "3year", label: "3 Year" },
        { value: "3+2year", label: "3+2 Year" },
        { value: "5years", label: "5 Year" },
      ];

  return (
    <div className="bg-white shadow-md rounded-xl border-2 p-6">
      <h1 className="font-semibold text-lg">AC Details</h1>
      {showSavedItems && (
  <div className="flex flex-wrap gap-4 mt-4">
    {savedItems.map((item) => (
      <div
        key={item.id}
        className="border border-primary p-4 rounded-2xl w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 min-h-72 flex flex-col justify-between"
      >
        <h3 className="font-semibold">
          {item.acType} AC - {item.ton === '10' ? '1' : item.ton === '15' ? '1.5' : item.ton === '20' ? '2' : item.ton === '30' ? '3.0' : item.ton} Ton
        </h3>
        <p>Plan: {item.plan}</p>
        <p>Quantity: {item.quantity}</p>
        <p>Total Installation: {item.totalInstallation}</p>
        <p>Subscription Plan: {item.totalSubscription}</p>
        <p>Deposit Amount: {item.totalDeposit}</p>
        {item.plan === "3+2year" && (
          <>
            <p>Price After 3 Years per Unit: {item.totalAfter3Years/item.quantity}</p>
            <p>Total After 3 Years: {item.totalAfter3Years}</p>
          </>
        )}
        <p>Approval Code: {item.approavalcode}</p>
        <button
          onClick={() => handleRemove(item.id)}
          className="mt-4 bg-red-500 text-white font-normal py-2 px-4 rounded"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
)}
      {!modalACDetails && (
        <button className="mt-6 border border-primary py-2 px-4 text-primary rounded-lg" onClick={() => setModalACDetails(true)}>
          + Add an AC
        </button>
      )}

      {modalACDetails && (
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label htmlFor="acType" className="block font-semibold mb-2">AC type:</label>
              <select id="acType" className="w-full border-2 border-gray-300 rounded py-2 px-4" value={acDetails.acType} onChange={handleChange}>
                <option value="Split">Split</option>
                <option value="Cassette">Cassette</option>
              </select>
            </div>
            <div>
              <label htmlFor="ton" className="block font-semibold mb-2">Ton:</label>
              <select id="ton" className="w-full border-2 border-gray-300 rounded py-2 px-4" value={acDetails.ton} onChange={handleChange}>
                {availableTons.map((ton) => (
                  <option key={ton.value} value={ton.value}>{ton.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="plan" className="block font-semibold mb-2">Plan:</label>
              <select id="plan" className="w-full border-2 border-gray-300 rounded py-2 px-4" value={acDetails.plan} onChange={handleChange}>
                {availablePlans.map((plan) => (
                  <option key={plan.value} value={plan.value}>{plan.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="quantity" className="block font-semibold mb-2">Quantity:</label>
              <input type="number" id="quantity" className="w-full border-2 border-gray-300 rounded py-2 px-4" value={acDetails.quantity} onChange={handleChange} min="1" />
            </div>
            <div>
              <label htmlFor="subscription_plan" className="block font-semibold mb-2">Subscription Plan (Per Unit):</label>
              <input type="number" id="subscription_plan" className="w-full border-2 border-gray-300 rounded py-2 px-4" value={acDetails.subscription_plan} onChange={handleChange}  />
            </div>
            <div>
              <label htmlFor="installetionCharge" className="block font-semibold mb-2">Installation Fees (Per Unit):</label>
              <input type="number" id="installetionCharge" className="w-full border-2 border-gray-300 rounded py-2 px-4" value={acDetails.installetionCharge} onChange={handleChange}  />
            </div>
            <div>
              <label htmlFor="depositamount" className="block font-semibold mb-2">Deposit Refundable (Per Unit):</label>
              <input type="number" id="depositamount" className="w-full border-2 border-gray-300 rounded py-2 px-4" value={acDetails.depositamount} onChange={handleChange}  />
            </div>
            <div>
              <label htmlFor="totalSubscription" className="block font-semibold mb-2">Total Subscription:</label>
              <input type="number" id="totalSubscription" className="w-full border-2 border-gray-300 rounded py-2 px-4" value={acDetails.totalSubscription} onChange={handleChange}  />
            </div>
            <div>
              <label htmlFor="totalInstallation" className="block font-semibold mb-2">Total Installation:</label>
              <input type="number" id="totalInstallation" className="w-full border-2 border-gray-300 rounded py-2 px-4" value={acDetails.totalInstallation} onChange={handleChange} readOnly/>
            </div>
            <div>
              <label htmlFor="totalDeposit" className="block font-semibold mb-2">Total Deposit:</label>
              <input type="number" id="totalDeposit" className="w-full border-2 border-gray-300 rounded py-2 px-4" value={acDetails.totalDeposit}  onChange={handleChange} />
            </div>

            {acDetails.plan === "3+2year" && (
              <>
                <div>
                  <label htmlFor="priceAfter3Years" className="block font-semibold mb-2">Price after 3 years per unit:</label>
                  <input type="number" id="priceAfter3Years" className="w-full border-2 border-gray-300 rounded py-2 px-4" value={acDetails.fixedPriceAfter3Years}  onChange={handleChange} readOnly/>
                </div>
                <div>
                  <label htmlFor="totalAfter3Years" className="block font-semibold mb-2">Total after 3 years:</label>
                  <input type="number" id="totalAfter3Years" className="w-full border-2 border-gray-300 rounded py-2 px-4" value={acDetails.totalAfter3Years} onChange={handleChange} readOnly />
                </div>
              </>
            )}
            <div>
  <label htmlFor="approvalcode" className="block font-semibold mb-2">Approval Code</label>
  <input 
    type="text" 
    id="approvalcode" 
    className="w-full border-2 border-gray-300 rounded py-2 px-4" 
    value={acDetails.approvalcode}  // fixed typo
    onChange={handleChange} 
  />
</div>
          </div>
          <div>
            <button
              onClick={handleSave}
              className="mt-4 bg-primary text-white font-normal py-2 px-4 rounded"
            >
              Save AC Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}