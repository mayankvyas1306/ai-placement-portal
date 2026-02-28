import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Code2, MessagesSquare, FileText, Calendar, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
    const { user } = useContext(AuthContext);

    const links = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { name: 'DSA Generator', icon: <Code2 size={20} />, path: '/dsa' },
        { name: 'Interview Prep', icon: <MessagesSquare size={20} />, path: '/interview' },
        { name: 'Resume Analyzer', icon: <FileText size={20} />, path: '/resume' },
        { name: 'Study Planner', icon: <Calendar size={20} />, path: '/planner' },
    ];

    if (user?.role === 'admin') {
        links.push({ name: 'Admin Panel', icon: <ShieldCheck size={20} />, path: '/admin' });
    }

    return (
        <div className="w-64 glass-panel min-h-[calc(100vh-80px)] rounded-xl mr-6 p-4 border-r border-gray-100 flex flex-col gap-2 shadow-sm">
            {links.map((link) => (
                <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                    }
                >
                    {link.icon}
                    {link.name}
                </NavLink>
            ))}
        </div>
    );
};

export default Sidebar;
