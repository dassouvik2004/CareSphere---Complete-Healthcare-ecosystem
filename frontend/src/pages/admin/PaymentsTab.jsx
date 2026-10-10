const inr = (n) => '₹' + n.toLocaleString('en-IN');

export default function PaymentsTab({ payments }) {
  return (
    <>
      <div className="cs-section-head">
        <h2>Users Payment Details &amp; Transactions Ledger</h2>
        <p>Razorpay transaction IDs, payment methods, and timestamps</p>
      </div>
      <div className="cs-card cs-table-card">
        <div className="cs-table-scroll">
          <table className="cs-table" style={{ minWidth: 1000 }}>
            <thead>
              <tr>
                <th>Txn ID / Payment ID</th>
                <th>Type</th>
                <th>Payer Details</th>
                <th>Beneficiary</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.paymentId}>
                  <td>
                    <div className="cs-mono-bold">{p.paymentId}</div>
                    <div className="cs-mono-small cs-faint">{p.orderId}</div>
                  </td>
                  <td>{p.type}</td>
                  <td>
                    <div className="cs-strong cs-payer-name">{p.payerName}</div>
                    <div className="cs-teal-text">{p.payerEmail}</div>
                  </td>
                  <td>{p.beneficiary}</td>
                  <td className="cs-mono-bold cs-teal-strong">{inr(p.amount)}</td>
                  <td>{p.method}</td>
                  <td>
                    <span className="cs-status is-success">{p.status}</span>
                  </td>
                  <td className="cs-mono-date cs-muted-text">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}