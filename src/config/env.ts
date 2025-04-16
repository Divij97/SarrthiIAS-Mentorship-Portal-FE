export const config = {
  auth: {
    salt: process.env.NEXT_PUBLIC_AUTH_SALT,
    defaultPassword: "sarrthiiasmentorshipplatform",
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'https://backend.mentorship.sarrthiias.com',
  },
} as const; 