const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const config = {
  auth: {
    salt: process.env.NEXT_PUBLIC_AUTH_SALT,
    defaultPassword: "sarrthiiasmentorshipplatform",
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'https://backend.mentorship.sarrthiias.com',
  },
} as const; 