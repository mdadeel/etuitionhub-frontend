// why choose us
var React = require('react');
import { FaShieldAlt, FaMoneyBillWave, FaClock, FaStar } from 'react-icons/fa';
import { useState } from 'react';

function WhyChooseUs(props) {
    // features
    var features = [
        {
            icon: <FaShieldAlt className='text-3xl text-teal-600' />, title: "Verified Tutors",
            description: "All tutors are verified by admin before appearing on the platform"
        },
        {
            icon: <FaMoneyBillWave className="text-3xl text-teal-600" />, title: 'Affordable Rates',
            description: "find tutors within your budget. transparent pricing, no hidden fees"
        },
        {
            icon: <FaClock className='text-3xl text-teal-600' />,
            title: "Flexible Schedule", description: 'Choose tutors based on your available days and time kina'
        },
        { icon: <FaStar className="text-3xl text-teal-600" />, title: 'Quality Education', description: "Experienced tutors bhaiya bon ra ase" }
    ];

    // console.log(features.length);

    // check koro
    if (!features || !features.length) return null;

    return (
        <section className='py-16 bg-base-200' style={{ padding: '60px 0' }}>
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-2">Why Choose Us</h2>
                <p className='text-center text-gray-600 mb-10'>Benefits of using e-tuitionBD</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map(function (f, idx) {
                        return <div key={idx} className='bg-base-100 p-6 rounded-lg shadow-md text-center'>
                            <div className="mb-3 flex justify-center">{f.icon}</div>
                            <h3 className='font-semibold text-lg mb-2'>{f.title}</h3>
                            <p className="text-sm text-gray-600">{f.description}</p>
                        </div>
                    })}
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;
