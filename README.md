# Saarthi IAS Mentorship Program

A Next.js application for onboarding students into the Saarthi IAS Mentorship Program. This application provides a multi-step form to collect information about students' UPSC preparation journey and their mentorship needs.

## Features

- Multi-step form with progress tracking
- Responsive design using Tailwind CSS
- Form validation
- TypeScript support
- Modern UI with smooth transitions
- Comprehensive data collection across multiple sections:
  - Personal Information
  - Educational Background
  - UPSC Preparation Journey
  - Current Preparation Details
  - Program Expectations

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mentorship-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
