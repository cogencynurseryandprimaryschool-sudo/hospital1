import { 
  UserProfile, Department, Doctor, Staff, Patient, Appointment, 
  MedicalRecord, Prescription, Invoice, Payment, AuditLog, 
  NotificationItem, Medication, ServiceItem, UserRole, AppointmentStatus 
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY_PREFIX = 'hms_db_v1_';

const initialDepartments: Department[] = [
  { id: 'dept-1', name: 'General Medicine', code: 'GEN', description: 'Comprehensive primary medical diagnosis, outpatient treatment, and adult health care.', headOfDept: 'Dr. Alexander Vance', imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80', serviceCount: 12 },
  { id: 'dept-2', name: 'Pediatrics', code: 'PED', description: 'Child healthcare, vaccinations, pediatric emergency, and adolescent wellness care.', headOfDept: 'Dr. Sarah Jenkins', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80', serviceCount: 8 },
  { id: 'dept-3', name: 'Maternity & Obstetrics', code: 'OBS', description: 'Prenatal care, labor and delivery, high-risk obstetrics, and postnatal recovery.', headOfDept: 'Dr. Eleanor Martinez', imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80', serviceCount: 10 },
  { id: 'dept-4', name: 'Surgery', code: 'SUR', description: 'State-of-the-art operating theaters for general, laparoscopic, and orthopedic surgery.', headOfDept: 'Dr. Marcus Thorne', imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&auto=format&fit=crop&q=80', serviceCount: 14 },
  { id: 'dept-5', name: 'Dental', code: 'DEN', description: 'Oral healthcare, root canal therapy, teeth whitening, orthodontics, and implants.', headOfDept: 'Dr. Chloe Bennett', imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80', serviceCount: 6 },
  { id: 'dept-6', name: 'Laboratory Services', code: 'LAB', description: 'Full-spectrum automated clinical pathology, microbiology, and biochemistry tests.', headOfDept: 'Dr. David Okafor', imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80', serviceCount: 20 },
  { id: 'dept-7', name: 'Pharmacy Services', code: 'PHA', description: '24/7 hospital pharmaceutical services, drug safety counseling, and compounding.', headOfDept: 'Pharm. Grace Udoh', imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80', serviceCount: 15 },
  { id: 'dept-8', name: 'Radiology & Imaging', code: 'RAD', description: 'High-resolution digital X-rays, 3D Ultrasound, CT scans, and MRI diagnostics.', headOfDept: 'Dr. Harrison Cole', imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80', serviceCount: 9 }
];

const initialDoctors: Doctor[] = [
  {
    id: 'doc-1',
    profileId: 'prof-doc-1',
    fullName: 'Dr. Alexander Vance',
    email: 'alexander.vance@omolaracare.org',
    phone: '+234 803 123 4567',
    departmentId: 'dept-1',
    departmentName: 'General Medicine',
    specialization: 'Internal Medicine & Chronic Care',
    qualification: 'MBBS, FWACP (Internal Med)',
    licenseNumber: 'MDCN-789012',
    consultationFee: 15000,
    availabilitySchedule: ['Mon 09:00-14:00', 'Wed 09:00-14:00', 'Fri 09:00-14:00'],
    bio: 'Chief Medical Consultant with over 15 years of clinical excellence in internal medicine and cardiovascular risk management.',
    rating: 4.9,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'doc-2',
    profileId: 'prof-doc-2',
    fullName: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@omolaracare.org',
    phone: '+234 802 987 6543',
    departmentId: 'dept-2',
    departmentName: 'Pediatrics',
    specialization: 'Pediatric Pulmonology & Neonatology',
    qualification: 'MBBS, MD (Pediatrics), FAAP',
    licenseNumber: 'MDCN-654321',
    consultationFee: 12000,
    availabilitySchedule: ['Tue 08:30-15:00', 'Thu 08:30-15:00', 'Sat 10:00-14:00'],
    bio: 'Dedicated pediatrician specializing in neonatal intensive care and childhood respiratory health.',
    rating: 4.95,
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce7890c?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'doc-3',
    profileId: 'prof-doc-3',
    fullName: 'Dr. Eleanor Martinez',
    email: 'eleanor.martinez@omolaracare.org',
    phone: '+234 805 333 4444',
    departmentId: 'dept-3',
    departmentName: 'Maternity & Obstetrics',
    specialization: 'Obstetrics, Gynecology & Maternal Fetal Health',
    qualification: 'MBBS, FMCOG, FWACS',
    licenseNumber: 'MDCN-456789',
    consultationFee: 18000,
    availabilitySchedule: ['Mon 10:00-16:00', 'Wed 10:00-16:00', 'Thu 10:00-16:00'],
    bio: 'Senior Consultant Gynecologist with expertise in high-risk pregnancies and minimally invasive gynecological surgery.',
    rating: 4.88,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'doc-4',
    profileId: 'prof-doc-4',
    fullName: 'Dr. Marcus Thorne',
    email: 'marcus.thorne@omolaracare.org',
    phone: '+234 807 555 6666',
    departmentId: 'dept-4',
    departmentName: 'Surgery',
    specialization: 'General & Laparoscopic Surgery',
    qualification: 'MBBS, FRCS (Edin), FACS',
    licenseNumber: 'MDCN-112233',
    consultationFee: 25000,
    availabilitySchedule: ['Tue 09:00-13:00', 'Fri 10:00-15:00'],
    bio: 'Lead Surgical Specialist renowned for laparoscopic gallbladder, hernia, and acute abdominal surgical interventions.',
    rating: 4.92,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80'
  }
];

const initialPatients: Patient[] = [
  {
    id: 'pat-1',
    patientIdCode: 'PAT-2026-1001',
    profileId: 'prof-pat-1',
    fullName: 'Amina Bello',
    dob: '1992-05-14',
    gender: 'Female',
    phone: '+234 812 345 6789',
    email: 'patient@hospital.com',
    address: '14 Admiralty Way, Lekki Phase 1, Lagos',
    bloodGroup: 'O+',
    genotype: 'AA',
    allergies: ['Penicillin', 'Peanuts'],
    emergencyContact: {
      name: 'Ibrahim Bello',
      relationship: 'Spouse',
      phone: '+234 803 999 8888'
    },
    medicalHistoryNotes: 'Mild asthma managed with inhaler. Seasonal allergic rhinitis.',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'pat-2',
    patientIdCode: 'PAT-2026-1002',
    profileId: 'prof-pat-2',
    fullName: 'Chidi Okonkwo',
    dob: '1985-11-20',
    gender: 'Male',
    phone: '+234 809 111 2222',
    email: 'chidi.okonkwo@example.com',
    address: '42 Isaac John Street, Ikeja, Lagos',
    bloodGroup: 'A+',
    genotype: 'AS',
    allergies: ['Sulfa drugs'],
    emergencyContact: {
      name: 'Nneka Okonkwo',
      relationship: 'Sister',
      phone: '+234 802 333 4444'
    },
    medicalHistoryNotes: 'Essential hypertension diagnosed 2024. Currently on Amlodipine 5mg.',
    createdAt: '2026-02-01T14:30:00Z'
  },
  {
    id: 'pat-3',
    patientIdCode: 'PAT-2026-1003',
    profileId: 'prof-pat-3',
    fullName: 'Florence Adebayo',
    dob: '1978-08-03',
    gender: 'Female',
    phone: '+234 815 666 7777',
    email: 'florence.adebayo@example.com',
    address: '8 Victoria Avenue, Victoria Island, Lagos',
    bloodGroup: 'B+',
    genotype: 'AA',
    allergies: [],
    emergencyContact: {
      name: 'Babajide Adebayo',
      relationship: 'Husband',
      phone: '+234 818 222 1111'
    },
    medicalHistoryNotes: 'Type 2 Diabetes Mellitus managed with Metformin 500mg daily.',
    createdAt: '2026-02-15T09:15:00Z'
  }
];

const todayStr = new Date().toISOString().split('T')[0];

const initialAppointments: Appointment[] = [
  {
    id: 'app-1',
    patientId: 'pat-1',
    patientName: 'Amina Bello',
    patientCode: 'PAT-2026-1001',
    doctorId: 'doc-1',
    doctorName: 'Dr. Alexander Vance',
    departmentId: 'dept-1',
    departmentName: 'General Medicine',
    date: todayStr,
    timeSlot: '09:30 AM',
    reason: 'Routine quarterly checkup & persistent fatigue evaluation.',
    status: 'Confirmed',
    notes: 'Patient requested morning slot.',
    createdAt: '2026-07-20T08:00:00Z'
  },
  {
    id: 'app-2',
    patientId: 'pat-2',
    patientName: 'Chidi Okonkwo',
    patientCode: 'PAT-2026-1002',
    doctorId: 'doc-1',
    doctorName: 'Dr. Alexander Vance',
    departmentId: 'dept-1',
    departmentName: 'General Medicine',
    date: todayStr,
    timeSlot: '11:00 AM',
    reason: 'Blood pressure review and medication refill consultation.',
    status: 'Pending',
    createdAt: '2026-07-21T10:20:00Z'
  },
  {
    id: 'app-3',
    patientId: 'pat-3',
    patientName: 'Florence Adebayo',
    patientCode: 'PAT-2026-1003',
    doctorId: 'doc-3',
    doctorName: 'Dr. Eleanor Martinez',
    departmentId: 'dept-3',
    departmentName: 'Maternity & Obstetrics',
    date: todayStr,
    timeSlot: '02:00 PM',
    reason: 'Routine second-trimester prenatal ultrasound and wellness assessment.',
    status: 'Confirmed',
    createdAt: '2026-07-18T16:00:00Z'
  }
];

const initialMedicalRecords: MedicalRecord[] = [
  {
    id: 'medrec-1',
    patientId: 'pat-1',
    patientName: 'Amina Bello',
    patientCode: 'PAT-2026-1001',
    doctorId: 'doc-1',
    doctorName: 'Dr. Alexander Vance',
    appointmentId: 'app-1',
    symptoms: 'Mild fatigue, dry throat, episodic headache for 3 days.',
    diagnosis: 'Acute Upper Respiratory Tract Infection (mild) & Serum Iron Deficiency',
    vitalSigns: {
      bloodPressure: '118/76',
      pulseRate: 72,
      temperature: 36.8,
      respiratoryRate: 16,
      weightKg: 64,
      heightCm: 168
    },
    treatmentPlan: 'Hydration, oral vitamin supplements, iron tablets for 30 days, rest.',
    notes: 'Patient advised to repeat Full Blood Count in 4 weeks.',
    createdAt: '2026-06-10T11:00:00Z'
  }
];

const initialMedications: Medication[] = [
  { id: 'med-1', name: 'Paracetamol 500mg Tablets', code: 'MED-001', category: 'Analgesic', stockQuantity: 500, unitPrice: 500, description: 'Pain reliever and fever reducer.' },
  { id: 'med-2', name: 'Amoxicillin 500mg Capsules', code: 'MED-002', category: 'Antibiotic', stockQuantity: 250, unitPrice: 2500, description: 'Broad-spectrum penicillin antibiotic.' },
  { id: 'med-3', name: 'Amlodipine 5mg Tablets', code: 'MED-003', category: 'Antihypertensive', stockQuantity: 300, unitPrice: 3000, description: 'Calcium channel blocker for hypertension.' },
  { id: 'med-4', name: 'Metformin 500mg Extended Release', code: 'MED-004', category: 'Antidiabetic', stockQuantity: 400, unitPrice: 3500, description: 'Biguanide antidiabetic medication.' },
  { id: 'med-5', name: 'Ferrous Sulfate 200mg Tablets', code: 'MED-005', category: 'Supplement', stockQuantity: 350, unitPrice: 1500, description: 'Iron supplement for iron deficiency anemia.' }
];

const initialPrescriptions: Prescription[] = [
  {
    id: 'rx-1',
    patientId: 'pat-1',
    patientName: 'Amina Bello',
    patientCode: 'PAT-2026-1001',
    doctorId: 'doc-1',
    doctorName: 'Dr. Alexander Vance',
    medicalRecordId: 'medrec-1',
    date: '2026-06-10',
    items: [
      { id: 'rxi-1', medicationName: 'Ferrous Sulfate 200mg Tablets', dosage: '200mg', frequency: 'Once daily after breakfast', duration: '30 days', instructions: 'Take with glass of water or orange juice.' },
      { id: 'rxi-2', medicationName: 'Paracetamol 500mg Tablets', dosage: '500mg', frequency: '2 tablets every 8 hours as needed', duration: '5 days', instructions: 'For fever or mild headache relief.' }
    ],
    notes: 'Avoid drinking tea or milk within 2 hours of taking iron tablets.',
    status: 'Active',
    createdAt: '2026-06-10T11:30:00Z'
  }
];

const initialInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-8001',
    patientId: 'pat-1',
    patientName: 'Amina Bello',
    patientCode: 'PAT-2026-1001',
    patientEmail: 'patient@hospital.com',
    appointmentId: 'app-1',
    items: [
      { id: 'ii-1', description: 'General Consultation Fee', category: 'Consultation', amount: 15000, quantity: 1 },
      { id: 'ii-2', description: 'Full Blood Count (FBC) Lab Test', category: 'Laboratory', amount: 8500, quantity: 1 },
      { id: 'ii-3', description: 'Pharmacy Dispensing - Ferrous Sulfate & Paracetamol', category: 'Pharmacy', amount: 3500, quantity: 1 }
    ],
    totalAmount: 27000,
    paidAmount: 0,
    status: 'Pending',
    dueDate: todayStr,
    createdAt: '2026-07-20T09:00:00Z'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-8002',
    patientId: 'pat-2',
    patientName: 'Chidi Okonkwo',
    patientCode: 'PAT-2026-1002',
    patientEmail: 'chidi.okonkwo@example.com',
    items: [
      { id: 'ii-4', description: 'Cardiovascular Risk Assessment Consultation', category: 'Consultation', amount: 15000, quantity: 1 },
      { id: 'ii-5', description: 'Amlodipine 3-Month Medication Supply', category: 'Pharmacy', amount: 9000, quantity: 1 }
    ],
    totalAmount: 24000,
    paidAmount: 24000,
    status: 'Paid',
    dueDate: '2026-07-15',
    createdAt: '2026-07-15T10:00:00Z'
  }
];

const initialPayments: Payment[] = [
  {
    id: 'pay-1',
    invoiceId: 'inv-2',
    invoiceNumber: 'INV-2026-8002',
    patientId: 'pat-2',
    patientName: 'Chidi Okonkwo',
    amount: 24000,
    paymentMethod: 'Paystack Card',
    paystackReference: 'PST_20260715_8839210',
    status: 'Successful',
    paymentDate: '2026-07-15T11:05:00Z'
  }
];

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'prof-pat-1',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Alexander Vance is confirmed for today at 09:30 AM.',
    type: 'appointment',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'notif-2',
    userId: 'prof-pat-1',
    title: 'Outstanding Invoice Ready',
    message: 'Invoice #INV-2026-8001 of ₦27,000 is ready for online payment via Paystack.',
    type: 'payment',
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'prof-admin-1',
    userEmail: 'cogencynurseryandprimaryschool@gmail.com',
    userRole: 'admin',
    action: 'SYSTEM_INITIALIZATION',
    affectedTable: 'system',
    recordId: 'sys-01',
    details: 'Hospital Management System initialized successfully with RLS policies and audit trail tracking.',
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString()
  }
];

// Helper functions for Local Storage State persistence
function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
  }
  return defaultValue;
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// Memory / LocalStorage Data Store
let localDepartments = loadStorage<Department[]>('departments', initialDepartments);
let localDoctors = loadStorage<Doctor[]>('doctors', initialDoctors);
let localPatients = loadStorage<Patient[]>('patients', initialPatients);
let localAppointments = loadStorage<Appointment[]>('appointments', initialAppointments);
let localMedicalRecords = loadStorage<MedicalRecord[]>('medical_records', initialMedicalRecords);
let localMedications = loadStorage<Medication[]>('medications', initialMedications);
let localPrescriptions = loadStorage<Prescription[]>('prescriptions', initialPrescriptions);
let localInvoices = loadStorage<Invoice[]>('invoices', initialInvoices);
let localPayments = loadStorage<Payment[]>('payments', initialPayments);
let localNotifications = loadStorage<NotificationItem[]>('notifications', initialNotifications);
let localAuditLogs = loadStorage<AuditLog[]>('audit_logs', initialAuditLogs);

export async function logAuditAction(
  userEmail: string, 
  userRole: UserRole, 
  action: string, 
  affectedTable: string, 
  recordId: string, 
  details: string
): Promise<void> {
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    userId: 'user-active',
    userEmail,
    userRole,
    action,
    affectedTable,
    recordId,
    details,
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString()
  };

  localAuditLogs = [newLog, ...localAuditLogs];
  saveStorage('audit_logs', localAuditLogs);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('audit_logs').insert([{
        user_email: userEmail,
        user_role: userRole,
        action,
        affected_table: affectedTable,
        record_id: recordId,
        details,
        timestamp: newLog.timestamp
      }]);
    } catch (err) {
      console.warn('Supabase audit log insert fallback:', err);
    }
  }
}

export async function getDepartments(): Promise<Department[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('departments').select('*');
    if (!error && data && data.length > 0) {
      return data.map(d => ({
        id: d.id,
        name: d.name,
        code: d.code,
        description: d.description || '',
        headOfDept: d.head_of_dept || '',
        imageUrl: d.image_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
        serviceCount: 8
      }));
    }
  }
  return localDepartments;
}

