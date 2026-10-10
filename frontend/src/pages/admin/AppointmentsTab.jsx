const inr = (n) => '₹' + n.toLocaleString('en-IN');

export default function AppointmentsTab({ appointments }) {
  return (
    <>
      <h2 className="cs-table-title">All Clinical Doctor Appointments ({appointments.length})</h2>
      <div className="cs-card cs-table-card">
        <div className="cs-table-scroll">
          <table className="cs-table" style={{ minWidth: 980 }}>
            <thead>
              <tr>
                <th>Appt Ref</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Scheduled Date &amp; Slot</th>
                <th>Fee / Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.ref}>
                  <td className="cs-mono-bold">{a.ref}</td>
                  <td>
                    <div className="cs-strong">{a.patientName}</div>
                    <div className="cs-mono-small">{a.patientId}</div>
                  </td>
                  <td>
                    <div className="cs-doctor-name">{a.doctorName}</div>
                    <div className="cs-teal-text">{a.specialty}</div>
                  </td>
                  <td>
                    <div className="cs-mono-date">{a.date}</div>
                    <div className="cs-faint">{a.time}</div>
                  </td>
                  <td>
                    <div className="cs-mono-bold">{inr(a.fee)}</div>
                    <div className="cs-teal-text">{a.payment}</div>
                  </td>
                  <td>
                    <span className={`cs-status ${a.status === 'Scheduled' ? 'is-scheduled' : 'is-completed'}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}