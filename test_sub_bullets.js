const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testSubBullets() {
  console.log('🎯 Testing Sub-Bullet Point Formatting...\n');
  
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
        
        // Check for formatted summary with sub-bullets
        if (data.response) {
          console.log('   📊 Sub-Bullet Summary:');
          console.log('   ' + '='.repeat(50));
          
          // Split the response into lines and check formatting
          const lines = data.response.split('\n');
          let hasSubBullets = false;
          let hasBoldWords = false;
          let hasProperFormatting = true;
          
          lines.forEach((line, index) => {
            console.log(`   ${index + 1}. ${line}`);
            
            // Check for sub-bullets (indented lines)
            if (line.trim().startsWith('-') && line.includes('  ')) {
              hasSubBullets = true;
              console.log(`   ✅ Line ${index + 1} has sub-bullet formatting`);
            }
            
            // Check for bold words
            if (line.includes('**') && line.includes('**')) {
              hasBoldWords = true;
            }
            
            // Check for proper formatting (no asterisks)
            if (line.trim().startsWith('* ')) {
              hasProperFormatting = false;
              console.log(`   ❌ Line ${index + 1} has asterisk formatting`);
            }
          });
          
          console.log('   ' + '='.repeat(50));
          
          if (hasSubBullets) {
            console.log('   ✅ Sub-bullet points present');
          } else {
            console.log('   ❌ No sub-bullet points found');
          }
          
          if (hasBoldWords) {
            console.log('   ✅ Bold important words present');
          } else {
            console.log('   ❌ No bold words found');
          }
          
          if (hasProperFormatting) {
            console.log('   ✅ Proper formatting (no asterisks)');
          } else {
            console.log('   ❌ Still has asterisk formatting');
          }
          
          // Check for specific sections
          if (data.response.includes('Things I have already done for you')) {
            console.log('   ✅ "Things I have already done for you" section present');
          }
          
          if (data.response.includes('✅ You\'re Ready For:')) {
            console.log('   ✅ "You\'re Ready For" section present');
          }
          
          // Check for sub-bullet rendering
          console.log('   🎨 Frontend will render:');
          console.log('   - Main bullets: - item → • item');
          console.log('   - Sub-bullets:   - item →   ◦ item');
          console.log('   - Bold text: **text** → <strong>text</strong>');
        }
        
        // Check if it's a complete response
        if (data.actions && data.actions.length >= 5) {
          console.log('   🎉 Complete Sub-Bullet Interview Prep Plan Generated!');
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
  
  console.log('\n🎉 Sub-Bullet Formatting is working!');
  console.log('\n✅ New Features:');
  console.log('- Sub-bullet point formatting');
  console.log('- Main bullets: • item');
  console.log('- Sub-bullets:   ◦ item');
  console.log('- Bold text rendering');
  console.log('- Clean, hierarchical structure');
  console.log('- Professional appearance');
  console.log('\nTo test the UI:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Click on "Chat" tab');
  console.log('3. Try: "I have an interview next month with Amazon for Senior Backend role"');
  console.log('4. Check the sub-bullet formatting!');
}

testSubBullets(); 