export async function getDoctors(): Promise<Doctor[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('doctors').select('*, departments(name)');
    if (!error && data && data.length > 0) {
      return data.map(d => ({
        id: d.id,
        profileId: d.profile_id || '',
        fullName: d.full_name,
        email: d.email,
        phone: d.phone,
        departmentId: d.department_id,
        departmentName: d.departments?.name || 'Medical Department',
        specialization: d.specialization,
        qualification: d.qualification,
        licenseNumber: d.license_number,
        consultationFee: d.consultation_fee,
        availabilitySchedule: d.availability_schedule || ['Mon-Fri 09:00-14:00'],
        bio: d.bio || '',
        rating: d.rating || 4.9,
        avatarUrl: d.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'
      }));
    }
  }
  return localDoctors;
}

export async function getPatients(): Promise<Patient[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('patients').select('*');
    if (!error && data && data.length > 0) {
      return data.map(p => ({
        id: p.id,
        patientIdCode: p.patient_id_code,
        profileId: p.profile_id,
        fullName: p.full_name,
        dob: p.dob,
        gender: p.gender,
        phone: p.phone,
        email: p.email,
        address: p.address,
        bloodGroup: p.blood_group,
        genotype: p.genotype,
        allergies: p.allergies || [],
        emergencyContact: p.emergency_contact || { name: 'N/A', relationship: 'N/A', phone: 'N/A' },
        medicalHistoryNotes: p.medical_history_notes,
        createdAt: p.created_at
      }));
    }
  }
  return localPatients;
}

