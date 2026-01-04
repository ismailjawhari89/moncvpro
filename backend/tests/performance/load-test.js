import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 100,           // 100 virtual users
    duration: '5m',     // 5 minutes
    thresholds: {
        'http_req_duration': ['p(95)<200'], // 95% of requests must complete below 200ms
        'http_req_failed': ['rate<0.01'],   // Error rate should be below 1%
    },
};

const BASE_URL = 'http://localhost:3001/api';

export default function () {
    // 1. Authenticate
    const loginPayload = JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, params);

    check(loginRes, {
        'login successful': (r) => r.status === 200,
    });

    if (loginRes.status === 200) {
        const accessToken = loginRes.json('accessToken');
        const authParams = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        };

        // 2. Fetch User Profile
        const meRes = http.get(`${BASE_URL}/auth/me`, authParams);
        check(meRes, {
            'get profile successful': (r) => r.status === 200,
        });

        // 3. List CVs (simulated endpoint)
        // const cvsRes = http.get(`${BASE_URL}/cv`, authParams);
        // check(cvsRes, {
        //     'list cvs successful': (r) => r.status === 200,
        // });
    }

    sleep(1);
}
