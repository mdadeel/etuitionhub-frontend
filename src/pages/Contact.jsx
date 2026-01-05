/**
 * Contact Page - Contact form for user inquiries
 */
import React from 'react';
import toast from 'react-hot-toast';

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Communication synchronized with support infrastructure.');
    };

    return (
        <div className="fade-up container mx-auto px-8 py-20 lg:px-12 max-w-4xl">
            <header className="mb-16 border-b border-gray-200 pb-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-4 block">Communication Interface</span>
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tighter">Support Infrastructure</h1>
                <p className="mt-6 text-lg text-gray-600 font-medium leading-relaxed max-w-2xl italic">
                    Direct access to platform operations and resolution protocols.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                <div className="md:col-span-1 space-y-12">
                    <section>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-6 pb-2 border-b border-gray-50">Operational Hub</h2>
                        <p className="text-xs font-bold text-gray-900 uppercase tracking-widest leading-loose">
                            Dhaka Operations Center<br />
                            Bangladesh Regional Node<br />
                            <span className="text-gray-400 mt-4 block">support@e-tuitionbd.com</span>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-6 pb-2 border-b border-gray-50">Response Protocol</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                            Standard response latency:<br />
                            24 - 48 operational hours.
                        </p>
                    </section>
                </div>

                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-gray-50 border border-gray-100 rounded-sm">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Origin Identity</label>
                                <input type="text" className="input-quiet w-full bg-white" placeholder="Full name or organization" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Operational Email</label>
                                <input type="email" className="input-quiet w-full bg-white" placeholder="email@example.com" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Communication Payload</label>
                                <textarea className="textarea-quiet w-full bg-white h-32 resize-none" placeholder="Detail your inquiry or issue..." required></textarea>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="btn-quiet-primary w-full py-4 text-[10px] font-extrabold uppercase tracking-[0.2em]">
                                Transmit Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