export async function createPatient(patientData: Omit<Patient, 'id' | 'patientIdCode' | 'createdAt'>): Promise<Patient> {
  const newCode = `PAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newPatient: Patient = {
    ...patientData,
    id: `pat-${Date.now()}`,
    patientIdCode: newCode,
    createdAt: new Date().toISOString()
  };

  localPatients = [newPatient, ...localPatients];
  saveStorage('patients', localPatients);

  await logAuditAction('active_user', 'receptionist', 'REGISTER_PATIENT', 'patients', newPatient.id, `Registered patient ${newPatient.fullName} (${newPatient.patientIdCode})`);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('patients').insert([{
        patient_id_code: newPatient.patientIdCode,
        full_name: newPatient.fullName,
        dob: newPatient.dob,
        gender: newPatient.gender,
        phone: newPatient.phone,
        email: newPatient.email,
        address: newPatient.address,
        blood_group: newPatient.bloodGroup,
        genotype: newPatient.genotype,
        allergies: newPatient.allergies,
        emergency_contact: newPatient.emergencyContact,
        medical_history_notes: newPatient.medicalHistoryNotes
      }]);
    } catch (e) {
      console.warn('Supabase insert patient fallback:', e);
    }
  }

  return newPatient;
}

export async function getAppointments(): Promise<Appointment[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('appointments').select('*, patients(full_name, patient_id_code), doctors(full_name), departments(name)');
    if (!error && data && data.length > 0) {
      return data.map(a => ({
        id: a.id,
        patientId: a.patient_id,
        patientName: a.patients?.full_name || 'Patient',
        patientCode: a.patients?.patient_id_code || 'PAT-000',
        doctorId: a.doctor_id,
        doctorName: a.doctors?.full_name || 'Doctor',
        departmentId: a.department_id,
        departmentName: a.departments?.name || 'Department',
        date: a.appointment_date,
        timeSlot: a.time_slot,
        reason: a.reason,
        status: a.status as AppointmentStatus,
        notes: a.notes,
        createdAt: a.created_at
      }));
    }
  }
  return localAppointments;
}

export async function checkAppointmentConflict(doctorId: string, date: string, timeSlot: string): Promise<boolean> {
  const existingSlot = localAppointments.find(
    a => a.doctorId === doctorId && 
         a.date === date && 
         a.timeSlot === timeSlot && 
         a.status !== 'Cancelled'
  );
  return !!existingSlot;
}

export async function createAppointment(appData: Omit<Appointment, 'id' | 'createdAt'>): Promise<{ success: boolean; appointment?: Appointment; message?: string }> {
  // Check double-booking prevention rule
  const existingSlot = localAppointments.find(
    a => a.doctorId === appData.doctorId && 
         a.date === appData.date && 
         a.timeSlot === appData.timeSlot && 
         a.status !== 'Cancelled'
  );

  if (existingSlot) {
    return {
      success: false,
      message: `Doctor is already booked for ${appData.timeSlot} on ${appData.date}. Please choose another available time slot.`
    };
  }

  const newAppointment: Appointment = {
    ...appData,
    id: `app-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  localAppointments = [newAppointment, ...localAppointments];
  saveStorage('appointments', localAppointments);

  // Automatically generate a consultation invoice
  const doctor = localDoctors.find(d => d.id === appData.doctorId);
  const fee = doctor?.consultationFee || 15000;
  await createInvoice({
    patientId: appData.patientId,
    patientName: appData.patientName,
    patientCode: appData.patientCode,
    patientEmail: 'patient@hospital.com',
    appointmentId: newAppointment.id,
    items: [{
      id: `ii-${Date.now()}`,
      description: `Consultation Fee - ${appData.doctorName} (${appData.departmentName})`,
      category: 'Consultation',
      amount: fee,
      quantity: 1
    }],
    totalAmount: fee,
    paidAmount: 0,
    status: 'Pending',
    dueDate: appData.date
  });

  await logAuditAction('active_user', 'patient', 'BOOK_APPOINTMENT', 'appointments', newAppointment.id, `Booked appointment for ${appData.patientName} with ${appData.doctorName} on ${appData.date} at ${appData.timeSlot}`);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('appointments').insert([{
        patient_id: appData.patientId,
        doctor_id: appData.doctorId,
        department_id: appData.departmentId,
        appointment_date: appData.date,
        time_slot: appData.timeSlot,
        reason: appData.reason,
        status: appData.status,
        notes: appData.notes
      }]);
    } catch (e) {
      console.warn('Supabase appointment insert fallback:', e);
    }
  }

  return { success: true, appointment: newAppointment };
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<void> {
  localAppointments = localAppointments.map(a => a.id === id ? { ...a, status } : a);
  saveStorage('appointments', localAppointments);

  await logAuditAction('active_user', 'doctor', 'UPDATE_APPOINTMENT_STATUS', 'appointments', id, `Updated appointment status to ${status}`);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('appointments').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase update appointment fallback:', e);
    }
  }
}

