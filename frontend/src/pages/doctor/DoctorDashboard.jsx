
import { useState } from "react";
import "./DoctorDashboard.css";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "appointments", label: "Appointments", icon: "▤" },
  { id: "availability", label: "Availability", icon: "◷" },
  { id: "records", label: "Patient Records", icon: "♟" },
];

const stats = [
  { title: "Total Patients", value: "1,284", icon: "♟", color: "blue", note: "↑ 12.8% vs last month" },
  { title: "Appointments", value: "42", icon: "▦", color: "purple", note: "↑ 8.2% vs last month" },
  { title: "Pending Requests", value: "08", icon: "◷", color: "orange", note: "Needs your attention" },
  { title: "Completed Visits", value: "36", icon: "✓", color: "green", note: "↑ 5.4% this week" },
];

const appointments = [
  { id: "APT-1024", initials: "OR", name: "Olivia Rhye", type: "General Consultation", time: "09:00 AM", date: "13 Nov 2026", status: "Confirmed", color: "purple" },
  { id: "APT-1025", initials: "PB", name: "Phoenix Baker", type: "Follow-up", time: "10:30 AM", date: "13 Nov 2026", status: "Pending", color: "blue" },
  { id: "APT-1026", initials: "LS", name: "Lana Steiner", type: "Dental Checkup", time: "11:30 AM", date: "13 Nov 2026", status: "Confirmed", color: "pink" },
  { id: "APT-1027", initials: "DW", name: "Demi Wilkinson", type: "General Consultation", time: "02:00 PM", date: "13 Nov 2026", status: "Completed", color: "green" },
];

const patients = [
  { id: "PT-1001", initials: "OR", name: "Olivia Rhye", age: 28, gender: "Female", condition: "General Checkup", lastVisit: "13 Nov 2026", color: "purple" },
  { id: "PT-1002", initials: "PB", name: "Phoenix Baker", age: 35, gender: "Male", condition: "Blood Pressure", lastVisit: "12 Nov 2026", color: "blue" },
  { id: "PT-1003", initials: "LS", name: "Lana Steiner", age: 42, gender: "Female", condition: "Dental Checkup", lastVisit: "10 Nov 2026", color: "pink" },
  { id: "PT-1004", initials: "DW", name: "Demi Wilkinson", age: 31, gender: "Female", condition: "General Checkup", lastVisit: "08 Nov 2026", color: "green" },
];

const weeklyData = [
  { day: "Mon", height: 45 },
  { day: "Tue", height: 72 },
  { day: "Wed", height: 56 },
  { day: "Thu", height: 87 },
  { day: "Fri", height: 64 },
  { day: "Sat", height: 39 },
  { day: "Sun", height: 23 },
];

const initialSchedule = [
  { day: "Monday", time: "09:00 AM – 05:00 PM", enabled: true },
  { day: "Tuesday", time: "09:00 AM – 05:00 PM", enabled: true },
  { day: "Wednesday", time: "09:00 AM – 05:00 PM", enabled: true },
  { day: "Thursday", time: "09:00 AM – 05:00 PM", enabled: true },
  { day: "Friday", time: "09:00 AM – 03:00 PM", enabled: true },
  { day: "Saturday", time: "09:00 AM – 01:00 PM", enabled: false },
  { day: "Sunday", time: "Unavailable", enabled: false },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning, Doctor ☀️";
  if (hour < 17) return "Good afternoon, Doctor 👋";
  if (hour < 21) return "Good evening, Doctor 🌆";
  return "Good night, Doctor 🌙";
}

