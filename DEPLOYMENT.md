# Deployment Guide

This guide shows you how to deploy your static portfolio to various hosting platforms.

## Quick Deploy Options

### 1. GitHub Pages (Free)

```bash
# 1. Create a new repository on GitHub
# 2. Initialize git in the static_portfolio folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# 3. Go to repository Settings > Pages
# 4. Select "main" branch and "/" root folder
# 5. Your site will be live at: https://YOUR_USERNAME.github.io/YOUR_REPO/
```

### 2. Netlify (Free)

**Option A: Drag & Drop**
1. Go to https://app.netlify.com/drop
2. Drag the `static_portfolio` folder
3. Done! Your site is live

**Option B: CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd static_portfolio
netlify deploy --prod
```

### 3. Vercel (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd static_portfolio
vercel --prod
```

### 4. Cloudflare Pages (Free)

1. Go to https://pages.cloudflare.com/
2. Connect your GitHub repository
3. Set build settings:
   - Build command: (leave empty)
   - Build output directory: `/`
4. Deploy!

### 5. Firebase Hosting (Free)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
cd static_portfolio
firebase init hosting

# Deploy
firebase deploy
```

### 6. AWS S3 + CloudFront

```bash
# Install AWS CLI
# Configure: aws configure

# Create S3 bucket
aws s3 mb s3://your-portfolio-bucket

# Enable static website hosting
aws s3 website s3://your-portfolio-bucket --index-document index.html

# Upload files
aws s3 sync . s3://your-portfolio-bucket --acl public-read

# Optional: Set up CloudFront for CDN
```

### 7. Surge.sh (Free)

```bash
# Install Surge
npm install -g surge

# Deploy
cd static_portfolio
surge
```

## Custom Domain Setup

### For Netlify
1. Go to Domain Settings
2. Add custom domain
3. Update DNS records at your domain registrar:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### For Vercel
1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### For GitHub Pages
1. Add a `CNAME` file with your domain
2. Update DNS:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

## Performance Optimization

### Before Deployment

1. **Compress Images**
   ```bash
   # Install imagemagick
   sudo apt-get install imagemagick
   
   # Compress images
   mogrify -quality 85 assets/*.png assets/*.jpg
   ```

2. **Minify CSS**
   ```bash
   # Install cssnano
   npm install -g cssnano-cli
   
   # Minify
   cssnano css/style.css css/style.min.css
   ```

3. **Minify JavaScript**
   ```bash
   # Install terser
   npm install -g terser
   
   # Minify
   terser js/main.js -o js/main.min.js -c -m
   ```

4. **Compress Videos** (already done, but for reference)
   ```bash
   ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 1000k output.mp4
   ```

## SSL/HTTPS

All modern hosting platforms provide free SSL certificates:
- **Netlify**: Automatic
- **Vercel**: Automatic
- **Cloudflare Pages**: Automatic
- **GitHub Pages**: Automatic (for custom domains too)
- **Firebase**: Automatic

## Environment-Specific Configurations

If you need different configurations for different environments:

```javascript
// Add to js/main.js
const config = {
  production: {
    apiUrl: 'https://api.example.com'
  },
  development: {
    apiUrl: 'http://localhost:3000'
  }
};

const env = window.location.hostname === 'localhost' ? 'development' : 'production';
const currentConfig = config[env];
```

## Monitoring & Analytics

### Add Google Analytics

Add before `</head>` in index.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Add Plausible Analytics (Privacy-friendly)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## Troubleshooting

### Videos not playing
- Ensure video files are in the correct format (MP4 with H.264)
- Check file paths are correct
- Verify MIME types are set correctly on your server

### Three.js not loading
- Check if CDN is accessible
- Consider downloading Three.js locally
- Check browser console for errors

### Styles not applying
- Clear browser cache
- Check CSS file path
- Verify CSS file is uploaded

### Mobile issues
- Test on real devices
- Use Chrome DevTools mobile emulation
- Check viewport meta tag is present

## Backup & Version Control

Always keep your code in version control:

```bash
# Initialize git
git init

# Create .gitignore
echo "node_modules/" > .gitignore
echo ".DS_Store" >> .gitignore

# Commit
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## Continuous Deployment

Most platforms support automatic deployment from Git:

1. **Connect your repository**
2. **Set up build settings** (none needed for static sites)
3. **Every push to main branch auto-deploys**

## Cost Comparison

| Platform | Free Tier | Bandwidth | Custom Domain | SSL |
|----------|-----------|-----------|---------------|-----|
| GitHub Pages | ✅ | 100GB/month | ✅ | ✅ |
| Netlify | ✅ | 100GB/month | ✅ | ✅ |
| Vercel | ✅ | 100GB/month | ✅ | ✅ |
| Cloudflare Pages | ✅ | Unlimited | ✅ | ✅ |
| Firebase | ✅ | 10GB/month | ✅ | ✅ |
| Surge | ✅ | Unlimited | ✅ | ❌ (paid) |

## Recommended Setup

For best results:
1. **Host on**: Netlify or Vercel (easiest)
2. **CDN**: Cloudflare (free plan)
3. **Analytics**: Plausible or Google Analytics
4. **Monitoring**: UptimeRobot (free)
5. **Domain**: Namecheap or Cloudflare

---

Need help? Check the documentation for your chosen platform or open an issue.
