import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { AppleButton, AppleInput } from '../shared/AppleUI';
import { Textarea } from "@/components/ui/textarea";

/**
 * Generic EditModal for Admin Dashboard
 * Handles dynamic fields and form state
 */
const EditModal = ({ 
    isOpen, 
    onClose, 
    title, 
    data, 
    fields, 
    onSave,
    isLoading = false
}) => {
    const [formData, setFormData] = useState({});

    // Initialize form data when data or fields change
    useEffect(() => {
        if (data) {
            const initialData = {};
            fields.forEach(field => {
                initialData[field.name] = data[field.name] || '';
            });
            setFormData(initialData);
        }
    }, [data, fields, isOpen]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-2xl border-border/50 rounded-3xl p-0 overflow-hidden">
                <DialogHeader className="p-8 pb-0">
                    <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                        {title}
                    </DialogTitle>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        Operational Integrity: Editing Active Node
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        {fields.map(field => (
                            <div key={field.name} className="space-y-1.5">
                                {field.type === 'textarea' ? (
                                    <div className="space-y-1.5 w-full">
                                        <label className="text-xs font-semibold text-muted-foreground ml-1">
                                            {field.label}
                                        </label>
                                        <Textarea 
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="min-h-[100px] bg-muted/50 border-none ring-1 ring-border focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all duration-200 px-4 py-3 rounded-xl text-sm"
                                        />
                                    </div>
                                ) : (
                                    <AppleInput 
                                        label={field.label}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        type={field.type || 'text'}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-3">
                        <AppleButton 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose}
                            className="flex-1 rounded-xl"
                        >
                            Cancel
                        </AppleButton>
                        <AppleButton 
                            type="submit" 
                            variant="primary"
                            isLoading={isLoading}
                            className="flex-1 rounded-xl"
                        >
                            Save Changes
                        </AppleButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditModal;
