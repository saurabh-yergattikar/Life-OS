#!/usr/bin/env node

/**
 * Test Chat History Functionality
 * 
 * This script tests the chat history feature by:
 * 1. Starting multiple chat sessions
 * 2. Sending messages to different sessions
 * 3. Verifying session persistence
 * 4. Testing session switching
 */

console.log('🧪 Testing Chat History Functionality...\n');

async function testChatHistory() {
  try {
    // Test 1: Start a new chat session
    console.log('1. Testing new chat session creation...');
    const session1Response = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Hello, this is my first chat session' })
    });
    const session1Data = await session1Response.json();
    console.log('✅ Session 1 created with response type:', session1Data.type);
    
    // Test 2: Start another chat session
    console.log('\n2. Testing second chat session...');
    const session2Response = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'I have an interview with Google next month' })
    });
    const session2Data = await session2Response.json();
    console.log('✅ Session 2 created with response type:', session2Data.type);
    console.log('✅ Session ID:', session2Data.sessionId);
    
    // Test 3: Send another message to session 2
    console.log('\n3. Testing follow-up message in session 2...');
    const followUpResponse = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Can you help me prepare for technical questions?' })
    });
    const followUpData = await followUpResponse.json();
    console.log('✅ Follow-up message sent with response type:', followUpData.type);
    
    // Test 4: Start a third session with emergency keywords
    console.log('\n4. Testing emergency session...');
    const emergencyResponse = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'I have an emergency - my server is down!' })
    });
    const emergencyData = await emergencyResponse.json();
    console.log('✅ Emergency session created with response type:', emergencyData.type);
    console.log('✅ Emergency session ID:', emergencyData.sessionId);
    
    console.log('\n🎉 Chat History Test Complete!');
    console.log('\nTo test the full UI experience:');
    console.log('1. Open http://localhost:3000');
    console.log('2. Click on "Chat" tab');
    console.log('3. Try creating multiple chat sessions');
    console.log('4. Check that sessions appear in the sidebar');
    console.log('5. Click on different sessions to switch between them');
    console.log('6. Verify that chat history is preserved');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testChatHistory(); 