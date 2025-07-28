VeriHire
 The Ethical & Transparent Hiring Co-Pilot.

(https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Dabhi9202/veri-hire-co-pilot)
(https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

(https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.io/)
(https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

🚀 Project Overview
VeriHire is a modern, AI-powered hiring platform designed to fix the broken recruitment process. The core problem we solve is the "AI Trust Deficit"—where companies use AI tools that operate as a "black box," leading to uncertainty and potential bias.

Our mission is to provide an all-in-one platform that empowers, not replaces, human recruiters. We turn AI into a clear, understandable co-pilot that helps companies find the best talent with unparalleled speed, transparency, and integrity.

✨ Key Features
For Employers
Company Dashboard: A central command center to manage job postings and view key hiring metrics at a glance.

Intelligent Job Posting: Create detailed job profiles with fields for descriptions, skills, and requirements.

Candidate Pipeline: Track applicants as they move through the hiring stages.

AI-Powered Insights: (Future) Review AI-generated analysis of candidate resumes and video interviews.

Explainable AI: (Future) Understand why a candidate is a good match with clear, data-driven explanations.

For Candidates
Guided Onboarding: A simple, step-by-step process to apply for a job, starting with a resume upload.

AI-Powered Interviews: Engage in a one-way video interview where questions are intelligently tailored to your specific resume and the job requirements.

Transparent Status Tracking: A clean dashboard to see the real-time status of your application, from "Submitted" to "Under Review."

🛠️ Technology Stack
VeriHire is built with a modern, scalable, and efficient technology stack.

Frontend:

Framework: Next.js (React)

Language: TypeScript

Styling:(https://tailwindcss.com/)

UI Components:(https://ui.shadcn.com/)

Icons:(https://lucide.dev/)

Backend (Backend-as-a-Service):

Platform:(https://supabase.io/)

Database: Supabase Postgres

Authentication: Supabase Auth

File Storage: Supabase Storage (for resumes, logos, etc.)

Serverless Functions: Supabase Edge Functions (for running AI models)

⚙️ Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18 or later)

npm or bun

A free Supabase account

Installation & Setup
Clone the repository:

Bash

git clone https://github.com/Dabhi9202/veri-hire-co-pilot.git
cd veri-hire-co-pilot
Install NPM packages:

Bash

npm install
Set up your Supabase environment variables:

Create a new project on(https://supabase.io/).

Go to your project's Settings > API.

Create a new file named .env.local in the root of your project.

Copy the contents of .env.example (if it exists) or add the following, replacing the placeholder values with your actual Supabase Project URL and Anon Key:

Code snippet

NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
Run the development server:

Bash

npm run dev
Open http://localhost:3000 with your browser to see the result.

🤖 AI Integration Workflow
The core AI features of VeriHire are designed to run securely on the backend using serverless functions.

Resume Parsing:

A candidate uploads their resume to the Next.js frontend.

The file is securely uploaded to Supabase Storage.

This upload triggers a Supabase Edge Function.

The Edge Function securely calls an external AI API (like OpenAI), passing the resume content.

The AI service returns structured JSON data (skills, experience, etc.).

The Edge Function saves this structured data into the Supabase database, linking it to the candidate's profile.

Interview Question Generation:

When a candidate starts an interview, an Edge Function is called.

It receives the job description and the parsed resume data as input.

It sends this context to a powerful language model (like Grok or GPT-4) with a detailed prompt.

The model returns a tailored set of 15 interview questions (basic, intermediate, advanced).

These questions are then presented to the candidate one by one in the interview interface.

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.

