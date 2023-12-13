/**
 *
 * SMATA 1.0 API V1 - Types
 *
 */

interface PaginatedRequest {
  page?: string;
  order?: string;
  per_page?: string;
  sort?: string;
}

export type QueryParam<T> = PaginatedRequest & T;

export type PaginatedResult<T, Key extends string> = {
  meta: Record<string, string>;
} & {
  [key in Key]: T[];
};
