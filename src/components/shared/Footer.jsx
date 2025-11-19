// footer component - page er niche thakbe
// about, links, contact info sob ekhane ase
// TODO: newsletter signup form add korbo maybe
import {Link,useLocation} from 'react-router-dom'
import {FaFacebook,FaLinkedin,FaYoutube} from 'react-icons/fa'
import {FaXTwitter} from 'react-icons/fa6' // X logo use kortesi
import {AiOutlineMail,AiOutlinePhone} from "react-icons/ai";
import {BiCurrentLocation} from "react-icons/bi";

// arrow function define kortesi
const Footer=()=>{
    // footer show korbo kina check
    const allowedPath=true;
    // const[allowedPath,setAllowedPath]=useState(true);
    // const pathname=useLocation();

    // NOTE: dashboard e footer hide korbo maybe?
    // useEffect(()=>{
    //     pathname.includes('/dashboard')?setAllowedPath(false):setAllowedPath(true);
    // },[pathname]);

    return (
        <>
            {allowedPath && (
                <footer className="bg-teal-600 text-slate-100 mt-8 lg:mt-32">
                    <div className="footer p-8 pb-4 md:pt-12 md:pb-8 max-w-7xl mx-auto grid gap-8 lg:gap-18 lg:grid-cols-5">
                        {/* About section - maybe add logo here too */}
                        <div className="col-span-2">
                            <Link to="/" className="flex gap-3 items-center text-3xl text-slate-50 font-bold">
                                <span className='flex items-center banner-highlighted-text !text-2xl md:!text-3xl'>e-tuitionBD</span>
                            </Link>
                            <p className="text-justify mt-2 mb-2">
                                Your trusted platform for connecting students with qualified tutors.
                                Find the perfect tutor for home tuition across Bangladesh.
                            </p>
                            {/* <p className='text-justify mb-2'>
                                Open New Horizons: Immerse Yourself in the Art of Language at EduMentor – Where Fluency Fuels Boundless Connections!
                            </p> */}
                            <header>
                                <h1 className='text-xl mb-2 underline underline-offset-2'>Get in touch with us</h1>
                            </header>
                            <div className="flex gap-4">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-tip="Facebook" className="tooltip tooltip-bottom cursor-pointer transition duration-200 transform hover:-translate-y-2 border rounded-full p-2">
                                    <FaFacebook className="text-2xl" />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" data-tip="Twitter" className="tooltip tooltip-bottom cursor-pointer transition duration-200 transform hover:-translate-y-2 border rounded-full p-2">
                                    <FaXTwitter className="text-2xl" /> {/* X logo not Twitter bird */}
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" data-tip="YouTube" className="tooltip tooltip-bottom cursor-pointer transition duration-200 transform hover:-translate-y-2 border rounded-full p-2">
                                    <FaYoutube className="text-2xl" />
                                </a>
                            </div>
                        </div>

                        {/* About Us - TODO: add more links */}
                        <div className='col-span-1 md:ml-8'>
                            <span className="footer-title text-lg">About Us</span>
                            <Link to="/contact" className="link link-hover">Contact</Link>
                            <Link to="/about" className="link link-hover">About Us</Link>
                        </div>

                        {/* Quick Links */}
                        <div className='col-span-1'>
                            <span className="footer-title text-lg">Quick Links</span>
                            <Link to="/" className="link link-hover">Home</Link>
                            <Link to="/tutors" className="link link-hover">Tutors</Link>
                            <Link to="/tuitions" className="link link-hover">Tuitions</Link>
                        </div>

                        {/* Contact Info - using placeholder phone for now */}
                        <div className='col-span-2'>
                            <span className="footer-title text-lg">CONTACT</span>
                            <p className='mb-2 text-slate-300'>Contact us via phone, email or visit us in our Head Office.</p>
                            <p className='flex gap-2 items-center font-normal'>
                                <BiCurrentLocation className='text-lg text-slate-100' />
                                <span className='text-slate-300'>Gulshan, Dhaka, Bangladesh</span>
                            </p>
                            <p className='flex gap-2 items-center font-normal mt-1'>
                                <AiOutlineMail className='text-lg text-slate-100' />
                                <span className='text-slate-300'>info@e-tuitionbd.com</span>
                            </p>
                            <p className='flex gap-2 items-center font-normal mt-1'>
                                <AiOutlinePhone className='text-lg text-slate-100' />
                                <span className='text-slate-300'>+880 1XXX-XXXXXX</span>
                            </p>
                        </div>
                    </div>

                    {/* Copyright - keeping it simple */}
                    <div className="text-sm lg:text-base mx-auto mt-8 py-6 border-t-2 border-teal-500 flex flex-col gap-2 justify-center items-center">
                        <p className='text-center px-16'>Copyright © {new Date().getFullYear()} e-tuitionBD. All Rights Reserved.</p>
                    </div>
                </footer>
            )}
        </>
    )
}

export default Footer
