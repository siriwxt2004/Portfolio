# Deployment Guide - Portfolio on Vercel

## Prerequisites
- GitHub account (create if you don't have one at https://github.com)
- Vercel account (sign up at https://vercel.com using your GitHub account)

## Steps to Deploy

### 1. Push Code to GitHub
```bash
cd "c:\Users\lenor\OneDrive\Documents\GitHub\Portfolio"
git add .
git commit -m "Professional portfolio with improved design"
git push origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository "Portfolio"
4. Click "Import"
5. Vercel will auto-detect your project settings
6. Click "Deploy"

Your portfolio will be live at: `https://portfolio-siriwat.vercel.app/`

### 3. Custom Domain (Optional)
1. Go to your project on Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

## Features Deployed
✅ Professional Design System
✅ Responsive Layout (Mobile, Tablet, Desktop)
✅ Smooth Animations & Transitions
✅ Modern Color Palette
✅ Improved Typography
✅ Hover Effects & Micro-interactions
✅ SEO Optimized
✅ Fast Loading Performance

## Project Structure
```
Portfolio/
├── index.html          # Main page
├── project2.html       # Project showcase
├── uxui.html          # UX/UI showcase
├── css/
│   └── styles.css     # Main stylesheet
├── js/
│   └── scripts.js     # Interactive features
├── images/            # Project images
├── vercel.json        # Vercel configuration
└── .gitignore         # Git ignore file
```

## Environment
- HTML5, CSS3, JavaScript (Vanilla)
- No build process required
- Static site hosting
- Automatic deployments on push to GitHub
