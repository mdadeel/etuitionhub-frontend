import { useNavigate } from 'react-router-dom';
import { Star, MapPin, BookOpen, Clock, CheckCircle, Bookmark } from "lucide-react";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { memo, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const TutorCard = memo(({ tutor }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            api.get(`/api/bookmarks/check/${tutor._id}`)
                .then(res => setIsSaved(res.data.isSaved))
                .catch(() => {});
        }
    }, [user, tutor._id]);

    const handleBookmark = async (e) => {
        e.stopPropagation();
        if (!user) {
            toast.error('Please login to save tutors');
            return;
        }
        setSaving(true);
        try {
            if (isSaved) {
                await api.delete(`/api/bookmarks/${tutor._id}`);
                setIsSaved(false);
                toast.success('Removed from saved');
            } else {
                await api.post(`/api/bookmarks/${tutor._id}`);
                setIsSaved(true);
                toast.success('Tutor saved!');
            }
        } catch (error) {
            toast.error('Could not save tutor');
        }
        setSaving(false);
    };

    if (!tutor) return null;

    const { _id, displayName, photoURL, qualification, location, subjects = [], isVerified, availableDays = [] } = tutor;
    const rating = tutor.ratings || tutor.rating || 4.8;
    const salary = tutor.expectedSalary || 5000;
    const experience = tutor.experience || '1-2 years';

    const teachingStyles = [
        "Explains concepts visually",
        "Concept-based teaching",
        "Problem-solving approach",
        "Exam-oriented strategy",
        "Patient & step-by-step",
        "Focused on core fundamentals"
    ];
    const randomStyle = teachingStyles[Math.floor(Math.random() * teachingStyles.length)];

    return (
        <Card
            hover
            className="cursor-pointer h-full flex flex-col"
            onClick={() => navigate(`/tutor/${_id}`)}
        >
            <div className="p-4 flex-grow">
                <div className="flex items-start gap-3">
                    <Avatar 
                        src={photoURL} 
                        alt={displayName} 
                        size="md" 
                        verified={isVerified && _id !== 'tutor_001'} 
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h3 className="font-heading text-sm text-[#111827] tracking-tight truncate">{displayName}</h3>
                            <button
                                onClick={handleBookmark}
                                disabled={saving}
                                className="p-1 hover:bg-[#EEF2F6] rounded-md transition-colors"
                            >
                                <Bookmark 
                                    size={15} 
                                    className={isSaved ? "fill-[#2563EB] text-[#2563EB]" : "text-[#5B6475]"} 
                                />
                            </button>
                        </div>
                        <p className="text-[11px] text-[#5B6475]">{qualification || 'Experienced Tutor'}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[rgba(15,23,46,0.08)]">
                    {subjects.slice(0, 3).map((sub, i) => (
                        <Badge key={i} variant="subtle" size="xs" className="py-0.5 text-[10px]">
                            {sub}
                        </Badge>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-y-2 mt-3 pt-3 border-t border-[rgba(15,23,46,0.08)] text-[11px] text-[#5B6475]">
                    <span className="flex items-center gap-1.5">
                        <BookOpen size={12} className="text-[#2563EB]" />
                        <span>Exp {experience.split(' ')[0]}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Star size={12} className="fill-current text-amber-500" />
                        <span className="font-medium text-[#111827]">{rating.toFixed(1)}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-[#2563EB]" />
                        <span className="truncate">{(location || 'N/A').split(',')[0]}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-[#2563EB]" />
                        <span>Resp ~18m</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-[#F5F7FA] border-t border-[rgba(15,23,46,0.08)]">
                <div className="flex items-baseline">
                    <span className="text-base font-heading text-[#2563EB]">৳{salary.toLocaleString()}</span>
                    <span className="text-[10px] text-[#5B6475] ml-1">/mo</span>
                </div>
                <Button size="xs">
                    View
                </Button>
            </div>
        </Card>
    );
});

export default TutorCard;
