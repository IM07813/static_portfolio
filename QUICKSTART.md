# Quick Start Guide

Get your static portfolio running in 60 seconds! ⚡

## Option 1: Open Directly (Fastest)

```bash
# Just open the file in your browser
open index.html
# or
xdg-open index.html  # Linux
# or
start index.html     # Windows
```

## Option 2: Local Server (Recommended)

### Using the included script:
```bash
./serve.sh
```

### Or manually:

**Python 3** (Most common)
```bash
python3 -m http.server 8000
```
Then visit: http://localhost:8000

**Python 2**
```bash
python -m SimpleHTTPServer 8000
```

**PHP**
```bash
php -S localhost:8000
```

**Node.js**
```bash
npx serve
```

## Option 3: Deploy Online (5 minutes)

### Netlify (Easiest)
1. Go to https://app.netlify.com/drop
2. Drag the `static_portfolio` folder
3. Done! ✨

### Vercel
```bash
npx vercel
```

### GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
# Then enable GitHub Pages in repo settings
```

## Testing

Open the test page to verify everything works:
```bash
# Start server first, then visit:
http://localhost:8000/test.html
```

## Customization

### Change Your Info
Edit `index.html`:
- Line 103: Your name
- Line 104-108: Your title and subtitle
- Line 112: Your resume link
- Line 115: Your profile image
- Lines 45-62: Social media links

### Change Colors
Edit `css/style.css`:
```css
:root {
    --primary-glow: #00ffff;      /* Main accent color */
    --secondary-glow: #ff00ff;    /* Secondary accent */
    --accent-glow: #ffff00;       /* Tertiary accent */
}
```

### Add/Remove Projects
Edit `index.html` in the projects section (around line 300)

### Update Skills
Edit `index.html` in the skills section (around line 130)

## File Structure

```
static_portfolio/
├── index.html          ← Main file (edit this)
├── css/
│   └── style.css      ← Styles (edit colors here)
├── js/
│   └── main.js        ← Functionality
├── assets/
│   ├── profile.png    ← Your photo
│   ├── my_resume.pdf  ← Your resume
│   └── ...            ← Other images
├── videos/            ← Project videos
└── README.md          ← Documentation
```

## Common Issues

### Videos not playing?
- Make sure you're using a local server (not opening file directly)
- Check video file paths in `index.html`

### Styles not loading?
- Use a local server instead of opening file directly
- Check browser console for errors

### Three.js background not showing?
- Check internet connection (CDN required)
- Check browser console for errors

## Next Steps

1. ✅ Test locally
2. ✅ Customize content
3. ✅ Replace images/videos
4. ✅ Deploy online
5. ✅ Share your portfolio!

## Need Help?

- 📖 Read [README.md](README.md) for detailed info
- 🚀 Read [DEPLOYMENT.md](DEPLOYMENT.md) for hosting options
- 📊 Read [COMPARISON.md](COMPARISON.md) to understand differences
- 🧪 Open `test.html` to verify files

## Pro Tips

1. **Test on mobile**: Use Chrome DevTools device emulation
2. **Optimize images**: Compress before uploading
3. **Custom domain**: Most hosts offer free custom domains
4. **Analytics**: Add Google Analytics or Plausible
5. **SEO**: Add meta descriptions and Open Graph tags

## One-Line Deploy Commands

```bash
# Netlify
npx netlify-cli deploy --prod

# Vercel  
npx vercel --prod

# Surge
npx surge

# Firebase
firebase deploy
```

---

That's it! Your portfolio is ready to go! 🎉

Questions? Check the other documentation files or open an issue.
