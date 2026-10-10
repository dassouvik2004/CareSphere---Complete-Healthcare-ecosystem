import { FileText, XCircle, CheckCircle2 } from 'lucide-react';

const inr = (n) => '₹' + n.toLocaleString('en-IN');

// mode: 'pending' (Approve + Reject) or 'rejected' (Approve only)
export default function DoctorCard({ doctor: d, mode = 'pending', onDecide }) {
  const rejected = mode === 'rejected';
  return (
    <article className="cs-card cs-req">
      <div className="cs-req-top">
        <div>
          <h3 className="cs-req-name">{d.name}</h3>
          <p className="cs-req-spec">{d.specialty}</p>
          <p className="cs-req-qual">{d.qualifications}</p>
        </div>
        <span className={`cs-pill ${rejected ? 'is-rejected' : ''}`}>{rejected ? 'REJECTED' : 'PENDING REVIEW'}</span>
      </div>

      <dl className="cs-info">
        <div><dt>Medical Council Reg No</dt><dd className="is-mono">{d.regNo}</dd></div>
        <div><dt>Experience / Fee</dt><dd>{d.experience} yrs · {inr(d.fee)}</dd></div>
        <div className="is-wide"><dt>Contact</dt><dd>{d.email} · {d.phone}</dd></div>
        {rejected && <div className="is-wide"><dt>Rejected on</dt><dd>{d.rejectedAt}</dd></div>}
      </dl>

      {d.document && (
        <div className="cs-doc">
          <FileText size={26} />
          <div>
            <div className="cs-doc-name">{d.document.name}</div>
            <div className="cs-doc-meta">Valid Format: .pdf Verified</div>
          </div>
          <a href={d.document.url} target="_blank" rel="noreferrer">PDF Document</a>
        </div>
      )}

      <div className="cs-actions">
        {!rejected && (
          <button className="cs-btn cs-btn-reject" onClick={() => onDecide(d.id, 'rejected')}><XCircle size={16} /> Reject</button>
        )}
        <button className="cs-btn cs-btn-approve" onClick={() => onDecide(d.id, 'approved')}><CheckCircle2 size={16} /> Approve Doctor</button>
      </div>
    </article>
  );
}