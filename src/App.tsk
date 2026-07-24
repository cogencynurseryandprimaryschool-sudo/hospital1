import React, { useState } from 'react';
import { UserProfile, UserRole } from './types';
import { Header } from './components/layout/Header';
import { Sidebar, NavigationTab } from './components/layout/Sidebar';
import { PublicLayout } from './components/public/PublicLayout';
import { HomePage } from './components/public/HomePage';
import { AboutPage } from './components/public/AboutPage';
import { ServicesPage } from './components/public/ServicesPage';
import { DepartmentsPage } from './components/public/DepartmentsPage';
import { ContactPage } from './components/public/ContactPage';
import { PublicAppointmentPage } from './components/public/PublicAppointmentPage';

import { LoginForm } from './components/auth/LoginForm';
import { RegisterPatientModal } from './components/auth/RegisterPatientModal';
import { BookAppointmentModal } from './components/appointments/BookAppointmentModal';
import { DatabaseSetupModal } from './components/modals/DatabaseSetupModal';

import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { PatientDashboard } from './components/dashboards/PatientDashboard';
import { ReceptionistDashboard } from './components/dashboards/ReceptionistDashboard';
import { NurseDashboard } from './components/dashboards/NurseDashboard';
import { AccountantDashboard } from './components/dashboards/AccountantDashboard';

import { PatientsModule } from './components/modules/PatientsModule';
import { AppointmentsModule } from './components/modules/AppointmentsModule';
import { MedicalRecordsModule } from './components/modules/MedicalRecordsModule';
import { PrescriptionsModule } from './components/modules/PrescriptionsModule';
import { BillingModule } from './components/modules/BillingModule';
import { AuditLogsModule } from './components/modules/AuditLogsModule';

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('public_home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterPatientModal, setShowRegisterPatientModal] = useState(false);
  const [showBookAppointmentModal, setShowBookAppointmentModal] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);

  // Default demo user profile for fast testing if user enters portal directly
  const defaultAdminUser: UserProfile = {
    id: 'prof-admin-1',
    email: 'cogencynurseryandprimaryschool@gmail.com',
    fullName: 'System Administrator',
    role: 'admin',
    phone: '+234 800 000 0001',
    createdAt: '2026-01-01T00:00:00Z'
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    setActiveTab('dashboard');
  };

  const handleOpenPortalLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('public_home');
  };

  // Determine if viewing public website or dashboard portal
  const isPublicView = activeTab.startsWith('public_');

  // Render Role Dashboard
  const renderRoleDashboard = () => {
    const role: UserRole = currentUser?.role || 'admin';
    switch (role) {
      case 'admin':
        return <AdminDashboard onNavigateTab={(t) => setActiveTab(t)} onOpenDbModal={() => setShowDbModal(true)} />;
      case 'doctor':
        return <DoctorDashboard onNavigateTab={(t) => setActiveTab(t)} />;
      case 'patient':
        return <PatientDashboard onNavigateTab={(t) => setActiveTab(t)} onOpenBookModal={() => setShowBookAppointmentModal(true)} />;
      case 'receptionist':
        return <ReceptionistDashboard onOpenRegisterPatient={() => setShowRegisterPatientModal(true)} onOpenBookAppointment={() => setShowBookAppointmentModal(true)} />;
      case 'nurse':
        return <NurseDashboard />;
      case 'accountant':
        return <AccountantDashboard />;
      default:
        return <AdminDashboard onNavigateTab={(t) => setActiveTab(t)} onOpenDbModal={() => setShowDbModal(true)} />;
    }
  };

  // Main View Switcher
  const renderMainContent = () => {
    if (activeTab === 'dashboard') return renderRoleDashboard();
    if (activeTab === 'patients') return <PatientsModule onOpenRegisterModal={() => setShowRegisterPatientModal(true)} />;
    if (activeTab === 'appointments') return <AppointmentsModule onOpenBookModal={() => setShowBookAppointmentModal(true)} />;
    if (activeTab === 'medical_records') return <MedicalRecordsModule />;
    if (activeTab === 'prescriptions') return <PrescriptionsModule />;
    if (activeTab === 'billing') return <BillingModule />;
    if (activeTab === 'audit_logs') return <AuditLogsModule />;
    if (activeTab === 'departments') return <DepartmentsPage onBookAppointment={() => setShowBookAppointmentModal(true)} />;
    return renderRoleDashboard();
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased selection:bg-[#0F766E] selection:text-white">
      
      {/* PUBLIC WEBSITE LAYOUT */}
      {isPublicView ? (
        <PublicLayout
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenLogin={handleOpenPortalLogin}
          onOpenBookAppointment={() => setShowBookAppointmentModal(true)}
          currentUser={currentUser}
        >
          {activeTab === 'public_home' && (
            <HomePage
              onBookAppointment={() => setShowBookAppointmentModal(true)}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}
          {activeTab === 'public_about' && <AboutPage />}
          {activeTab === 'public_services' && <ServicesPage onBookAppointment={() => setShowBookAppointmentModal(true)} />}
          {activeTab === 'public_departments' && <DepartmentsPage onBookAppointment={() => setShowBookAppointmentModal(true)} />}
          {activeTab === 'public_contact' && <ContactPage />}
          {activeTab === 'public_appointment' && <PublicAppointmentPage />}
        </PublicLayout>
      ) : (
        /* AUTHENTICATED DASHBOARD PORTAL LAYOUT */
        <div className="min-h-screen flex flex-col">
          <Header
            currentUser={currentUser || defaultAdminUser}
            onOpenLogin={handleOpenPortalLogin}
            onOpenRegisterPatient={() => setShowRegisterPatientModal(true)}
            onOpenBookAppointment={() => setShowBookAppointmentModal(true)}
            onLogout={handleLogout}
            onOpenDbModal={() => setShowDbModal(true)}
          />

          <div className="flex-1 flex overflow-hidden">
            <Sidebar
              activeTab={activeTab}
              onNavigate={(tab) => setActiveTab(tab)}
              userRole={currentUser?.role || 'admin'}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto space-y-6">
                {renderMainContent()}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showLoginModal && (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
          onOpenRegister={() => {
            setShowLoginModal(false);
            setShowRegisterPatientModal(true);
          }}
        />
      )}

      {showRegisterPatientModal && (
        <RegisterPatientModal
          onClose={() => setShowRegisterPatientModal(false)}
          onRegisteredSuccess={(patient) => {
            // Auto login patient or notify
          }}
        />
      )}

      {showBookAppointmentModal && (
        <BookAppointmentModal
          onClose={() => setShowBookAppointmentModal(false)}
          onAppointmentCreated={() => {
            // Refresh
          }}
        />
      )}

      {showDbModal && (
        <DatabaseSetupModal onClose={() => setShowDbModal(false)} />
      )}

    </div>
  );
}

export default App;
