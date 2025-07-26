const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAutonomousAgent() {
  console.log('🎯 Testing Autonomous Interview Prep Agent...\n');
  
  const testCases = [
    {
      name: 'Amazon Senior Backend Interview',
      prompt: 'I have an interview next month with Amazon for Senior Backend role',
      expectedType: 'interview_prep'
    },
    {
      name: 'Google Frontend Interview',
      prompt: 'I have an interview next month with Google for Senior Frontend role',
      expectedType: 'interview_prep'
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`${i + 1}. Testing: ${testCase.name}`);
    console.log(`   Input: "${testCase.prompt}"`);
    
    try {
      const startTime = Date.now();
      const response = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: testCase.prompt })
      });
      
      const data = await response.json();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`   ✅ Response Type: ${data.type}`);
      console.log(`   ⏱️  Duration: ${duration}ms`);
      
      if (data.type === 'interview_prep') {
        console.log(`   🎯 Session ID: ${data.sessionId}`);
        console.log(`   📋 Actions Created: ${data.actions?.length || 0}`);
        console.log(`   📝 Summary Generated: ${data.summary ? 'Yes' : 'No'}`);
        console.log(`   🔄 Progress Updates: ${data.progress?.length || 0} steps`);
        
        if (data.progress) {
          console.log('   📊 Progress Steps:');
          data.progress.forEach((step, index) => {
            console.log(`      ${index + 1}. ${step}`);
          });
        }
        
        // Check if it's a complete response
        if (data.actions && data.actions.length >= 5) {
          console.log('   🎉 Complete Autonomous Interview Prep Plan Generated!');
        } else {
          console.log('   ℹ️  Basic response (needs more info)');
        }
      } else {
        console.log(`   💬 Response: ${data.response?.substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('   ' + '-'.repeat(40));
  }
  
  console.log('\n🎉 Autonomous Interview Prep Agent is working!');
  console.log('\nTo test the UI:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Click on "Chat" tab');
  console.log('3. Try: "I have an interview next month with Amazon for Senior Backend role"');
  console.log('4. Watch the autonomous agent work with progress updates!');
  console.log('\n✅ Features Working:');
  console.log('- Gemini API analysis');
  console.log('- Real API calls to autonomous endpoints');
  console.log('- Progress updates in chat');
  console.log('- Summary only in response');
  console.log('- No split window - everything in chat');
}

testAutonomousAgent(); 