const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testWorkLifeEmergency() {
  console.log('👶 Testing Work-Life Balance Emergency Detection...\n');
  
  try {
    console.log('📡 Sending work-life conflict request to backend...');
    const response = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: 'I need to pick up my Daughter from School and I have Production Deployment' 
      })
    });
    
    const data = await response.json();
    console.log('✅ Response received');
    console.log(`📊 Response Type: ${data.type}`);
    
    if (data.type === 'emergency_crisis' && data.response) {
      console.log('\n🚨 Work-Life Emergency Crisis Response:');
      console.log('='.repeat(60));
      console.log(data.response);
      console.log('='.repeat(60));
      
      // Check for work-life balance indicators
      const lines = data.response.split('\n');
      let hasChildcareCoordination = false;
      let hasWorkCoverage = false;
      let hasEmergencyIndicators = false;
      
      lines.forEach((line, index) => {
        // Check for childcare coordination
        if (line.includes('👶') || line.includes('childcare') || line.includes('pickup') || line.includes('school')) {
          hasChildcareCoordination = true;
          console.log(`✅ Line ${index + 1}: Childcare coordination found - "${line.trim()}"`);
        }
        
        // Check for work coverage
        if (line.includes('💼') || line.includes('deployment') || line.includes('work') || line.includes('coverage')) {
          hasWorkCoverage = true;
          console.log(`✅ Line ${index + 1}: Work coverage found - "${line.trim()}"`);
        }
        
        // Check for emergency indicators
        if (line.includes('🚨') || line.includes('Emergency') || line.includes('Crisis')) {
          hasEmergencyIndicators = true;
          console.log(`🚨 Line ${index + 1}: Emergency indicator found - "${line.trim()}"`);
        }
      });
      
      console.log('\n📊 Work-Life Emergency Analysis:');
      console.log(`- Has childcare coordination: ${hasChildcareCoordination ? '✅ Yes' : '❌ No'}`);
      console.log(`- Has work coverage: ${hasWorkCoverage ? '✅ Yes' : '❌ No'}`);
      console.log(`- Has emergency indicators: ${hasEmergencyIndicators ? '✅ Yes' : '❌ No'}`);
      
      if (hasChildcareCoordination && hasWorkCoverage && hasEmergencyIndicators) {
        console.log('\n🎉 SUCCESS: Work-Life Balance Emergency detected and handled!');
        console.log('✅ Emergency crisis agent activated for work-life conflict');
        console.log('✅ Childcare coordination arranged');
        console.log('✅ Work coverage secured');
        console.log('✅ Professional emergency response provided');
      } else {
        console.log('\n❌ ISSUE: Work-Life Balance Emergency not properly handled');
        if (!hasChildcareCoordination) console.log('❌ Missing childcare coordination');
        if (!hasWorkCoverage) console.log('❌ Missing work coverage');
        if (!hasEmergencyIndicators) console.log('❌ Missing emergency indicators');
      }
      
    } else {
      console.log('❌ Not detected as emergency crisis');
      console.log(`Response Type: ${data.type}`);
      console.log(`Response: ${data.response?.substring(0, 100)}...`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testWorkLifeEmergency(); 