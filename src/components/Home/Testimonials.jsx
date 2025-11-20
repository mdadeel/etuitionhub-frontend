// Testimonials - happy students er feedback
// TODO: backend theke fetch korbo later, hardcoded for now
// import {useState,useEffect} from 'react';  
// import axios from 'axios';  // might use later

const Testimonials = () => {
    // hardcoded - DB theke anbo maybe later
    // const[reviews,setReviews]=useState([]);
    let testimonials = [
        {
            name: "Rahim Ahmed",
            role: "Class 10 Student",
            text: "Found an amazing math tutor through e-tuitionBD. My grades improved significantly!",
            image: "https://i.pravatar.cc/150?img=1"
        },
        {
            name: "Fatima Khan",
            role: "HSC Student",
            text: "The platform made it so easy to find a qualified physics tutor near my home.",
            image: "https://i.pravatar.cc/150?img=2"
        },
        {
            name: "Karim Hassan",
            role: "Parent",
            text: "Finally a trustworthy platform to find tutors for my children. Highly recommended!",
            image: "https://i.pravatar.cc/150?img=3"
        }
    ];

    return (
        <section className="py-16" data-aos="fade-up">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-2">What Our Users Say</h2>
                <p className="text-center text-gray-600 mb-10">Testimonials from happy students</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((item, index) => (
                        <div key={index} className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                <p className="italic mb-4">"{item.text}"</p>
                                <div className="flex items-center gap-3">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
