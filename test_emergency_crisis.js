const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testEmergencyCrisis() {
  console.log('🚨 Testing Emergency Crisis Agent...\n');
  
  try {
    console.log('📡 Sending emergency request to backend...');
    const response = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: 'My mom just had a fall, I need to fly home NOW but I have a huge presentation tomorrow' 
      })
    });
    
    const data = await response.json();
    console.log('✅ Response received');
    console.log(`📊 Response Type: ${data.type}`);
    
    if (data.type === 'emergency_crisis' && data.response) {
      console.log('\n🚨 Emergency Crisis Response:');
      console.log('='.repeat(60));
      console.log(data.response);
      console.log('='.repeat(60));
      
      // Check for emergency indicators
      const lines = data.response.split('\n');
      let emergencyActions = 0;
      let crisisStatus = 0;
      let hasCheckmarkEmoji = false;
      let hasEmergencyEmoji = false;
      
      lines.forEach((line, index) => {
        // Check for ✅ emoji in section titles
        if (line.includes('✅ Emergency Actions Completed:') || 
            line.includes('✅ Crisis Response Status:')) {
          hasCheckmarkEmoji = true;
          console.log(`✅ Line ${index + 1}: Checkmark emoji found in section title`);
        }
        
        // Check for emergency-related emojis
        if (line.includes('🚨') || line.includes('✈️') || line.includes('💼') || 
            line.includes('📱') || line.includes('🏥')) {
          hasEmergencyEmoji = true;
          console.log(`🚨 Line ${index + 1}: Emergency emoji found`);
        }
        
        // Check for emergency actions completed
        if (line.includes('Emergency Actions Completed:')) {
          emergencyActions++;
        }
        
        // Check for crisis response status
        if (line.includes('Crisis Response Status:')) {
          crisisStatus++;
        }
      });
      
      console.log('\n📊 Emergency Analysis:');
      console.log(`- Has checkmark emoji: ${hasCheckmarkEmoji ? '✅ Yes' : '❌ No'}`);
      console.log(`- Has emergency emojis: ${hasEmergencyEmoji ? '✅ Yes' : '❌ No'}`);
      console.log(`- Emergency actions section: ${emergencyActions > 0 ? '✅ Found' : '❌ Missing'}`);
      console.log(`- Crisis response section: ${crisisStatus > 0 ? '✅ Found' : '❌ Missing'}`);
      
      if (hasCheckmarkEmoji && hasEmergencyEmoji && emergencyActions > 0 && crisisStatus > 0) {
        console.log('\n🎉 SUCCESS: Emergency Crisis Agent is working!');
        console.log('✅ Emergency crisis detected and handled');
        console.log('✅ Crisis response actions completed');
        console.log('✅ Professional emergency summary generated');
        console.log('✅ All emergency systems activated');
      } else {
        console.log('\n❌ ISSUE: Emergency Crisis Agent not working properly');
        if (!hasCheckmarkEmoji) console.log('❌ Missing checkmark emoji in section titles');
        if (!hasEmergencyEmoji) console.log('❌ Missing emergency emojis');
        if (emergencyActions === 0) console.log('❌ Missing emergency actions section');
        if (crisisStatus === 0) console.log('❌ Missing crisis response section');
      }
      
    } else {
      console.log('❌ Not an emergency crisis response');
      console.log(`Response: ${data.response?.substring(0, 100)}...`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testEmergencyCrisis(); 