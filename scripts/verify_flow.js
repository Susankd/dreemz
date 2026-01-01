"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3000/api/v1';
const USER_ID = 'user_test_runner';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function main() {
    console.log('🚀 Starting Verification Script...');
    try {
        // 1. Check Health
        const health = await axios_1.default.get('http://localhost:3000/health');
        console.log('✅ Health Check:', health.data);
        // 2. Fetch Feed (Initial)
        console.log('\n--- Fetching Initial Feed ---');
        let response = await axios_1.default.get(`${API_URL}/feed`, { headers: { 'x-user-id': USER_ID } });
        let posts = response.data.posts;
        console.log(`Received ${posts.length} posts.`);
        if (posts.length === 0) {
            console.error('❌ Expected posts, got none.');
            process.exit(1);
        }
        // 3. Simulate Viewing ALL Posts
        console.log('\n--- Simulating Views (Watching all posts) ---');
        // We know we have 20 posts in mockDb. Let's fetch and view loop until empty.
        let cycles = 0;
        while (true) {
            response = await axios_1.default.get(`${API_URL}/feed`, { headers: { 'x-user-id': USER_ID } });
            posts = response.data.posts;
            if (posts.length === 0) {
                // Should have triggered reset automatically in the LAST call if logic is right? 
                // Or maybe the service returns empty array AND cycleReset: true?
                console.log('Feed is empty.');
                break;
            }
            console.log(`Viewing batch of ${posts.length} posts...`);
            for (const post of posts) {
                await axios_1.default.post(`${API_URL}/feed/view`, { postId: post.id }, { headers: { 'x-user-id': USER_ID } });
            }
            cycles++;
            if (cycles > 10) {
                console.log('⚠️ Breaking infinite loop safety.');
                break;
            }
        }
        // 4. Verify Reset
        console.log('\n--- Verifying Cycle Reset ---');
        response = await axios_1.default.get(`${API_URL}/feed`, { headers: { 'x-user-id': USER_ID } });
        if (response.data.posts.length > 0) {
            console.log('✅ Cycle Reset Successful! Posts are available again.');
            console.log(`Got ${response.data.posts.length} posts.`);
            if (response.data.cycleReset) {
                console.log('✅ Server indicated a transparent cycle reset.');
            }
        }
        else {
            console.error('❌ Feed is still empty after viewing everything. Reset failed.');
        }
        // 5. Test Notifications
        console.log('\n--- Testing Notifications ---');
        // Register Device
        await axios_1.default.post(`${API_URL}/notifications/device`, { fcmToken: 'test_token_123' }, { headers: { 'x-user-id': USER_ID } });
        console.log('✅ Device Registered');
        // Trigger Digest
        const notifyRes = await axios_1.default.post(`${API_URL}/notifications/test-trigger`);
        console.log('✅ Triggered Digest:', notifyRes.data);
    }
    catch (error) {
        console.error('❌ Verification Failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}
main();
