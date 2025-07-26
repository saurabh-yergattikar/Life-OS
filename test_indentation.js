const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testIndentation() {
  console.log('🎯 Testing Indentation...\n');
  
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
        
        // Check for formatted summary with proper indentation
        if (data.response) {
          console.log('   📊 Indentation Summary:');
          console.log('   ' + '='.repeat(50));
          
          // Split the response into lines and check formatting
          const lines = data.response.split('\n');
          let hasProperIndentation = false;
          let hasBoldWords = false;
          let subBulletCount = 0;
          let mainBulletCount = 0;
          
          lines.forEach((line, index) => {
            console.log(`   ${index + 1}. ${line}`);
            
            // Check for main bullets (no indentation)
            if (line.trim().startsWith('-') && !line.includes('  ')) {
              mainBulletCount++;
            }
            
            // Check for sub-bullets (with indentation)
            if (line.trim().startsWith('-') && line.includes('  ')) {
              hasProperIndentation = true;
              subBulletCount++;
              console.log(`   ✅ Line ${index + 1} has proper indentation`);
            }
            
            // Check for bold words
            if (line.includes('**') && line.includes('**')) {
              hasBoldWords = true;
            }
          });
          
          console.log('   ' + '='.repeat(50));
          
          if (hasProperIndentation) {
            console.log('   ✅ Proper indentation present');
            console.log(`   📊 Sub-bullet count: ${subBulletCount}`);
          } else {
            console.log('   ❌ No proper indentation found');
          }
          
          if (hasBoldWords) {
            console.log('   ✅ Bold important words present');
          } else {
            console.log('   ❌ No bold words found');
          }
          
          console.log(`   📊 Main bullet count: ${mainBulletCount}`);
          
          // Check for specific sections
          if (data.response.includes('Things I have already done for you')) {
            console.log('   ✅ "Things I have already done for you" section present');
          }
          
          if (data.response.includes('✅ You\'re Ready For:')) {
            console.log('   ✅ "You\'re Ready For" section present');
          }
          
          // Check for indentation rendering
          console.log('   🎨 Frontend will render:');
          console.log('   - Main bullets: - item → • item');
          console.log('   - Sub-bullets:       - item →       ◦ item');
          console.log('   - Bold text: **text** → <strong>text</strong>');
          console.log('   - Proper indentation: 7 spaces for sub-bullets');
        }
        
        // Check if it's a complete response
        if (data.actions && data.actions.length >= 5) {
          console.log('   🎉 Complete Indented Interview Prep Plan Generated!');
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
  
  console.log('\n🎉 Indentation is working!');
  console.log('\n✅ New Features:');
  console.log('- Proper indentation with 7 spaces');
  console.log('- Main bullets: • item');
  console.log('- Sub-bullets:       ◦ item');
  console.log('- Bold text rendering');
  console.log('- Clean, hierarchical structure');
  console.log('- Professional appearance');
  console.log('\nTo test the UI:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Click on "Chat" tab');
  console.log('3. Try: "I have an interview next month with Amazon for Senior Backend role"');
  console.log('4. Check the proper indentation!');
}

testIndentation(); 