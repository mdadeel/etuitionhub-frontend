// about page
let About = () => {
    console.log('about page')
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-6">About e-tuitionBD</h1>


            <div className="prose lg:prose-xl">
                <p>e-tuitionBD is Bangladesh's premier online tuition platform</p>
                <p>connecting students with qualified tutors across the country</p>

                <h2>Our Mission</h2>
                <p>We aim to make quality education accessible to everyone</p>

                <h2>What We Offer</h2>
                <ul>
                    <li>Verified tutors</li>
                    <li>All subjects covered</li>
                    <li>Flexible scheduling</li>
                    <li>Home tuition support</li>
                </ul>
            </div>
        </div>
    )
}

export default About
