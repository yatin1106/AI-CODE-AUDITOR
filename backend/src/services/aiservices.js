const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateContent(userCode, language = 'javascript') {
  const systemPrompt = `
    Act as a Senior Software Architect.
    Return ONLY a Markdown report.
    NO JSON. NO ESCAPED NEWLINES. NO CODE WRAPPERS.

    ### FORMATTING RULES:
    - Use PHYSICAL line breaks (hit enter twice) between paragraphs.
    - Use HUGE HEADERS (# Section Name).
    - Use BOLD (**) for every single bug name.
    - Use Horizontal Rules (---) to separate sections.

    ### STRUCTURE:
    # 📝 SUMMARY
    [Summary here]
    ---
    # 🚨 CRITICAL BUGS
    - **[Line X] BUG NAME:** Description.
    - **[Line Y] SECURITY:** Risk.
    ---
    # 🛠️ THE FIX
\`\`\`${language}
    [Corrected Code]
\`\`\`
    ---
    # 📈 SCORE: [X]/10
  `;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userCode }
    ],
    temperature: 0.1,
  });

  return response.choices[0].message.content;
}

module.exports = { generateContent };