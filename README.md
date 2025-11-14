# Resume Portfolio Template

A modern, full-stack portfolio and resume website with a secure admin panel for content management. Built with Next.js 15, TypeScript, Prisma, and Tailwind CSS v4.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)

## ✨ Features

### Public-Facing
- **Interactive Resume**: Expandable timeline with work experience, education, skills, and certifications
- **Portfolio/Blog**: Rich content management with image uploads and markdown support
- **Responsive Design**: Mobile-first design that works beautifully on all devices
- **Dark Mode**: Automatic dark/light theme with system preference detection
- **SEO Optimized**: Meta tags, Open Graph, structured data (JSON-LD)
- **Performance**: Server-side rendering, optimized images, and fast page loads

### Admin Panel
- **Secure Authentication**: NextAuth.js with email whitelist protection
- **Content Management**: Easy-to-use interface for updating all resume sections
- **Real-time Editing**: Edit and preview your content instantly
- **Image Uploads**: Upload profile photos and article images (base64 storage)
- **Drag & Drop**: Reorder experiences, skills, and portfolio items
- **Data Validation**: Zod schemas ensure data integrity

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📋 Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **PostgreSQL** database (local or hosted)
- **Git** for version control

## 🏁 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/TheExtravagantHobo/ehl-resume-homepage.git
cd ehl-resume-homepage
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database - PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?sslmode=require"

# NextAuth - Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-this-with-openssl-rand-base64-32"

# Admin Access - Comma-separated list of authorized emails
ADMIN_EMAILS="your-email@example.com"

# Optional - Custom domain for production
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Seed with example data
npx prisma db seed
```

The seed will create:
- Admin user: `admin@example.com` / `admin123`
- Example resume for "Jane Developer"
- Sample experiences, education, skills, etc.

**⚠️ Important**: Change the password after first login!

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site!

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🎨 Customization Guide

### Branding & Colors

Edit `app/globals.css` to customize your brand colors:

```css
@theme {
  --color-brand-orange: #3B82F6;       /* Primary accent - Change to your color */
  --color-brand-orange-light: #60A5FA; /* Hover state - Lighter version */
  --color-brand-navy: #1E293B;         /* Text and dark elements */
}
```

The template uses semantic naming:
- `brand-orange` = Primary accent color (buttons, links, CTAs)
- `brand-orange-light` = Hover states
- `brand-navy` = Text and dark UI elements

**Color Palette Suggestions**:
- **Blue**: `#3B82F6` and `#60A5FA` (default)
- **Purple**: `#8B5CF6` and `#A78BFA`
- **Green**: `#10B981` and `#34D399`
- **Orange**: `#F59E0B` and `#FBBF24`
- **Pink**: `#EC4899` and `#F472B6`

### Personal Information

1. **Login**: Visit `/admin` with the seeded credentials
2. **Profile Tab**: Update your name, title, bio, and contact info
3. **Add Content**: Use the tabs to add experiences, education, skills, etc.
4. **Upload Images**: Click upload buttons for profile photo and portfolio images
5. **Save**: Click "Save All Changes" to persist your updates

### Landing Page Showcase

Edit showcase tiles in the **Admin Panel** under the **Showcase** tab:
- Create custom tiles linking to internal pages or external URLs
- Add images, descriptions, and link types (internal, external, mailto)
- Reorder tiles by changing the order number
- Toggle active/inactive status

### Metadata & SEO

Update `app/layout.tsx` for global metadata:

```typescript
export const metadata: Metadata = {
  title: 'Your Name - Portfolio',
  description: 'Your professional description',
  // ... customize other fields
}
```

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:push          # Push schema changes to database
npm run db:migrate       # Create and run migrations
npm run db:seed          # Seed database with example data
npx prisma studio        # Open Prisma Studio GUI

# Code Quality
npm run type-check       # Run TypeScript type checking
npm run lint             # Run ESLint

