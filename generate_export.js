const fs = require('fs');
const path = require('path');

const transcriptPath = 'C:/Users/crtvecode/.gemini/antigravity-ide/brain/54a7fd09-a8cd-4a0d-a808-283a796f2bfd/.system_generated/logs/transcript_full.jsonl';
const outputMdPath = 'C:/GatewayOps/CONVERSATION_EXPORT.md';
const outputHtmlPath = 'C:/GatewayOps/CONVERSATION_EXPORT.html';
const outputJsonlPath = 'C:/GatewayOps/CONVERSATION_TRANSCRIPT.jsonl';

// 1. Copy raw transcript JSONL
fs.copyFileSync(transcriptPath, outputJsonlPath);
console.log('Copied raw JSONL transcript to:', outputJsonlPath);

// 2. Parse full transcript
const rawLines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

const turns = [];
let currentTurn = null;

for (const line of rawLines) {
  if (!line.trim()) continue;
  try {
    const step = JSON.parse(line);

    if (step.type === 'USER_INPUT') {
      let rawContent = step.content || '';
      let cleanContent = rawContent;

      const userReqMatch = rawContent.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
      if (userReqMatch) {
        cleanContent = userReqMatch[1].trim();
      } else {
        cleanContent = rawContent.split('<ADDITIONAL_METADATA>')[0].trim();
      }

      currentTurn = {
        turnIndex: turns.length + 1,
        stepIndex: step.step_index,
        timestamp: step.timestamp || null,
        userPrompt: cleanContent,
        responses: [],
      };
      turns.push(currentTurn);
    } else if (step.type === 'PLANNER_RESPONSE' && step.content) {
      if (currentTurn) {
        currentTurn.responses.push({
          stepIndex: step.step_index,
          content: step.content.trim(),
        });
      }
    }
  } catch (err) {
    console.error('Error parsing line:', err);
  }
}

console.log(`Parsed ${turns.length} conversational turns.`);

// 3. Build Markdown export
let md = `# GatewayOps Engineering Engagement — Complete Conversation Transcript

**Project:** GatewayOps Production Issues Remediation  
**Repository:** \`c:\\GatewayOps\`  
**Date:** October 14, 2026  
**Total Interaction Turns:** ${turns.length}  
**Status:** All 10 Production Issues Investigated, Resolved, and Verified  

---

## Table of Contents

`;

turns.forEach((turn, idx) => {
  const shortTitle = turn.userPrompt
    ? turn.userPrompt.split('\n')[0].slice(0, 70).replace(/[#*`_\[\]]/g, '')
    : `Turn ${idx + 1}`;
  md += `- [Turn ${idx + 1}: ${shortTitle}](#turn-${idx + 1})\n`;
});

md += `\n---\n\n`;

turns.forEach((turn, idx) => {
  md += `## Turn ${idx + 1}\n\n`;
  md += `### 👤 User Request\n\n`;
  md += `\`\`\`text\n${turn.userPrompt || '(Empty prompt / System interaction)'}\n\`\`\`\n\n`;

  md += `### 🤖 Assistant Response\n\n`;

  if (turn.responses.length === 0) {
    md += `*No text response recorded for this step.*\n\n`;
  } else {
    // Deduplicate / consolidate responses
    // Filter out intermediate status strings if a final comprehensive response exists
    const substantiveResponses = turn.responses.filter(r => r.content.length > 80);
    const responsesToInclude = substantiveResponses.length > 0 ? substantiveResponses : turn.responses;

    responsesToInclude.forEach((resp) => {
      md += `${resp.content}\n\n`;
    });
  }

  md += `---\n\n`;
});

fs.writeFileSync(outputMdPath, md, 'utf8');
console.log('Generated Markdown export at:', outputMdPath);

// 4. Build Standalone HTML export with clean, professional styling
const escapeHtml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GatewayOps Engineering Engagement — Complete Conversation Transcript</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --accent-hover: #0284c7;
      --code-bg: #090d16;
      --user-bg: #1e293b;
      --assistant-bg: #0f172a;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2rem 1rem;
    }
    .container {
      max-width: 960px;
      margin: 0 auto;
    }
    header {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
    }
    h1 { color: #ffffff; font-size: 1.8rem; margin-bottom: 0.5rem; }
    .meta { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem; }
    .badge {
      display: inline-block;
      background: rgba(56, 189, 248, 0.15);
      color: var(--accent);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }
    .toc {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem 2rem;
      margin-bottom: 2rem;
    }
    .toc h2 { font-size: 1.25rem; margin-bottom: 1rem; color: #ffffff; }
    .toc ul { list-style-type: none; padding-left: 0; }
    .toc li { margin-bottom: 0.5rem; }
    .toc a { color: var(--accent); text-decoration: none; }
    .toc a:hover { text-decoration: underline; }
    .turn-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      margin-bottom: 2rem;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
    }
    .turn-header {
      background: #1e293b;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .turn-header h3 { font-size: 1.15rem; color: #ffffff; }
    .user-section {
      background: #172033;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .section-label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .user-content {
      white-space: pre-wrap;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.95rem;
      background: var(--code-bg);
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      color: #38bdf8;
    }
    .assistant-section {
      padding: 1.5rem;
      background: var(--assistant-bg);
    }
    .assistant-content {
      white-space: pre-wrap;
      font-size: 0.95rem;
      color: #cbd5e1;
    }
    pre {
      background: var(--code-bg);
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      overflow-x: auto;
      margin: 1rem 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.9rem;
      color: #f1f5f9;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background: rgba(148, 163, 184, 0.15);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.9em;
      color: #38bdf8;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>GatewayOps Engineering Engagement</h1>
      <div class="meta">Full Conversation Transcript &amp; Solution Delivery Record</div>
      <span class="badge">10 of 10 Issues Resolved &amp; Verified</span>
    </header>

    <div class="toc">
      <h2>Table of Contents</h2>
      <ul>
`;

turns.forEach((turn, idx) => {
  const shortTitle = turn.userPrompt
    ? turn.userPrompt.split('\n')[0].slice(0, 80)
    : `Turn ${idx + 1}`;
  htmlContent += `        <li><a href="#turn-${idx + 1}">Turn ${idx + 1}: ${escapeHtml(shortTitle)}</a></li>\n`;
});

htmlContent += `      </ul>
    </div>
`;

turns.forEach((turn, idx) => {
  htmlContent += `    <div class="turn-card" id="turn-${idx + 1}">
      <div class="turn-header">
        <h3>Turn ${idx + 1}</h3>
      </div>
      <div class="user-section">
        <div class="section-label">👤 User Request</div>
        <div class="user-content">${escapeHtml(turn.userPrompt || '(Empty prompt / System interaction)')}</div>
      </div>
      <div class="assistant-section">
        <div class="section-label">🤖 Assistant Response</div>
        <div class="assistant-content">`;

  const substantiveResponses = turn.responses.filter(r => r.content.length > 80);
  const responsesToInclude = substantiveResponses.length > 0 ? substantiveResponses : turn.responses;

  if (responsesToInclude.length === 0) {
    htmlContent += `<em>No response text recorded for this step.</em>`;
  } else {
    responsesToInclude.forEach((resp) => {
      htmlContent += `${escapeHtml(resp.content)}\n\n`;
    });
  }

  htmlContent += `</div>
      </div>
    </div>
`;
});

htmlContent += `  </div>
</body>
</html>`;

fs.writeFileSync(outputHtmlPath, htmlContent, 'utf8');
console.log('Generated HTML export at:', outputHtmlPath);
