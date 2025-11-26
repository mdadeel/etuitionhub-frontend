// Contact page - message pathano jabe
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Contact = () => {
    let { register, handleSubmit, reset } = useForm();

    const onSubmit = (data) => {
        console.log('Contact form:', data); // debug
        // TODO: backend e message save korbo later
        toast.success('Message patheche! We will get back to you soon.')
        reset();
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
                    <p className="mb-4">Have questions? We'd love to hear from you.</p>
                    <p><strong>Email:</strong> info@e-tuitionbd.com</p>
                    <p><strong>Phone:</strong> +880 1XXX-XXXXXX</p>
                    <p><strong>Address:</strong> Dhaka, Bangladesh</p>
                </div>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input type="text" placeholder="Your Name" className="input input-bordered w-full" {...register('name', { required: true })} />
                        <input type="email" placeholder="Your Email" className="input input-bordered w-full" {...register('email', { required: true })} />
                        <textarea placeholder="Your Message" className="textarea textarea-bordered w-full h-32" {...register('message', { required: true })}></textarea>
                        <button type="submit" className="btn btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
