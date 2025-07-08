# Netlify Deployment Guide for PetCarePlus-Admin

This guide provides step-by-step instructions for deploying the PetCarePlus-Admin Vue.js application to Netlify's free tier.

## Prerequisites

- GitHub repository with your PetCarePlus-Admin code
- Netlify account (free)
- Node.js and npm installed locally for testing

## Step 1: Prepare Your Vue.js Application

### Configure SPA Routing

Create a file named `_redirects` in the `public` directory of your project:

```
/* /index.html 200
```

This configuration tells Netlify to redirect all requests to index.html, which is essential for SPA routing to work correctly.

Alternatively, you can create a `netlify.toml` file in the root of your project:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Update Base URL (Optional)

If your application will be deployed to a subdirectory, update the `base` property in your `vite.config.ts` file:

```typescript
export default defineConfig({
  base: '/',  // This is the default and works for most cases
  // ...other configuration
})
```

## Step 2: Set Up Netlify Deployment

### Option 1: Direct GitHub Integration (Recommended for Simplicity)

1. **Create a Netlify Account**
   - Go to [netlify.com](https://www.netlify.com/) and sign up for a free account
   - You can sign up using your GitHub account for easier integration

2. **Connect Your Repository**
   - Click "Add new site" > "Import an existing project"
   - Select GitHub as your Git provider
   - Authorize Netlify to access your GitHub repositories
   - Select your PetCarePlus-Admin repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Show advanced" to add environment variables

4. **Add Environment Variables**
   - Add all required environment variables from your `.env.production` file
   - Make sure to include:
     - `VITE_API_BASE_URL`
     - `VITE_APP_ENV`
     - Any other variables your application needs

5. **Deploy Your Site**
   - Click "Deploy site"
   - Netlify will build and deploy your application
   - Once complete, you'll get a unique Netlify URL (e.g., `your-app-name.netlify.app`)

### Option 2: GitHub Actions Workflow

If you prefer using GitHub Actions for more control over the build and deployment process:

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
     - Add any environment variables your application needs (e.g., `VITE_API_BASE_URL`)

4. **Create GitHub Actions Workflow**
   - Create a file at `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to Netlify
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_APP_ENV: production
          # Add other environment variables here
          
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --dir=dist --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

5. **Push the Workflow File**
   - Commit and push the workflow file to your repository
   - GitHub Actions will automatically build and deploy your site when you push to the main branch

## Step 3: Custom Domain Setup (Optional)

If you want to use a custom domain instead of the default Netlify subdomain:

1. **Add Your Custom Domain**
   - In Netlify, go to Site settings > Domain management
   - Click "Add custom domain"
   - Enter your domain name and follow the verification steps

2. **Configure DNS**
   - Option 1: Use Netlify DNS (recommended)
     - Update your domain's nameservers to point to Netlify's nameservers
   - Option 2: Add DNS records at your current provider
     - Add a CNAME record pointing to your Netlify site

3. **Enable HTTPS**
   - Netlify automatically provisions SSL certificates through Let's Encrypt
   - Enable "Force HTTPS" in your site settings for additional security

## Step 4: Environment Variable Management

Netlify provides several ways to manage environment variables:

1. **Netlify UI**
   - Go to Site settings > Build & deploy > Environment
   - Add each variable individually

2. **netlify.toml**
   - For non-sensitive variables, you can include them in your `netlify.toml` file:

```toml
[build.environment]
  VITE_APP_ENV = "production"
  # Don't include sensitive variables here
```

3. **Per-Context Variables**
   - Netlify supports different environments (production, deploy-preview, branch-deploy)
   - Configure variables per context in `netlify.toml`:

```toml
[context.production.environment]
  VITE_APP_ENV = "production"

[context.deploy-preview.environment]
  VITE_APP_ENV = "staging"
```

## Step 5: Continuous Deployment

Netlify automatically rebuilds and deploys your site when you push changes to your connected GitHub repository. No additional configuration is needed for this feature.

## Troubleshooting

### SPA Routing Issues

If you encounter 404 errors when navigating directly to routes:
- Verify your `_redirects` file is in the `public` directory
- Check that the `_redirects` file is being copied to the `dist` directory during build

### Build Failures

If your build fails:
1. Check the build logs in Netlify
2. Ensure all dependencies are correctly specified in `package.json`
3. Verify your build command works locally: `npm run build`
4. Check that all required environment variables are set

### Environment Variable Issues

If environment variables aren't working:
1. Ensure they are prefixed with `VITE_` for Vite to expose them
2. Verify they are correctly set in Netlify's UI
3. Check that they are being accessed correctly in your code with `import.meta.env.VITE_VARIABLE_NAME`

## Monitoring and Analytics

Netlify provides basic analytics in the free tier:
- Deploy logs
- Form submissions
- Function invocations

For more detailed analytics, consider adding a service like Google Analytics or Plausible Analytics to your application.

## Conclusion

Your PetCarePlus-Admin Vue.js application should now be successfully deployed to Netlify with:
- Automatic HTTPS
- SPA routing support
- Environment variable configuration
- Continuous deployment from GitHub

The free tier limitations (100GB bandwidth, 300 build minutes) should be more than sufficient for an admin dashboard application with moderate usage.