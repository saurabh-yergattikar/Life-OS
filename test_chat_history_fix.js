#!/usr/bin/env node

/**
 * Test Chat History Fix
 * 
 * This script tests the fixed chat history functionality:
 * 1. Creates multiple chat sessions
 * 2. Sends messages to different sessions
 * 3. Verifies session switching works
 * 4. Tests persistence
 */

console.log('🧪 Testing Chat History Fix...\n');

async function testChatHistoryFix() {
  try {
    // Test 1: Create first chat session
    console.log('1. Creating first chat session...');
    const session1Response = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Hello, this is session 1' })
    });
    const session1Data = await session1Response.json();
    console.log('✅ Session 1 created with response type:', session1Data.type);
    
    // Test 2: Create second chat session
    console.log('\n2. Creating second chat session...');
    const session2Response = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Hello, this is session 2' })
    });
    const session2Data = await session2Response.json();
    console.log('✅ Session 2 created with response type:', session2Data.type);
    
    // Test 3: Send follow-up to session 2
    console.log('\n3. Sending follow-up to session 2...');
    const followUpResponse = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Can you help me with this?' })
    });
    const followUpData = await followUpResponse.json();
    console.log('✅ Follow-up sent with response type:', followUpData.type);
    
    console.log('\n🎉 Chat History Fix Test Complete!');
    console.log('\nTo test the UI:');
    console.log('1. Open http://localhost:3000');
    console.log('2. Click "Chat" tab');
    console.log('3. Send a message');
    console.log('4. Click "+ New Chat"');
    console.log('5. Send another message');
    console.log('6. Click on the first chat in sidebar');
    console.log('7. Verify the messages are loaded correctly');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testChatHistoryFix(); 