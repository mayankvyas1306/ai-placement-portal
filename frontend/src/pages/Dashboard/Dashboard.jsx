import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Sparkles, Code2, MessagesSquare, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ title, description, icon, link, color }) => (
    <Link to={link} className="block group">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} bg-opacity-10`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        </div>
    </Link>
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Welcome, <span className="gradient-text">{user?.name}</span> 👋
                    </h1>
                    <p className="mt-2 text-gray-500">What would you like to practice today?</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <FeatureCard
                    title="DSA Generator"
                    description="Get personalized Data Structures & Algorithms questions with hints and solutions."
                    icon={<Code2 className="text-blue-600" size={24} />}
                    link="/dsa"
                    color="bg-blue-600"
                />
                <FeatureCard
                    title="Interview Prep"
                    description="Simulate real technical and behavioral interviews tailored to your target role."
                    icon={<MessagesSquare className="text-purple-600" size={24} />}
                    link="/interview"
                    color="bg-purple-600"
                />
                <FeatureCard
                    title="Resume Analyzer"
                    description="Get an ATS score and actionable feedback to optimize your resume."
                    icon={<FileText className="text-green-600" size={24} />}
                    link="/resume"
                    color="bg-green-600"
                />
                <FeatureCard
                    title="7-Day Study Planner"
                    description="Generate a customized week-long study plan for any technical topic."
                    icon={<Calendar className="text-orange-600" size={24} />}
                    link="/planner"
                    color="bg-orange-600"
                />
            </div>

            <div className="mt-12 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
                <Sparkles className="text-indigo-600 shrink-0 mt-1" />
                <div>
                    <h3 className="text-lg font-bold text-indigo-900">Pro Tip</h3>
                    <p className="text-indigo-700 mt-1 text-sm">Consistency is key. Try generating at least one DSA question daily to build your problem-solving muscle before placements.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