export async function getMedicalRecords(): Promise<MedicalRecord[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('medical_records').select('*, patients(full_name, patient_id_code), doctors(full_name)');
    if (!error && data && data.length > 0) {
      return data.map(m => ({
        id: m.id,
        patientId: m.patient_id,
        patientName: m.patients?.full_name || 'Patient',
        patientCode: m.patients?.patient_id_code || 'PAT-000',
        doctorId: m.doctor_id,
        doctorName: m.doctors?.full_name || 'Doctor',
        appointmentId: m.appointment_id,
        symptoms: m.symptoms,
        diagnosis: m.diagnosis,
        vitalSigns: m.vital_signs,
        treatmentPlan: m.treatment_plan,
        notes: m.notes,
        createdAt: m.created_at
      }));
    }
  }
  return localMedicalRecords;
}

export async function createMedicalRecord(rec: Omit<MedicalRecord, 'id' | 'createdAt'>): Promise<MedicalRecord> {
  const newRec: MedicalRecord = {
    ...rec,
    id: `medrec-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  localMedicalRecords = [newRec, ...localMedicalRecords];
  saveStorage('medical_records', localMedicalRecords);

  await logAuditAction('doctor_user', 'doctor', 'CREATE_MEDICAL_RECORD', 'medical_records', newRec.id, `Created medical record & diagnosis for ${rec.patientName}`);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('medical_records').insert([{
        patient_id: rec.patientId,
        doctor_id: rec.doctorId,
        appointment_id: rec.appointmentId,
        symptoms: rec.symptoms,
        diagnosis: rec.diagnosis,
        vital_signs: rec.vitalSigns,
        treatment_plan: rec.treatmentPlan,
        notes: rec.notes
      }]);
    } catch (e) {
      console.warn('Supabase medical record insert fallback:', e);
    }
  }

  return newRec;
}

export async function getMedications(): Promise<Medication[]> {
  return localMedications;
}

export async function getPrescriptions(): Promise<Prescription[]> {
  return localPrescriptions;
}

export async function createPrescription(rx: Omit<Prescription, 'id' | 'createdAt'>): Promise<Prescription> {
  const newRx: Prescription = {
    ...rx,
    id: `rx-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  localPrescriptions = [newRx, ...localPrescriptions];
  saveStorage('prescriptions', localPrescriptions);

  await logAuditAction('doctor_user', 'doctor', 'CREATE_PRESCRIPTION', 'prescriptions', newRx.id, `Issued prescription for ${rx.patientName}`);

  return newRx;
}

export async function getInvoices(): Promise<Invoice[]> {
  return localInvoices;
}

export async function createInvoice(invData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>): Promise<Invoice> {
  const newNum = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newInvoice: Invoice = {
    ...invData,
    id: `inv-${Date.now()}`,
    invoiceNumber: newNum,
    createdAt: new Date().toISOString()
  };

  localInvoices = [newInvoice, ...localInvoices];
  saveStorage('invoices', localInvoices);

  await logAuditAction('active_user', 'accountant', 'GENERATE_INVOICE', 'invoices', newInvoice.id, `Generated invoice #${newInvoice.invoiceNumber} (₦${newInvoice.totalAmount.toLocaleString()}) for ${newInvoice.patientName}`);

  return newInvoice;
}

export async function getPayments(): Promise<Payment[]> {
  return localPayments;
}

export async function recordPayment(payData: Omit<Payment, 'id' | 'paymentDate'>): Promise<Payment> {
  const newPay: Payment = {
    ...payData,
    id: `pay-${Date.now()}`,
    paymentDate: new Date().toISOString()
  };

  localPayments = [newPay, ...localPayments];
  saveStorage('payments', localPayments);

  // Update invoice status
  localInvoices = localInvoices.map(inv => {
    if (inv.id === payData.invoiceId || inv.invoiceNumber === payData.invoiceNumber) {
      const updatedPaid = inv.paidAmount + payData.amount;
      const updatedStatus = updatedPaid >= inv.totalAmount ? 'Paid' : 'Partially Paid';
      return {
        ...inv,
        paidAmount: updatedPaid,
        status: updatedStatus
      };
    }
    return inv;
  });
  saveStorage('invoices', localInvoices);

  await logAuditAction('system', 'patient', 'VERIFY_PAYMENT', 'payments', newPay.id, `Recorded verified payment of ₦${newPay.amount.toLocaleString()} for Invoice #${newPay.invoiceNumber} via ${newPay.paymentMethod} (Ref: ${newPay.paystackReference})`);

  return newPay;
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  return localAuditLogs;
}

export async function getNotifications(userId?: string): Promise<NotificationItem[]> {
  if (userId) {
    return localNotifications.filter(n => n.userId === userId || n.userId === 'all');
  }
  return localNotifications;
}

export async function markNotificationRead(id: string): Promise<void> {
  localNotifications = localNotifications.map(n => n.id === id ? { ...n, isRead: true } : n);
  saveStorage('notifications', localNotifications);
}
