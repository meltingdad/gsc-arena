# GSC Arena 🏆

**The global leaderboard for Google Search Console metrics.** Compete with websites worldwide and see how your SEO performance ranks.

![GSC Arena](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-latest-2D3748?style=for-the-badge&logo=prisma)

---

## Features

- **Global Leaderboard** - Compare your website's performance with others worldwide
- **Real-time Metrics** - Live data from Google Search Console
  - Total Clicks
  - Total Impressions
  - Average CTR
  - Average Position
- **Google OAuth** - Secure authentication with Google Search Console access
- **Auto-sync** - Metrics automatically refresh every 24 hours
- **Competitive UI** - Dark arena theme with electric cyan accents and animated effects
- **Sortable Rankings** - Click columns to sort by any metric
- **Mobile Responsive** - Beautiful on all devices

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **JetBrains Mono** + **Outfit** fonts

### Backend & Database
- **NextAuth.js** - Authentication
- **Prisma** - ORM
- **Supabase** - PostgreSQL database
- **Google Search Console API** - Metrics fetching

### Design
- Dark arena theme with cyberpunk aesthetics
- Animated gradients and glow effects
- Metallic rank badges (gold/silver/bronze)
- Scan-line effects and floating elements

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd gsc_leaderboard
npm install
```

### 2. Setup Environment

Copy `.env` and fill in your credentials:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:PASSWORD@HOST.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### 3. Setup Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Detailed Setup

For complete setup instructions including:
- Creating a Supabase database
- Configuring Google OAuth & Search Console API
- Setting up test users
- Troubleshooting

**See [SETUP.md](./SETUP.md) for full step-by-step instructions.**

---

## Project Structure

```
gsc_leaderboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth routes
│   │   │   ├── gsc/                 # Google Search Console API
│   │   │   └── websites/            # Leaderboard data API
│   │   ├── globals.css              # Global styles & animations
│   │   ├── layout.tsx               # Root layout with providers
│   │   └── page.tsx                 # Landing page
│   ├── components/
│   │   ├── ui/                      # shadcn components
│   │   ├── add-website-dialog.tsx   # Website submission modal
│   │   ├── hero.tsx                 # Hero section
│   │   ├── how-it-works.tsx         # Steps section
│   │   ├── leaderboard-table.tsx    # Rankings table
│   │   ├── navbar.tsx               # Navigation
│   │   └── providers.tsx            # Session provider
│   ├── lib/
│   │   ├── auth.ts                  # NextAuth configuration
│   │   └── prisma.ts                # Prisma client
│   └── types/
│       └── next-auth.d.ts           # NextAuth type extensions
├── prisma/
│   └── schema.prisma                # Database schema
└── SETUP.md                         # Detailed setup guide
```

---

## How It Works

1. **Sign In** - Users authenticate with Google OAuth
2. **Authorize** - Grant access to Google Search Console data
3. **Select Website** - Choose a website from their GSC properties
4. **Fetch Metrics** - App fetches last 28 days of data via GSC API
5. **Join Leaderboard** - Website appears on global rankings
6. **Auto-Update** - Metrics refresh automatically every 24 hours

---

## API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handler

### Google Search Console
- `GET /api/gsc/sites` - Get user's GSC properties

### Leaderboard
- `GET /api/websites` - Get all websites with metrics
- `POST /api/websites` - Add new website to leaderboard

---

## Database Schema

### Users
- Email, name, image
- Google OAuth tokens
- Timestamps

### Websites
- Domain, site URL
- User relationship
- Timestamps

### Metrics
- Total clicks/impressions
- Average CTR/position
- Date range, last updated

Plus NextAuth tables: `accounts`, `sessions`, `verification_tokens`

---

## Customization

### Colors
Edit `src/app/globals.css` to customize the theme:
```css
--primary: 189 97% 56%;  /* Electric cyan */
--accent: 189 97% 56%;   /* Accent color */
```

### Fonts
Update in `src/app/layout.tsx`:
```typescript
const jetbrainsMono = JetBrains_Mono({ ... })
const outfit = Outfit({ ... })
```

### Animations
All animation classes are in `globals.css`:
- `.glow-cyan`, `.glow-gold`
- `.gradient-text`
- `.metallic-gold/silver/bronze`
- `.animate-count-up`, `.animate-float`

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables for Production

Update these in your hosting platform:
- `DATABASE_URL` - Your Supabase connection string
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Generated secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret

### Google OAuth for Production

1. Add production URL to authorized redirect URIs:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
2. Publish your OAuth app (remove "Testing" status)

---

## Roadmap

- [ ] Background job for automatic metric updates
- [ ] Website deletion functionality
- [ ] User dashboard with their websites
- [ ] Historical data tracking & charts
- [ ] Filtering by niche/category
- [ ] Top movers (biggest gains/losses)

---

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

MIT License - feel free to use this project however you'd like!

---

## Support

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Search Console API](https://developers.google.com/webmaster-tools)

---

Made with ⚡ by [Your Name]

**Enter the arena. Prove your dominance. 🏆**
