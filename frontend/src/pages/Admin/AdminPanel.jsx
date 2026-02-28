import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { Users, Activity, BarChart3, Database } from 'lucide-react';

const AdminPanel = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    apiClient.get('/admin/stats'),
                    apiClient.get('/admin/users')
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
            } catch (error) {
                console.error('Failed to fetch admin data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-12 text-center text-gray-500">Loading admin data...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
                <p className="mt-2 text-gray-500">Platform statistics and user management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0"><Users size={24} /></div>
                    <div><p className="text-sm text-gray-500 font-medium">Total Users</p><h3 className="text-2xl font-bold text-gray-900">{stats?.users.total}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0"><Activity size={24} /></div>
                    <div><p className="text-sm text-gray-500 font-medium">Total AI Requests</p><h3 className="text-2xl font-bold text-gray-900">{stats?.aiRequests.total}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0"><Database size={24} /></div>
                    <div><p className="text-sm text-gray-500 font-medium">Students</p><h3 className="text-2xl font-bold text-gray-900">{stats?.users.students}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0"><BarChart3 size={24} /></div>
                    <div><p className="text-sm text-gray-500 font-medium">Admins</p><h3 className="text-2xl font-bold text-gray-900">{stats?.users.admins}</h3></div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">User Directory</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="bg-white border-b border-gray-50 hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                                    <td className="px-6 py-4">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && <div className="p-8 text-center text-gray-500">No users found.</div>}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
