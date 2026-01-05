// 404 page comp
import { Link } from "react-router-dom"
const NotFound = () => {
    return (
        <div className="fade-up min-h-[70vh] flex items-center justify-center p-8 bg-gray-50/30">
            <div className="text-center max-w-md">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-4 block italic">Address Resolution Failure</span>
                <h1 className="text-8xl font-black text-gray-900 tracking-tighter mb-4 opacity-5 group-hover:opacity-10 transition-opacity">404</h1>
                <p className="text-xl font-extrabold text-gray-900 tracking-tight mb-2 uppercase">Node Not Found</p>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest leading-relaxed mb-12 italic">
                    The requested path does not exist within the current system architecture.
                </p>

                <Link to="/" className="btn-quiet-primary px-12 py-4 text-[10px]">
                    Return to Root Origin
                </Link>
            </div>
        </div>
    );
};

export default NotFound
