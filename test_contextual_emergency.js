const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testContextualEmergency() {
  console.log('🔍 Testing Contextual Emergency Crisis Agent...\n');
  
  try {
    console.log('📡 Sending emergency request to backend...');
    const response = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: 'My mom just had a fall in Los Angeles, I need to fly home NOW but I have a huge presentation tomorrow' 
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
      
      // Check for hardcoded vs contextual responses
      const lines = data.response.split('\n');
      let hasHardcodedNames = false;
      let hasContextualInfo = false;
      
      lines.forEach((line, index) => {
        // Check for hardcoded names
        if (line.includes('Dr. Martinez') || line.includes('Cedars-Sinai')) {
          hasHardcodedNames = true;
          console.log(`❌ Line ${index + 1}: Hardcoded name found - "${line.trim()}"`);
        }
        
        // Check for contextual information
        if (line.includes('Los Angeles') || line.includes('emergency location') || 
            line.includes('medical facility') || line.includes('specialist')) {
          hasContextualInfo = true;
          console.log(`✅ Line ${index + 1}: Contextual information found - "${line.trim()}"`);
        }
      });
      
      console.log('\n📊 Analysis:');
      console.log(`- Has hardcoded names: ${hasHardcodedNames ? '❌ Yes' : '✅ No'}`);
      console.log(`- Has contextual info: ${hasContextualInfo ? '✅ Yes' : '❌ No'}`);
      
      if (!hasHardcodedNames && hasContextualInfo) {
        console.log('\n🎉 SUCCESS: Emergency Crisis Agent is now contextual!');
        console.log('✅ No hardcoded names (Dr. Martinez, Cedars-Sinai)');
        console.log('✅ Uses contextual information from user request');
        console.log('✅ Dynamic responses based on emergency details');
        console.log('✅ AI-powered crisis management');
      } else {
        console.log('\n❌ ISSUE: Emergency Crisis Agent still has hardcoded elements');
        if (hasHardcodedNames) console.log('❌ Still contains hardcoded names');
        if (!hasContextualInfo) console.log('❌ Missing contextual information');
      }
      
    } else {
      console.log('❌ Not an emergency crisis response');
      console.log(`Response: ${data.response?.substring(0, 100)}...`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testContextualEmergency(); 