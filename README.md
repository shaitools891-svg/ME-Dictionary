# Bangla-English Dictionary PWA

A comprehensive bilingual dictionary application with Islamic prayer-based auto-silence functionality, built as a Progressive Web App that can be installed on Android devices.

## Features

- **Bilingual Dictionary**: English ↔ Bangla translation
- **Progressive Web App**: Installable on Android devices
- **Prayer Time Auto-Silence**: Automatically silences device during prayer times
- **Custom Words**: Personal vocabulary management
- **Offline Packages**: Download content for offline use
- **Multiple Themes**: Light, Dark, Sepia, and Forest themes
- **Touch-Optimized**: Mobile-first design with Android optimizations

## Quick Start

### Local Development
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```

## GitHub Pages Deployment

Follow these steps to deploy your dictionary app to GitHub Pages:

### 1. Create GitHub Repository
1. Create a new repository on GitHub named `dictionary-app`
2. Initialize it as empty (no README, .gitignore, or license)

### 2. Push Your Code
```bash
git init
git add .
git commit -m "Initial commit - Dictionary PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dictionary-app.git
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The deployment workflow will automatically run

### 4. Manual Build Command (if needed)
If the automatic deployment doesn't work, you can build manually:
```bash
node build-gh-pages.js
npx vite build --config vite.gh-pages.config.js
```

### 5. Access Your App
Your app will be available at:
```
https://YOUR_USERNAME.github.io/dictionary-app/
```

## Android Installation

Once deployed to GitHub Pages:

1. **Open on Android**: Visit your GitHub Pages URL on Android Chrome
2. **Install Prompt**: A banner will appear asking to "Install this app"
3. **Add to Home**: Tap "Install" to add to your home screen
4. **Native Experience**: The app will work like a native Android app with:
   - Full-screen mode (no browser bars)
   - Home screen icon
   - Offline functionality
   - Prayer time notifications
   - Vibration support

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom hooks (including Android features)
│   │   └── lib/            # Utilities and services
│   └── public/
│       ├── manifest.json   # PWA manifest
│       ├── sw.js          # Service worker
│       └── icon-*.png     # App icons
├── server/                 # Express backend
├── shared/                 # Shared types and schemas
├── .github/workflows/      # GitHub Actions for deployment
└── build-gh-pages.js      # GitHub Pages build script
```

## Features Details

### Prayer Time Auto-Silence
- Configurable prayer times for Fajr, Dhuhr, Asr, Maghrib, and Isha
- Automatic device silent mode during prayer times
- Visual and vibration notifications
- Customizable duration settings

### PWA Capabilities
- Installable on Android devices
- Offline functionality via service worker
- Background sync for prayer notifications
- Native sharing and vibration APIs
- Battery status integration

### Android Optimizations
- Touch-friendly interface
- Safe area support for notched devices
- Prevent zoom on inputs
- Native install prompts
- Android-specific CSS optimizations

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: shadcn/ui components, Tailwind CSS
- **PWA**: Service Worker, Web App Manifest
- **State**: TanStack Query for server state
- **Routing**: Wouter (lightweight React router)

## Environment Variables

For local development, you may need:
- `DATABASE_URL`: PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`: Database credentials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on Android devices
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the GitHub Issues page
2. Create a new issue with detailed description
3. Include device type and browser version for Android-specific issues