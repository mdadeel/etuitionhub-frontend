import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, Clock } from 'lucide-react';

const EditHistoryModal = ({ isOpen, onClose, message }) => {
    if (!message) return null;

    const history = message.editHistory || [];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-background border border-border shadow-2xl rounded-3xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <History size={16} />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">Edit History</h3>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-6">
                                {/* Current Version */}
                                <div className="relative pl-6 border-l-2 border-primary">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Current Version</span>
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Clock size={10} /> {new Date(message.updatedAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                        {message.text}
                                    </div>
                                </div>

                                {/* Previous Versions */}
                                {[...history].reverse().map((item, idx) => (
                                    <div key={idx} className="relative pl-6 border-l-2 border-border/50">
                                        <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-border ring-4 ring-background" />
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                                {idx === history.length - 1 ? 'Original' : `Edit #${history.length - idx - 1}`}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Clock size={10} /> {new Date(item.editedAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="p-3 bg-muted/30 rounded-2xl border border-border/50 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {item.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-border bg-muted/10 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 bg-foreground text-background font-bold text-sm rounded-full hover:opacity-90 transition-all active:scale-95"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditHistoryModal;
