const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


function cleanResponse(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\n/g, "")
    .trim();
}


app.post("/api/eligibility", async (req, res) => {
  const { income, creditScore, loanAmount } = req.body;

  if (!income || !creditScore || !loanAmount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const prompt = `
    Evaluate if a user qualifies for a loan based on these conditions:
    - Annual income must be greater than $50,000.
    - Credit score must be greater than 700.
    - Loan amount must be less than $20,000.
    
    User details:
    - Income: $${income}
    - Credit Score: ${creditScore}
    - Loan Amount: $${loanAmount}
    
    Return a valid JSON object with:
    - status: "Approved" or "Denied"
    - reason: If denied, explain why (e.g., "Low income"). If approved, set reason to an empty string.
    
    Ensure the response is a raw JSON string without backticks or Markdown formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const rawText = await result.response.text();
    console.log("Raw Response:", rawText);

    const cleanedText = cleanResponse(rawText);
    console.log("Cleaned Response:", cleanedText);

    const output = JSON.parse(cleanedText);
    res.json(output);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to evaluate eligibility" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Eligibility Service running on port ${PORT}`));