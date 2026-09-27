# AI Job Match Setup

FreshStart Jobs now includes an AI-powered job match analyzer for candidate accounts. It compares selected candidate profile fields with a job and returns a match score, strengths, missing skills, recommendations, and interview questions.

## 1. Create an OpenRouter API key

1. Sign in at https://openrouter.ai/.
2. Open **Keys** and create a key for FreshStart Jobs.
3. Copy the key once and keep it private.

Never place the key in the frontend or commit it to GitHub.

## 2. Configure local development

Add these values to `backend/.env`:

```env
OPENROUTER_API_KEY=your_private_key
OPENROUTER_MODEL=openai/gpt-4o-mini
```

The model is configurable. If this model is unavailable on your account, replace it with another OpenRouter chat model that supports JSON output.

Restart the application:

```powershell
npm run dev
```

## 3. Test locally

1. Log in as a candidate.
2. Ensure the profile contains skills, a headline, or a bio.
3. Open **Find jobs** and select a job.
4. Click **Analyze with AI**.
5. Verify that the match score, strengths, skill gaps, recommendations, and interview questions appear.

The first request calls OpenRouter. The result is cached in MongoDB. The cache is automatically invalidated when the relevant profile or job content changes.

## 4. Configure Render

Open the `freshstart-jobs-api` service in Render and add:

```text
OPENROUTER_API_KEY = your_private_key
OPENROUTER_MODEL = openai/gpt-4o-mini
```

Save the environment variables and allow Render to redeploy the backend.

No new frontend environment variable is required. After pushing the code to `main`, Render will redeploy both connected services.

## 5. Production verification

1. Open https://freshstart-jobs.onrender.com.
2. Log in as a candidate.
3. Open a job and run the AI analysis.
4. Confirm that the backend logs contain no OpenRouter errors.
5. Check MongoDB Atlas for the `aijobmatches` collection.

## Privacy and cost controls

- The browser never receives the OpenRouter key.
- The AI receives headline, location, bio, skills, and job information only.
- Name, email, password, phone, resume URL, and authentication token are not sent to the model.
- Results are cached to avoid paying for the same analysis repeatedly.
- AI output is guidance only and is not used to automatically accept or reject candidates.
