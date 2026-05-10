import { Calculator, Languages, Palette, Code, BookOpen, GraduationCap, Award } from "lucide-react";
import { Link } from 'react-router-dom';

const categories = [
    { icon: GraduationCap, label: "SSC", count: "850+", slug: "ssc", tag: "Most popular" },
    { icon: BookOpen, label: "HSC", count: "620+", slug: "hsc", tag: "Trending" },
    { icon: Languages, label: "IELTS", count: "340+", slug: "ielts", tag: null },
    { icon: Languages, label: "English", count: "480+", slug: "english-medium", tag: null },
    { icon: Calculator, label: "University", count: "480+", slug: "university", tag: "High demand" },
    { icon: Code, label: "Programming", count: "290+", slug: "programming", tag: null },
    { icon: Award, label: "Admission", count: "310+", slug: "admission", tag: null },
    { icon: Palette, label: "Arts", count: "180+", slug: "arts", tag: null },
];

const FeaturedCategories = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">Find your subject</h2>
                    <p className="text-slate-600">From school preparation to university-level coaching</p>
                </div>

                {/* More editorial - varied sizes, some with extra info */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {categories.map((cat, idx) => (
                        <Link
                            key={cat.slug}
                            to={`/tutors?subject=${cat.slug}`}
                            className={`relative p-5 rounded-xl border transition-all hover:border-blue-400 hover:shadow-md ${
                                cat.tag ? 'border-slate-300 bg-slate-50' : 'border-slate-200 bg-white'
                            }`}
                        >
                            {/* Tag for some items */}
                            {cat.tag && (
                                <span className="absolute -top-2 right-3 px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                                    {cat.tag}
                                </span>
                            )}

                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-lg">
                                    <cat.icon className="w-5 h-5 text-slate-600" />
                                </div>
                                <span className="font-medium text-slate-900">{cat.label}</span>
                            </div>
                            <div className="text-sm text-slate-600">{cat.count} tutors</div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;