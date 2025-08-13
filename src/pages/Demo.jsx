
import { Link } from 'react-router'
import Scene from '../components/Scene'

export default function Demo() {
    return (
        <div className="w-full h-screen relative">

            <Scene />

            {/* Back button */}
            <Link
                to="/"
                className="absolute top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
                ← Back to Home
            </Link>
        </div>
    )
}
