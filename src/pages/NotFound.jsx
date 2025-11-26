// 404 - page paoa jaini
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary">404</h1>
                <p className="text-2xl mt-4 mb-8">Page Not Found</p>
                <Link to="/" className="btn btn-primary">Go Back Home</Link>
            </div>
        </div>
    );
};

export default NotFound;
