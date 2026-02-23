export interface Address {
  city: string
  state: string
  country: string
}

export interface Employee {
  id: number
  name: string
  email: string
  department: string
  role: string
  salary: number
  joinDate: string
  lastReview: string
  isActive: boolean
  skills: string[]
  address: Address
  projects: number
  performanceRating: number
}