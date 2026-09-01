import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import api from '../services/api';
import SEO from '../components/shared/SEO';

const Contact = () => {
    const { t } = useTranslation();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/api/contact', formData);
            toast.success(t('contact.toast_success'));
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || t('contact.toast_error'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-background min-h-screen py-16 px-6">
            <SEO title={t('contact.seo_title')} description={t('contact.seo_desc')} />

            <div className="max-w-5xl mx-auto">
                <header className="mb-16 border-b border-border pb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                        {t('contact.title')}
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                        {t('contact.subtitle')}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Sidebar Info */}
                    <div className="md:col-span-4 space-y-12">
                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-primary" />
                                <h2 className="text-sm font-semibold text-foreground">{t('contact.info_title')}</h2>
                            </div>
                            <div className="pl-7 space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    {t('contact.info_location_desc')}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-primary">
                                    <Mail size={14} />
                                    <span>support@etuitionbd.com</span>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock size={18} className="text-primary" />
                                <h2 className="text-sm font-semibold text-foreground">{t('contact.info_hours')}</h2>
                            </div>
                            <div className="pl-7">
                                <p className="text-sm text-muted-foreground">
                                    {t('contact.info_hours_desc')}
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-8">
                        <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-background border border-border">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="contact-name" className="text-sm font-medium text-foreground">{t('contact.form_name')}</Label>
                                    <Input
                                        id="contact-name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder={t('contact.form_name_placeholder')}
                                        className="h-12 border-border bg-background"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contact-email" className="text-sm font-medium text-foreground">{t('contact.form_email')}</Label>
                                    <Input
                                        id="contact-email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder={t('contact.form_email_placeholder')}
                                        className="h-12 border-border bg-background"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact-message" className="text-sm font-medium text-foreground">{t('contact.form_message')}</Label>
                                <Textarea
                                    id="contact-message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={t('contact.form_message_placeholder')}
                                    className="min-h-[180px] border-border bg-background resize-none p-4 text-sm"
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={submitting} className="h-12 px-8 flex items-center gap-2">
                                    {submitting ? t('contact.form_sending') : t('contact.form_submit')} <Send size={16} />
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
