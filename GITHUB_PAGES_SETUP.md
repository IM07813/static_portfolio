# GitHub Pages Deployment Guide

## Quick Setup

### 1. Create GitHub Repository
```bash
# If you haven't already, create a new repository on GitHub
# Then push your code:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git commit -m "Initial commit: Portfolio website"
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### 3. Access Your Site
Your site will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

It may take 1-2 minutes for the site to go live after enabling GitHub Pages.

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file to your repository root with your domain:
   ```
   yourdomain.com
   ```

2. Configure your domain's DNS settings:
   - Add a CNAME record pointing to: `YOUR_USERNAME.github.io`
   - Or add A records pointing to GitHub's IPs

3. In GitHub Pages settings, enter your custom domain and enable HTTPS

## Important Notes

✅ **What's Ready:**
- All assets are properly linked with relative paths
- No backend dependencies
- No API keys exposed
- Fully static site
- Mobile responsive
- All videos and images included

⚠️ **File Sizes:**
- Total video size: ~40MB
- GitHub has a 100MB file size limit per file
- All your files are within limits

🎨 **Features Working:**
- 3D background animation
- Smooth scrolling navigation
- Video preview modals
- Mobile menu
- Contact information display
- All external links

## Troubleshooting

**Site not loading?**
- Wait 2-3 minutes after enabling GitHub Pages
- Check that `index.html` is in the root directory
- Verify the branch name is correct in settings

**Assets not loading?**
- All paths are relative, so they should work automatically
- Clear browser cache and try again

**Videos not playing?**
- GitHub Pages supports video files
- Ensure videos are committed to the repository
- Check file sizes are under 100MB each

## Local Testing

Before pushing, test locally:
```bash
python3 -m http.server 8000
```
Then visit: http://localhost:8000

## Support

If you encounter issues, check:
- GitHub Pages documentation: https://pages.github.com/
- Repository Actions tab for build errors
- Browser console for JavaScript errors
