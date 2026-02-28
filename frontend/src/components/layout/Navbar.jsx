import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="glass-panel sticky top-0 z-50 flex items-center justify-between px-6 py-4 mb-6 shadow-sm">
            <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold gradient-text tracking-tight">AI Placement Pro</Link>
            </div>
            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        <div className="flex items-center gap-2 text-gray-700">
                            <User size={18} />
                            <span className="font-medium text-sm">{user.name}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all cursor-pointer">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
