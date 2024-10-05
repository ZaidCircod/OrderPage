import React, { useState } from 'react';

export default function SitesSurvery() {
    const [siteSurveyRequest, setSiteSurveyRequest] = useState('online');
    const [siteSurveyDate, setSiteSurveyDate] = useState('');
    const [installationDate, setInstallationDate] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [source, setSource] = useState('');

    const handleSiteSurveyChange = (e) => {
        setSiteSurveyRequest(e.target.value);
    };

    const handleSourceChange = (event) => {
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

    return (
        <div className="bg-white shadow-md rounded-xl border-2 p-6">
            <h1 className="font-medium text-lg mb-6">Site Survey Details</h1>
            
            <div className="flex items-center mb-6">
                <label className="font-semibold mr-4">Type of Site Survey:</label>
                <div className="flex">
                    <div className="flex items-center mr-4">
                        <input
                            type="radio"
                            id="online"
                            name="siteSurveyRequest"
                            value="online"
                            className="hidden"
                            checked={siteSurveyRequest === 'online'}
                            onChange={handleSiteSurveyChange}
                        />
                        <label
                            htmlFor="online"
                            className={`flex items-center cursor-pointer relative gap-2`}
                        >
                            <span className={`h-5 w-5 border-2 border-gray-300 rounded-full flex items-center justify-center ${siteSurveyRequest === 'online' ? 'bg-primary' : 'bg-white'}`}>
                                {siteSurveyRequest === 'online' && <span className="h-3 w-3 rounded-full bg-white"></span>}
                            </span>
                            Online
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="offline"
                            name="siteSurveyRequest"
                            value="offline"
                            className="hidden"
                            checked={siteSurveyRequest === 'offline'}
                            onChange={handleSiteSurveyChange}
                        />
                        <label
                            htmlFor="offline"
                            className={`flex items-center cursor-pointer relative gap-2`}
                        >
                            <span className={`h-5 w-5 border-2 border-gray-300 rounded-full flex items-center justify-center ${siteSurveyRequest === 'offline' ? 'bg-primary' : 'bg-white'}`}>
                                {siteSurveyRequest === 'offline' && <span className="h-3 w-3 rounded-full bg-white"></span>}
                            </span>
                            Offline
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="">
                    <label htmlFor="siteSurveyDate" className="block font-semibold mb-2">Site Survey Date</label>
                    <input
                        type="date"
                        id="siteSurveyDate"
                        className="w-full border-2 border-gray-300 rounded py-2 px-7"
                        value={siteSurveyDate}
                        onChange={handleSiteSurveyDateChange}
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="installationDate" className="block font-semibold mb-2">Installation Date</label>
                    <input
                        type="date"
                        id="installationDate"
                        className="w-1/5 border-2 border-gray-300 rounded py-2 px-4"
                        value={installationDate}
                        onChange={handleInstallationDateChange}
                    />
                </div>
            </div>
            <div className='flex gap-4'>
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
                    <option value="Pharmacies">Pharmacies</option>
                    <option value="cafe/Restro Bar">Cafe/Restro Bar</option>
                    <option value="spa">Spa</option>
                    <option value="coaching_center">Coaching Center</option>
                    <option value="school">School</option>
                    <option value="salon">Salon</option>
                    <option value="retail_supermarket">Retail Supermarket</option>
                    <option value="Independent_Shop">Independent Shop</option>
                    <option value="hotel">Hotel</option>
                    <option value="laundry">Laundry</option>
                    <option value="College">College</option>
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="Source" className="block font-semibold mb-2">Source of Lead</label>
                <select
                    id="Source"
                    value={source}
                    onChange={handleSourceChange}
                    className="w-full border-2 border-gray-300 rounded py-2 px-4"
                >
                    <option value="" disabled>Select a type</option>
                    <option value="Cold Visit">Cold Visit</option>
                    <option value="Employee Referral">Employee Referral</option>
                    <option value="Customer Referral">Customer Referral</option>
                </select>
            </div>
            </div>
        </div>
    );
}