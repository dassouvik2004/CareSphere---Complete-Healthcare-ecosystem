import DoctorCard from './DoctorCard';

export default function RejectedTab({ doctors, onDecide }) {
  return (
    <>
      <div className="cs-section-head">
        <h2>Rejected Doctor Applications ({doctors.length})</h2>
      </div>
      {doctors.length === 0 ? (
        <div className="cs-card cs-empty">No rejected doctors. Doctors you reject from Onboarding Requests will appear here.</div>
      ) : (
        <div className="cs-requests">
          {doctors.map((d) => <DoctorCard key={d.id} doctor={d} mode="rejected" onDecide={onDecide} />)}
        </div>
      )}
    </>
  );
}