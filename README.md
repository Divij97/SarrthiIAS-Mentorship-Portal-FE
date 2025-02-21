# Saarthi IAS Mentorship Portal

A web application for managing mentorship programs at Saarthi IAS, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Authentication & Session Management
- Phone number and password-based authentication
- Secure password hashing using SHA-256 with salt
- Persistent session management using Zustand with localStorage
- Protected routes with automatic redirection
- Centralized auth state management

### User Dashboard
- Comprehensive mentee profile management
- Course enrollment and tracking
- Session scheduling and management
- Direct mentor communication interface

### Components
- **Profile View**: Display and manage personal information, academic details, and preferences
- **Course Management**: Access and track enrolled courses
- **Session Details**: View and manage mentorship sessions
- **Ask Mentor**: Direct communication channel with mentors

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx               # Root page
│   ├── login/
│   │   └── page.tsx          # Login page
│   └── home/
│       └── page.tsx          # Dashboard page
├── components/
│   ├── RootLayoutClient.tsx   # Client-side layout with auth checks
│   ├── Home/
│   │   ├── Profile.tsx       # Profile component
│   │   ├── Courses.tsx       # Courses component
│   │   ├── SessionDetails.tsx
│   │   ├── AskMentor.tsx
│   │   └── Sidebar.tsx       # Navigation sidebar
│   └── ui/
│       └── RadioGroup.tsx    # Reusable UI components
├── stores/
│   ├── auth/
│   │   └── store.ts         # Authentication state management
│   └── mentee/
│       └── store.ts         # Mentee data management
├── services/
│   └── mentee.ts            # API service for mentee data
├── types/
│   ├── mentee.ts            # Type definitions
│   └── course.ts            # Course-related types
└── utils/
    └── config.ts            # Configuration utilities
```

## Technologies Used

- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Headless UI](https://headlessui.com/) - Unstyled UI components

## State Management

### Authentication Store
- Manages login state
- Handles authentication tokens
- Persists auth state across sessions
- Manages loading and error states

### Mentee Store
- Manages mentee profile data
- Persists user data across sessions
- Handles profile updates

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/your-username/mentorship-portal.git
cd mentorship-portal
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Run the development server
```bash
npm run dev
```

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow the existing component structure
- Use Tailwind CSS for styling
- Implement proper type checking

### State Management
- Use Zustand stores for global state
- Keep component state local when possible
- Implement proper error handling
- Maintain type safety

### Authentication
- All non-public routes are protected
- Session persistence is handled automatically
- Auth state is managed centrally
- Proper error handling for auth failures

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