function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [schedule, setSchedule] = useState(initialSchedule);
  const [notification, setNotification] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.id} ${patient.condition}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const toggleSchedule = (index) => {
    setSchedule((previous) =>
      previous.map((item, i) =>
        i === index ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const renderStats = () => (
    <section className="doctor-stats">
      {stats.map((stat) => (
        <div className="doctor-card stat-card" key={stat.title}>
          <div className="stat-top">
            <span>{stat.title}</span>
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
          </div>
          <h2>{stat.value}</h2>
          <p className={stat.color === "orange" ? "warning-text" : "trend-text"}>
            {stat.note}
          </p>
        </div>
      ))}
    </section>
  );

  const renderNavigation = () => (
    <nav className="doctor-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`doctor-nav-item ${activeTab === item.id ? "active" : ""}`}
          onClick={() => {
            setActiveTab(item.id);
            setSearch("");
          }}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );

  const renderDashboard = () => (
    <section className="doctor-content-grid">
      <div className="doctor-card appointments-card">
        <div className="card-heading">
          <div>
            <h3>Today's Appointments</h3>
            <p>You have 4 scheduled appointments today.</p>
          </div>
          <span className="date-label">{currentDate}</span>
        </div>

        <div className="appointment-row table-header">
          <span>Patient</span>
          <span>Time</span>
          <span>Status</span>
        </div>

        {appointments.map((item) => (
          <div className="appointment-row" key={item.id}>
            <div className="patient-info">
              <div className={`patient-avatar ${item.color}`}>
                {item.initials}
              </div>
              <div>
                <strong>{item.name}</strong>
                <small>{item.type}</small>
              </div>
            </div>
            <span className="appointment-time">{item.time}</span>
            <span className={`appointment-status ${item.status.toLowerCase()}`}>
              {item.status}
            </span>
          </div>
        ))}

        <button className="doctor-text-btn" onClick={() => setActiveTab("appointments")}>
          View all appointments →
        </button>
      </div>

      <div className="doctor-card weekly-card">
        <div className="card-heading">
          <div>
            <h3>Weekly Overview</h3>
            <p>Appointment activity</p>
          </div>
          <span className="more-btn">•••</span>
        </div>

        <div className="weekly-total">
          <strong>186</strong>
          <span>Appointments this week</span>
        </div>

        <div className="weekly-chart">
          {weeklyData.map((item) => (
            <div className="chart-column" key={item.day}>
              <div className="chart-bar-bg">
                <div className="chart-bar" style={{ height: `${item.height}%` }} />
              </div>
              <span>{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderAppointments = () => (
    <section className="doctor-card module-card">
      <div className="module-heading">
        <div>
          <h2>All Appointments</h2>
          <p>Manage your patient appointments and consultation schedules.</p>
        </div>
        <span className="module-count">04 Appointments</span>
      </div>

      <div className="cs-table-scroll">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Patient</th>
              <th>Consultation</th>
              <th>Date & Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.id}>
                <td className="mono-text">{item.id}</td>
                <td>
                  <div className="patient-info">
                    <div className={`patient-avatar ${item.color}`}>{item.initials}</div>
                    <strong>{item.name}</strong>
                  </div>
                </td>
                <td>{item.type}</td>
                <td>
                  <strong>{item.date}</strong>
                  <small className="table-subtext">{item.time}</small>
                </td>
                <td>
                  <span className={`appointment-status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderAvailability = () => (
    <section className="doctor-card module-card">
      <div className="module-heading">
        <div>
          <h2>Availability & Schedule</h2>
          <p>Manage your weekly consultation hours.</p>
        </div>
        <span className="module-count">Weekly Schedule</span>
      </div>

      <div className="schedule-list">
        {schedule.map((item, index) => (
          <div className="schedule-row" key={item.day}>
            <div>
              <strong>{item.day}</strong>
              <small>{item.time}</small>
            </div>
            <div className="schedule-action">
              <span className={item.enabled ? "available-label" : "unavailable-label"}>
                {item.enabled ? "Available" : "Unavailable"}
              </span>
              <button
                className={`schedule-toggle ${item.enabled ? "enabled" : ""}`}
                onClick={() => toggleSchedule(index)}
                aria-label={`Toggle ${item.day} availability`}
                aria-pressed={item.enabled}
              >
                <span />
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="schedule-note">
        Note: These are sample schedules. Changes are currently stored only in this browser session.
      </p>
    </section>
  );

  const renderRecords = () => (
    <section className="doctor-card module-card">
      <div className="module-heading">
        <div>
          <h2>Patient Records</h2>
          <p>View your registered patients and their consultation history.</p>
        </div>
        <span className="module-count">{filteredPatients.length} Patients</span>
      </div>

      <div className="patient-search">
        <span>⌕</span>
        <input
          type="search"
          placeholder="Search by patient name, ID or condition..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="cs-table-scroll">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Patient ID</th>
              <th>Age / Gender</th>
              <th>Condition</th>
              <th>Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>
                  <div className="patient-info">
                    <div className={`patient-avatar ${patient.color}`}>{patient.initials}</div>
                    <strong>{patient.name}</strong>
                  </div>
                </td>
                <td className="mono-text">{patient.id}</td>
                <td>{patient.age} / {patient.gender}</td>
                <td>{patient.condition}</td>
                <td>{patient.lastVisit}</td>
              </tr>
            ))}
            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-state">No patients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderActivePage = () => {
    switch (activeTab) {
      case "appointments":
        return renderAppointments();
      case "availability":
        return renderAvailability();
      case "records":
        return renderRecords();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="doctor-dashboard">
      <div className="doctor-container">

        <header className="doctor-header">
          <div className="doctor-brand">
            <div className="brand-icon">✚</div>
            <span>CareSphere</span>
            <span className="workspace-label">DOCTOR WORKSPACE</span>
          </div>

          <div className="doctor-profile">
            <div className="notification-wrapper">
              <button
                className="notification-btn"
                aria-label="Notifications"
                onClick={() => setNotification(!notification)}
              >
                ♧
                <span className="notification-dot" />
              </button>
              {notification && (
                <div className="notification-popup">
                  <strong>Notifications</strong>
                  <p>You have 2 pending appointment requests.</p>
                </div>
              )}
            </div>
            <div className="profile-avatar">DR</div>
          </div>
        </header>

        <section className="doctor-welcome">
          <div>
            <h1>{getGreeting()}</h1>
            <p>Here's what's happening with your practice today.</p>
          </div>
          <span className="date-label">{currentDate}</span>
        </section>

        <main className="doctor-page-content">
          {renderStats()}
          {renderNavigation()}
          {renderActivePage()}
        </main>

        <footer className="doctor-footer">
          <span>© 2026 CareSphere. All rights reserved.</span>
          <span>Doctor Workspace</span>
        </footer>

      </div>
    </div>
  );
}

export default DoctorDashboard;
