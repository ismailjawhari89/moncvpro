
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const API_URL = 'http://localhost:3001/api/v1';
const prisma = new PrismaClient();

async function runTests() {
    console.log('🚀 Starting Password Reset & Security Tests...\n');

    const testId = Date.now();
    const testUser = {
        email: `pw_tester_${testId}@example.com`,
        password: 'OriginalPassword123!',
        firstName: 'PW',
        lastName: 'Tester'
    };

    const apiClient = axios.create({
        baseURL: API_URL,
        withCredentials: true,
        validateStatus: () => true
    });

    // 1. Register
    await apiClient.post('/auth/register', testUser);
    console.log('✅ Registered');

    // 2. Request Password Reset
    await apiClient.post('/auth/forgot-password', { email: testUser.email });
    console.log('✅ Password reset requested');

    // 3. Extract Token from DB
    const tokenRecord = await prisma.verificationToken.findFirst({
        where: { email: testUser.email, type: 'PASSWORD_RESET' },
        orderBy: { createdAt: 'desc' }
    });

    if (!tokenRecord) {
        console.log('❌ FAIL: No reset token found in DB');
        return;
    }
    console.log('✅ Token extracted from DB');

    // 4. Reset Password with same password (Should fail)
    let res = await apiClient.post('/auth/reset-password', {
        token: tokenRecord.token,
        newPassword: testUser.password
    });
    if (res.status === 400 && res.data.error?.includes('history')) {
        console.log('✅ PASS: Password history enforced (prevented reuse)');
    } else {
        console.log('❌ FAIL: Password reuse allowed or wrong error:', res.data);
    }

    // 5. Reset Password with new valid password
    const newPw = 'NewPassword456!';
    res = await apiClient.post('/auth/reset-password', {
        token: tokenRecord.token,
        newPassword: newPw
    });
    if (res.status === 200) {
        console.log('✅ PASS: Password reset successful');
    } else {
        console.log('❌ FAIL: Password reset failed', res.data);
    }

    await prisma.$disconnect();
}

runTests();
