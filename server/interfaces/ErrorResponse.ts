import { ZodIssue } from 'zod';

export default interface ErrorResponse {
  stack?: string | ZodIssue[]
  errorMessage?: string
}