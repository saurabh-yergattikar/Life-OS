const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function demoMultiAgent() {
  console.log('🚀 Life-OS Multi-Agent System Demo\n');
  console.log('='.repeat(50));
  
  const testCases = [
    {
      name: 'Simple Chat',
      prompt: 'Hello, how are you?',
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
    },
    {
      name: 'Research Task',
      prompt: 'I want to research the latest AI trends',
      expectedType: 'multi_agent'
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${i + 1}. Testing: ${testCase.name}`);
    console.log(`   Input: "${testCase.prompt}"`);
    console.log(`   Expected Type: ${testCase.expectedType}`);
    
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
        
        // Show task details
        if (data.tasks) {
          console.log('   📊 Task Breakdown:');
          data.tasks.forEach((task, index) => {
            console.log(`      ${index + 1}. ${task.name} - ${task.status}`);
          });
        }
      } else {
        console.log(`   💬 Simple Response: ${data.response?.substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('   ' + '-'.repeat(40));
  }
  
  console.log('\n🎉 Demo Complete!');
  console.log('\nTo see the full UI experience:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Click on "Chat" tab');
  console.log('3. Try the interview preparation example');
  console.log('4. Watch the multi-agent system in action!');
}

demoMultiAgent(); 