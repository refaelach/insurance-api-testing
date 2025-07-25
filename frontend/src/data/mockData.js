export const mockPolicies = [
  {
    id: 1,
    type: 'Auto',
    status: 'Active',
    policyNumber: 'AUTO-2024-001',
    insuredAmount: 25000,
    holderName: 'John Smith',
    premium: 1200,
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    vehicleMake: 'Toyota',
    vehicleModel: 'Camry',
    vehicleYear: 2022,
    coverage: 'Comprehensive'
  },
  {
    id: 2,
    type: 'Home',
    status: 'Expired',
    policyNumber: 'HOME-2023-002',
    insuredAmount: 350000,
    holderName: 'Sarah Johnson',
    premium: 2400,
    startDate: '2023-03-01',
    endDate: '2024-03-01',
    propertyAddress: '123 Main St, Anytown, USA',
    propertyType: 'Single Family',
    coverage: 'Standard'
  },
  {
    id: 3,
    type: 'Health',
    status: 'Pending',
    policyNumber: 'HLTH-2024-003',
    insuredAmount: 50000,
    holderName: 'Mike Davis',
    premium: 3600,
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    planType: 'Family Plan',
    coverage: 'Premium'
  },
  {
    id: 4,
    type: 'Life',
    status: 'Active',
    policyNumber: 'LIFE-2023-004',
    insuredAmount: 1000000,
    holderName: 'Emily Wilson',
    premium: 4800,
    startDate: '2023-06-15',
    endDate: '2024-06-15',
    policyType: 'Term Life',
    coverage: '20 Year Term'
  },
  {
    id: 5,
    type: 'Auto',
    status: 'Active',
    policyNumber: 'AUTO-2024-005',
    insuredAmount: 30000,
    holderName: 'David Brown',
    premium: 1500,
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    vehicleMake: 'Honda',
    vehicleModel: 'CR-V',
    vehicleYear: 2023,
    coverage: 'Liability Plus'
  }
];

export const mockUser = {
  name: 'John Smith',
  email: 'john.smith@example.com',
  role: 'user',
  phone: '+1 (555) 123-4567',
  address: '456 Oak Avenue, Somewhere, USA',
  memberSince: '2022-03-15'
};

// Mock users for admin panel
export const mockUsers = [
  {
    id: 1,
    username: 'john.smith',
    email: 'john.smith@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2022-03-15T09:00:00Z'
  },
  {
    id: 2,
    username: 'admin.user',
    email: 'admin@insurance.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15T08:15:00Z',
    createdAt: '2021-06-10T14:30:00Z'
  },
  {
    id: 3,
    username: 'sarah.johnson',
    email: 'sarah.j@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-01-14T16:45:00Z',
    createdAt: '2023-01-20T11:20:00Z'
  },
  {
    id: 4,
    username: 'mike.davis',
    email: 'mike.davis@example.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2024-01-10T13:20:00Z',
    createdAt: '2023-08-05T15:45:00Z'
  },
  {
    id: 5,
    username: 'emily.wilson',
    email: 'emily.w@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-01-15T09:30:00Z',
    createdAt: '2022-11-12T10:15:00Z'
  }
];

// Mock search results
export const mockSearchResults = {
  policies: [
    { id: 1, type: 'Auto', status: 'Active', holderName: 'John Smith', policyNumber: 'AUTO-2024-001' },
    { id: 2, type: 'Home', status: 'Expired', holderName: 'Sarah Johnson', policyNumber: 'HOME-2023-002' },
    { id: 3, type: 'Health', status: 'Pending', holderName: 'Mike Davis', policyNumber: 'HLTH-2024-003' }
  ],
  claims: [
    { id: 101, type: 'Auto Claim', status: 'Processing', claimantName: 'John Smith', claimNumber: 'CLM-2024-001' },
    { id: 102, type: 'Home Claim', status: 'Approved', claimantName: 'Sarah Johnson', claimNumber: 'CLM-2024-002' }
  ]
};

// Mock files for file viewer
export const mockFiles = {
  'policy.txt': 'This is a sample policy document containing terms and conditions for insurance coverage.',
  'user_data.json': '{"users": [{"id": 1, "name": "John Smith"}, {"id": 2, "name": "Sarah Johnson"}]}',
  'config.xml': '<config><database>mysql</database><port>3306</port></config>',
  'log.txt': '2024-01-15 10:30:15 INFO: User login successful\n2024-01-15 10:35:22 ERROR: Database connection failed',
  'secret.txt': 'This file contains sensitive information that should not be accessible via path traversal.'
};

// Mock URL fetch results
export const mockUrlResults = {
  'https://api.example.com/data': '{"status": "success", "data": {"message": "External API response"}}',
  'https://internal-service.local/config': '{"database": "mysql", "host": "internal-db.local", "port": 3306}',
  'http://localhost:8080/admin': 'Admin panel accessible - this should be blocked in production'
};

// Mock error messages for error simulation
export const mockErrorMessages = {
  'validation_error': 'Validation failed: Field "amount" must be a positive number, received: -100',
  'database_error': 'Database connection failed: Connection refused (localhost:5432)',
  'authentication_error': 'Authentication failed: Invalid JWT token format',
  'authorization_error': 'Access denied: User does not have permission to access this resource',
  'system_error': 'Internal server error: NullPointerException in UserService.java:45'
}; 