import { useState } from 'react';
import ReportModal from './ReportModal';

const inr = (n) => '₹' + n.toLocaleString('en-IN');

export default function ReportsTab({ bookings, reports, onSave, onPublish }) {
  const [openRef, setOpenRef] = useState(null);
  const booking = bookings.find((b) => b.ref === openRef);

  return (
    <>
      <div className="cs-section-head">
        <h2>Diagnostic Test Bookings &amp; Report Updates</h2>
        <p>Admin can enter lab results, calibrate biological ranges, and release certified reports to patients</p>
      </div>
      <div className="cs-card cs-table-card">
        <div className="cs-table-scroll">
          <table className="cs-table" style={{ minWidth: 1000 }}>
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Patient</th>
                <th>Diagnostic Test</th>
                <th>Date / Slot</th>
                <th>Amount</th>
                <th>Lab Status</th>
                <th className="is-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.ref}>
                  <td className="cs-mono-bold">{b.ref}</td>
                  <td>
                    <div className="cs-strong">{b.patientName}</div>
                    <div className="cs-mono-small">{b.patientId}</div>
                  </td>
                  <td>
                    <div className="cs-strong">{b.test}</div>
                    <div className="cs-teal-text">{b.category}</div>
                  </td>
                  <td className="cs-mono-date">{b.date} · {b.slot}{b.fasting ? ' (Fasting)' : ''}</td>
                  <td className="cs-mono-bold">{inr(b.amount)}</td>
                  <td><span className="cs-status is-scheduled">{b.status}</span></td>
                  <td className="is-right">
                    <button className="cs-btn-outline" onClick={() => setOpenRef(b.ref)}>Update / Publish Report</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {booking && (
        <ReportModal
          key={booking.ref}
          booking={booking}
          report={reports[booking.ref]}
          onClose={() => setOpenRef(null)}
          onSave={(d) => onSave(booking.ref, d)}
          onPublish={(d) => onPublish(booking.ref, d)}
        />
      )}
    </>
  );
}