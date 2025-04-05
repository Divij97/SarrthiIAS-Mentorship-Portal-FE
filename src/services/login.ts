import { config } from "@/config/env";
import { ResetPasswordResponse } from "@/types/auth";
export const resetUserPassword = async (authHeader: string, phone: string): Promise<ResetPasswordResponse> => {
    
    try {
        const response = await fetch(`${config.api.url}/${phone}/reset-password`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${authHeader}`
            }
        });

    if (!response.ok) {
        throw new Error('Failed to reset password');
    }

    const data: ResetPasswordResponse = await response.json();
    return data;
    } catch (error) {
        console.error('Failed to reset password:', error);
        throw error;
    }
}