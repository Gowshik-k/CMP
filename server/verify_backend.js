const http = require('http');

const PORT = 5000;
const HOST = 'localhost';

const uniqueId = Date.now();
const user = {
    username: `VerifyUser_${uniqueId}`,
    email: `verify_${uniqueId}@test.com`,
    password: 'password123',
    phoneNumber: '1234567890'
};

let token = '';
let conferenceId = '';
let userId = '';

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function verify() {
    console.log('--- Starting Verification ---');

    // 1. Register User
    console.log('1. Registering User...');
    let res = await request({
        hostname: HOST, port: PORT, path: '/api/user/register', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, user);

    if (res.status === 200 || res.status === 201) {
        console.log('   User Registered:', res.data.message);
        userId = res.data.userId;
        const emailCode = res.data.debug_email_code;
        const phoneCode = res.data.debug_phone_code;

        // 1.5 Verify User
        console.log('1.5. Verifying User...');
        res = await request({
            hostname: HOST, port: PORT, path: '/api/user/verify', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { userId, emailCode, phoneCode });

        if (res.status === 200) {
            console.log('   User verified.');
        } else {
            console.error('   Failed to verify user:', res.data);
            return;
        }

    } else {
        console.error('   Failed to register user:', res.data, 'Status:', res.status);
        return;
    }

    // 2. Login
    console.log('2. Logging in...');
    res = await request({
        hostname: HOST, port: PORT, path: '/api/user/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { email: user.email, password: user.password });

    if (res.status === 200) {
        token = res.data.token;
        userId = res.data.user.id; // Or _id from user object
        console.log('   Logged in. Token received.');
    } else {
        console.error('   Failed to login:', res.data);
        return;
    }

    // 3. Get Conferences
    console.log('3. Fetching Conferences...');
    res = await request({
        hostname: HOST, port: PORT, path: '/api/participant/conferences', method: 'GET',
        headers: { 'auth-token': token }
    });

    if (res.status === 200 && res.data.data.length > 0) {
        conferenceId = res.data.data[0]._id;
        console.log('   Conference found:', res.data.data[0].title);
    } else {
        console.error('   No conferences found or failed to fetch:', res.data);
        // Create one if needed? Assuming there is at least one.
        return;
    }

    // 4. Register for Conference with intendToSubmit: true
    console.log('4. Registering for Conference with intendToSubmit: true...');
    res = await request({
        hostname: HOST, port: PORT, path: '/api/participant/register', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'auth-token': token }
    }, { conferenceId, intendToSubmit: true });

    if (res.status === 201) {
        console.log('   Registered for conference.');
    } else {
        console.error('   Failed to register for conference:', res.data);
        return;
    }

    // 5. Verify intendToSubmit flag in GetAllConferences
    console.log('5. Verifying intendToSubmit flag...');
    res = await request({
        hostname: HOST, port: PORT, path: '/api/participant/conferences', method: 'GET',
        headers: { 'auth-token': token }
    });

    const conf = res.data.data.find(c => c._id === conferenceId);
    if (conf && conf.intendToSubmit === true) {
        console.log('   SUCCESS: intendToSubmit is true for the conference.');
    } else {
        console.error('   FAILURE: intendToSubmit is not true:', conf);
    }

    // 6. Submit Paper and Verify Role Transition
    console.log('6. Submitting Paper...');
    res = await request({
        hostname: HOST, port: PORT, path: '/api/participant/submit', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'auth-token': token }
    }, {
        conferenceId,
        title: 'Test Paper Verification',
        abstract: 'Abstract for verification',
        filePath: 'dummy/path.pdf'
    });

    if (res.status === 201) {
        console.log('   Paper submitted.');
    } else {
        console.error('   Failed to submit paper:', res.data);
        return;
    }

    // 7. Verify Role Transition
    console.log('7. Verifying User Role (should be Author)...');
    res = await request({
        hostname: HOST, port: PORT, path: '/api/participant/dashboard', method: 'GET',
        headers: { 'auth-token': token }
    });

    if (res.status === 200) {
        const currentUser = res.data.data.user;
        if (currentUser.role === 'Author') {
            console.log('   SUCCESS: User role is Author.');
        } else {
            console.error('   FAILURE: User role is ' + currentUser.role);
        }
    } else {
        console.error('   Failed to fetch dashboard:', res.data);
    }

    console.log('--- Verification Complete ---');
}

verify().catch(console.error);
