// Priority: 1. Environment Variable (Vercel/Production), 2. Local Machine IP
export const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.161.45.1:5000';
