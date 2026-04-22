import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";
import { AppleBadge, AppleCard, AppleInput } from "../shared/AppleUI";

const Newsletter = () => {
    return (
        <section className="py-40 bg-white dark:bg-apple-gray-950 overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                <AppleCard className="relative overflow-hidden p-12 md:p-24 border-none bg-apple-gray-50 dark:bg-apple-gray-900" data-aos="zoom-in">
                    {/* Subtle Ambient Background */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
                    
                    <div className="relative z-10 max-w-2xl">
                        <AppleBadge variant="primary" className="mb-8">Newsletter</AppleBadge>
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[0.95] mb-10">
                            Stay in the loop. <br />
                            <span className="text-black/20 dark:text-white/20">Never miss a beat.</span>
                        </h2>
                        <p className="text-xl text-black/50 dark:text-white/50 mb-12 leading-relaxed tracking-tight font-medium">
                            Get the latest tutor profiles, tuition opportunities, and educational insights delivered directly to your inbox.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-4 max-w-xl" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative flex-grow">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 dark:text-white/20" />
                                <AppleInput
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="h-16 pl-14 pr-6"
                                    required
                                />
                            </div>
                            <Button className="h-16 px-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90 transition-all active:scale-[0.95] group">
                                Subscribe <Send size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Button>
                        </form>
                    </div>
                </AppleCard>
            </div>
        </section>
    );
};

export default Newsletter;
