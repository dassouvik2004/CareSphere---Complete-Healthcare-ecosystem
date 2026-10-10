// Mock data for the Diagnostic Reports Manager. Replace with API data later.
export const INITIAL_BOOKINGS = [
  { ref: 'DIAG-REF-2026-9910', patientName: 'Jun Mukherjee', patientId: 'PT-2026-8842', age: 28, gender: 'Male', test: 'Complete Blood Count (CBC) with ESR', category: 'Pathology', date: '2026-09-22', slot: '08:30 AM', fasting: false, amount: 450, status: 'Completed' },
  { ref: 'DIAG-REF-2026-9911', patientName: 'Jun Mukherjee', patientId: 'PT-2026-8842', age: 28, gender: 'Male', test: 'Advanced Lipid & Cardiovascular Profile', category: 'Biochemistry', date: '2026-10-01', slot: '07:30 AM', fasting: true, amount: 850, status: 'Report Ready' },
];

export const INITIAL_REPORTS = {
  'DIAG-REF-2026-9910': {
    reportId: 'REP-7701', bookingNo: 'BK-9910', panel: 'Pathology Panel',
    collected: '2026-09-22 08:45 AM', released: '2026-09-22 04:30 PM',
    markers: [
      { name: 'Hemoglobin (Hb)', value: '14.8', unit: 'g/dL', min: '13', max: '17', dp: 1 },
      { name: 'Total Leukocyte Count (TLC)', value: '7400', unit: '/cu.mm', min: '4000', max: '11000', dp: 0 },
      { name: 'Platelet Count', value: '265000', unit: '/cu.mm', min: '150000', max: '450000', dp: 0 },
      { name: 'Erythrocyte Sedimentation Rate (ESR)', value: '10', unit: 'mm/1st hr', min: '0', max: '15', dp: 0 },
      { name: 'Neutrophils', value: '62', unit: '%', min: '40', max: '70', dp: 0 },
      { name: 'Lymphocytes', value: '30', unit: '%', min: '20', max: '40', dp: 0 },
      { name: 'Eosinophils', value: '4', unit: '%', min: '1', max: '6', dp: 0 },
    ],
    impression: 'Complete hemogram parameters are within normal physiological biological reference limits. No cytopenia or atypical cells seen.',
    remarks: 'Adequate hydration and balanced protein diet recommended.',
    signedBy: 'Dr. Sujata Sen, MD (Pathology), Lead Pathologist',
    signedTitle: 'Consultant Pathologist, CareSphere Labs',
  },
  'DIAG-REF-2026-9911': {
    reportId: 'REP-7702', bookingNo: 'BK-9911', panel: 'Biochemistry Panel',
    collected: '2026-10-01 07:45 AM', released: '',
    markers: [
      { name: 'Total Cholesterol', value: '', unit: 'mg/dL', min: null, max: '200', dp: 0 },
      { name: 'LDL Cholesterol', value: '', unit: 'mg/dL', min: null, max: '100', dp: 0 },
      { name: 'HDL Cholesterol', value: '', unit: 'mg/dL', min: '40', max: '60', dp: 0 },
      { name: 'Triglycerides', value: '', unit: 'mg/dL', min: null, max: '150', dp: 0 },
      { name: 'VLDL Cholesterol', value: '', unit: 'mg/dL', min: '5', max: '40', dp: 0 },
    ],
    impression: '',
    remarks: '',
    signedBy: 'Dr. Sujata Sen, MD (Pathology), Lead Pathologist',
    signedTitle: 'Consultant Pathologist, CareSphere Labs',
  },
};