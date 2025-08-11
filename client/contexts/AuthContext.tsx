import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'department_moderator' | 'lecturer' | 'student';

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: Department;
  employeeId?: string;
  studentId?: string;
  avatar?: string;
  subjects?: string[];
  year?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // For demo purposes
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  'admin@university.edu': {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'admin@university.edu',
    role: 'admin',
    employeeId: 'EMP001',
    avatar: '/placeholder.svg'
  },
  'dept.cs@university.edu': {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'dept.cs@university.edu',
    role: 'department_moderator',
    department: { id: 'cs', name: 'Computer Science', code: 'CS' },
    employeeId: 'EMP002',
    avatar: '/placeholder.svg'
  },
  'lecturer@university.edu': {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'lecturer@university.edu',
    role: 'lecturer',
    department: { id: 'cs', name: 'Computer Science', code: 'CS' },
    employeeId: 'EMP003',
    subjects: ['Data Structures', 'Algorithms', 'Database Systems'],
    avatar: '/placeholder.svg'
  },
  'student@university.edu': {
    id: '4',
    name: 'John Doe',
    email: 'student@university.edu',
    role: 'student',
    department: { id: 'cs', name: 'Computer Science', code: 'CS' },
    studentId: 'CS21001',
    year: 3,
    avatar: '/placeholder.svg'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('scams_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers[email];
    if (mockUser && password === 'password') {
      setUser(mockUser);
      localStorage.setItem('scams_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('scams_user');
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const newUser = { ...user, role };
      setUser(newUser);
      localStorage.setItem('scams_user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRequireAuth(requiredRole?: UserRole) {
  const { user } = useAuth();
  
  if (!user) {
    return { authorized: false, user: null };
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return { authorized: false, user };
  }
  
  return { authorized: true, user };
}
