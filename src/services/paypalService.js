// PayPal JavaScript SDK Integration Service

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb'; // 'sb' for sandbox default

export const PAYPAL_TIERS = {
    VIP_PARTY: {
        id: 'VIP_PARTY',
        name: 'JSF 100-VIP Frankfurt Launch Party Ticket',
        amount: '100.00',
        currency: 'EUR',
        badge: '🎟️ VIP PASS',
        description: 'VIP Admission, 432Hz Live Symphony, Free Vintage Wine & Lookbook'
    },
    COMMERCIAL_AUDIO: {
        id: 'COMMERCIAL_AUDIO',
        name: '432Hz Master Audio Catalog & Stems License',
        amount: '49.00',
        currency: 'EUR',
        badge: '🎻 AUDIO LICENSE',
        description: 'Lifetime Commercial Sync License for "A Twelve-Minute Alibi" & Op. 1'
    },
    PATRON_COFFEE: {
        id: 'PATRON_COFFEE',
        name: 'Atelier Acoustic Patron Supporter',
        amount: '5.00',
        currency: 'EUR',
        badge: '☕ PATRON',
        description: 'Support Independent 432Hz Sound & High-End Web Experience R&D'
    }
};

let paypalSdkPromise = null;

export function loadPayPalSdk(currency = 'EUR') {
    if (window.paypal) {
        return Promise.resolve(window.paypal);
    }
    if (paypalSdkPromise) {
        return paypalSdkPromise;
    }

    paypalSdkPromise = new Promise((resolve, reject) => {
        const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(window.paypal));
            existingScript.addEventListener('error', reject);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}&intent=capture`;
        script.async = true;
        script.onload = () => {
            if (window.paypal) {
                resolve(window.paypal);
            } else {
                reject(new Error('PayPal SDK failed to initialize'));
            }
        };
        script.onerror = (err) => {
            paypalSdkPromise = null;
            reject(err);
        };
        document.head.appendChild(script);
    });

    return paypalSdkPromise;
}

export function savePaymentReceipt(receipt) {
    try {
        const existing = JSON.parse(localStorage.getItem('jsf_payment_receipts') || '[]');
        existing.unshift(receipt);
        localStorage.setItem('jsf_payment_receipts', JSON.stringify(existing));
    } catch (e) {
        console.warn('Failed to save receipt to localStorage', e);
    }
}

export function getPaymentReceipts() {
    try {
        return JSON.parse(localStorage.getItem('jsf_payment_receipts') || '[]');
    } catch (e) {
        return [];
    }
}
