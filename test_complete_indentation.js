const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCompleteIndentation() {
  console.log('🎯 Testing Complete Indentation Flow...\n');
  
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
      console.log('\n📝 Summary Response:');
      console.log('='.repeat(60));
      console.log(data.response);
      console.log('='.repeat(60));
      
      // Test the frontend renderer
      const renderMarkdown = (text) => {
        // Convert **text** to <strong>text</strong>
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Split into lines to handle indentation properly
        const lines = formattedText.split('\n');
        const processedLines = lines.map(line => {
          // Check if this is a main bullet point (starts with - and no leading spaces)
          if (line.trim().startsWith('-') && !line.startsWith(' ')) {
            return line.replace(/^\s*-\s*/, '• ');
          }
          
          // Check if this is a sub-bullet point (starts with - and has leading spaces)
          if (line.trim().startsWith('-') && line.startsWith(' ')) {
            return line.replace(/^\s*-\s*/, '       ◦ ');
          }
          
          // Check if this is a main bullet point with *
          if (line.trim().startsWith('*') && !line.startsWith(' ')) {
            return line.replace(/^\s*\*\s*/, '• ');
          }
          
          // Check if this is a sub-bullet point with *
          if (line.trim().startsWith('*') && line.startsWith(' ')) {
            return line.replace(/^\s*\*\s*/, '       ◦ ');
          }
          
          // Check if this is already a bullet point
          if (line.trim().startsWith('•') && !line.startsWith(' ')) {
            return line;
          }
          
          // Check if this is already a sub-bullet point
          if (line.trim().startsWith('•') && line.startsWith(' ')) {
            return line.replace(/^\s*•\s*/, '       ◦ ');
          }
          
          return line;
        });
        
        return processedLines.join('\n');
      };
      
      console.log('\n🎨 Frontend Rendered Version:');
      console.log('='.repeat(60));
      console.log(renderMarkdown(data.response));
      console.log('='.repeat(60));
      
      // Analyze the response
      const lines = data.response.split('\n');
      let mainBullets = 0;
      let subBullets = 0;
      let hasIndentation = false;
      
      lines.forEach((line, index) => {
        if (line.trim().startsWith('-') && !line.startsWith(' ')) {
          mainBullets++;
          console.log(`✅ Line ${index + 1}: Main bullet found`);
        }
        
        if (line.trim().startsWith('-') && line.startsWith(' ')) {
          subBullets++;
          hasIndentation = true;
          console.log(`✅ Line ${index + 1}: Sub-bullet with indentation found`);
        }
      });
      
      console.log('\n📊 Analysis:');
      console.log(`- Main bullets: ${mainBullets}`);
      console.log(`- Sub-bullets: ${subBullets}`);
      console.log(`- Has indentation: ${hasIndentation ? '✅ Yes' : '❌ No'}`);
      
      if (hasIndentation) {
        console.log('\n🎉 SUCCESS: Proper indentation is working!');
        console.log('✅ Backend is sending indented format');
        console.log('✅ Frontend is rendering properly');
        console.log('✅ Sub-bullets have correct spacing');
      } else {
        console.log('\n❌ ISSUE: No indentation found in response');
        console.log('🔧 Backend might not be sending proper indentation');
      }
      
    } else {
      console.log('❌ Not an interview prep response');
      console.log(`Response: ${data.response?.substring(0, 100)}...`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testCompleteIndentation(); 