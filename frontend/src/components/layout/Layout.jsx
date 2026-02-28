import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />
            <div className="flex px-6 pb-6 max-w-7xl mx-auto">
                <Sidebar />
                <main className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[calc(100vh-100px)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
