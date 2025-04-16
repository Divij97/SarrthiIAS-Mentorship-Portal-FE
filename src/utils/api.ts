// utils/api.ts

import { BackendError, FetchError } from "@/types/error";

export async function fetchSafe<TSuccess, TError = BackendError>(
    url: string,
    options?: RequestInit
): Promise<TSuccess> {
    const response = await fetch(url, options);

    if (!response.ok) {
        let errorData: TError | null = null;

        try {
            errorData = (await response.json()) as TError;
        } catch {
            console.error(`Failed to parse error response ${response}`)
        }

        const errorMessage = errorData && typeof errorData === 'object' && 'exMessage' in errorData
            ? (errorData as unknown as BackendError).exMessage
            : `Request failed with status ${response.status}`;

        const error: FetchError<TError> = new Error(errorMessage);
        error.status = response.status;
        error.errorData = errorData || undefined;
        throw error;
    }

    // Check if the response has content
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        return undefined as TSuccess;
    }

    // Parse the response as JSON
    const data = (await response.json()) as TSuccess;
    return data;
}