# Utilities
npm run clean            # Remove .next build directory
npm run analyze          # Analyze bundle size
```

## 🗄️ Database Schema

The application uses these main models:

- **User**: Admin authentication accounts
- **Resume**: Core profile (name, bio, contact info)
- **Experience**: Work history with expandable bullet points
- **Education**: Academic background
- **Skill**: Technical and soft skills with proficiency levels
- **Certification**: Professional certifications with icons
- **Language**: Language proficiencies
- **Publication**: Academic or professional publications
- **Showcase**: Landing page tiles/cards
- **Article**: Portfolio/blog posts

See `prisma/schema.prisma` for full schema details.

## 🌍 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import on Vercel**: [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Vercel auto-detects Next.js

3. **Set Environment Variables**: Add all variables from `.env.example`
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (use your Vercel URL)
   - `NEXTAUTH_SECRET`
   - `ADMIN_EMAILS`
   - `NEXT_PUBLIC_BASE_URL`

4. **Deploy**: Click "Deploy"

After first deployment:
```bash
# Run migrations in Vercel's terminal or locally targeting production DB
npx prisma migrate deploy
npx prisma db seed
```

### Other Platforms

Compatible with any platform supporting Next.js:
- **Netlify**: Use Next.js runtime
- **Railway**: Supports Next.js + PostgreSQL
- **Render**: Configure build command as `npm run build`
- **Self-hosted**: Use `npm run build && npm start`

### Database Hosting

Choose a PostgreSQL provider:
- **Vercel Postgres**: Integrated with Vercel deployments
- **Supabase**: Free tier with generous limits
- **Railway**: PostgreSQL included
- **Neon**: Serverless PostgreSQL (recommended)
- **Amazon RDS**: Production-grade AWS hosting

## 🔒 Security

- **Email Whitelist**: Only emails in `ADMIN_EMAILS` can authenticate
- **Password Hashing**: bcrypt with salt rounds
- **JWT Sessions**: Secure 30-day sessions
- **Route Protection**: Middleware protects `/admin/*` routes
- **Input Validation**: Zod schemas validate all inputs
- **CSRF Protection**: Built into NextAuth.js
- **SQL Injection Prevention**: Prisma parameterizes all queries

**Important**: Change the default password (`admin123`) immediately after first login!

## 🛠️ Development Tips

### Adding a New Resume Section

See `CLAUDE.md` for detailed architectural guidance.

1. Add model to `prisma/schema.prisma` with `order` field
2. Run `npx prisma migrate dev --name add_section_name`
3. Update `app/api/resume/route.ts`:
   - Add to `Promise.all()` in GET
   - Add transaction logic in POST
4. Create tab component in `app/admin/components/tabs/`
5. Add tab to `app/admin/page.tsx`
6. Display on public resume page

### Working with Images

Images are stored as base64 strings in the database (max 5MB). For larger files or production use, consider:
- **Cloudinary**: Image CDN with transformations
- **AWS S3**: Object storage
- **Vercel Blob**: File storage (recommended for Vercel deployments)

See `lib/image-handler.ts` for image utilities.

### Dark Mode

The template uses `next-themes` with class-based dark mode. Toggle component: `components/ThemeToggle.tsx`

## 📚 Documentation

- **Architecture Guide**: See `CLAUDE.md` for detailed technical documentation
- **API Reference**: See route handlers in `app/api/`
- **Component Library**: Shared components in `components/`
- **Database Schema**: `prisma/schema.prisma`

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear build cache
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma Client
npx prisma generate
```

### Database Issues

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View database in GUI
npx prisma studio

# Check connection
npx prisma db push --skip-generate
```

### Authentication Not Working

1. Verify `NEXTAUTH_SECRET` is set
2. Check email is in `ADMIN_EMAILS` (comma-separated, no spaces)
3. Clear browser cookies and retry
4. Check browser console for errors
5. Verify `NEXTAUTH_URL` matches your deployment URL

### Styles Not Loading

- Ensure `globals.css` uses `@import "tailwindcss"` (Tailwind v4 syntax)
- All form inputs should have explicit text color: `text-gray-900`
- Clear `.next` folder: `npm run clean`

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with these amazing open-source projects:
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide](https://lucide.dev/) - Beautiful icons

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/TheExtravagantHobo/ehl-resume-homepage/issues)
- **Discussions**: [GitHub Discussions](https://github.com/TheExtravagantHobo/ehl-resume-homepage/discussions)
- **Documentation**: See `CLAUDE.md` for technical details

---

**Made with ❤️ for the developer community**

⭐ Star this repo if you find it helpful!
