// components/AiAssistant/PremiumGate.jsx
// Hard block for Porua AI: non-premium users cannot dismiss this modal.
// Only exits are Go back and Request premium access (/contact).
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function PremiumGate() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const goBack = () => {
        if (window.history.length > 2) navigate(-1);
        else navigate('/dashboard');
    };

    return (
        <Dialog open>
            <DialogContent
                showCloseButton={false}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className="sm:max-w-sm text-center"
            >
                <DialogHeader className="items-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Crown size={22} />
                    </span>
                    <DialogTitle className="text-lg font-bold">
                        {t('premiumGate.title', 'Porua AI is for premium users')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('premiumGate.body', 'Chat with Porua AI, generate quizzes, lesson plans and more — upgrade to premium to unlock it all.')}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <Button onClick={() => navigate('/contact')}>
                        {t('premiumGate.upgrade', 'Request premium access')}
                    </Button>
                    <Button variant="outline" onClick={goBack}>
                        {t('premiumGate.back', 'Go back')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
