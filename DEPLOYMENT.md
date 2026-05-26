# 🚀 Deployment Guide for AI Recruitment Platform

This guide will walk you through deploying your application for free on two popular platforms: **Render** (for your Python backend) and **Vercel** (for your React frontend).

## Step 1: Upload your code to GitHub
Before deploying, your code needs to be in a GitHub repository.
1. Go to [GitHub](https://github.com/) and create a new repository (e.g., `ai-recruitment-platform`).
2. Open your terminal in your project directory (`AI_resume_analyser`) and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Deploy the Backend (FastAPI) on Render
Your project is already configured with a `render.yaml` file, which makes this step incredibly easy!

1. Go to [Render.com](https://render.com/) and sign up with your GitHub account.
2. In the Render Dashboard, click **New +** and select **Blueprint**.
3. Connect your GitHub repository that you created in Step 1.
4. Render will automatically detect the `render.yaml` file and set up two services for you:
   - A PostgreSQL Database
   - A Web Service (FastAPI Backend)
5. During setup, Render will ask you to provide an environment variable for `GEMINI_API_KEY`. Paste your Google Gemini API key there.
6. Click **Apply**.
7. Wait a few minutes for the deployment to finish. Once it's done, your backend will be live! Copy the backend URL (e.g., `https://ai-recruiter-backend-1234.onrender.com`).

## Step 3: Connect Frontend to Backend
Your frontend needs to know where the newly deployed backend is located.
1. Open the `frontend/vercel.json` file in your code editor.
2. Find this line:
   `"destination": "https://YOUR_RENDER_BACKEND_URL.onrender.com/api/$1"`
3. Replace `https://YOUR_RENDER_BACKEND_URL.onrender.com` with the actual URL you copied from Render in Step 2.
4. Commit and push this change to GitHub:
   ```bash
   git add frontend/vercel.json
   git commit -m "Update backend URL for production"
   git push
   ```

## Step 4: Deploy the Frontend (React) on Vercel
1. Go to [Vercel.com](https://vercel.com/) and sign up with your GitHub account.
2. Click **Add New... -> Project**.
3. Import the GitHub repository you created in Step 1.
4. Important: Under **Framework Preset**, Vercel will auto-detect "Vite". This is correct.
5. Important: Under **Root Directory**, click **Edit** and select the `frontend` folder (since your React app is inside the `frontend` folder, not the main project root).
6. Click **Deploy**.
7. Wait a minute for Vercel to build your React app.

## 🎉 You're Done!
Once Vercel finishes deploying, it will give you a public URL (e.g., `https://ai-recruitment-platform.vercel.app`). 

Click that link to use your fully deployed, live application! All API requests will automatically be routed to your Render backend thanks to the `vercel.json` configuration.
