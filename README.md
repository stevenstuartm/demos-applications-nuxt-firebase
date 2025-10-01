# Nuxt Firebase Demo Application

A full-stack Nuxt 4 application demonstrating Firebase Authentication integration with role-based access control, user management, and a modular layer architecture.

## Features

- **Firebase Authentication** - Secure user authentication with Google Firebase
- **Role-Based Access Control** - Granular permission system with role management
- **User Management** - Admin interface for managing users, roles, and permissions
- **Layer Architecture** - Modular design using Nuxt layers for separation of concerns
- **Server-Side Rendering** - SEO-friendly SSR with Nuxt 4
- **Modern UI** - Built with Nuxt UI and Tailwind CSS 4
- **TypeScript** - Full type safety with TypeScript support

## Architecture

The application uses Nuxt layers to organize functionality:

- **`base`** - Core UI components, layouts, navigation, and utilities
- **`auth`** - Firebase authentication, login, user management, and role-based middleware
- **`my`** - User profile and personal settings pages

## Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com/)
- **UI Library:** [Nuxt UI](https://ui.nuxt.com/) with Tailwind CSS 4
- **Authentication:** [Firebase](https://firebase.google.com/)
- **State Management:** Vue Composition API with composables
- **Package Manager:** pnpm
- **TypeScript:** Full type checking enabled

## Prerequisites

- Node.js 18+
- pnpm 10+
- Firebase project with Authentication enabled

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd demos-applications-nuxt-firebase
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Firebase**

   Create a `.env.development` file in the root directory with your Firebase configuration:
   ```env
   NUXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NUXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com

   DEMO_DEMOS_API_URL=https://devapi.demos.io/demo/
   ```

   To get these values:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Copy the config values from your web app

4. **Run development server**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm generate` - Generate static site
- `pnpm preview` - Preview production build

## Project Structure

```
.
├── app/                      # Main application
│   └── app.vue              # Root component with auth routing
├── layers/
│   ├── base/                # Base layer
│   │   ├── app/
│   │   │   ├── components/  # Shared components (navigation, dark mode, etc.)
│   │   │   ├── composables/ # Shared composables (toast, API, navigation)
│   │   │   ├── layouts/     # Layout components
│   │   │   └── pages/       # Base pages (index/dashboard)
│   │   └── shared/          # Shared utilities and types
│   ├── auth/                # Authentication layer
│   │   ├── app/
│   │   │   ├── components/  # Auth components (login, user management)
│   │   │   ├── composables/ # Auth composables (Firebase, roles, API)
│   │   │   ├── middleware/  # Role-based route protection
│   │   │   ├── pages/       # Auth pages (login, reset password, user management)
│   │   │   └── plugins/     # Firebase client initialization
│   │   └── shared/          # Auth types and interfaces
│   └── my/                  # User profile layer
│       └── app/pages/       # Profile pages
├── public/                  # Static assets
├── nuxt.config.ts          # Main Nuxt configuration
└── package.json            # Dependencies and scripts
```

## Key Features

### Authentication
- Email/password authentication via Firebase
- Password reset functionality
- Protected routes with automatic redirect
- Session persistence

### User Management
- View all users with search and filtering
- Role assignment and management
- User status (active/disabled, verified/unverified)
- Last sign-in tracking

### Role-Based Access Control
- Middleware-protected routes
- Configurable role permissions
- Role-based UI visibility

### UI/UX
- Dark mode support
- Responsive design
- Toast notifications
- Loading states and error handling

## Deployment

### Build for production
```bash
pnpm build
```

### Docker
A Dockerfile is included for containerized deployment:
```bash
docker build -t nuxt-firebase-app .
docker run -p 3000:3000 nuxt-firebase-app
```

## Environment Variables

All Firebase configuration is loaded via environment variables for security. Never commit `.env` files with actual credentials.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions, please open an issue on GitHub.
