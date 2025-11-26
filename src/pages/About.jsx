// About page - e-tuitionBD er details
const About = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">About e-tuitionBD</h1>
            <div className="prose max-w-none">
                <p className="mb-4">
                    e-tuitionBD is your trusted platform for finding qualified home tutors across Bangladesh.
                    We connect students with experienced tutors for personalized learning.
                </p>
                <h2 className="text-xl font-semibold mt-6 mb-3">Our Mission</h2>
                <p>To make quality education accessible to every student through personalized home tuition.</p>
                <h2 className="text-xl font-semibold mt-6 mb-3">FAQ</h2>
                <div className="collapse collapse-arrow bg-base-200 mb-2">
                    <input type="radio" name="faq" defaultChecked />
                    <div className="collapse-title font-medium">How do I find a tutor?</div>
                    <div className="collapse-content"><p>Browse our tutors page, filter by subject/location, and contact your preferred tutor.</p></div>
                </div>
                <div className="collapse collapse-arrow bg-base-200 mb-2">
                    <input type="radio" name="faq" />
                    <div className="collapse-title font-medium">How do I become a tutor?</div>
                    <div className="collapse-content"><p>Register as a tutor, complete your profile, and wait for admin verification.</p></div>
                </div>
            </div>
        </div>
    );
};

export default About;
