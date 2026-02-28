import React, { useState } from 'react';
import apiClient from '../../services/apiClient';
import { Loader2, CalendarPlus, BookOpen } from 'lucide-react';

const StudyPlanner = () => {
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState('');
    const [currentLevel, setCurrentLevel] = useState('Beginner');
    const [plan, setPlan] = useState(null);
    const [error, setError] = useState('');

    const generateData = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await apiClient.post('/ai/study-planner', { topic, currentLevel });
            const planData = data.planDetails
                ? data
                : {
                    planDetails: data.planDetails || data,
                    topic: data.topic || topic
                };
            setPlan(planData);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Failed to generate plan. Check your API key or try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">7-Day Study Planner</h1>
                <p className="mt-2 text-gray-500">Generate a structured learning path to master any subject in a week.</p>
            </div>

            <form onSubmit={generateData} className="glass-panel p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-100">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject / Topic</label>
                    <input
                        type="text"
                        placeholder="e.g., System Design, React.js"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        value={topic} onChange={(e) => setTopic(e.target.value)} required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Skill Level</label>
                    <select
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                        value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)}
                    >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                </div>

                <div className="md:col-span-2 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <><Loader2 className="animate-spin" size={18} /> Crafting your Plan...</> : <><CalendarPlus size={18} /> Generate 7-Day Plan</>}
                    </button>
                </div>
            </form>

            {error && (
                <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl mt-6">
                    {error}
                </div>
            )}

            {plan && plan.planDetails && (
                <div className="space-y-6 mt-8">
                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                        <h2 className="text-xl font-bold text-orange-900">Your Master Plan: {plan.topic}</h2>
                        <p className="text-orange-700 text-sm mt-1">Tailored for {currentLevel} level.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                        {plan.planDetails.map((day, idx) => (
                            <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-2 h-full bg-orange-400 group-hover:bg-orange-600 transition-colors"></div>
                                <div className="pl-4">
                                    <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-3">
                                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold tracking-wide uppercase">Day {day.day}</span>
                                        <h3 className="font-bold text-gray-900 text-right">{day.title}</h3>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Topics to Cover:</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                            {day.topicsToCover?.map((t, i) => <li key={i}>{t}</li>)}
                                        </ul>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                        <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-1 mb-2"><BookOpen size={16} /> Suggested Resources:</h4>
                                        <ul className="pl-5 list-circle space-y-1 text-sm text-gray-600">
                                            {day.resources?.map((r, i) => <li key={i}>{r}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyPlanner;
