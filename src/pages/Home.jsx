import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HomeBanner from '../components/Home/HomeBanner';
import WhyChooseUs from '../components/Home/WhyChooseUs';
import PopularTutors from '../components/Home/PopularTutors';
import PoruaTeaser from '../components/Home/PoruaTeaser';
import Statistics from '../components/Home/Statistics';
import Testimonials from "../components/Home/Testimonials";
import FeaturedCategories from '../components/Home/FeaturedCategories';
import FAQ from '../components/Home/FAQ';
import CallToAction from '@/components/Home/CallToAction';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import FinalTrustStrip from '@/components/Home/FinalTrustStrip';
import SEO from '../components/shared/SEO';
import { Helmet } from 'react-helmet-async';
import {
    organizationJsonLd,
    webSiteJsonLd,
    serializeJsonLd,
} from '../lib/jsonLd';
import { trackEvent, trackPageView } from '../services/analytics';
import SectionDivider from '../components/Home/illustrations/SectionDivider';

const Home = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    useEffect(() => { trackPageView('/'); }, []);
    return (
        <div className="bg-background">
            <SEO
                title="Find Private Tutors in Bangladesh | Home Tuition – eTuitionBD"
                description="Book verified private tutors in Dhaka, Chattogram & across Bangladesh. No agent fees. Direct contact. Browse 2,500+ tutors by subject & area — free to join."
                keywords="tutor, online tutor, home tutor, bangladesh tuition, e-tuitionBD, find tutors, home tuition dhaka"
            />
            <Helmet>
                <script type="application/ld+json">
                    {serializeJsonLd(organizationJsonLd()).__html}
                </script>
                <script type="application/ld+json">
                    {serializeJsonLd(webSiteJsonLd()).__html}
                </script>
            </Helmet>
            <HomeBanner />
            <FeaturedCategories />
            <PopularTutors />
            <SectionDivider variant="minimal-wave" />
            <WhyChooseUs />
            <PoruaTeaser />
            <Statistics />
            <SectionDivider variant="book-edge" />
            <Testimonials />
            <FAQ />
            <CallToAction />
            
            {!user && (
              <section className="bg-muted/40 border-y border-border/30">
                <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t('home.become_tutor_title')}</p>
                    <p className="text-xs text-muted-foreground">{t('home.become_tutor_desc')}</p>
                  </div>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shrink-0"
                    onClick={() => trackEvent('home_become_tutor', 'apply_now')}
                  >
                    {t('home.become_tutor_btn')} →
                  </Link>
                </div>
              </section>
            )}
            <FinalTrustStrip />
        </div>
    );
};

export default Home;
