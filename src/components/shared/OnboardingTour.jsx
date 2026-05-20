import { Joyride, STATUS } from 'react-joyride';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const TOUR_STEPS = [
    {
        target: 'body',
        content: (
            <div>
                <h3 className="font-bold text-lg text-[#111827] mb-2">👋 Welcome to e-tuitionBD!</h3>
                <p className="text-[#5B6475] text-sm">Let us show you around in 30 seconds.</p>
            </div>
        ),
        placement: 'center',
        disableBeacon: true,
    },
    {
        target: '[data-tour="find-tutors"]',
        content: (
            <div>
                <h3 className="font-bold text-[#111827] mb-1">🔍 Find Tutors</h3>
                <p className="text-[#5B6475] text-sm">Browse hundreds of verified tutors. Filter by subject, location, price, and language.</p>
            </div>
        ),
        placement: 'bottom',
    },
    {
        target: '[data-tour="search-bar"]',
        content: (
            <div>
                <h3 className="font-bold text-[#111827] mb-1">🎯 Quick Search</h3>
                <p className="text-[#5B6475] text-sm">Search by tutor name, subject, or location instantly.</p>
            </div>
        ),
        placement: 'bottom',
    },
    {
        target: '[data-tour="lang-switcher"]',
        content: (
            <div>
                <h3 className="font-bold text-[#111827] mb-1">🌐 Language Switch</h3>
                <p className="text-[#5B6475] text-sm">Switch between English and Bengali at any time.</p>
            </div>
        ),
        placement: 'bottom',
    },
    {
        target: 'body',
        content: (
            <div>
                <h3 className="font-bold text-lg text-[#111827] mb-2">🚀 You are all set!</h3>
                <p className="text-[#5B6475] text-sm">Start by searching for a tutor, or browse the full list.</p>
            </div>
        ),
        placement: 'center',
    }
];

const OnboardingTour = () => {
    const { user, dbUser, loading, refreshUserFromDB } = useAuth();
    const [run, setRun] = useState(false);

    useEffect(() => {
        if (loading || !user || !dbUser) {
            setRun(false);
            return;
        }

        // Run ONLY if hasCompletedOnboarding is explicitly false
        if (dbUser.hasCompletedOnboarding === false) {
            // Small delay so the page has time to render
            const timer = setTimeout(() => setRun(true), 1500);
            return () => clearTimeout(timer);
        } else {
            setRun(false);
        }
    }, [user, dbUser, loading]);

    const handleJoyrideCallback = async ({ status }) => {
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRun(false);
            if (user && user.email) {
                try {
                    console.log('Onboarding complete, updating user profile in DB...');
                    await api.patch(`/api/users/by-email/${user.email}`, {
                        hasCompletedOnboarding: true
                    });
                    // Refresh context so dbUser changes to hasCompletedOnboarding: true
                    await refreshUserFromDB(user.email);
                } catch (error) {
                    console.error('Failed to update onboarding status in DB:', error);
                }
            }
        }
    };

    if (loading || !user || !dbUser) return null;

    return (
        <Joyride
            steps={TOUR_STEPS}
            run={run}
            continuous
            showSkipButton
            showProgress
            scrollToFirstStep
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: '#2563EB',
                    backgroundColor: '#ffffff',
                    textColor: '#111827',
                    zIndex: 10000,
                    arrowColor: '#ffffff',
                    overlayColor: 'rgba(0, 0, 0, 0.5)',
                },
                tooltip: {
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                },
                buttonNext: {
                    backgroundColor: '#2563EB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    padding: '8px 16px',
                },
                buttonBack: {
                    color: '#5B6475',
                    fontSize: '13px',
                },
                buttonSkip: {
                    color: '#5B6475',
                    fontSize: '12px',
                },
            }}
        />
    );
};

export default OnboardingTour;
