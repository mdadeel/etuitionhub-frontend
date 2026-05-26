import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Calendar, Check } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, tutorId, tutorName }) {
    const { user, dbUser } = useAuth();
    const [step, setStep] = useState(1);
    const [availability, setAvailability] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        if (isOpen && tutorId) {
            const url = selectedDate 
                ? `/api/tutors/${tutorId}/availability?date=${selectedDate}`
                : `/api/tutors/${tutorId}/availability`;
            api.get(url)
                .then(res => setAvailability(res.data))
                .catch(err => console.error(err));
        }
    }, [isOpen, tutorId, selectedDate]);

    const handleConfirm = async (method) => {
        try {
            const bookingRes = await api.post('/api/bookings', {
                tutorId,
                tutorName,
                studentEmail: user?.email || dbUser?.email,
                subject: 'Trial Session',
                scheduledAt: selectedDate || new Date(),
                duration: 60,
                status: 'pending'
            });
            
            const bookingId = bookingRes.data._id || 'mock-id';
            
            const paymentRes = await api.post(`/api/payments/${method}/create`, {
                amount: 500,
                bookingId: bookingId,
                tutorName: tutorName
            });
            
            // 3. Redirect to the mock payment gateway URL
            if (paymentRes.data && (paymentRes.data.bkashURL || paymentRes.data.nagadURL)) {
                window.location.href = paymentRes.data.bkashURL || paymentRes.data.nagadURL;
            } else {
                setStep(3);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-card">
                <DialogHeader>
                    <DialogTitle>Book Session with {tutorName}</DialogTitle>
                    <DialogDescription>
                        Select an available time slot for your session.
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <div className="py-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Select Date</label>
                            <input 
                                type="date" 
                                value={selectedDate || ''}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setSelectedSlot(null);
                                }}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <p className="mb-2 font-medium text-sm text-foreground/80">Available Slots:</p>
                        {availability.length === 0 ? (
                            <p className="text-muted-foreground text-sm italic">No slots available right now.</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {availability.map((day, idx) => (
                                    day.slots.map((slot, sIdx) => (
                                        <Button 
                                            key={`${idx}-${sIdx}`}
                                            variant={selectedSlot === slot ? "default" : "outline"}
                                            onClick={() => {
                                                setSelectedSlot(slot);
                                            }}
                                            className="w-full justify-start text-xs font-normal"
                                        >
                                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                            {slot.startTime} - {slot.endTime}
                                        </Button>
                                    ))
                                ))}
                            </div>
                        )}
                        <div className="mt-6 flex justify-end">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg" onClick={() => setStep(2)} disabled={!selectedSlot}>Next Step</Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="py-4">
                        <p className="mb-4 text-sm text-muted-foreground">You have selected <span className="font-semibold text-foreground">{selectedSlot?.startTime} to {selectedSlot?.endTime}</span>. Choose your payment method to confirm:</p>
                        <div className="flex flex-col gap-3 mt-6">
                            <Button className="bg-[#E2136E] hover:bg-[#b00f55] text-white w-full" onClick={() => handleConfirm('bkash')}>
                                Pay with bKash
                            </Button>
                            <Button className="bg-[#EC1C24] hover:bg-[#ba151c] text-white w-full" onClick={() => handleConfirm('nagad')}>
                                Pay with Nagad
                            </Button>
                            <Button variant="ghost" onClick={() => setStep(1)} className="w-full mt-2">Back</Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="py-4 text-center">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Booking Confirmed!</h3>
                        <p className="text-sm text-muted-foreground mt-2">Your session has been successfully scheduled.</p>
                        <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={onClose}>Done</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}


