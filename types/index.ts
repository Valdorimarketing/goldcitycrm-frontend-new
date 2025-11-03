// Auth types
export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
  role?: string
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

// User management types
export interface CreateUserDto {
  name: string
  email: string
  password: string
  role: string
}

export interface UpdateUserDto {
  name?: string
  email?: string
  role?: string
  isActive?: boolean
}

// Generic API response types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// Sales types (for reference)
export interface Sale {
  id: number
  amount: number
  description: string
  date: string
  customer?: Customer
  createdAt?: string
  updatedAt?: string
}

// Location types
export interface Country {
  id: number
  name: string
  createdAt?: string
  updatesAt?: string
}

export interface State {
  id: number
  name: string
  country: number
  createdAt?: string
  updatesAt?: string
}

export interface City {
  id: number
  name: string
  state: number
  createdAt?: string
  updatesAt?: string
}

export interface District {
  id: number
  name: string
  city: number
  createdAt?: string
  updatesAt?: string
}

// Source types
export interface Source {
  id: number
  name: string
  createdAt?: string
  updatedAt?: string
}

// Status types
export interface Status {
  id: number
  name: string
  color?: string
  description?: string
  order?: number
  is_remindable?: boolean
  is_first?: boolean
  is_closed?: boolean
  is_sale?: boolean
  remindingDay?: number | null
  isDoctor?: boolean
  isPricing?: boolean
  createdAt?: string
  updatedAt?: string
}

// Customer Dynamic Fields types
export interface CustomerDynamicField {
  id: number
  name: string
  type: string // 'text', 'number', 'select', 'file', 'textarea', 'date', 'email', 'phone', 'url'
  options_data?: string // JSON string for select options
  order: number
  is_required: boolean
  created_at: string
  updated_at: string
}

export interface CustomerDynamicFieldValue {
  id: number
  customer: number
  customer_dynamic_field: number
  file?: string
  name: string
  type: string
  options_data?: string
  order: number
  created_at: string
  updated_at: string
  customerDynamicFieldRelation?: CustomerDynamicField
}

export interface CreateCustomerDynamicFieldDto {
  name: string
  type: string
  options_data?: string
  order: number
  is_required?: boolean
}

export interface UpdateCustomerDynamicFieldDto {
  name?: string
  type?: string
  options_data?: string
  order?: number
  is_required?: boolean
}

export interface CreateCustomerDynamicFieldValueDto {
  customer_dynamic_field: number
  file?: string
  name: string
  type: string
  options_data?: string
  order: number
}

export interface UpdateCustomerDynamicFieldValueDto {
  file?: string
  name?: string
  type?: string
  options_data?: string
  order?: number
}

// Customer types
export interface Customer {
  id: number
  name: string
  surname: string
  title?: string
  email: string
  gender?: 'male' | 'female' | 'other' | null
  birth_date?: string
  phone?: string
  source_id?: number
  source?: Source
  job?: string
  identity_number?: string
  referance_customer?: number
  referance?: Customer
  language?: string
  isActive: boolean
  status?: number
  status_info?: Status
  website?: string
  country?: number
  state?: number
  city?: number
  district?: number
  postal_code?: string
  address?: string
  relevent_user?: number
  user?: User
  description?: string
  relatedTransaction?: string
  createdAt?: string
  updatedAt?: string
  dynamicFields?: CustomerDynamicFieldValue[]
}

export interface CreateCustomerDto {
  name: string
  surname: string
  title?: string
  email: string
  gender?: 'male' | 'female' | 'other'
  birth_date?: string
  phone?: string
  source_id?: number
  job?: string
  identity_number?: string
  referance_customer?: number
  language?: string
  isActive?: boolean
  status?: number
  website?: string
  country?: number
  state?: number
  city?: number
  district?: number
  postal_code?: string
  address?: string
  relevent_user?: number
  description?: string
  relatedTransaction?: string
  dynamicFields?: CreateCustomerDynamicFieldValueDto[]
}

export interface UpdateCustomerDto {
  name?: string
  surname?: string
  title?: string
  email?: string
  gender?: 'male' | 'female' | 'other'
  birth_date?: string
  phone?: string
  source_id?: number
  job?: string
  identity_number?: string
  referance_customer?: number
  language?: string
  isActive?: boolean
  status?: number
  website?: string
  country?: number
  state?: number
  city?: number
  district?: number
  postal_code?: string
  address?: string
  relevent_user?: number
  description?: string
  relatedTransaction?: string
  dynamicFields?: CreateCustomerDynamicFieldValueDto[]
}

// Product types
export interface Product {
  id: number
  name: string
  price: number
  currency: any
  isActive?: boolean
  createdAt?: string | Date
  updatesAt?: string | Date
}

export interface CreateProductDto {
  name: string
  price: number
}

export interface UpdateProductDto {
  name?: string
  price?: number
}

// Action List types
export interface ActionList {
  id: number
  user: number
  product: number
  plannedDate: number
  name: string
  description: string
  created_at?: string
  updates_at?: string
  userInfo?: User
}

export interface CreateActionListDto {
  user: number
  product: number
  plannedDate: number
  name: string
  description: string
}

export interface UpdateActionListDto {
  user?: number
  product?: number
  plannedDate?: number
  name?: string
  description?: string
}

// Sales Product types
export interface SalesProduct {
  id: number
  name: string
  price: number
  currency: any
  description?: string
  createdAt?: string
  updatedAt?: string
}

// Customer Note types
export interface CustomerNote {
  id: number
  customer: number
  customerInfo?: Customer
  user?: number
  userInfo?: User
  note: string
  isReminding: boolean
  remindingAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCustomerNoteDto {
  customer: number
  user?: number
  note: string
  isReminding?: boolean
  remindingAt?: string
}

export interface UpdateCustomerNoteDto {
  note?: string
  isReminding?: boolean
  remindingAt?: string
}

// User Group types
export interface UserGroup {
  id: number
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserGroupDto {
  name: string
}

export interface UpdateUserGroupDto {
  name?: string
}

// Meeting types
export interface MeetingLocation {
  id: number
  name: string
  address?: string
  createdAt?: string
  updatedAt?: string
}

export interface MeetingStatus {
  id: number
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface Meeting {
  id: number
  customer?: number
  customerInfo?: Customer
  meetingLocation?: number
  meetingLocationInfo?: MeetingLocation
  remindingAt?: string
  startTime?: string
  endTime?: string
  user?: number
  userInfo?: User
  meetingStatus?: number
  meetingStatusInfo?: MeetingStatus
  description?: string
  salesProductId?: number
  salesProduct?: SalesProduct
  createdAt?: string
  updatedAt?: string
}

export interface CreateMeetingDto {
  customer?: number
  meetingLocation?: number
  remindingAt?: string
  startTime?: string
  endTime?: string
  user?: number
  meetingStatus?: number
  description?: string
  salesProductId?: number
}

export interface UpdateMeetingDto {
  customer?: number
  meetingLocation?: number
  remindingAt?: string
  startTime?: string
  endTime?: string
  user?: number
  meetingStatus?: number
  description?: string
  salesProductId?: number
} 