/**
 * About Page - Platform information and mission statement
 */
import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-6">About e-tuitionBD</h1>

            <div className="prose lg:prose-xl">
                <p>e-tuitionBD is Bangladesh's premier online tuition platform connecting students with qualified tutors across the country.</p>

                <h2 className="mt-8">Our Mission</h2>
                <p>We aim to make quality education accessible to everyone, regardless of location or background.</p>

                <h2>What We Offer</h2>
                <ul>
                    <li>Verified tutors with proven track records</li>
                    <li>All subjects covered from primary to university level</li>
                    <li>Flexible scheduling to fit your lifestyle</li>
                    <li>Home tuition support across Bangladesh</li>
                </ul>
            </div>
        </div>
    );
};

export default About;
