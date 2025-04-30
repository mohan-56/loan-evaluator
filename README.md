# Loan Eligibility Evaluator

A web application that evaluates loan eligibility using **Next.js**, **Node.js** microservices, and **Google Gemini LLM**. It simulates a loan approval system by checking conditions like income, credit score, and loan amount, storing application history in SQLite.

## Features
- **Frontend**: Next.js with TypeScript and Tailwind CSS for a responsive form.
- **Microservices**:
  - **Eligibility Service**: Uses Gemini LLM to evaluate loan conditions.
  - **History Service**: Stores application history using SQLite.
- **LLM Integration**: Gemini API for condition checks with JSON responses.
- **Security**: `.gitignore` files exclude sensitive data (e.g., `.env`).

## Tech Stack
- Frontend: Next.js, TypeScript, Tailwind CSS, Axios
- Backend: Node.js, Express, SQLite
- LLM: Google Gemini API
- Tools: Git, Postman
