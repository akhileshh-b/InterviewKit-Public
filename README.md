# InterviewKit - Public Repository

> **Note**: This is the public showcase version of InterviewKit. The main development happens in a private repository for security reasons.

## 🚀 About InterviewKit

InterviewKit is a technical interview preparation platform that provides expert-curated preparatory blogs and documentation. Built with modern web technologies, it helps students and professionals excel in technical interviews.

**Live Demo**: [interview-kit.pages.dev](https://interview-kit.pages.dev)

## ✨ Features

- **Expert-Curated Content**: High-quality preparatory blogs and documentation
- **Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Works seamlessly across all devices
- **Fast Performance**: Optimized for speed and user experience
- **Real Testimonials**: Feedback from RCOEM students and professionals

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Cloudflare Pages
- **Analytics**: Google Analytics

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/akhileshh-b/InterviewKit-Public.git
   cd InterviewKit-Public
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Google Analytics (Optional)
   VITE_GA_MEASUREMENT_ID=your_ga_measurement_id
   
   # Admin Configuration
   VITE_ADMIN_EMAILS=admin1@example.com,admin2@example.com
   
   # Image Security (Optional)
   VITE_IMAGE_SECRET_KEY=your_secret_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics Measurement ID | No |
| `VITE_ADMIN_EMAILS` | Comma-separated admin emails | No |
| `VITE_IMAGE_SECRET_KEY` | Secret key for image security | No |

### Missing Files (For Security)

This public repository excludes sensitive data:

- **Personal Photos**: Replace `src/assets/placeholder-photo.png` with actual photos
- **Database Credentials**: Configure your own Supabase instance
- **Admin Configurations**: Set up your admin emails
- **Analytics Keys**: Configure your Google Analytics

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── utils/              # Utility functions
├── config/             # Configuration files
├── integrations/       # Third-party integrations
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── assets/             # Static assets
└── lib/                # Library configurations
```

## 🎨 Key Components

- **Navigation**: Responsive navigation with authentication
- **Testimonials**: Marquee-style testimonials with manual controls
- **SecurePhoto**: Placeholder component for profile photos
- **Authentication**: Supabase-based auth system

## 🚀 Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `dist`
4. Configure environment variables in Cloudflare dashboard

### Other Platforms

The project can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Akhilesh Bonde**
- Email: akhileshbruh@gmail.com
- GitHub: [@akhileshh-b](https://github.com/akhileshh-b)

## 🙏 Acknowledgments

- RCOEM students for their valuable feedback
- Open source community for amazing tools and libraries
- All contributors who helped improve InterviewKit

## 📞 Support

If you have any questions or need help setting up the project:

- 📧 Email: akhileshbruh@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/akhileshh-b/InterviewKit-Public/issues)

---

**InterviewKit 2025 | Built for interview success** 