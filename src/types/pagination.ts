export interface PaginationParams {
	page: number
	size: number
	sortBy: string
	sort: 'asc' | 'desc'
}

export interface PaginationResponse<T> {
  items: T[]
  page: number
  pages: number
  size: number
  total: number
}