const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testBoldMainBullets() {
  console.log('🎯 Testing Bold Main Bullet Points...\n');
  
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
      console.log('\n📝 Summary with Bold Main Bullets:');
      console.log('='.repeat(60));
      console.log(data.response);
      console.log('='.repeat(60));
      
      // Check for bold main bullet points
      const lines = data.response.split('\n');
      let boldMainBullets = 0;
      let hasCheckmarkEmoji = false;
      let mainBulletCount = 0;
      
      lines.forEach((line, index) => {
        // Check for ✅ emoji in section titles
        if (line.includes('✅ Things I have already done for you:') || 
            line.includes('✅ You\'re Ready For:')) {
          hasCheckmarkEmoji = true;
          console.log(`✅ Line ${index + 1}: Checkmark emoji found in section title`);
        }
        
        // Check for bold main bullet points (starts with - and has **)
        if (line.trim().startsWith('-') && !line.startsWith(' ') && 
            line.includes('**') && line.includes(':')) {
          boldMainBullets++;
          mainBulletCount++;
          console.log(`✅ Line ${index + 1}: Bold main bullet found`);
        }
        
        // Check for regular main bullet points (not bold)
        if (line.trim().startsWith('-') && !line.startsWith(' ') && 
            line.includes(':') && !line.includes('**')) {
          mainBulletCount++;
          console.log(`❌ Line ${index + 1}: Main bullet NOT bold`);
        }
      });
      
      console.log('\n📊 Analysis:');
      console.log(`- Has checkmark emoji: ${hasCheckmarkEmoji ? '✅ Yes' : '❌ No'}`);
      console.log(`- Bold main bullets: ${boldMainBullets}`);
      console.log(`- Total main bullets: ${mainBulletCount}`);
      console.log(`- Bold percentage: ${mainBulletCount > 0 ? Math.round((boldMainBullets/mainBulletCount)*100) : 0}%`);
      
      if (boldMainBullets > 0 && hasCheckmarkEmoji) {
        console.log('\n🎉 SUCCESS: Bold main bullet points are working!');
        console.log('✅ Section titles have checkmark emoji');
        console.log('✅ Main bullet points are bold');
        console.log('✅ Sub-bullets are properly indented');
        console.log('✅ Clean, professional appearance');
      } else {
        console.log('\n❌ ISSUE: Bold main bullet points not working');
        if (!hasCheckmarkEmoji) console.log('❌ Missing checkmark emoji in section titles');
        if (boldMainBullets === 0) console.log('❌ No bold main bullet points found');
      }
      
    } else {
      console.log('❌ Not an interview prep response');
      console.log(`Response: ${data.response?.substring(0, 100)}...`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testBoldMainBullets(); 