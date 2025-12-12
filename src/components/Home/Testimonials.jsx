// testimonials
var React = require('react');
// import { useEffect } from 'react';

const Testimonials = (props) => {
    var testimonials = [
        {
            name: 'Rahim Ahmed', role: 'Class 10 Student',
            text: "found amazing math tutor through e-tuitionBD. my grades improved!",
            image: 'https://i.pravatar.cc/150?img=1'
        },
        {
            name: "Fatima Khan", role: 'HSC Student', text: 'platform made it easy to find qualified physics tutor near amar home.',
            image: "https://i.pravatar.cc/150?img=2"
        },
        { name: 'Karim Hassan', role: "Parent", text: "finally trustworthy platform to find tutors for amar childrens. highly recommended!", image: 'https://i.pravatar.cc/150?img=3' }
    ];

    // console.log(testimonials);

    if (!testimonials || !testimonials.length) return null;

    return (
        <section className='py-16' data-aos="fade-up" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
            <div className="container mx-auto px-4">
                <h2 className='text-3xl font-bold text-center mb-2'>What Our Users Say</h2>
                <p className="text-center text-gray-600 mb-10">Testimonials from happy students</p>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {testimonials.map(function (t, idx) {
                        return <div key={idx} className="card bg-base-100 shadow-lg">
                            <div className='card-body'>
                                <p className="italic mb-4">"{t.text}"</p>
                                <div className='flex items-center gap-3'>
                                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <p className='font-semibold'>{t.name}</p>
                                        <p className="text-sm text-gray-500">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
