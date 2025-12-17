// why choose us section
import { FaShieldAlt, FaMoneyBillWave, FaClock, FaStar } from 'react-icons/fa';

// features data - could move to json later
var features = [
    {
        icon: <FaShieldAlt className="text-3xl text-teal-600" />, title: "Verified Tutors",
        description: "All tutors are verified by admin before appearing on the platform"
    },
    {
        icon: <FaMoneyBillWave className="text-3xl text-teal-600" />, title: "Affordable Rates",
        description: "Find tutors within your budget. Transparent pricing, no hidden fees"
    },
    { icon: <FaClock className="text-3xl text-teal-600" />, title: "Flexible Schedule", description: "Choose tutors based on your available days and time slots" },
    {
        icon: <FaStar className="text-3xl text-teal-600" />,
        title: "Quality Education", description: "Experienced and qualified tutors to help you succeed"
    }
];

function WhyChooseUs() {
    console.log('why choose us rendered'); // debug - remove later

    return (
        <section className="py-16 bg-base-200">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-2">Why Choose Us</h2>
                <p className="text-center text-gray-600 mb-10">Benefits of using e-tuitionBD</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-base-100 p-6 rounded-lg shadow-md text-center">
                            <div className="mb-3 flex justify-center">{feature.icon}</div>
                            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;
