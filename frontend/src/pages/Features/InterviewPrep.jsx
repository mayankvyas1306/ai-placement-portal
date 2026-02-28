import React, { useState } from 'react';
import apiClient from '../../services/apiClient';
import { Loader2, UserCheck, MessageSquarePlus } from 'lucide-react';

const InterviewPrep = () => {
    const [loading, setLoading] = useState(false);
    const [targetRole, setTargetRole] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('Entry-Level (0-2 years)');
    const [skills, setSkills] = useState('');
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');

    const generateData = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
            const { data } = await apiClient.post('/ai/interview-questions', { targetRole, experienceLevel, skills: skillsArray });
            setQuestions(data.questions || []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Failed to generate. Check your API key or try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">AI Interview Prep</h1>
                <p className="mt-2 text-gray-500">Generate realistic behavioral and technical interview questions based on your role and skills.</p>
            </div>

            <form onSubmit={generateData} className="glass-panel p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-100">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                    <input
                        type="text"
                        placeholder="e.g., Frontend Developer, Data Scientist"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={targetRole} onChange={(e) => setTargetRole(e.target.value)} required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <select
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}
                    >
                        <option>Entry-Level (0-2 years)</option>
                        <option>Mid-Level (3-5 years)</option>
                        <option>Senior (5+ years)</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills (Comma separated)</label>
                    <input
                        type="text"
                        placeholder="e.g., React, Node.js, MongoDB, AWS"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={skills} onChange={(e) => setSkills(e.target.value)} required
                    />
                </div>
                <div className="md:col-span-2 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <><Loader2 className="animate-spin" size={18} /> Simulating Interview...</> : <><MessageSquarePlus size={18} /> Generate Interview</>}
                    </button>
                </div>
            </form>

            {error && (
                <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl mt-6">
                    {error}
                </div>
            )}

            {questions.length > 0 && (
                <div className="space-y-6 mt-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2"><UserCheck className="text-purple-500" /> Mock Interview Questions</h2>
                    {questions.map((q, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                            <div className="flex items-start justify-between">
                                <h3 className="text-lg text-gray-900 font-semibold pr-4">Q{idx + 1}. {q.question}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${q.type.toLowerCase().includes('behavior') ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {q.type}
                                </span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50">
                                <h4 className="text-sm font-bold text-gray-700 mb-2">Expected Answer Key Points:</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                    {q.expectedAnswerPoints?.map((point, pIdx) => <li key={pIdx}>{point}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InterviewPrep;
