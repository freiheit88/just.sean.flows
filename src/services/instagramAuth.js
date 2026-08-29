// Instagram Basic Display API OAuth 2.0 Service

const INSTAGRAM_CLIENT_ID = import.meta.env.VITE_INSTAGRAM_CLIENT_ID || '';
const INSTAGRAM_REDIRECT_URI = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI || (typeof window !== 'undefined' ? `${window.location.origin}/auth/instagram/callback` : '');

export function isInstagramConfigured() {
    return Boolean(INSTAGRAM_CLIENT_ID && INSTAGRAM_CLIENT_ID !== 'YOUR_INSTAGRAM_CLIENT_ID');
}

export function getInstagramAuthUrl() {
    if (!isInstagramConfigured()) {
        return null;
    }
    const params = new URLSearchParams({
        client_id: INSTAGRAM_CLIENT_ID,
        redirect_uri: INSTAGRAM_REDIRECT_URI,
        scope: 'user_profile,user_media',
        response_type: 'code'
    });
    return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
}

export function openInstagramOAuthPopup() {
    return new Promise((resolve, reject) => {
        const authUrl = getInstagramAuthUrl();
        if (!authUrl) {
            // Fallback for development without Meta App credentials
            return reject(new Error('NO_CONFIG'));
        }

        const width = 580;
        const height = 650;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
            authUrl,
            'Instagram_OAuth',
            `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=1`
        );

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            return reject(new Error('POPUP_BLOCKED'));
        }

        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) return;
            if (event.data?.type === 'INSTAGRAM_AUTH_SUCCESS') {
                window.removeEventListener('message', handleMessage);
                popup.close();
                resolve(event.data.payload);
            } else if (event.data?.type === 'INSTAGRAM_AUTH_ERROR') {
                window.removeEventListener('message', handleMessage);
                popup.close();
                reject(new Error(event.data.error || 'AUTH_FAILED'));
            }
        };

        window.addEventListener('message', handleMessage);

        const checkPopupClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkPopupClosed);
                window.removeEventListener('message', handleMessage);
                reject(new Error('USER_CANCELLED'));
            }
        }, 800);
    });
}
