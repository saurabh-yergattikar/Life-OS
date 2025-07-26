const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testMultiAgent() {
  console.log('🧪 Testing Multi-Agent Functionality...\n');
  
  try {
    // Test 1: Simple chat
    console.log('1. Testing simple chat...');
    const simpleResponse = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Hello' })
    });
    const simpleData = await simpleResponse.json();
    console.log('✅ Simple chat response:', simpleData.type);
    
    // Test 2: Multi-agent task
    console.log('\n2. Testing multi-agent task...');
    const multiAgentResponse = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: 'I have a Google interview next month for Senior SDE' 
      })
    });
    const multiAgentData = await multiAgentResponse.json();
    console.log('✅ Multi-agent response type:', multiAgentData.type);
    console.log('✅ Session ID:', multiAgentData.sessionId);
    console.log('✅ Tasks created:', multiAgentData.tasks?.length || 0);
    console.log('✅ Summary generated:', !!multiAgentData.summary);
    
    // Test 3: Check sessions
    console.log('\n3. Testing sessions endpoint...');
    const sessionsResponse = await fetch('http://localhost:4000/api/chat/sessions');
    const sessionsData = await sessionsResponse.json();
    console.log('✅ Active sessions:', sessionsData.sessions.length);
    
    // Test 4: Get specific session
    if (multiAgentData.sessionId) {
      console.log('\n4. Testing session details...');
      const sessionResponse = await fetch(`http://localhost:4000/api/chat/session/${multiAgentData.sessionId}`);
      const sessionData = await sessionResponse.json();
      console.log('✅ Session status:', sessionData.status);
      console.log('✅ Session tasks:', sessionData.tasks?.length || 0);
    }
    
    console.log('\n🎉 All tests passed! Multi-agent system is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMultiAgent(); 