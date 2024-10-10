import React, { useState } from 'react';

export default function SiteSurvey({ onSiteSurveyChange }) {
    const [siteSurveyData, setSiteSurveyData] = useState({
        siteSurveyRequest: 'online',
        siteSurveyDate: '',
        installationDate: '',
        businessType: '',
        source: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSiteSurveyData(prevData => ({
            ...prevData,
            [name]: value
        }));
        onSiteSurveyChange({
            ...siteSurveyData,
            [name]: value
        });
    };

    return (
        <div className="bg-white shadow-md rounded-xl border-2 p-6">
            <h1 className="font-medium text-lg mb-6">Site Survey Details</h1>
            
            <div className="flex items-center mb-6">
                <label className="font-semibold mr-4">Type of Site Survey:</label>
                <div className="flex">
                    {['online', 'offline'].map(type => (
                        <div key={type} className="flex items-center mr-4">
                            <input
                                type="radio"
                                id={type}
                                name="siteSurveyRequest"
                                value={type}
                                className="hidden"
                                checked={siteSurveyData.siteSurveyRequest === type}
                                onChange={handleInputChange}
                            />
                            <label
                                htmlFor={type}
                                className={`flex items-center cursor-pointer relative gap-2`}
                            >
                                <span className={`h-5 w-5 border-2 border-gray-300 rounded-full flex items-center justify-center ${siteSurveyData.siteSurveyRequest === type ? 'bg-primary' : 'bg-white'}`}>
                                    {siteSurveyData.siteSurveyRequest === type && <span className="h-3 w-3 rounded-full bg-white"></span>}
                                </span>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="">
                    <label htmlFor="siteSurveyDate" className="block font-semibold mb-2">Site Survey Date</label>
                    <input
                        type="date"
                        id="siteSurveyDate"
                        name="siteSurveyDate"
                        className="w-full border-2 border-gray-300 rounded py-2 px-7"
                        value={siteSurveyData.siteSurveyDate}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="installationDate" className="block font-semibold mb-2">Installation Date</label>
                    <input
                        type="date"
                        id="installationDate"
                        name="installationDate"
                        className="w-1/5 border-2 border-gray-300 rounded py-2 px-4"
                        value={siteSurveyData.installationDate}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className='flex gap-4'>
                <div className="mb-4">
                    <label htmlFor="businessType" className="block font-semibold mb-2">Type of Business</label>
                    <select
                        id="businessType"
                        name="businessType"
                        value={siteSurveyData.businessType}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded py-2 px-4"
                    >
                        <option value="" disabled>Select a type</option>
                        {[
                            "Office Space", "PG/Co-living/Hostel", "Clinic", "Gym", "Factory",
                            "Pharmacies", "Cafe/Restro Bar", "Spa", "Coaching Center", "School",
                            "Salon", "Retail Supermarket", "Independent Shop", "Hotel", "Laundry", "College"
                        ].map(type => (
                            <option key={type} value={type.toLowerCase().replace(/ /g, '_')}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="source" className="block font-semibold mb-2">Source of Lead</label>
                    <select
                        id="source"
                        name="source"
                        value={siteSurveyData.source}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded py-2 px-4"
                    >
                        <option value="" disabled>Select a type</option>
                        {["Cold Visit", "Employee Referral", "Customer Referral"].map(source => (
                            <option key={source} value={source}>{source}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}