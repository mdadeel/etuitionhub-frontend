// testimonials section

var testimonials = [
    {
        name: 'Rahim Ahmed', role: 'Class 10 Student',
        text: "Found an amazing math tutor through e-tuitionBD. My grades improved significantly!",
        image: 'https://i.pravatar.cc/150?img=1'
    },
    {
        name: 'Fatima Khan', role: 'HSC Student', text: "The platform made it so easy to find a qualified physics tutor near my home.",
        image: 'https://i.pravatar.cc/150?img=2'
    },
    {
        name: 'Karim Hassan', role: 'Parent',
        text: "Finally a trustworthy platform to find tutors for my children. Highly recommended!",
        image: 'https://i.pravatar.cc/150?img=3'
    }
];

function Testimonials() {
    // console.log('testimonials rendered');
    return (
        <section className="py-20 bg-[var(--color-surface)]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-extrabold text-center mb-2 text-[var(--color-text-primary)]">What Our Users Say</h2>
                <p className="text-center text-[var(--color-text-secondary)] mb-12">Testimonials from happy students</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map(function (t, idx) {
                        return (
                            <div key={idx} className="bg-[var(--color-surface)] p-8 rounded-xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                                <p className="italic mb-6 text-[var(--color-text-primary)] leading-relaxed flex-grow">"{t.text}"</p>
                                <div className="flex items-center gap-4 border-t border-[var(--color-border)] pt-6 mt-auto">
                                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border-2 border-[var(--color-border)] object-cover" />
                                    <div>
                                        <p className="font-bold text-[var(--color-text-primary)] leading-tight">{t.name}</p>
                                        <p className="text-[var(--color-text-secondary)] text-xs font-medium uppercase tracking-wider mt-1">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
