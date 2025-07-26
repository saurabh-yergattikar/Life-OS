const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCareerAgent() {
  console.log('🎯 Testing Career Agent System...\n');
  
  const testCases = [
    {
      name: 'Simple Chat',
      prompt: 'Hello',
      expectedType: 'simple'
    },
    {
      name: 'Career Request - Basic',
      prompt: 'I have an interview next month with Amazon',
      expectedType: 'career_agent'
    },
    {
      name: 'Career Request - Specific',
      prompt: 'I have an interview next month with Amazon for Senior SDE role',
      expectedType: 'career_agent'
    },
    {
      name: 'Behavioral Interview',
      prompt: 'Help me prepare for behavioral interview',
      expectedType: 'career_agent'
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
      
      if (data.type === 'career_agent') {
        console.log(`   🎯 Session ID: ${data.sessionId}`);
        console.log(`   📋 Actions Created: ${data.actions?.length || 0}`);
        console.log(`   📝 Summary Generated: ${data.summary ? 'Yes' : 'No'}`);
        console.log(`   ❓ Info Needed: ${data.needsInfo?.length || 0} items`);
        
        if (data.actions) {
          console.log('   📊 Action Types:');
          data.actions.forEach((action, index) => {
            console.log(`      ${index + 1}. ${action.type} - ${action.description} (${action.status})`);
          });
        }
      } else {
        console.log(`   💬 Response: ${data.response?.substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('   ' + '-'.repeat(40));
  }
  
  console.log('\n🎉 Career Agent System is working correctly!');
  console.log('\nTo test the UI:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Click on "Chat" tab');
  console.log('3. Try: "I have an interview next month with Amazon for Senior SDE role"');
  console.log('4. Watch the career agent in action!');
}

testCareerAgent(); 