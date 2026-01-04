
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

async function runTests() {
    console.log('🚀 Starting Session Management Tests...\n');

    const testUser = {
        email: `session_tester_${Date.now()}@example.com`,
        password: 'Password123!',
        firstName: 'Session',
        lastName: 'Tester'
    };

    const apiClient = axios.create({
        baseURL: API_URL,
        withCredentials: true
    });

    // 1. Register and Login
    await apiClient.post('/auth/register', testUser);
    const loginRes = await apiClient.post('/auth/login', {
        email: testUser.email,
        password: testUser.password
    });

    const token = loginRes.data.accessToken;
    console.log('✅ Logged in');

    // 2. Get Sessions
    const sessionsRes = await apiClient.get('/auth/sessions', {
        headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Sessions retrieved:', sessionsRes.data.length);
    const session = sessionsRes.data[0];
    console.log('ℹ️ Session info:', {
        deviceName: session.deviceName,
        ipAddress: session.ipAddress,
        lastActivityAt: session.lastActivityAt
    });

    if (session.deviceName && session.ipAddress) {
        console.log('✅ PASS: Device name and IP detected');
    } else {
        console.log('❌ FAIL: Device name or IP missing');
    }

    // 3. Revoke Session
    // We'll need another session to test revocation of a different one, 
    // but we can try revoking the current one and see if it works.
    try {
        await apiClient.delete(`/auth/sessions/${session.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ PASS: Session revoked successfully');
    } catch (e: any) {
        console.log('❌ FAIL: Session revocation failed', e.response?.data);
    }
}

runTests();
