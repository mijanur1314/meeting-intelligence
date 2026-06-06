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

const text = `[00:00] Alice: Welcome everyone to the weekly sync. Let's discuss the new launch.
[00:15] Bob: I looked at the metrics, and I think we need to delay the launch to Friday to make sure everything is stable.
[00:30] Alice: Agreed. We will officially launch this feature next Friday.
[00:45] Bob: Awesome. I will prepare the release notes by Wednesday.
[01:00] Alice: Great, and I will notify the marketing team to prep the emails.`;

console.log(JSON.stringify(parseTranscript(text), null, 2))
