# The Extravagant Hobo - Interactive Resume & Portfolio

A modern, animated, and fully interactive resume website with a hidden admin panel for content management. Built with Next.js 14, TypeScript, and Tailwind CSS v4.

🌐 **Live Site**: [https://www.theextravaganthobo.com](https://www.theextravaganthobo.com)  
🔧 **Admin Panel**: [https://admin.theextravaganthobo.com](https://admin.theextravaganthobo.com)

## 🚀 Features

### Public-Facing
- **Interactive Resume Page**: Timeline-style experience with expanding sections, animated skill bars, and hover effects
- **Portfolio Page**: Showcases LinkedIn articles and thought leadership content with tag filtering
- **Landing Page**: Modern gradient design with smooth navigation
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Elegant dark mode with purple/blue gradient accents
- **Smooth Animations**: Powered by Framer Motion for professional transitions

### Admin Panel
- **Secure Authentication**: NextAuth with email whitelist protection
- **Content Management**: Full CRUD operations for all resume sections
- **Real-time Preview**: Changes reflect immediately on the public site
- **Drag & Drop Ordering**: Reorder experiences, education, and skills
- **Image Upload**: Base64 image storage for profile photo and certification icons
- **Mission Statement**: Toggle-able section for personal mission/vision

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **API**: Next.js API Routes

### Infrastructure
- **Hosting**: Vercel
- **DNS**: Cloudflare
- **SSL**: Automatic via Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (recommend Neon for serverless)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/theextravaganthobo.git
cd theextravaganthobo
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Admin emails (comma-separated)
ADMIN_EMAILS="admin@theextravaganthobo.com"
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npx prisma db seed
```

5. **Create admin account**
```bash
node scripts/setup-admin.js
```

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## 📁 Project Structure

```
/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel
│   │   ├── layout.tsx     # Admin layout with auth check
│   │   └── page.tsx       # Main admin dashboard
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── portfolio/     # Articles API
│   │   └── resume/        # Resume data API
│   ├── portfolio/         # Portfolio page
│   ├── resume/           # Interactive resume page
│   ├── signin/           # Custom sign-in page
│   ├── globals.css       # Global styles (Tailwind v4)
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # React components
│   └── Providers.tsx     # Session & theme providers
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   └── db.ts             # Prisma client singleton
├── prisma/               # Database schema
│   ├── schema.prisma     # Database models
│   └── seed.ts           # Initial data seeding
├── public/               # Static assets
├── scripts/              # Utility scripts
│   ├── setup-admin.js    # Admin account setup
│   └── init-resume.js    # Initialize resume data
└── middleware.ts         # Route protection
```

## 🗄 Database Schema

### Core Models
- **User**: Admin authentication
- **Resume**: Basic profile information
- **Experience**: Work history with full/short descriptions
- **Education**: Academic background
- **Skill**: Technical skills with proficiency levels
- **Certification**: Professional certifications
- **Publication**: Academic/professional publications
- **Language**: Language proficiencies
- **Article**: Portfolio articles/blog posts

## 🔐 Security Features

- **Authentication**: Secure credential-based auth with bcrypt password hashing
- **Email Whitelist**: Only pre-approved emails can create admin accounts
- **Route Protection**: Middleware protects admin routes
- **Session Management**: Secure JWT-based sessions
- **Environment Variables**: Sensitive data stored securely
- **HTTPS Only**: Enforced in production via Vercel

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Add environment variables
- Deploy!

3. **Configure Custom Domain**
- Add domain in Vercel dashboard
- Update Cloudflare DNS records:
  - A record: @ → 76.76.21.21
  - CNAME: www → cname.vercel-dns.com
  - CNAME: admin → cname.vercel-dns.com

4. **Run Database Migrations**
```bash
npx prisma migrate deploy
```

## 🔧 Common Tasks

### Add a New Admin User
```bash
# Update ADMIN_EMAILS in .env.local
ADMIN_EMAILS="admin@theextravaganthobo.com,newadmin@example.com"

# Run setup script
node scripts/setup-admin.js
```

### Update Database Schema
```bash
# Edit prisma/schema.prisma
# Create migration
npx prisma migrate dev --name migration_name

# Deploy to production
npx prisma migrate deploy
```

### Backup Database
```bash
# Use Prisma Studio to export data
npx prisma studio

# Or use pg_dump for PostgreSQL
pg_dump DATABASE_URL > backup.sql
```

## 🐛 Troubleshooting

### Articles Not Showing on Portfolio Page
1. Check if articles exist in database: `npx prisma studio`
2. Verify API response: Visit `/api/portfolio`
3. Clear browser cache and reload
4. Check console for errors
5. Ensure articles are saved from admin panel (not just added to DB)

### Styles Not Loading
- Ensure `globals.css` uses Tailwind v4 syntax: `@import "tailwindcss"`
- Check that all input fields have explicit text color: `text-gray-900`

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check email is in ADMIN_EMAILS list
- Ensure DATABASE_URL is correct
- Clear cookies and try again

### Database Connection Errors
- Check DATABASE_URL includes `?sslmode=require`
- Verify database is accessible
- Run `npx prisma generate` after schema changes

## 📝 License

This project is private and proprietary. All rights reserved.

## 🤝 Contributing

This is a personal project, but if you find bugs or have suggestions:
1. Open an issue describing the problem
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

## 📧 Contact

**Alex Sonne**  
- Email: admin@theextravaganthobo.com
- LinkedIn: [https://www.linkedin.com/in/alexsonne/](https://www.linkedin.com/in/alexsonne/)

---

Built with ❤️ by Alex Sonne | The Extravagant Hobo