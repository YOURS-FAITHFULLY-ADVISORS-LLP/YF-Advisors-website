export function sanitizeInput<T>(input: T): T {
  if (typeof input === 'string') {
    return input.trim() as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item)) as T;
  }

  if (input && typeof input === 'object' && input.constructor === Object) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, sanitizeInput(value)])
    ) as T;
  }

  return input;
}
