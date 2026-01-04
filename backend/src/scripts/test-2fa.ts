
import axios from 'axios';
import speakeasy from 'speakeasy';

const API_URL = 'http://localhost:3001/api/v1';

async function runTests() {
    console.log('🚀 Starting 2FA (TOTP) Tests...\n');

    const testId = Date.now();
    const testUser = {
        email: `2fa_tester_${testId}@example.com`,
        password: 'Password123!',
        firstName: 'MFA',
        lastName: 'Tester'
    };

    const apiClient = axios.create({
        baseURL: API_URL,
        withCredentials: true,
        validateStatus: () => true
    });

    // 1. Register and Login
    await apiClient.post('/auth/register', testUser);
    const loginRes = await apiClient.post('/auth/login', {
        email: testUser.email,
        password: testUser.password
    });

    let token = loginRes.data.accessToken;
    console.log('✅ Logged in initially');

    // 2. Setup 2FA
    const setupRes = await apiClient.post('/auth/2fa/setup', {}, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const { secret, qrCode } = setupRes.data;
    console.log('✅ 2FA Setup initiated, secret received');

    // 3. Enable 2FA
    const otpToken = speakeasy.totp({
        secret: secret,
        encoding: 'base32'
    });

    const enableRes = await apiClient.post('/auth/2fa/enable', { otpToken }, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (enableRes.status === 200) {
        console.log('✅ PASS: 2FA enabled successfully');
        console.log('ℹ️ Backup codes count:', enableRes.data.backupCodes?.length || 0);
    } else {
        console.log('❌ FAIL: 2FA enable failed', enableRes.data);
        return;
    }

    // 4. Test Login with 2FA
    console.log('ℹ️ Attempting login with 2FA enabled...');
    const login2faRes = await apiClient.post('/auth/login', {
        email: testUser.email,
        password: testUser.password
    });

    let finalAccessToken = '';
    if (login2faRes.data.mfaRequired) {
        console.log('✅ PASS: MFA required flag received');
        const tempToken = login2faRes.data.tempToken;

        const loginOtp = speakeasy.totp({
            secret: secret,
            encoding: 'base32'
        });

        const verifyRes = await apiClient.post('/auth/verify-2fa', {
            tempToken,
            otpToken: loginOtp
        });

        if (verifyRes.data.accessToken) {
            console.log('✅ PASS: 2FA verification successful, JWT issued');
            finalAccessToken = verifyRes.data.accessToken;
        } else {
            console.log('❌ FAIL: 2FA verification failed', verifyRes.data);
            return;
        }
    } else {
        console.log('❌ FAIL: MFA required flag NOT received');
        return;
    }

    // 5. Disable 2FA
    const disableOtp = speakeasy.totp({
        secret: secret,
        encoding: 'base32'
    });
    const disableRes = await apiClient.post('/auth/2fa/disable', { otpToken: disableOtp }, {
        headers: { Authorization: `Bearer ${finalAccessToken}` }
    });

    if (disableRes.status === 200) {
        console.log('✅ PASS: 2FA disabled successfully');
    } else {
        console.log('❌ FAIL: 2FA disable failed', disableRes.data);
    }
}

runTests();
