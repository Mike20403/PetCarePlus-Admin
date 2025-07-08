# PetCarePlus-Admin Deployment Guide

This document provides instructions for deploying the PetCarePlus-Admin Vue.js application to Netlify using the provided configuration.

## Deployment Configuration Files

The following files have been created to facilitate deployment:

1. `public/_redirects` - Ensures SPA routing works correctly
2. `netlify.toml` - Netlify configuration file with build settings and environment variables
3. `.github/workflows/netlify-deploy.yml` - GitHub Actions workflow for automated deployment

## Deployment Options

### Option 1: Direct Netlify Deployment (Simplest)

1. **Create a Netlify Account**
   - Go to [netlify.com](https://www.netlify.com/) and sign up for a free account
   - You can sign up using your GitHub account for easier integration

2. **Connect Your Repository**
   - Click "Add new site" > "Import an existing project"
   - Select GitHub as your Git provider
   - Authorize Netlify to access your GitHub repositories
   - Select your PetCarePlus-Admin repository

3. **Configure Build Settings**
   - Build command: `pnpm run build`
   - Publish directory: `dist`
   - Netlify will automatically detect the `netlify.toml` file and use its settings
   - Make sure Node.js 20 is selected in the build settings

4. **Add Environment Variables**
   - Add any sensitive environment variables that aren't included in the `netlify.toml` file
   - At minimum, you should add:
     - `VITE_API_BASE_URL`: Your production API URL

5. **Deploy Your Site**
   - Click "Deploy site"
   - Netlify will build and deploy your application
   - Once complete, you'll get a unique Netlify URL (e.g., `your-app-name.netlify.app`)

### Option 2: GitHub Actions Deployment (More Control)

1. **Create a Netlify Site**
   - Go to Netlify and create a new site manually
   - Note your Site ID from the Site settings

2. **Generate a Netlify Access Token**
   - Go to User Settings > Applications > Personal access tokens
   - Generate a new token with appropriate permissions
   - Copy the token for use in GitHub

3. **Add GitHub Secrets**
   - In your GitHub repository, go to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `NETLIFY_AUTH_TOKEN`: Your Netlify access token
     - `NETLIFY_SITE_ID`: Your Netlify site ID
     - `VITE_API_BASE_URL`: Your production API URL
     - Add any other sensitive environment variables as needed

4. **Push Your Code**
   - The GitHub Actions workflow is configured in `.github/workflows/netlify-deploy.yml`
   - When you push to the main branch, it will automatically build and deploy to Netlify
   - Pull requests will create preview deployments with unique URLs
   - The workflow includes:
     - Latest Node.js 18 setup
     - Dependency caching for faster builds
     - Type checking and linting
     - Build validation
     - Automated comments on GitHub PRs with deployment URLs

## Environment Variables

The following environment variables are configured in the `netlify.toml` file:

### Production (main branch)
```
VITE_APP_ENV = "production"
VITE_DEBUG = "false"
VITE_LOG_LEVEL = "error"
VITE_ENABLE_MOCK_DATA = "false"
VITE_ENABLE_DEV_TOOLS = "false"
VITE_ENABLE_HTTPS = "true"
VITE_CORS_ENABLED = "false"
```

### Preview Deployments (pull requests)
```
VITE_APP_ENV = "staging"
VITE_DEBUG = "false"
VITE_LOG_LEVEL = "warn"
VITE_ENABLE_MOCK_DATA = "false"
VITE_ENABLE_DEV_TOOLS = "false"
VITE_ENABLE_HTTPS = "true"
VITE_CORS_ENABLED = "false"
```

### Branch Deployments (other branches)
```
VITE_APP_ENV = "development"
VITE_DEBUG = "true"
VITE_LOG_LEVEL = "debug"
VITE_ENABLE_MOCK_DATA = "true"
VITE_ENABLE_DEV_TOOLS = "true"
VITE_ENABLE_HTTPS = "true"
VITE_CORS_ENABLED = "true"
```

## Sensitive Environment Variables

The following sensitive environment variables should be added through the Netlify dashboard or as GitHub secrets:

- `VITE_API_BASE_URL`: Your production API URL
- `VITE_API_TIMEOUT`: API request timeout (optional)
- `VITE_SESSION_TIMEOUT`: User session timeout (optional)
- `VITE_API_RETRY_ATTEMPTS`: Number of API retry attempts (optional)
- `VITE_API_RETRY_DELAY`: Delay between API retry attempts (optional)

## Custom Domain Setup (Optional)

If you want to use a custom domain:

1. **Add Your Custom Domain**
   - In Netlify, go to Site settings > Domain management
   - Click "Add custom domain"
   - Enter your domain name and follow the verification steps

2. **Configure DNS**
   - Update your domain's nameservers to point to Netlify's nameservers
   - Or add a CNAME record pointing to your Netlify site

3. **Enable HTTPS**
   - Netlify automatically provisions SSL certificates through Let's Encrypt
   - Enable "Force HTTPS" in your site settings for additional security

## Troubleshooting

If you encounter issues with the deployment:

1. **Package Manager Issues**
   - The project uses pnpm as the package manager
   - Ensure you're using pnpm for local development and testing
   - The GitHub Actions workflow and netlify.toml are configured to use pnpm
   - If switching from npm, run `pnpm install` to generate a proper pnpm-lock.yaml file

2. **Node.js Version Compatibility**
   - The project requires Node.js 20 or higher due to dependencies like @tabler/core
   - Both GitHub Actions and Netlify are configured to use Node.js 20
   - If deploying manually, ensure your Netlify site is configured to use Node.js 20

3. **Check Build Logs**
   - Review the build logs in Netlify or GitHub Actions for errors
   - Ensure all dependencies are correctly specified in `package.json`
   - Look for type checking or linting errors that might be preventing the build

4. **SPA Routing Issues**
   - Verify the `_redirects` file is in the `public` directory
   - Check that the `_redirects` file is being copied to the `dist` directory during build
   - Confirm the `netlify.toml` file has the correct redirects configuration

5. **Environment Variable Issues**
   - Ensure all required environment variables are set
   - Verify they are being accessed correctly in your code with `import.meta.env.VITE_VARIABLE_NAME`
   - Check that GitHub Secrets are properly configured for the workflow
   - The VITE_API_BASE_URL variable is critical for API connections

6. **Caching Issues**
   - If you encounter issues with stale dependencies, you can manually clear the GitHub Actions cache
   - In GitHub, go to your repository → Actions → Caches in the left sidebar

## Additional Resources

For more detailed information, refer to the documentation in the `docs` directory:

- [Hosting Options Analysis](./docs/hosting-options-analysis.md)
- [Netlify Deployment Guide](./docs/netlify-deployment-guide.md)
- [GitHub Actions Workflow](./docs/github-actions-netlify-workflow.md)
- [Hosting Recommendations Summary](./docs/hosting-recommendations-summary.md)