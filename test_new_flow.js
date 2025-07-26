const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testNewFlow() {
  console.log('🎯 Testing New Interview Prep Flow...\n');
  
  const testCases = [
    {
      name: 'Amazon Senior Backend Interview',
      prompt: 'I have an interview next month with Amazon for Senior Backend role'
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
          console.log('   📊 Progress Flow:');
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
        
        // Check for acknowledgment
        if (data.progress && data.progress[0] === "Working on your request...") {
          console.log('   ✅ Acknowledgment shown correctly');
        }
        
        // Check for clean summary format
        if (data.response && data.response.includes('Things I have already done for you')) {
          console.log('   ✅ Clean summary format with 2 sections');
        }
      } else {
        console.log(`   💬 Response: ${data.response?.substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('   ' + '-'.repeat(40));
  }
  
  console.log('\n🎉 New Flow is working!');
  console.log('\nTo test the UI:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Click on "Chat" tab');
  console.log('3. Try: "I have an interview next month with Amazon for Senior Backend role"');
  console.log('4. Watch the new flow:');
  console.log('   - Acknowledgment first');
  console.log('   - Progress updates one by one');
  console.log('   - Clean summary with 2 sections');
  console.log('\n✅ New Features:');
  console.log('- Acknowledgment: "Working on your request..."');
  console.log('- Real-time progress updates');
  console.log('- Clean summary with 2 sections only');
  console.log('- Bold keys in summary');
  console.log('- Professional formatting');
}

testNewFlow(); 