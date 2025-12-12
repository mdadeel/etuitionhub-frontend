// 404 page comp
import { Link } from "react-router-dom"
let NotFound = () => {
    console.log('404 page')
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl mb-6">Page not found</p>


                <Link to="/" className="btn bg-teal-600 text-white hover:bg-teal-700 border-none">
                    Go Home
                </Link>
            </div>
        </div>
    )
}

export default NotFound
