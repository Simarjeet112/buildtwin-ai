const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "llama-3.3-70b-versatile";

async function chat(prompt) {
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: MODEL,
  });
  return completion.choices[0].message.content;
}

async function analyzeDebug(language, code, errorMessage) {
  return await chat(`
You are a senior software engineer and debugging expert.
Analyze the following programming error.
Programming Language: ${language}
Code: ${code}
Error Message: ${errorMessage}
Provide:
1. Error Type
2. Root Cause
3. Detailed Explanation
4. Suggested Fix
5. Corrected Code Example
6. Best Practice Tip
`);
}

async function fixBug(language, code, errorMessage) {
  return await chat(`
You are a senior software engineer.
Fix the following code error.
Language: ${language}
Code: ${code}
Error: ${errorMessage}
Return:
1. Fixed Code
2. Explanation of Fix
`);
}

async function explainCodeAI(code) {
  return await chat(`
You are an expert programming teacher.
Explain the following code.
Code: ${code}
Return:
1. Step-by-step explanation
2. Time complexity
3. Space complexity
4. Beginner-friendly summary
`);
}

async function generateLearning(topic, level, goal) {
  return await chat(`
You are an expert programming teacher.
Teach the following concept.
Topic: ${topic}
Skill Level: ${level}
Learning Goal: ${goal}
Return:
1. Simple Explanation
2. Real World Analogy
3. Common Mistakes
4. Quick Summary
5. Mini Quiz (3 questions)
`);
}

async function recommendTutorial(topic, level, goal) {
  return await chat(`
You are a senior programming mentor.
Recommend the best tutorials for learning this topic.
Topic: ${topic}
Skill Level: ${level}
Goal: ${goal}
Return:
1. Best YouTube tutorial
2. Best article
3. Best documentation
4. Best practice problems
5. Why each resource is good
`);
}

module.exports = {
  analyzeDebug,
  fixBug,
  explainCodeAI,
  generateLearning,
  recommendTutorial
};