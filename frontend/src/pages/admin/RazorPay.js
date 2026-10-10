// Razorpay Checkout helper (frontend only).
// Put your TEST key in frontend/.env as:  VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
// With no key set, a demo payment is simulated so the UI can still be tested.

const SRC = 'https://checkout.razorpay.com/v1/checkout.js';

function loadScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = SRC;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export async function payWithRazorpay({ amount, description, onSuccess, onFailure }) {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

  if (!key) {
    const id = 'pay_DEMO_' + Math.random().toString(36).slice(2, 10).toUpperCase();
    onSuccess({ razorpay_payment_id: id, demo: true });
    return;
  }

  const loaded = await loadScript();
  if (!loaded) return onFailure('Could not load Razorpay. Check your internet connection and try again.');

  const rzp = new window.Razorpay({
    key,
    amount: Math.round(amount * 100), // paise
    currency: 'INR',
    name: 'CareSphere',
    description,
    theme: { color: '#0d9488' },
    handler: (response) => onSuccess(response),
    modal: { ondismiss: () => onFailure(null) }, // closed without paying: no message
  });
  rzp.on('payment.failed', (res) => onFailure(res?.error?.description || 'Payment failed. Please try again.'));
  rzp.open();
}