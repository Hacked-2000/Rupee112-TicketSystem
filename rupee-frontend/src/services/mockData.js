// Initial mock data
export const mockUsers = [
  {
    id: 1,
    lms_user_id: 1001,
    role_id: 1,
    role_name: "Admin",
    name: "Admin User",
    email: "admin@example.com",
    created_by: 1,
    reporting: 1,
    is_active: 1,
    is_deleted: 0
  },
  {
    id: 2,
    lms_user_id: 1002,
    role_id: 2,
    role_name: "Manager",
    name: "Manager User",
    email: "manager@example.com",
    created_by: 1,
    reporting: 1,
    is_active: 1,
    is_deleted: 0
  },
  {
    id: 3,
    lms_user_id: 1003,
    role_id: 3,
    role_name: "Support",
    name: "Support User",
    email: "support@example.com",
    created_by: 1,
    reporting: 2,
    is_active: 1,
    is_deleted: 0
  },
  {
    id: 4,
    lms_user_id: 1004,
    role_id: 4,
    role_name: "Agent",
    name: "Agent User",
    email: "agent@example.com",
    created_by: 1,
    reporting: 2,
    is_active: 1,
    is_deleted: 0
  }
];

export const mockRoles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Manager" },
  { id: 3, name: "Support" },
  { id: 4, name: "Agent" }
];

export const mockTickets = [
  {
    id: 1,
    title: "Sample Ticket 1",
    description: "This is a sample ticket description",
    status: "open",
    created_by: 4,
    created_by_name: "Agent User",
    assigned_to: 3,
    assigned_to_name: "Support User",
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-10T10:00:00Z",
    attachments: [],
    replies: []
  }
];

// Initialize localStorage with mock data if empty
export const initializeMockData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem('tickets')) {
    localStorage.setItem('tickets', JSON.stringify(mockTickets));
  }
};