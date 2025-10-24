# CarBuddy Web App - Deployment Guide

## Automatic Deployment to Vercel via GitHub Actions

This repository is configured to automatically deploy to Vercel whenever you push to the `master` or `main` branch.

### Setup Instructions

#### 1. Create a Vercel Account
- Go to [Vercel](https://vercel.com) and sign up/login with your GitHub account

#### 2. Create a New Project on Vercel
- Click "Add New..." → "Project"
- Import your `web-app` repository from GitHub
- Configure the project:
  - **Framework Preset**: Vite
  - **Root Directory**: `./` (leave as default)
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
  - **Install Command**: `npm install`

#### 3. Get Vercel Tokens
You need three pieces of information from Vercel:

**a) Vercel Token:**
- Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
- Click "Create Token"
- Give it a name (e.g., "GitHub Actions")
- Copy the token (you'll only see it once!)

**b) Project ID:**
- Go to your project settings on Vercel
- Navigate to "General" tab
- Copy your "Project ID"

**c) Organization/Team ID:**
- Go to [Vercel Account Settings](https://vercel.com/account)
- Copy your "Team ID" or "Organization ID"

#### 4. Add Secrets to GitHub Repository
- Go to your GitHub repository: `https://github.com/aicarbuddy-max/web-app`
- Navigate to **Settings** → **Secrets and variables** → **Actions**
- Click "New repository secret" and add the following:

| Secret Name | Value |
|------------|-------|
| `VERCEL_TOKEN` | Your Vercel token from step 3a |
| `VERCEL_ORG_ID` | Your Vercel org/team ID from step 3c |
| `VERCEL_PROJECT_ID` | Your Vercel project ID from step 3b |

#### 5. Create `.vercel` Directory (Local - Optional)
If you want to deploy manually from your local machine:

```bash
cd E:\car buddy\web-app
npm install -g vercel
vercel login
vercel link
```

This will create a `.vercel` directory with your project configuration.

## How It Works

Once setup is complete:

1. **Push to GitHub**: Any push to `master` or `main` branch triggers the workflow
2. **GitHub Actions**: Automatically builds and deploys to Vercel
3. **Live URL**: Your app is live at `https://your-project-name.vercel.app`

## Manual Deployment (Alternative)

If you prefer to deploy manually instead of using GitHub Actions:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Environment Variables

If your app needs environment variables (API keys, etc.):

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add your variables (e.g., `VITE_API_URL`, `VITE_SUPABASE_URL`, etc.)
3. Redeploy or push to trigger a new deployment

## Troubleshooting

### Build Fails
- Check the GitHub Actions logs in the "Actions" tab
- Ensure all dependencies are listed in `package.json`
- Verify build command works locally: `npm run build`

### Deployment Not Triggering
- Verify GitHub secrets are correctly set
- Check if the workflow file exists: `.github/workflows/vercel-deploy.yml`
- Ensure you're pushing to `master` or `main` branch

### 404 Errors on Routes
- The `vercel.json` file includes rewrites to handle SPA routing
- If issues persist, check Vercel Dashboard → Settings → Rewrites

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
