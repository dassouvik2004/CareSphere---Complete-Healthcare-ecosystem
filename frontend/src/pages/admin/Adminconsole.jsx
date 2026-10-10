import { useState, useMemo } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import DoctorCard from './DoctorCard';
import RejectedTab from './RejectedTab';
import UsersTab from './UsersTab';
import AppointmentsTab from './AppointmentsTab';
import PaymentsTab from './PaymentsTab';
import ReportsTab from './ReportsTab';
import PayoutsTab from './PayoutsTab';
import { DOCTOR_CODES, INITIAL_PAYOUTS } from './PayoutsData';
import { payWithRazorpay } from './RazorPay';
import { INITIAL_BOOKINGS, INITIAL_REPORTS } from './ReportsData';
import './admin.css';

// ---- Mock data: replace with API calls later ----
const approvedDoc = (id, name, email, phone, specialty, regNo, fee, slotDays, dailySlots, dues) => ({
  id, name, email, phone, specialty, regNo, fee, slotDays, dailySlots, dues, status: 'approved',
});

const INITIAL_DOCTORS = [
  approvedDoc('d1', 'Dr. Debabrata Roy, MD, DM', 'dr.debabrata@caresphere.com', '+91 94331 55620', 'Cardiologist', 'WBMC-58492', 1000, ['Monday', 'Wednesday', 'Friday', 'Saturday'], 6, 4000),
  approvedDoc('d2', 'Dr. Sharmila Bannerjee, MD', 'dr.sharmila@caresphere.com', '+91 98310 99420', 'General Physician & Diabetologist', 'WBMC-63102', 700, ['Tuesday', 'Thursday', 'Saturday', 'Sunday'], 5, 2800),
  approvedDoc('d3', 'Dr. Arindam Ganguly, MS, MCh', 'dr.arindam@caresphere.com', '+91 91632 44781', 'Neurologist & Neurosurgeon', 'WBMC-52119', 1200, ['Monday', 'Tuesday', 'Thursday'], 4, 3600),
  approvedDoc('d4', 'Dr. Priya Nambiar, MD, DCH', 'dr.priya@caresphere.com', '+91 97412 88219', 'Pediatrician', 'KMC-41920', 650, ['Monday', 'Wednesday', 'Thursday', 'Saturday'], 5, 1950),
  {
    id: 'd5',
    status: 'pending',
    name: 'Dr. Tanmoy Sengupta, MD, DNB',
    specialty: 'Pulmonologist & Chest Specialist',
    qualifications: 'MBBS (Cal), MD (Pulmonary Medicine), European Diploma in Adult Respiratory Medicine',
    regNo: 'WBMC-71932',
    dues: 0,
    slotDays: [],
    dailySlots: 0,
    experience: 11,
    fee: 850,
    email: 'dr.tanmoy.s@example.com',
    phone: '+91 98319 77123',
    document: { name: 'Medical_Registration_Council_License_WBMC-71932.pdf', url: '#' },
  },
];

const STATS_STATIC = { revenue: 2300 };

const APPOINTMENTS = [
  { ref: 'APT-1001', patientName: 'Jun Mukherjee', patientId: 'PT-2026-8842', doctorName: 'Dr. Debabrata Roy, MD, DM', specialty: 'Cardiologist', date: '2026-10-02', time: '10:00 AM', fee: 1000, payment: 'UPI (Google Pay)', status: 'Scheduled' },
  { ref: 'APT-1002', patientName: 'Jun Mukherjee', patientId: 'PT-2026-8842', doctorName: 'Dr. Sharmila Bannerjee, MD', specialty: 'General Physician & Diabetologist', date: '2026-09-20', time: '11:00 AM', fee: 700, payment: 'Credit Card', status: 'Completed' },
];

