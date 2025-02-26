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
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },
} as const; 