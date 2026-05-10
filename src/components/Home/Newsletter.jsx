import { Mail } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Newsletter = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">
                        Get updates in your inbox
                    </h2>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        New tutor listings and learning tips, delivered weekly.
                    </p>

                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <div className="relative flex-1">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                type="email"
                                placeholder="Your email"
                                className="pl-11 h-12 rounded-lg bg-white border-slate-200"
                                required
                            />
                        </div>
                        <Button type="submit" className="h-12 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg">
                            Subscribe
                        </Button>
                    </form>
                    <p className="text-xs text-slate-500 mt-4">
                        No spam. Unsubscribe anytime.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;