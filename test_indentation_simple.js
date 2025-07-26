// Test the indentation rendering
const testText = `**Things I have already done for you:**
- **📅 Scheduled Daily Study Sessions:** 2 hours daily, focusing on **interview prep** and **system design**
       • Morning (9:00 AM - 11:00 AM) and evening (7:00 PM - 9:00 PM) study blocks.
       • Calendar reminders set for all sessions.
- **📚 Gathered & Sent Resources:** Comprehensive study materials package
       • **Leadership Principles** guide and recent **interview questions** (2024).
       • **System design patterns** and **behavioral questions** with STAR examples.`;

// Simple markdown renderer for testing
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

console.log('🎯 Testing Indentation Rendering...\n');
console.log('Original Text:');
console.log(testText);
console.log('\n' + '='.repeat(50));
console.log('Rendered Text:');
console.log(renderMarkdown(testText));
console.log('\n' + '='.repeat(50));

// Check if indentation is working
const rendered = renderMarkdown(testText);
const lines = rendered.split('\n');
let hasProperIndentation = false;

lines.forEach((line, index) => {
  if (line.includes('◦')) {
    hasProperIndentation = true;
    console.log(`✅ Line ${index + 1}: Proper sub-bullet indentation found`);
  }
});

if (hasProperIndentation) {
  console.log('\n🎉 Indentation is working correctly!');
} else {
  console.log('\n❌ Indentation is not working');
} 