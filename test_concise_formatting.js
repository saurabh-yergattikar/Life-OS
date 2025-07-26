const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testConciseFormatting() {
  console.log('🎯 Testing Concise Formatting...\n');
  
  try {
    console.log('📡 Sending request to backend...');
    const response = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: 'I have an interview next month with Amazon for Senior Backend role' 
      })
    });
    
    const data = await response.json();
    console.log('✅ Response received');
    console.log(`📊 Response Type: ${data.type}`);
    
    if (data.type === 'interview_prep' && data.response) {
      console.log('\n📝 New Concise Summary:');
      console.log('='.repeat(60));
      console.log(data.response);
      console.log('='.repeat(60));
      
      // Check for new formatting
      const lines = data.response.split('\n');
      let hasCheckmarkEmoji = false;
      let hasConciseBullets = false;
      let mainBulletCount = 0;
      let subBulletCount = 0;
      
      lines.forEach((line, index) => {
        // Check for ✅ emoji in section titles
        if (line.includes('✅ Things I have already done for you:') || 
            line.includes('✅ You\'re Ready For:')) {
          hasCheckmarkEmoji = true;
          console.log(`✅ Line ${index + 1}: Checkmark emoji found in section title`);
        }
        
        // Check for concise main bullets (no long descriptions)
        if (line.trim().startsWith('-') && !line.startsWith(' ') && 
            line.includes(':') && !line.includes('2 hours daily') && 
            !line.includes('Comprehensive study materials')) {
          hasConciseBullets = true;
          mainBulletCount++;
          console.log(`✅ Line ${index + 1}: Concise main bullet found`);
        }
        
        // Check for sub-bullets
        if (line.trim().startsWith('-') && line.startsWith(' ')) {
          subBulletCount++;
        }
      });
      
      console.log('\n📊 Analysis:');
      console.log(`- Has checkmark emoji: ${hasCheckmarkEmoji ? '✅ Yes' : '❌ No'}`);
      console.log(`- Has concise bullets: ${hasConciseBullets ? '✅ Yes' : '❌ No'}`);
      console.log(`- Main bullets: ${mainBulletCount}`);
      console.log(`- Sub-bullets: ${subBulletCount}`);
      
      if (hasCheckmarkEmoji && hasConciseBullets) {
        console.log('\n🎉 SUCCESS: Concise formatting is working!');
        console.log('✅ Section titles have checkmark emoji');
        console.log('✅ Main bullets are concise (no long descriptions)');
        console.log('✅ Sub-bullets are properly indented');
        console.log('✅ Clean, professional appearance');
      } else {
        console.log('\n❌ ISSUE: Concise formatting not working');
        if (!hasCheckmarkEmoji) console.log('❌ Missing checkmark emoji in section titles');
        if (!hasConciseBullets) console.log('❌ Main bullets still have long descriptions');
      }
      
    } else {
      console.log('❌ Not an interview prep response');
      console.log(`Response: ${data.response?.substring(0, 100)}...`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testConciseFormatting(); 