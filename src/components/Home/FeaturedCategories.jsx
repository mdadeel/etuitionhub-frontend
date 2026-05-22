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
        <section className="py-20 bg-card">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-heading text-foreground tracking-tight leading-[0.95] mb-4">Find your subject</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed font-body">From school preparation to university-level coaching</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat, idx) => (
                        <Link
                            key={cat.slug}
                            to={`/tutors?subject=${cat.slug}`}
                            className="block"
                        >
                            <Card hover className={`p-5 relative h-full ${cat.tag ? 'bg-background' : ''}`}>
                                {cat.tag && (
                                    <Badge variant="dark" size="xs" className="absolute -top-2 right-4">
                                        {cat.tag}
                                    </Badge>
                                )}

                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-lg border border-border">
                                        <cat.icon className="w-5 h-5 text-foreground" />
                                    </div>
                                    <span className="font-heading text-base text-foreground tracking-tight">{cat.label}</span>
                                </div>
                                <div className="text-sm text-muted-foreground">{cat.count} tutors</div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
