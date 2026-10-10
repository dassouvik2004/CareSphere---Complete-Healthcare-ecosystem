import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Printer, X } from 'lucide-react';

const num = (v) => (v === '' || v == null ? null : Number(v));
const fmt = (v, dp = 0) => (num(v) === null || isNaN(num(v)) ? '—' : Number(v).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp }));

const fmtRange = (m) => {
  const lo = num(m.min), hi = num(m.max);
  if (lo !== null && hi !== null) return `${fmt(lo, m.dp)} - ${fmt(hi, m.dp)}`;
  if (hi !== null) return `< ${fmt(hi, m.dp)}`;
  if (lo !== null) return `> ${fmt(lo, m.dp)}`;
  return '—';
};

const flagOf = (m) => {
  const v = num(m.value);
  if (v === null || isNaN(v)) return 'Pending';
  if (num(m.min) !== null && v < num(m.min)) return 'Low';
  if (num(m.max) !== null && v > num(m.max)) return 'High';
  return 'Normal';
};

const nowStamp = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  const h = d.getHours() % 12 || 12;
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(h)}:${p(d.getMinutes())} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
};

export default function ReportModal({ booking, report, onClose, onSave, onPublish }) {
  const [draft, setDraft] = useState(() => structuredClone(report));
  const [editing, setEditing] = useState(booking.status !== 'Completed');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const setMarker = (i, field, val) =>
    setDraft((d) => ({ ...d, markers: d.markers.map((m, j) => (j === i ? { ...m, [field]: val === '' && field !== 'value' ? null : val } : m)) }));

  const flags = draft.markers.map(flagOf);
  const overall = flags.includes('Pending') ? 'PENDING' : flags.some((f) => f !== 'Normal') ? 'ABNORMAL' : 'NORMAL';

  const cancel = () => { setDraft(structuredClone(report)); setEditing(false); };
  const publish = () => { const out = { ...draft, released: nowStamp() }; setDraft(out); onPublish(out); setEditing(false); };
  const save = () => { onSave(draft); setEditing(false); };

  return createPortal(
    <div className="cs-modal-backdrop" onClick={onClose}>
      <div className="cs-modal" role="dialog" aria-modal="true" aria-label="Diagnostic report" onClick={(e) => e.stopPropagation()}>
        <div className="cs-modal-bar cs-no-print">
          <div className="cs-modal-title"><FileText size={18} /> Diagnostic Laboratory Investigation Report</div>
          <div className="cs-modal-actions">
            {!editing && <button className="cs-btn-outline cs-small" onClick={() => setEditing(true)}>Edit / Update Report</button>}
            <button className="cs-btn-outline cs-small cs-btn-plain" onClick={() => window.print()}><Printer size={14} /> Print / PDF</button>
            <button className="cs-icon-btn" onClick={onClose} aria-label="Close report"><X size={20} /></button>
          </div>
        </div>

        <div className="cs-modal-body">
          <div className="cs-report-sheet">
            <div className="cs-rep-head">
              <div>
                <div className="cs-rep-lab"><span className="cs-footer-mark cs-rep-mark">CS</span> CARESPHERE CENTRAL PATHOLOGY &amp; RADIOLOGY</div>
                <div className="cs-rep-sub">NABL Accredited Laboratory · ISO 15189:2022 Certified Reference Center</div>
                <div className="cs-rep-sub cs-teal-text">Salt Lake Sector V, Diagnostic Hub, Kolkata 700091 | Helpline: 1800-200-CARE</div>
              </div>
              <div className="cs-rep-ids">
                <div>Report ID: {draft.reportId}</div>
                <div>Booking Ref: {draft.bookingNo}</div>
                <span className={`cs-rep-overall is-${overall.toLowerCase()}`}>STATUS: {overall}</span>
              </div>
            </div>
            <hr className="cs-rep-rule" />

            <div className="cs-rep-patient">
              <div><span>PATIENT NAME</span><strong>{booking.patientName}</strong></div>
              <div><span>PATIENT ID / DEMOGRAPHICS</span><code>{booking.patientId} · {booking.age} Y / {booking.gender}</code></div>
              <div>
                <span>SAMPLE COLLECTED</span>
                {editing ? <input className="cs-input cs-input-wide" aria-label="Sample collected" value={draft.collected} onChange={(e) => setDraft({ ...draft, collected: e.target.value })} /> : <code>{draft.collected}</code>}
              </div>
              <div><span>REPORT RELEASED</span><code>{draft.released || 'Not released yet'}</code></div>
            </div>

            <h3 className="cs-rep-test">{booking.test}</h3>
            <div className="cs-teal-text cs-rep-panel">{draft.panel}</div>

            <div className="cs-rep-table-wrap">
              <table className="cs-rep-table">
                <thead>
                  <tr><th>Investigation / Marker</th><th>Observed Value</th><th>Unit</th><th>Biological Reference Interval</th><th>Clinical Flag</th></tr>
                </thead>
                <tbody>
                  {draft.markers.map((m, i) => (
                    <tr key={m.name}>
                      <td>{m.name}</td>
                      <td className="cs-mono-bold">
                        {editing ? <input className="cs-input" type="number" step="any" aria-label={`${m.name} value`} value={m.value} onChange={(e) => setMarker(i, 'value', e.target.value)} /> : fmt(m.value, m.dp)}
                      </td>
                      <td className="cs-mono-small">{m.unit}</td>
                      <td className="cs-mono-small">
                        {editing ? (
                          <span className="cs-range-edit">
                            <input className="cs-input" type="number" step="any" aria-label={`${m.name} minimum`} value={m.min ?? ''} onChange={(e) => setMarker(i, 'min', e.target.value)} />
                            –
                            <input className="cs-input" type="number" step="any" aria-label={`${m.name} maximum`} value={m.max ?? ''} onChange={(e) => setMarker(i, 'max', e.target.value)} />
                          </span>
                        ) : fmtRange(m)}
                      </td>
                      <td><span className={`cs-flag is-${flags[i].toLowerCase()}`}>{flags[i]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cs-rep-label">PATHOLOGIST CLINICAL IMPRESSION:</div>
            {editing ? <textarea className="cs-textarea" rows={2} value={draft.impression} onChange={(e) => setDraft({ ...draft, impression: e.target.value })} /> : <div className="cs-rep-box">{draft.impression || '—'}</div>}

            <div className="cs-rep-label">DOCTOR / CLINICAL REMARKS:</div>
            {editing ? <textarea className="cs-textarea" rows={2} value={draft.remarks} onChange={(e) => setDraft({ ...draft, remarks: e.target.value })} /> : <div className="cs-rep-box">{draft.remarks || '—'}</div>}

            <hr className="cs-rep-rule cs-rep-rule-light" />
            <div className="cs-rep-foot">
              <div className="cs-teal-text">
                <div>*** End of Diagnostic Investigation Report ***</div>
                <div>Automated barcoded specimen verified under CareSphere Laboratory SOP-802.</div>
              </div>
              <div className="cs-rep-sign">
                {editing ? (
                  <>
                    <input className="cs-input cs-input-wide" aria-label="Doctor name and qualification" placeholder="Doctor name, qualification" value={draft.signedBy} onChange={(e) => setDraft({ ...draft, signedBy: e.target.value })} />
                    <input className="cs-input cs-input-wide" aria-label="Doctor designation" placeholder="Designation, lab" value={draft.signedTitle ?? ''} onChange={(e) => setDraft({ ...draft, signedTitle: e.target.value })} />
                  </>
                ) : (
                  <>
                    <strong>{draft.signedBy}</strong>
                    <div className="cs-teal-text">{draft.signedTitle}</div>
                  </>
                )}
                <code>Digitally Authenticated Certificate</code>
              </div>
            </div>
          </div>
        </div>

        {editing && (
          <div className="cs-modal-footer cs-no-print">
            <button className="cs-btn cs-btn-reject" onClick={cancel}>Cancel</button>
            <button className="cs-btn cs-btn-reject cs-btn-neutral" onClick={save}>Save draft</button>
            <button className="cs-btn cs-btn-approve" onClick={publish}>Publish report</button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}