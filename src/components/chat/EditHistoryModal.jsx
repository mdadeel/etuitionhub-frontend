import { History, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const EditHistoryModal = ({ isOpen, onClose, message }) => {
    if (!message) return null;

    const history = message.editHistory || [];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <History size={16} />
                        </div>
                        Edit History
                    </DialogTitle>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-6">
                    {/* Current Version */}
                    <div className="relative pl-6 border-l-2 border-primary">
                        <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-primary ring-4 ring-background" />
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Current Version</span>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Clock size={10} /> {new Date(message.updatedAt).toLocaleString()}
                            </span>
                        </div>
                        <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                            {message.text}
                        </div>
                    </div>

                    {/* Previous Versions */}
                    {[...history].reverse().map((item, idx) => (
                        <div key={idx} className="relative pl-6 border-l-2 border-border/50">
                            <div className="absolute -left-[7px] top-0 size-3 rounded-full bg-border ring-4 ring-background" />
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {idx === history.length - 1 ? 'Original' : `Edit #${history.length - idx - 1}`}
                                </span>
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                    <Clock size={10} /> {new Date(item.editedAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg border border-border/50 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {item.text}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-2">
                    <Button variant="outline" onClick={onClose}>Done</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditHistoryModal;
