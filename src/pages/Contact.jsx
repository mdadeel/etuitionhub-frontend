// contact page
import toast from 'react-hot-toast'
let Contact = () => {
    console.log('contact page')

    let handleSubmit = (e) => {
        e.preventDefault()
        // toast.success('Message sent')
        toast.success('Message pathaise!')
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

            <div className="max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">Name</label>
                        <input type="text" className="input input-bordered" required />
                    </div>


                    <div className="form-control">
                        <label className="label">Email</label>
                        <input type="email" className="input input-bordered" required />
                    </div>
                    <div className="form-control">
                        <label className="label">Message</label>
// <textarea className="textarea textarea-bordered h-24"></textarea>
                        <textarea className="textarea textarea-bordered h-24" required></textarea>
                    </div>
                    <button type="submit" className="btn bg-teal-600 text-white hover:bg-teal-700 w-full border-none">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Contact
