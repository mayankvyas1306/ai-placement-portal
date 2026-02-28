import React, { useState } from 'react';
import apiClient from '../../services/apiClient';
import { Loader2, CheckCircle2, Lightbulb } from 'lucide-react';

const DSAGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [questions, setQuestions] = useState([]);

    const generateData = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await apiClient.post('/ai/dsa-questions', { topic, difficulty, count: 3 });
            setQuestions(data.questions || []);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to generate questions';
            alert(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">DSA Question Generator</h1>
                <p className="mt-2 text-gray-500">Practice custom algorithm questions tailored to your focus area.</p>
            </div>

            <form onSubmit={generateData} className="glass-panel p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-100">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                    <input
                        type="text"
                        placeholder="e.g., Binary Search Trees, Dynamic Programming"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={topic} onChange={(e) => setTopic(e.target.value)} required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                    >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </div>
                <div className="md:col-span-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <><Loader2 className="animate-spin" size={18} /> Generating AI Questions...</> : 'Generate Questions'}
                    </button>
                </div>
            </form>

            {questions.length > 0 && (
                <div className="space-y-6 mt-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2"><CheckCircle2 className="text-green-500" /> Generated Questions</h2>
                    {questions.map((q, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <h3 className="text-lg font-bold text-gray-900">{idx + 1}. {q.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                    {q.difficulty}
                                </span>
                            </div>
                            <p className="mt-4 text-gray-600 font-mono text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">{q.description}</p>

                            {q.hints && q.hints.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="flex items-center gap-1 text-sm font-bold text-amber-600 mb-2"><Lightbulb size={16} /> Hints</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                        {q.hints.map((hint, hIdx) => <li key={hIdx}>{hint}</li>)}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <details className="group cursor-pointer">
                                    <summary className="text-sm font-semibold text-indigo-600 select-none">Show Solution Approach</summary>
                                    <div className="mt-3 text-sm text-gray-700 leading-relaxed pl-4 border-l-2 border-indigo-200">
                                        {q.solutionApproach}
                                    </div>
                                </details>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DSAGenerator;
