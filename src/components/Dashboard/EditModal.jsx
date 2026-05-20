import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

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
            <DialogContent className="sm:max-w-[500px] bg-white border border-[rgba(15,23,46,0.12)] rounded-none p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="p-8 pb-0">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-1.5 bg-[#2563EB] rounded-none"></div>
                        <span className="text-[9px] font-heading font-black uppercase tracking-[0.25em] text-[#2563EB]">Edit Details</span>
                    </div>
                    <DialogTitle className="text-lg font-heading font-black tracking-tight text-[#111827] uppercase">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-[10px] font-bold text-[#5B6475] uppercase tracking-widest mt-1">
                        Please update the fields below
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        {fields.map(field => (
                            <div key={field.name} className="space-y-1.5">
                                {field.type === 'textarea' ? (
                                    <div className="space-y-1.5 w-full">
                                        <label className="text-[9px] font-heading font-black text-[#111827] uppercase tracking-widest ml-1">
                                            {field.label}
                                        </label>
                                        <textarea 
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="w-full min-h-[100px] bg-white border border-[rgba(15,23,46,0.12)] rounded-none focus:outline-none focus:border-[#2563EB] transition-all font-heading font-bold text-xs px-4 py-3 placeholder:text-[#5B6475]/40"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-1.5 w-full">
                                        <label className="text-[9px] font-heading font-black text-[#111827] uppercase tracking-widest ml-1">
                                            {field.label}
                                        </label>
                                        <input 
                                            type={field.type || 'text'}
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="w-full px-4 py-3 text-xs bg-white border border-[rgba(15,23,46,0.12)] rounded-none focus:outline-none focus:border-[#2563EB] transition-all font-heading font-bold placeholder:text-[#5B6475]/40"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 h-10 rounded-none text-[#5B6475] hover:text-[#111827] border border-[rgba(15,23,46,0.12)] hover:bg-[#EEF2F6] text-[9px] font-heading font-black uppercase tracking-widest transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="flex-1 h-10 rounded-none bg-[#2563EB] text-white hover:bg-[#1D4ED8] text-[9px] font-heading font-black uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditModal;
