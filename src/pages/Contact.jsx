// contact form
import React from 'react'
import toast from 'react-hot-toast'
// import { useState } from 'react';

let Contact = (props) => {
    // console.log('contact');

    var handleSubmit = e => {
        e.preventDefault()
        toast.success('Message pathaise!')
    }

    return (
        <div className='container mx-auto px-4 py-12' style={{ paddingTop: '48px', paddingBottom: '48px' }}>
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

            <div className='max-w-lg mx-auto'>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className='form-control'>
                        <label className="label">Name</label>
                        <input type='text' className="input input-bordered" required />
                    </div>

                    <div className="form-control">
                        <label className='label'>Email</label>
                        <input type="email" className='input input-bordered' required />
                    </div>

                    <div className='form-control'>
                        <label className="label">Message</label>
                        <textarea className='textarea textarea-bordered h-24' required></textarea>
                    </div>

                    <button type='submit' className="btn bg-teal-600 text-white hover:bg-teal-700 w-full border-none">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Contact
