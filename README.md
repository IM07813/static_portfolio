# Static Portfolio Website

This is a 100% static version of the portfolio website - built with pure HTML, CSS, and JavaScript.

## Features

- ✨ Identical design to the original Django portfolio
- 🎨 Modern glassmorphism UI with animated Three.js background
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎥 Video preview modals for projects
- 🌟 Smooth animations and transitions
- 🚀 No backend required - pure static files
- 📦 All assets included (images, videos, PDFs)

## Structure

```
static_portfolio/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # All styles
├── js/
│   └── main.js        # JavaScript functionality
├── assets/
│   ├── profile.png
│   ├── my_resume.pdf
│   ├── favicon files
│   └── logo
├── videos/
│   ├── snapgorithm_compressed.mp4
│   ├── farm_stack_agentic_CRM.mp4
│   ├── realestate_pro.mp4
│   └── contruction_site_portfolio.mp4
└── README.md
```

## How to Use

### Option 1: Open Directly
Simply open `index.html` in your web browser.

### Option 2: Local Server (Recommended)
For better performance and to avoid CORS issues:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

### Option 3: Deploy to Hosting
You can deploy this to any static hosting service:

- **GitHub Pages**: Push to a repo and enable GitHub Pages
- **Netlify**: Drag and drop the folder
- **Vercel**: Deploy with `vercel` command
- **Cloudflare Pages**: Connect your repo
- **AWS S3**: Upload as static website
- **Firebase Hosting**: Use `firebase deploy`

## Sections

1. **Home** - Hero section with profile and introduction
2. **Skills** - Technical skills and tools/technologies
3. **Projects** - Featured projects with video previews
4. **Certifications** - Professional certifications
5. **Contact** - Contact form (frontend validation only)

## Technologies Used

- HTML5
- CSS3 (with custom properties and animations)
- Vanilla JavaScript
- Three.js (for 3D background effects)
- Font Awesome (for icons)

## Notes

- The contact form has frontend validation but doesn't send emails (no backend)
- All external links (GitHub, LinkedIn, etc.) are functional
- Videos are included locally for offline viewing
- The design is 100% identical to the original Django version

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

To customize this portfolio:

1. **Update content**: Edit `index.html`
2. **Change colors**: Modify CSS variables in `css/style.css`
3. **Replace images**: Update files in `assets/` folder
4. **Add/remove projects**: Edit the projects section in `index.html`
5. **Modify animations**: Update `js/main.js`

## Performance

- Optimized for fast loading
- Compressed videos for better performance
- Lazy loading for images
- Minimal dependencies

## License

Personal portfolio - All rights reserved.

---

Built with ❤️ by Waqar Ahmed