const PAYMENTS = [
  { paymentId: 'pay_RAZOR_984129', orderId: 'ORD_APT_1001', type: 'Doctor Appointment', payerName: 'Jun Mukherjee', payerEmail: 'junmukherjee562@gmail.com', beneficiary: 'Dr. Debabrata Roy, MD, DM', amount: 1000, method: 'UPI', status: 'SUCCESS', date: '9/28/2026' },
  { paymentId: 'pay_RAZ_7749102', orderId: 'ORD_TEST_9910', type: 'Diagnostic Test', payerName: 'Jun Mukherjee', payerEmail: 'junmukherjee562@gmail.com', beneficiary: 'CareSphere Pathology Lab', amount: 450, method: 'UPI', status: 'SUCCESS', date: '9/21/2026' },
  { paymentId: 'pay_RAZ_8820194', orderId: 'ORD_TEST_9911', type: 'Diagnostic Test', payerName: 'Jun Mukherjee', payerEmail: 'junmukherjee562@gmail.com', beneficiary: 'CareSphere Biochemistry Lab', amount: 850, method: 'Netbanking', status: 'SUCCESS', date: '9/28/2026' },
];

const PATIENTS = [
  { id: 'PT-2026-8842', name: 'Jun Mukherjee', email: 'junmukherjee562@gmail.com', phone: '+91 98301 24590', gender: 'Male', dob: '1998-04-14', blood: 'B+', address: 'Block B-4, Salt Lake Sector V, Kolkata, WB - 700091' },
  { id: 'PT-2026-3190', name: 'Ananya Sen', email: 'ananya.sen@example.com', phone: '+91 98745 61230', gender: 'Female', dob: '1992-09-22', blood: 'O+', address: 'Flat 302, Green Glen Layout, Bellandur, Bengaluru - 560103' },
];

const inr = (n) => '₹' + n.toLocaleString('en-IN');

