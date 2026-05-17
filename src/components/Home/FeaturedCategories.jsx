import { Calculator, Languages, Palette, Code, BookOpen, GraduationCap, Award } from "lucide-react";
import { Link } from 'react-router-dom';
import { Card, Badge } from '@/components/ui';

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
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-heading text-[#111827] tracking-tight leading-[0.95] mb-4">Find your subject</h2>
                    <p className="text-lg text-[#5B6475] leading-relaxed font-body">From school preparation to university-level coaching</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat, idx) => (
                        <Link
                            key={cat.slug}
                            to={`/tutors?subject=${cat.slug}`}
                            className="block"
                        >
                            <Card hover className={`p-5 relative h-full ${cat.tag ? 'bg-[#F5F7FA]' : ''}`}>
                                {cat.tag && (
                                    <Badge variant="dark" size="xs" className="absolute -top-2 right-4">
                                        {cat.tag}
                                    </Badge>
                                )}

                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 flex items-center justify-center bg-[#EEF2F6] rounded-lg border border-[rgba(15,23,46,0.08)]">
                                        <cat.icon className="w-5 h-5 text-[#111827]" />
                                    </div>
                                    <span className="font-heading text-base text-[#111827] tracking-tight">{cat.label}</span>
                                </div>
                                <div className="text-sm text-[#5B6475]">{cat.count} tutors</div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
