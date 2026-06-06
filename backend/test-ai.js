const jwt = require('jsonwebtoken');
const token = jwt.sign({userId: 'f2c1ee15-a500-4349-8fb2-143147a39080'}, 'supersecretjwtkey');

const transcript = `[00:00] Sarah: Welcome everyone to the Q3 Design Review. Let's start with the mobile app redesign.
[00:20] David: I've reviewed the wireframes. The new navigation bar looks great, but I think the checkout button is too small on mobile screens.
[00:45] Sarah: Good point. Let's officially decide to increase the checkout button size by 20% on all mobile views.
[01:10] David: Perfect. I will update the Figma prototypes by tomorrow morning.
[01:30] Sarah: Excellent. Once you do that, I'll schedule a final review meeting with the engineering team.`;

const parseTranscript = (text) => {
    const lines = text.split('\n').filter(l => l.trim() !== '')
    const segments = []
    const regex = /^\[([\d:]+)\]\s+([^:]+):\s+(.*)$/
    
    for (const line of lines) {
      const match = line.match(regex)
      if (match) {
        segments.push({
          timestamp: match[1],
          speaker: match[2].trim(),
          text: match[3].trim()
        })
      } else {
        segments.push({
          timestamp: '00:00',
          speaker: 'Unknown',
          text: line.trim()
        })
      }
    }
    return segments.length > 0 ? segments : [{ timestamp: '00:00', speaker: 'System', text }]
}

const run = async () => {
    try {
        const createRes = await fetch('http://localhost:8000/api/meetings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({
                title: 'Q3 Design Review',
                date: '2026-06-06T00:00:00.000Z',
                transcripts: parseTranscript(transcript)
            })
        });
        const createData = await createRes.json();
        console.log('Created:', createData);

        if (!createData.data) return;
        
        console.log('Analyzing meeting ID:', createData.data.id);
        const analyzeRes = await fetch('http://localhost:8000/api/meetings/' + createData.data.id + '/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        });
        const analyzeData = await analyzeRes.json();
        console.log('Analyzed:', analyzeData);
    } catch(e) {
        console.error(e);
    }
}
run();