export default function AdminConsole() {
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [tab, setTab] = useState('onboarding');
  const [refreshing, setRefreshing] = useState(false);
  const [payouts, setPayouts] = useState(INITIAL_PAYOUTS);
  const disbursed = payouts.reduce((sum, p) => sum + p.amount, 0);
  const [payError, setPayError] = useState('');
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [reports, setReports] = useState(INITIAL_REPORTS);

  const saveReport = (ref, draft) => {
    setReports((r) => ({ ...r, [ref]: draft }));
    setBookings((list) => list.map((b) => (b.ref === ref && b.status !== 'Completed' ? { ...b, status: 'Report Ready' } : b)));
  };
  const publishReport = (ref, draft) => {
    setReports((r) => ({ ...r, [ref]: draft }));
    setBookings((list) => list.map((b) => (b.ref === ref ? { ...b, status: 'Completed' } : b)));
  };

  const pending = useMemo(() => doctors.filter((d) => d.status === 'pending'), [doctors]);
  const approvedDoctors = useMemo(() => doctors.filter((d) => d.status === 'approved'), [doctors]);
  const rejectedDoctors = useMemo(() => doctors.filter((d) => d.status === 'rejected'), [doctors]);
  const approvedCount = approvedDoctors.length;

  const payDoctor = (id) => {
    const doc = doctors.find((d) => d.id === id);
    if (!doc || !doc.dues) return;
    setPayError('');
    payWithRazorpay({
      amount: doc.dues,
      description: `Consultation payout - ${doc.name}`,
      onSuccess: (res) => {
        setPayouts((list) => [
          { ref: res.razorpay_payment_id, doctorName: doc.name, amount: doc.dues, method: res.demo ? 'Razorpay (demo)' : 'Razorpay', date: new Date().toLocaleDateString('en-US') },
          ...list,
        ]);
        setDoctors((list) => list.map((d) => (d.id === id ? { ...d, dues: 0 } : d)));
      },
      onFailure: (msg) => msg && setPayError(msg),
    });
  };

  const decide = (id, status) =>
    setDoctors((list) =>
      list.map((d) =>
        d.id === id ? { ...d, status, rejectedAt: status === 'rejected' ? new Date().toLocaleDateString('en-US') : undefined } : d
      )
    );

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800); // swap for real fetch
  };

  const stats = [
    { label: 'Total Patients', value: PATIENTS.length },
    { label: 'Approved Doctors', value: approvedCount },
    { label: 'Pending Doctor Reqs', value: pending.length, alert: true },
    { label: 'Appointments', value: APPOINTMENTS.length },
    { label: 'Gross Revenue', value: inr(STATS_STATIC.revenue), money: true },
    { label: 'Doctor Disbursed', value: inr(disbursed) },
  ];

  const tabs = [
    { id: 'onboarding', label: 'Doctor Onboarding Requests', badge: pending.length },
    { id: 'rejected', label: `Rejected Doctors (${rejectedDoctors.length})` },
    { id: 'users', label: `All Registered Users (${approvedCount + PATIENTS.length})` },
    { id: 'appointments', label: `Doctor Appointments (${APPOINTMENTS.length})` },
    { id: 'reports', label: 'Diagnostic Reports Manager' },
    { id: 'payments', label: 'User Payments Ledger' },
    { id: 'payouts', label: 'Doctor Payouts' },
  ];

  return (
    <div className="cs-admin">
      <div className="cs-wrap">
        <header className="cs-card cs-header">
          <div>
            <h1 className="cs-title">
              <span className="cs-logo"><ShieldCheck size={22} /></span>
              CareSphere Chief Medical Admin Console
            </h1>
            <p className="cs-sub">Supervise registered clinical users, doctor approvals, diagnostic lab reports, and UPI/Netbanking payouts</p>
          </div>
          <button className={`cs-btn-refresh ${refreshing ? 'cs-spin' : ''}`} onClick={refresh}>
            <RefreshCw size={16} /> Refresh Data
          </button>
        </header>

        <section className="cs-stats" aria-label="Summary">
          {stats.map((s) => (
            <div key={s.label} className={`cs-card cs-stat ${s.alert ? 'is-alert' : ''} ${s.money ? 'is-money' : ''}`}>
              <div className="cs-stat-label">{s.label}</div>
              <div className="cs-stat-value">{s.value}</div>
            </div>
          ))}
        </section>

        {payError && (
          <div className="cs-alert" role="alert">
            <span>{payError}</span>
            <button onClick={() => setPayError('')} aria-label="Dismiss">×</button>
          </div>
        )}

        <nav className="cs-tabs" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={`cs-tab ${tab === t.id ? 'is-active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
              {t.badge > 0 && <span className="cs-badge">{t.badge}</span>}
            </button>
          ))}
        </nav>

        {tab === 'onboarding' ? (
          <>
            <div className="cs-section-head">
              <h2>Doctor Registration Requests Awaiting Council Approval</h2>
              <p>Review qualifications and attached PDF documents before granting portal access</p>
            </div>
            {pending.length === 0 ? (
              <div className="cs-card cs-empty">No pending requests. New doctor registrations will appear here.</div>
            ) : (
              <div className="cs-requests">
                {pending.map((d) => <DoctorCard key={d.id} doctor={d} mode="pending" onDecide={decide} />)}
              </div>
            )}
          </>
        ) : tab === 'rejected' ? (
          <RejectedTab doctors={rejectedDoctors} onDecide={decide} />
        ) : tab === 'users' ? (
          <UsersTab doctors={approvedDoctors} patients={PATIENTS} onPay={payDoctor} />
        ) : tab === 'appointments' ? (
          <AppointmentsTab appointments={APPOINTMENTS} />
        ) : tab === 'payments' ? (
          <PaymentsTab payments={PAYMENTS} />
        ) : tab === 'reports' ? (
          <ReportsTab bookings={bookings} reports={reports} onSave={saveReport} onPublish={publishReport} />
        ) : tab === 'payouts' ? (
          <PayoutsTab doctors={approvedDoctors} codes={DOCTOR_CODES} payouts={payouts} onPay={payDoctor} />
        ) : (
          <div className="cs-section-head">
            <div className="cs-card cs-placeholder">{tabs.find((t) => t.id === tab).label} — screen coming next.</div>
          </div>
        )}
      </div>

      <footer className="cs-footer">
        <div className="cs-footer-brand">
          <span className="cs-footer-mark">CS</span>
          <strong>CareSphere Healthcare &amp; Clinical Systems</strong>
          <span>· NABL Accredited &amp; MCI Registered</span>
        </div>
        <div className="cs-footer-note">Compliant with clinical health record standards. Medical predictions are advisory only.</div>
      </footer>
    </div>
  );
}