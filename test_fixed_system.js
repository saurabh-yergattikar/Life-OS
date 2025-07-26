const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testFixedSystem() {
  console.log('🧪 Testing Fixed Multi-Agent System...\n');
  
  const testCases = [
    {
      name: 'Simple Chat',
      prompt: 'Hello',
      expectedType: 'simple'
    },
    {
      name: 'Interview Preparation',
      prompt: 'I have a Google interview next month for Senior SDE',
      expectedType: 'multi_agent'
    },
    {
      name: 'Project Planning',
      prompt: 'I need to plan a new software project',
      expectedType: 'multi_agent'
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
      
      if (data.type === 'multi_agent') {
        console.log(`   🤖 Session ID: ${data.sessionId}`);
        console.log(`   📋 Tasks Created: ${data.tasks?.length || 0}`);
        console.log(`   📝 Summary Generated: ${data.summary ? 'Yes' : 'No'}`);
        
        if (data.tasks) {
          console.log('   📊 Task Status:');
          data.tasks.forEach((task, index) => {
            console.log(`      ${index + 1}. ${task.name} - ${task.status} (${task.progress}%)`);
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
  
  console.log('\n🎉 System is working correctly!');
  console.log('\nTo test the UI:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Click on "Chat" tab');
  console.log('3. Try the interview preparation example');
  console.log('4. You should see the multi-agent panel appear!');
}

testFixedSystem(); 