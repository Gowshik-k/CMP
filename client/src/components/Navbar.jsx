import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
    const location = useLocation();
    
    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        window.location.href = '/';
    };

    const handleHomeClick = (e) => {
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#1e40af] flex items-center justify-center text-white font-bold text-lg">
                            U
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2563eb] to-[#1e40af]">
                            UniversityConf
                        </span>
                    </Link>
                </div>
                
                <div className="hidden md:flex items-center gap-8">
                    <Link 
                        to="/" 
                        onClick={handleHomeClick}
                        className={`font-medium transition-colors ${isActive('/') ? 'text-blue-600' : 'text-zinc-600 hover:text-blue-600'}`}
                    >
                        Home
                    </Link>
                    <a href="/#conferences" className="text-zinc-600 hover:text-blue-600 font-medium transition-colors">Conferences</a>
                    <a href="/#about" className="text-zinc-600 hover:text-blue-600 font-medium transition-colors">About Us</a>
                    {user?.role === 'Admin' && (
                        <Link 
                            to="/admin" 
                            className={`font-bold transition-colors ${isActive('/admin') ? 'text-blue-600' : 'text-zinc-500 hover:text-blue-600'}`}
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {!user ? (
                        <>
                            <Link to="/login" className="hidden md:block text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                Log In
                            </Link>
                            <Link to="/register" className="bg-blue-600 text-white py-2 px-6 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-all">
                                Register Now
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-zinc-600">Hi, {user.username}</span>
                            <button 
                                onClick={handleLogout}
                                className="text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
