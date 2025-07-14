export interface PaginationParams {
	page: number
	size: number
	sortBy: string
	sort: 'asc' | 'desc'
}

export interface PaginationInfo {
  pageNumber: number
  totalPage: number
  pageSize: number
  totalItem: number
}

export interface PaginationResponse<T> {
  data: T[]
  paging: PaginationInfo
}

// Keep backward compatibility
export interface LegacyPaginationResponse<T> {
  items: T[]
  page: number
  pages: number
  size: number
  total: number
}