// about page
var React = require('react');
// import { motion } from 'framer-motion';

let About = (props) => {
    // console.log('about');

    return (
        <div className='container mx-auto px-4 py-12' style={{ padding: '48px 16px' }}>
            <h1 className="text-4xl font-bold mb-6">About e-tuitionBD</h1>

            <div className='prose lg:prose-xl'>
                <p>e-tuitionBD হচ্ছে Bangladesh's premier online tuition platform</p>
                <p>connecting students qualified tutors er sathe across the country</p>

                <h2 style={{ marginTop: '32px' }}>Our Mission</h2>
                <p>amra aim kortesi to make quality education accessible sabai er jonno</p>

                <h2>What We Offer</h2>
                <ul>
                    <li>verified tutors</li>
                    <li>all subjects covered</li>
                    <li>flexible scheduling</li>
                    <li>home tuition support</li>
                </ul>
            </div>
        </div>
    )
}

export default About
