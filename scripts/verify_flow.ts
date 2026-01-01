import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';
const USERNAME = 'alice'; // Using the seeded username

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
    console.log('🚀 Starting Verification Script (Postgres Edition)...');

    try {
        // 1. Check Health
        const health = await axios.get('http://localhost:3000/health');
        console.log('✅ Health Check:', health.data);

        // 2. Fetch Feed (Initial)
        console.log('\n--- Fetching Initial Feed ---');
        // NOTE: We now send x-user-username because the controller does a DB lookup
        let response = await axios.get(`${API_URL}/feed`, { headers: { 'x-user-username': USERNAME } });
        let posts = response.data.posts;
        console.log(`Received ${posts.length} posts.`);

        if (posts.length === 0) {
            console.log('⚠️ Feed empty. Maybe user already saw everything?');
        }

        // 3. Simulate Viewing ALL Posts
        console.log('\n--- Simulating Views (Watching all posts) ---');
        let cycles = 0;
        let totalViewed = 0;

        while (true) {
            response = await axios.get(`${API_URL}/feed`, { headers: { 'x-user-username': USERNAME } });
            posts = response.data.posts;

            if (posts.length === 0) {
                // Check if reset happened
                if (response.data.cycleReset) {
                    console.log('✅ Cycle Reset Triggered!');
                    // One more fetch to confirm new posts
                    response = await axios.get(`${API_URL}/feed`, { headers: { 'x-user-username': USERNAME } });
                    if (response.data.posts.length > 0) {
                        console.log(`✅ Reset confirmed. Got ${response.data.posts.length} new posts.`);
                        break;
                    }
                }

                console.log('Feed is empty and no reset triggered (or DB empty).');
                break;
            }

            console.log(`Viewing batch of ${posts.length} posts...`);
            for (const post of posts) {
                await axios.post(`${API_URL}/feed/view`, { postId: post.id }, { headers: { 'x-user-username': USERNAME } });
                totalViewed++;
            }
            cycles++;
            if (cycles > 10) {
                console.log('⚠️ Breaking loop - maybe too many posts or logic error.');
                break;
            }
        }
        console.log(`Total posts viewed in this session: ${totalViewed}`);

        // 4. Test Notifications
        console.log('\n--- Testing Notifications ---');
        // Register Device
        await axios.post(`${API_URL}/notifications/device`, { fcmToken: 'test_token_123' }, { headers: { 'x-user-username': USERNAME } });
        console.log('✅ Device Registered');

        // Trigger Digest
        const notifyRes = await axios.post(`${API_URL}/notifications/test-trigger`);
        console.log('✅ Triggered Digest:', notifyRes.data);

    } catch (error: any) {
        console.error('❌ Verification Failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

main();
