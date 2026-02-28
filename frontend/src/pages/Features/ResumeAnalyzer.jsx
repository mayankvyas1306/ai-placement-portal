import React, { useState } from 'react';
import apiClient from '../../services/apiClient';
import { Loader2, Zap, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

const ResumeAnalyzer = () => {
    const [loading, setLoading] = useState(false);
    const [targetRole, setTargetRole] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [analysis, setAnalysis] = useState(null);

    const generateData = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await apiClient.post('/ai/analyze-resume', { resumeText, targetRole });
            setAnalysis(data);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to analyze resume';
            alert(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Resume Analyzer</h1>
                <p className="mt-2 text-gray-500">Paste your resume text to get an ATS friendliness score and actionable feedback.</p>
            </div>

            <form onSubmit={generateData} className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-gray-100">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                    <input
                        type="text"
                        placeholder="e.g., Software Engineer, Product Manager"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        value={targetRole} onChange={(e) => setTargetRole(e.target.value)} required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume Text (Paste content here)</label>
                    <textarea
                        rows="8"
                        placeholder="Paste the raw text of your resume here..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-y"
                        value={resumeText} onChange={(e) => setResumeText(e.target.value)} required
                    ></textarea>
                </div>
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <><Loader2 className="animate-spin" size={18} /> Analyzing Resume...</> : <><Zap size={18} /> Analyze Fast</>}
                    </button>
                </div>
            </form>

            {analysis && (
                <div className="space-y-6 mt-8">
                    <div className="flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                        <div className={`flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 ${analysis.score >= 80 ? 'border-green-500 text-green-600' : analysis.score >= 60 ? 'border-yellow-500 text-yellow-600' : 'border-red-500 text-red-600'}`}>
                            <span className="text-4xl font-extrabold">{analysis.score}</span>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ATS Score</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Analysis Complete!</h2>
                            <p className="text-gray-600 mt-1">
                                {analysis.score >= 80 ? 'Great job! Your resume is highly optimized.' : 'Your resume needs some work to pass ATS filters.'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-green-700 mb-4 border-b border-gray-50 pb-2">
                                <CheckCircle size={20} /> Strengths
                            </h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                                {analysis.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-red-700 mb-4 border-b border-gray-50 pb-2">
                                <AlertTriangle size={20} /> Weaknesses
                            </h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                                {analysis.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-6 rounded-2xl shadow-sm">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-800 mb-4 border-b border-indigo-100 pb-2">
                            <TrendingUp size={20} /> Actionable ATS Optimizations
                        </h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-indigo-900">
                            {analysis.atsOptimizations?.map((o, i) => <li key={i}>{o}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeAnalyzer;
