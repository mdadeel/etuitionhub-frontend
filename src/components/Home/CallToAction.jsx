import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="py-12 bg-slate-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-slate-800 rounded-2xl p-10 text-center">
                    <h2 className="text-2xl font-semibold text-white mb-3">
                        Ready to get started?
                    </h2>
                    <p className="text-slate-300 mb-8 max-w-md mx-auto">
                        Find the right tutor for your needs
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Account
                        </Link>
                        <Link
                            to="/tutors"
                            className="px-8 py-3 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors"
                        >
                            Browse Tutors
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;