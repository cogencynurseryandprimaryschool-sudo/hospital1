export type UserRole = 
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'accountant'
  | 'patient';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headOfDept?: string;
  imageUrl?: string;
  serviceCount?: number;
  createdAt?: string;
}

export interface Doctor {
  id: string;
  profileId: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName?: string;
  specialization: string;
  qualification: string;
  licenseNumber: string;
  consultationFee: number;
  availabilitySchedule: string[]; // e.g., ["Mon 09:00-14:00", "Wed 10:00-16:00"]
  bio: string;
  rating: number;
  avatarUrl?: string;
}

export interface Staff {
  id: string;
  profileId: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  departmentId?: string;
  departmentName?: string;
  designation: string;
  joinDate: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Patient {
  id: string;
  patientIdCode: string; // e.g. PAT-2026-1042
  profileId?: string;
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup: string; // e.g., A+, O-, B+
  genotype: string; // e.g., AA, AS, SS
  allergies: string[];
  emergencyContact: EmergencyContact;
  medicalHistoryNotes?: string;
  createdAt: string;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM"
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface VitalSigns {
  bloodPressure: string; // e.g. "120/80"
  pulseRate: number; // bpm
  temperature: number; // °C
  respiratoryRate: number; // breaths/min
  weightKg: number;
  heightCm: number;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  symptoms: string;
  diagnosis: string;
  vitalSigns?: VitalSigns;
  treatmentPlan: string;
  notes?: string;
  createdAt: string;
}

export interface Medication {
  id: string;
  name: string;
  code: string;
  category: string;
  stockQuantity: number;
  unitPrice: number;
  description: string;
}

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  dosage: string; // e.g. "500mg"
  frequency: string; // e.g. "2 times daily after meal"
  duration: string; // e.g. "7 days"
  instructions: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  doctorId: string;
  doctorName: string;
  medicalRecordId?: string;
  date: string;
  items: PrescriptionItem[];
  notes?: string;
  status: 'Active' | 'Dispensed' | 'Completed';
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'Consultation' | 'Treatment' | 'Laboratory' | 'Pharmacy' | 'Ward/Bed' | 'Other';
  amount: number;
  quantity: number;
}

export type InvoiceStatus = 'Pending' | 'Partially Paid' | 'Paid' | 'Failed' | 'Refunded';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g., INV-2026-9081
  patientId: string;
  patientName: string;
  patientCode: string;
  patientEmail: string;
  appointmentId?: string;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  amount: number;
  paymentMethod: 'Paystack Card' | 'Paystack Bank Transfer' | 'Cash' | 'POS';
  paystackReference: string;
  status: 'Successful' | 'Pending' | 'Failed';
  paymentDate: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'payment' | 'prescription' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  userRole: UserRole;
  action: string;
  affectedTable: string;
  recordId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
}
