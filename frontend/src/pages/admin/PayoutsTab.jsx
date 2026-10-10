const inr = (n) => '₹' + n.toLocaleString('en-IN');

export default function PayoutsTab({ doctors, codes, payouts, onPay }) {
  return (
    <>
      <div className="cs-payout-head">
        <h2>Doctor Payouts &amp; Settlement</h2>
        <p>Pay consultation earnings securely with Razorpay. UPI, netbanking, cards and wallets are offered at checkout.</p>
      </div>

      <div className="cs-payout-grid">
        {doctors.map((d) => (
          <article key={d.id} className="cs-card cs-payout-card">
            <div className="cs-payout-top">
              <div>
                <h3 className="cs-payout-name">{d.name}</h3>
                <div className="cs-teal-text cs-payout-spec">{d.specialty}</div>
              </div>
              <span className="cs-chip">{codes[d.id] ?? 'NEW'}</span>
            </div>

            <div className="cs-dues-box">
              <div className="cs-dues-label">ACCUMULATED CONSULTATION DUES</div>
              <div className="cs-dues-value">{inr(d.dues)}</div>
            </div>

            <button className="cs-btn-dark" disabled={d.dues === 0} onClick={() => onPay(d.id)}>
              {d.dues === 0 ? 'No dues pending' : `Pay  ${inr(d.dues)} `}
            </button>
          </article>
        ))}
      </div>

      <h2 className="cs-table-title">Completed Doctor Disbursements History</h2>
      <div className="cs-card cs-table-card">
        <div className="cs-table-scroll">
          <table className="cs-table" style={{ minWidth: 800 }}>
            <thead>
              <tr>
                <th>Razorpay Payment ID</th>
                <th>Doctor</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 ? (
                <tr><td colSpan={5} className="cs-faint">No payouts yet. Completed payments will appear here.</td></tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p.ref}>
                    <td className="cs-mono-small cs-ink">{p.ref}</td>
                    <td className="cs-strong">{p.doctorName}</td>
                    <td className="cs-mono-bold cs-teal-strong">{inr(p.amount)}</td>
                    <td>{p.method}</td>
                    <td className="cs-mono-date cs-muted-text">{p.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}