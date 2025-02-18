# Saarthi IAS Mentorship Portal

A web application for managing mentorship programs at Saarthi IAS, built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Authentication
- Phone number and password-based authentication
- Secure password hashing using SHA-256 with salt
- Automatic redirection to signup for new users
- Session management using Zustand store

### User Profile
- Comprehensive mentee profile management
- Display of personal information
- Academic details tracking
- Study preferences
- Progress monitoring

### Dashboard Sections
- Profile Overview
- Session Details
- Ask Mentor Interface

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── MultiStepForm.tsx
│   └── Onboarding/
│       ├── PersonalInfo.tsx
│       ├── EducationBackground.tsx
│       ├── PreparationJourney.tsx
│       ├── CurrentPreparation.tsx
│       └── Expectations.tsx
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms) - Form styling

## Development

The application uses the following development tools and practices:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking
- App Router for routing
- Client-side form state management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
