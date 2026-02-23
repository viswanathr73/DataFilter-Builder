import type { Employee } from '../types/employee'

export const employees: Employee[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    department: 'Engineering',
    role: 'Senior Developer',
    salary: 95000,
    joinDate: '2021-03-15',
    lastReview: '2024-01-15',
    isActive: true,
    skills: ['React', 'TypeScript', 'Node.js'],
    address: { city: 'San Francisco', state: 'CA', country: 'USA' },
    projects: 3,
    performanceRating: 4.5,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    department: 'Design',
    role: 'UX Designer',
    salary: 78000,
    joinDate: '2020-07-10',
    lastReview: '2024-02-01',
    isActive: true,
    skills: ['Figma', 'UX Research'],
    address: { city: 'New York', state: 'NY', country: 'USA' },
    projects: 2,
    performanceRating: 4.2,
  },
]