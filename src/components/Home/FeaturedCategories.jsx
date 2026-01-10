import {
    MdFunctions,
    MdScience,
    MdTranslate,
    MdBrush,
    MdComputer,
    MdBusinessCenter,
    MdMusicNote,
    MdPublic
} from 'react-icons/md';
import { Link } from 'react-router-dom';

const FeaturedCategories = () => {
    const categories = [
        { icon: MdFunctions, label: "Mathematics", count: "1,200+ Tutors", color: "bg-blue-50 text-blue-600" },
        { icon: MdScience, label: "Physics & Science", count: "850+ Tutors", color: "bg-purple-50 text-purple-600" },
        { icon: MdTranslate, label: "English & Languages", count: "2,000+ Tutors", color: "bg-pink-50 text-pink-600" },
        { icon: MdBrush, label: "Arts & Humanities", count: "450+ Tutors", color: "bg-orange-50 text-orange-600" },
        { icon: MdComputer, label: "ICT & Programming", count: "600+ Tutors", color: "bg-teal-50 text-teal-600" },
        { icon: MdBusinessCenter, label: "Business Studies", count: "500+ Tutors", color: "bg-indigo-50 text-indigo-600" },
        { icon: MdMusicNote, label: "Music & Dance", count: "120+ Tutors", color: "bg-red-50 text-red-600" },
        { icon: MdPublic, label: "Religious Studies", count: "300+ Tutors", color: "bg-green-50 text-green-600" },
    ];

    return (
        <section className="py-20 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">Explore</span>
                        <h2 className="text-3xl font-extrabold text-gray-900">Popular Categories</h2>
                    </div>
                    <Link to="/tuitions" className="btn-quiet-secondary">
                        View All Subjects
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat, idx) => (
                        <Link
                            to={`/tuitions?category=${cat.label}`}
                            key={idx}
                            className="bg-white p-6 rounded-lg border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                                <cat.icon className="text-2xl" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{cat.label}</h3>
                            <p className="text-xs text-gray-500 font-medium">{cat.count}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
