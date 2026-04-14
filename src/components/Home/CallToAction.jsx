import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="py-20 bg-[var(--color-surface-muted)]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-lg opacity-20 blur-lg"></div>
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                alt="Students learning"
                                className="relative rounded-lg shadow-2xl w-full object-cover h-[400px]"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)] shadow-xl max-w-xs hidden lg:block">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-surface-muted)] overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="font-bold text-[var(--color-text-primary)]">500+</span>
                                </div>
                                <p className="text-sm text-[var(--color-text-secondary)] font-medium">New students joined this week to find their perfect tutor.</p>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 md:order-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600 mb-2 block">Join the Community</span>
                        <h2 className="text-4xl font-extrabold text-[var(--color-text-primary)] mb-6 leading-tight">
                            Ready to Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Academic Journey?</span>
                        </h2>
                        <p className="text-[var(--color-text-secondary)] text-lg mb-8 leading-relaxed">
                            Whether you are a student looking for guidance or a tutor ready to share your knowledge, we provide the platform to make it happen. Secure, verified, and easy to use.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link to="/register" className="btn-quiet-primary px-8 py-4 text-base">
                                Get Started Today
                            </Link>
                            <Link to="/about" className="btn-quiet-secondary px-8 py-4 text-base">
                                Learn More
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center gap-8 text-gray-400 grayscale opacity-60">
                            {/* Simple partner logos/text */}
                            <span className="font-black text-xl">UDEMY</span>
                            <span className="font-black text-xl">COURSERA</span>
                            <span className="font-black text-xl">edX</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
