# GitHub Actions Workflow for Netlify Deployment

This document contains the GitHub Actions workflow configuration for deploying the PetCarePlus-Admin Vue.js application to Netlify.

## Setup Instructions

1. Create a `.github/workflows` directory in your project if it doesn't exist
2. Create a file named `netlify-deploy.yml` in that directory
3. Copy the YAML configuration below into that file

## Workflow Configuration

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]
  pull_request:
    types: [opened, synchronize]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Create Netlify configuration
        run: |
          mkdir -p public
          echo "/* /index.html 200" > public/_redirects

      - name: Build
        run: npm run build
        env:
          VITE_APP_NAME: ${{ secrets.VITE_APP_NAME || 'PetCare+ Admin Dashboard' }}
          VITE_APP_ENV: production
          VITE_APP_VERSION: ${{ secrets.VITE_APP_VERSION || '1.0.0' }}
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_API_TIMEOUT: ${{ secrets.VITE_API_TIMEOUT || '15000' }}
          VITE_DEBUG: false
          VITE_LOG_LEVEL: error
          VITE_ENABLE_MOCK_DATA: false
          VITE_ENABLE_DEV_TOOLS: false
          VITE_ENABLE_HTTPS: true
          VITE_CORS_ENABLED: false
          VITE_AUTH_TOKEN_REFRESH: true
          VITE_AUTH_TOKEN_STORAGE: localStorage
          VITE_SESSION_TIMEOUT: ${{ secrets.VITE_SESSION_TIMEOUT || '3600' }}
          VITE_API_RETRY_ATTEMPTS: ${{ secrets.VITE_API_RETRY_ATTEMPTS || '5' }}
          VITE_API_RETRY_DELAY: ${{ secrets.VITE_API_RETRY_DELAY || '2000' }}
          VITE_MAX_FILE_SIZE: ${{ secrets.VITE_MAX_FILE_SIZE || '10485760' }}
          VITE_ALLOWED_FILE_TYPES: ${{ secrets.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf' }}

      # Deploy to Netlify for production (main branch)
      - name: Deploy to Netlify (production)
        if: github.ref == 'refs/heads/main'
        uses: netlify/actions/cli@master
        with:
          args: deploy --dir=dist --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

      # Deploy preview for pull requests
      - name: Deploy to Netlify (preview)
        if: github.event_name == 'pull_request'
        uses: netlify/actions/cli@master
        with:
          args: deploy --dir=dist --alias=pr-${{ github.event.number }}
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Required GitHub Secrets

Before using this workflow, you need to add the following secrets to your GitHub repository:

1. `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
   - Generate at: Netlify user settings → Applications → Personal access tokens

2. `NETLIFY_SITE_ID`: Your Netlify site ID
   - Find at: Netlify site settings → Site information → API ID

3. `VITE_API_BASE_URL`: Your API base URL for production
   - Example: `https://api.petcareplus.com/api`

4. Optional environment variables (will use defaults if not provided):
   - `VITE_APP_NAME`
   - `VITE_APP_VERSION`
   - `VITE_API_TIMEOUT`
   - `VITE_SESSION_TIMEOUT`
   - `VITE_API_RETRY_ATTEMPTS`
   - `VITE_API_RETRY_DELAY`
   - `VITE_MAX_FILE_SIZE`
   - `VITE_ALLOWED_FILE_TYPES`

## Workflow Features

This GitHub Actions workflow:

1. **Triggers on**:
   - Pushes to the main branch (production deployment)
   - Pull request creation or updates (preview deployment)

2. **Environment Setup**:
   - Checks out the repository
   - Sets up Node.js 18
   - Installs dependencies with `npm ci`
   - Creates the necessary SPA routing configuration

3. **Build Process**:
   - Builds the Vue.js application with production settings
   - Injects environment variables from GitHub secrets

4. **Deployment**:
   - For main branch: Deploys to production
   - For pull requests: Creates preview deployments with unique URLs

5. **Preview URLs**:
   - Pull request deployments get a unique URL based on the PR number
   - This allows for easy testing of changes before merging

## Benefits

- **Automated Deployments**: No manual deployment steps needed
- **Preview Deployments**: Test changes in pull requests before merging
- **Environment Variable Management**: Securely manage sensitive configuration
- **Build Caching**: Faster builds with Node modules caching

## Troubleshooting

If you encounter issues with the deployment:

1. Check the GitHub Actions logs for detailed error messages
2. Verify that all required secrets are correctly set
3. Ensure your Netlify token has the necessary permissions
4. Test the build locally with `npm run build` to catch any build errors