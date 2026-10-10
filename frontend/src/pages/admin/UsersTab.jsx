const inr = (n) => '₹' + n.toLocaleString('en-IN');

export default function UsersTab({ doctors, patients, onPay }) {
  return (
    <>
      <h2 className="cs-table-title">Active Verified Doctors ({doctors.length})</h2>
      <div className="cs-card cs-table-card">
        <div className="cs-table-scroll">
          <table className="cs-table" style={{ minWidth: 980 }}>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialization &amp; Reg</th>
                <th>Consultation Fee</th>
                <th>Available Slots</th>
                <th>Pending Dues</th>
                <th className="is-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div className="cs-strong">{d.name}</div>
                    <div className="cs-teal-text">{d.email} · {d.phone}</div>
                  </td>
                  <td>
                    <div className="cs-teal-text cs-spec">{d.specialty}</div>
                    <div className="cs-mono-small">Reg: {d.regNo}</div>
                  </td>
                  <td className="cs-mono-bold">{inr(d.fee)}</td>
                  <td>
                    {d.slotDays?.length ? (
                      <>
                        <div className="cs-slot-days">{d.slotDays.join(', ')}</div>
                        <div className="cs-faint">{d.dailySlots} daily slots configured</div>
                      </>
                    ) : (
                      <div className="cs-faint">Not configured yet</div>
                    )}
                  </td>
                  <td className="cs-mono-bold cs-teal-strong">{inr(d.dues)}</td>
                  <td className="is-right">
                    <button className="cs-btn-pay" disabled={d.dues === 0} onClick={() => onPay(d.id)}>
                      {d.dues === 0 ? 'Paid' : 'Pay Doctor'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="cs-table-title">Registered Patients Directory ({patients.length})</h2>
      <div className="cs-card cs-table-card">
        <div className="cs-table-scroll">
          <table className="cs-table" style={{ minWidth: 980 }}>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Name</th>
                <th>Contact Email &amp; Phone</th>
                <th>Gender / DOB / Blood</th>
                <th>Residential Address</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td className="cs-mono-bold cs-teal-strong">{p.id}</td>
                  <td className="cs-strong">{p.name}</td>
                  <td>
                    <div>{p.email}</div>
                    <div className="cs-faint">{p.phone}</div>
                  </td>
                  <td>
                    {p.gender} · {p.dob} · <span className="cs-blood">{p.blood}</span>
                  </td>
                  <td>{p.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}