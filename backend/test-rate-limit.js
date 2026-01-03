import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testRateLimit(endpoint, maxAttempts, testName) {
    console.log(`\n=== Testing ${testName} ===`);
    
    const results = [];
    
    for (let i = 1; i <= maxAttempts + 2; i++) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'password123',
                }),
            });
            
            const headers = {
                'x-ratelimit-limit': response.headers.get('x-ratelimit-limit'),
                'x-ratelimit-remaining': response.headers.get('x-ratelimit-remaining'),
                'retry-after': response.headers.get('retry-after'),
            };
            
            results.push({
                attempt: i,
                status: response.status,
                headers,
            });
            
            console.log(`Attempt ${i}: Status ${response.status}`, headers);
            
            if (response.status === 429) {
                console.log(`✅ Rate limit triggered at attempt ${i}`);
                break;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error(`Attempt ${i} failed:`, error.message);
        }
    }
    
    return results;
}

async function testGlobalRateLimit() {
    console.log('\n=== Testing Global Rate Limit ===');
    
    for (let i = 1; i <= 5; i++) {
        try {
            const response = await fetch(`${BASE_URL}/`, {
                method: 'GET',
            });
            
            const headers = {
                'x-ratelimit-limit': response.headers.get('x-ratelimit-limit'),
                'x-ratelimit-remaining': response.headers.get('x-ratelimit-remaining'),
            };
            
            console.log(`Request ${i}: Status ${response.status}`, headers);
            
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error(`Request ${i} failed:`, error.message);
        }
    }
}

async function runTests() {
    console.log('🔍 Starting Rate Limit Tests...');
    console.log(`Target: ${BASE_URL}`);
    console.log('Note: Make sure the server is running on port 5000');
    
    await testGlobalRateLimit();
    
    console.log('\n\n✅ Tests completed!');
    console.log('\nTo fully test rate limits:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Run this test: node test-rate-limit.js');
    console.log('3. For login rate limit test, make 6+ requests to /api/auth/login');
    console.log('4. For register rate limit test, make 4+ requests to /api/auth/register');
}

runTests().catch(console.error);
