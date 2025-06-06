import { NextResponse } from 'next/server';

// Standard error response
export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

// Standard success response
export function successResponse(data: unknown = { success: true }) {
  return NextResponse.json(data);
}

// Wrap async route handlers with error handling
export function withErrorHandling<T extends (...args: unknown[]) => Promise<Response>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API Error:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return errorResponse(message, 500);
    }
  }) as T;
}

// Validate required fields
export function validateRequired(
  data: Record<string, unknown>,
  fields: string[]
): { valid: boolean; missing?: string[] } {
  const missing = fields.filter(field => !data[field]);
  return {
    valid: missing.length === 0,
    missing: missing.length > 0 ? missing : undefined
  };
} 