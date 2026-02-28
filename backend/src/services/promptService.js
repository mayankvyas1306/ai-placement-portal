const prompts = {
    dsa: (topic, difficulty, count) => `Act as an expert DSA instructor. Generate ${count} Data Structures and Algorithms questions on the topic "${topic}" with a difficulty level of "${difficulty}". 
Return strictly a JSON object with a single root key "questions" containing an array of objects. Each object should have keys: "title", "description", "difficulty", "hints" (array of strings), and "solutionApproach". Do not include any markdown backticks or explanation outside the JSON.`,

    interview: (targetRole, experienceLevel, skills) => `Act as a senior technical interviewer. Generate 5 interview questions for a ${targetRole} with ${experienceLevel} years of experience, focusing on these skills: ${skills.join(', ')}. 
Include a mix of behavioral and technical questions. 
Return strictly a JSON object with a single root key "questions" containing an array of objects. Each object should have keys: "type" (behavioral/technical), "question", and "expectedAnswerPoints" (array of strings). Do not include any markdown backticks or explanation outside the JSON.`,

    resume: (resumeText, targetRole) => `Act as an expert ATS (Applicant Tracking System) and HR recruiter. Analyze the following resume text for a candidate applying for a ${targetRole} role.
Resume Text: """${resumeText}"""
Return strictly a JSON object with keys: "score" (0-100), "strengths" (array of strings), "weaknesses" (array of strings), and "atsOptimizations" (array of strings). Do not include any markdown backticks or explanation outside the JSON.`,

    studyPlan: (topic, currentLevel) => `Act as a senior mentor. Create a 7-day study plan for learning "${topic}" tailored for a student at the "${currentLevel}" level.
Return strictly a JSON object with a root key "planDetails" containing an array of exactly 7 objects (one for each day). Each object should have keys: "day" (number), "title" (string), "topicsToCover" (array of strings), and "resources" (array of generic resource types like "Video Tutorial", "Documentation"). Do not include any markdown backticks or explanation outside the JSON.`
};

module.exports = prompts;
