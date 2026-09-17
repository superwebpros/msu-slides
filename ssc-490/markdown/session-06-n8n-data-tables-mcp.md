## Check-In & Housekeeping

<div style="display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: center; max-width: 960px; margin: 25px auto;">
<div style="text-align: left; font-size: 18px; line-height: 1.7;">

<h3>Session 6: First Look at n8n, Data Tables &amp; MCP</h3>
<p>Open your laptop, Claude.ai, and your Google Sheet tracker.<br>
👉 <a href="https://docs.google.com/document/d/1MdrQwEhPp2tQ63fQVINzCqTXdtvPFFrg-X9krSHfPrI/edit?tab=t.k7dcsndjdf2q" target="_blank" style="color: #2563eb; font-weight: bold; text-decoration: underline;">Open In-Class Follow-Along Doc</a></p>

<div style="background: #fdf2f8; border-left: 4px solid #db2777; padding: 12px 16px; border-radius: 6px; margin: 12px 0;">
<strong style="color: #9d174d;">The Runway Ahead:</strong>
<ul style="margin: 4px 0 0 16px; font-size: 15px; line-height: 1.5;">
<li><strong>Today (Thu Sep 17):</strong> Build your own MCP Server &amp; connect n8n to Claude!</li>
<li><strong>Tue Sep 22:</strong> Selected M1 Show &amp; Tell + APIs &amp; Data Sources.</li>
<li><strong>Wed Sep 23 (11:59 PM):</strong> <strong>Milestone 1 (Career Coach)</strong> &amp; <strong>Breakout Module 1</strong> due in D2L!</li>
<li><strong>Thu Sep 24:</strong> <strong>Partner Project Kickoff!</strong></li>
</ul>
</div>

<div style="background: #f5f3ff; border: 2px solid #7c3aed; padding: 14px 18px; border-radius: 8px; margin-top: 15px;">
<strong style="color: #5b21b6; font-size: 17px;">Today's Live Poll Warm-Up:</strong>
<p style="font-size: 17px; color: #1e293b; margin: 6px 0 0 0;">
<strong>"What was your single biggest takeaway from Tuesday's AI Ethics guest lecture?"</strong>
</p>
</div>

</div>
<div style="text-align: center;">
<img src="assets/poll-s06-qr.png" alt="Live Poll QR Code" style="width: 220px; height: 220px; border: 2px solid #cbd5e1; border-radius: 8px; padding: 6px; background: white;">
<div style="font-size: 12px; color: #6b7280; margin-top: 6px;">Live Poll: <strong style="color: #7c3aed;">msu-slides-poll.jesse-41b.workers.dev/s06</strong></div>
</div>
</div>

Note:
Welcome everyone to Session 6! Jesse is back in the classroom.
Point students immediately to the live poll on the screen: "What was your single biggest takeaway from Tuesday's AI Ethics guest lecture?"
Set the stakes for today: this is the final class session of Unit 0 before Milestone 1 is due next Tuesday (Sep 22).

---

## Debrief: Tuesday's Ethics Guest Lecture

Note:
Debrief Tuesday's ethics guest lecture. Listen to student takeaways and feedback.

---

## Where We Left Off

<div style="max-width: 920px; margin: 35px auto; text-align: left; font-size: 22px; line-height: 1.8;">

Before we dive in, let's pull out what we know:

<div style="background: #f8fafc; border: 2px solid #7c3aed; padding: 25px; border-radius: 10px; margin: 25px 0;">
<ul style="margin-left: 20px;">
<li>What is a <strong>Skill</strong>?</li>
<li style="margin-top: 15px;">What is a <strong>Connector</strong>?</li>
<li style="margin-top: 15px;">What is <strong>Context</strong>, and why does it matter?</li>
<li style="margin-top: 15px;">How do <strong>Skills and Connectors</strong> work together?</li>
</ul>
</div>

</div>

Note:
Prompt the room with these questions before giving answers. Get students to articulate the definitions from their own mental models.

;;;

## Where We Left Off in Session 4

<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

In Session 4, we connected Claude to Google Drive &amp; Google Sheets:

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">

<div style="background: #ecfdf5; border: 2px solid #059669; border-radius: 8px; padding: 20px;">
<h4 style="color: #065f46; margin-top: 0;">What Worked</h4>
<ul style="font-size: 16px; margin-left: 18px; color: #064e3b;">
<li>Claude created a brand-new Google Sheet.</li>
<li>Claude could read the Sheet anytime.</li>
<li>Seamless conversational access to career guidance data.</li>
</ul>
</div>

<div style="background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 20px;">
<h4 style="color: #991b1b; margin-top: 0;">The Hard Wall</h4>
<ul style="font-size: 16px; margin-left: 18px; color: #7f1d1d;">
<li>Claude <strong>could not append a single row</strong>.</li>
<li>Why? The Drive connector only exposed <code>create</code>, <code>read</code>, <code>copy</code>, and <code>trash</code>.</li>
<li><strong>A connector is only as capable as the tools it exposes!</strong></li>
</ul>
</div>

</div>

</div>

Note:
Re-anchor the room on the frustration from last Thursday. Remind them: we hit a literal wall. Claude told us it couldn't append rows.
Why? Because someone else wrote that Google Drive connector and didn't give Claude an "append_row" tool!

---

## Why We're Leaving Google Sheets Today

<div style="max-width: 920px; margin: 35px auto; text-align: left; font-size: 20px; line-height: 1.8;">

<div style="background: #f8fafc; border: 2px solid #0284c7; padding: 25px; border-radius: 10px;">
<h4 style="color: #0369a1; margin-top: 0; font-size: 24px;">The Conceptual Lesson: Document vs. Data Store</h4>
<ul style="margin-left: 20px; font-size: 19px; line-height: 1.8;">
<li>A <strong>Spreadsheet</strong> is a <em>document</em> that humans use like a data store. No strict types, loose formatting, ranges instead of records.</li>
<li>A <strong>Data Store</strong> enforces structure: typed columns, structured records (rows), and programmatic read/write operations.</li>
</ul>
</div>

</div>

Note:
Emphasize the conceptual distinction: A spreadsheet is a visual document for human eyes; a data store is built for systems and automations.

---

## Two Kinds of Systems: Record vs. Knowledge

<div style="max-width: 920px; margin: 20px auto; text-align: left; font-size: 18px; line-height: 1.7;">

In modern organizations and AI architectures, we make a critical distinction between two kinds of systems:

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">

<div style="background: #eff6ff; border: 2px solid #2563eb; border-radius: 8px; padding: 18px;">
<h4 style="color: #1e40af; margin-top: 0;">System of Knowledge</h4>
<p style="font-size: 15px; color: #1e3a8a; margin-bottom: 8px;"><strong>Context, reasoning &amp; strategy:</strong></p>
<ul style="font-size: 15px; margin-left: 18px; color: #1e3a8a; line-height: 1.5;">
<li>Answers: <em>"How do we do this? What advice applies here?"</em></li>
<li>Unstructured: guides, resumes, instructions, frameworks.</li>
<li><strong>In your M1:</strong> Claude Project instructions, WHO method skill, Career Services guides.</li>
</ul>
</div>

<div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 18px;">
<h4 style="color: #15803d; margin-top: 0;">System of Record</h4>
<p style="font-size: 15px; color: #166534; margin-bottom: 8px;"><strong>The single source of truth for facts &amp; history:</strong></p>
<ul style="font-size: 15px; margin-left: 18px; color: #166534; line-height: 1.5;">
<li>Answers: <em>"Did this actually happen? What is current right now?"</em></li>
<li>Structured: typed columns, exact dates, status entries.</li>
<li><strong>In your M1:</strong> Your job application table (your very first intro database!).</li>
</ul>
</div>

</div>

<div style="background: #faf5ff; border-left: 4px solid #9333ea; padding: 12px 18px; border-radius: 6px; margin-top: 15px; font-size: 16px; color: #581c87;">
💡 <strong>The AI Bridge:</strong> Claude holds the <em>knowledge</em> to analyze a job and tailor your resume, but it needs an explicit tool to write facts into your <em>system of record</em>!
</div>

</div>

Note:
Break down the terminology in plain English. Avoid computing jargon like "state machine."
Explain:
- A System of Knowledge has wisdom, nuance, and instructions (like a training manual or an advisor).
- A System of Record is the ledger. It has the cold, hard facts (like a CRM or accounting ledger). Did you apply? What date? What is the status?
- Up until now, their Claude project had knowledge, but no real system of record it could write to.
- Today's n8n Data Table is their first real database and their system of record.

---

## Today's Objective: You Build the Tool

<div style="max-width: 900px; margin: 30px auto; text-align: center;">

<div style="display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 15px; align-items: center; margin: 40px 0;">

<div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 10px; padding: 20px;">
<h4 style="margin: 0; color: #1e40af;">1. n8n Data Table</h4>
<p style="font-size: 14px; margin: 8px 0 0 0; color: #1e3a8a;">Import your CSV tracker into a typed data table.</p>
</div>

<div style="font-size: 28px; color: #64748b;">➔</div>

<div style="background: #fdf4ff; border: 2px solid #c026d3; border-radius: 10px; padding: 20px;">
<h4 style="margin: 0; color: #86198f;">2. Custom MCP Server</h4>
<p style="font-size: 14px; margin: 8px 0 0 0; color: #701a75;">Expose <code>read_rows</code> and <code>add_row</code> in n8n.</p>
</div>

<div style="font-size: 28px; color: #64748b;">➔</div>

<div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 10px; padding: 20px;">
<h4 style="margin: 0; color: #15803d;">3. Claude Writes Data</h4>
<p style="font-size: 14px; margin: 8px 0 0 0; color: #14532d;">Claude invokes your MCP tool and appends a row live.</p>
</div>

</div>

</div>

Note:
Show this 3-step arc clearly. Today they transition from passive consumers of pre-built tools to authors of custom MCP servers.

---

## Follow-Along Guide &amp; Resources

<div style="display: grid; grid-template-columns: 1fr 280px; gap: 30px; align-items: center; max-width: 920px; margin: 30px auto;">
<div style="text-align: left; font-size: 20px; line-height: 1.8;">

<h3 style="color: #1e293b; margin-top: 0;">Open Today's Guide:</h3>
<p>
Follow along step-by-step with today's prompts, links, and schema definitions in Google Docs:
</p>

<div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 18px; border-radius: 6px; margin: 15px 0; font-size: 17px;">
👉 <a href="https://docs.google.com/document/d/1MdrQwEhPp2tQ63fQVINzCqTXdtvPFFrg-X9krSHfPrI/edit?tab=t.k7dcsndjdf2q" target="_blank" style="color: #1d4ed8; font-weight: bold; text-decoration: underline;">Open In-Class Follow-Along Doc</a>
</div>

<p style="font-size: 16px; color: #64748b;">
Keep this tab open alongside <strong>n8n</strong> and <strong>Claude</strong> during our build.
</p>

</div>
<div style="text-align: center;">
<img src="assets/s06-doc-qr.png" alt="Google Doc Follow-Along QR Code" style="width: 230px; height: 230px; border: 2px solid #cbd5e1; border-radius: 8px; padding: 6px; background: white;">
<div style="font-size: 12px; color: #6b7280; margin-top: 8px;">Scan or click to open Google Doc</div>
</div>
</div>

Note:
Pause here to give students 60 seconds to scan the QR code or click the link so everyone has the follow-along doc open before Step 1 starts.

---

## Step 1: Export Your Sheet to CSV

<!-- FOLLOW-ALONG BLOCK 1 -->
<div style="max-width: 900px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

<div style="background: #f1f5f9; border-left: 5px solid #475569; padding: 18px 22px; border-radius: 6px; margin-bottom: 20px;">
<strong style="color: #1e293b; font-size: 20px;">Follow-Along Action:</strong>
<ol style="margin: 10px 0 0 20px; font-size: 17px; line-height: 1.6;">
<li>Open your Google Sheet job application tracker from Session 4.</li>
<li>Click <strong>File</strong> ➔ <strong>Download</strong> ➔ <strong>Comma Separated Values (.csv)</strong>.</li>
<li>Save it to your laptop.</li>
</ol>
</div>

</div>

Note:
Give students 2 minutes to download their CSV.
Check the room to ensure everyone has a file on their local disk.

---

## Step 2: Welcome to n8n

<!-- FOLLOW-ALONG BLOCK 2 -->
<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

<div style="text-align: center; margin-bottom: 20px;">
<a href="https://msu-n8n.superwebpros.com" target="_blank" style="background: #ff6d5a; color: white; padding: 12px 28px; border-radius: 8px; font-size: 22px; font-weight: bold; text-decoration: none; display: inline-block;">
👉 Go to msu-n8n.superwebpros.com
</a>
</div>

<p style="font-size: 20px; color: #334155; margin-bottom: 20px;">
<strong>What is n8n?</strong> At a 30,000-foot view, n8n is an open-source <strong>workflow automation engine</strong>. It connects apps, databases, and AI models so data can move and actions can happen automatically.
</p>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">

<div style="background: #f8fafc; border: 2px solid #7c3aed; border-radius: 8px; padding: 20px;">
<h4 style="color: #5b21b6; margin-top: 0;">Triggers (The Start)</h4>
<p style="font-size: 16px; color: #334155; margin: 0;">
A trigger listens for an event—a webhook, an MCP request from Claude, or a schedule. It kicks off the workflow.
</p>
</div>

<div style="background: #f8fafc; border: 2px solid #0284c7; border-radius: 8px; padding: 20px;">
<h4 style="color: #0369a1; margin-top: 0;">Nodes (The Action)</h4>
<p style="font-size: 16px; color: #334155; margin: 0;">
Nodes are individual steps that do work—read a database, transform data, or insert a row into a table.
</p>
</div>

</div>

<div style="background: #fefce8; border-left: 4px solid #eab308; padding: 12px 18px; border-radius: 6px; margin-top: 18px; font-size: 16px; color: #854d0e;">
✉️ <strong>Account Access:</strong> You should have received an email this morning inviting you to the app (sent to your <strong>MSU email address</strong>).
</div>

</div>

Note:
Have students navigate to msu-n8n.superwebpros.com and sign in.
Give the 30,000-foot view: n8n is an automation engine that wires systems together.
Define the two essential constructs:
- Triggers: What starts the process (e.g. an incoming request).
- Nodes: The building blocks that perform specific operations.
Keep it simple. We will do today, and return to understand deeper later.

---

## Step 3: Create an n8n Data Table

<!-- FOLLOW-ALONG BLOCK 3 -->
<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

<div style="background: #f8fafc; border-left: 5px solid #7c3aed; padding: 18px 22px; border-radius: 6px;">
<h4 style="color: #5b21b6; margin-top: 0;">Follow-Along Action in n8n:</h4>
<ol style="margin-left: 20px; font-size: 17px; line-height: 1.6;">
<li>In the left sidebar, click <strong>Overview</strong> ➔ <strong>Data tables</strong>.</li>
<li>Click <strong>Create Data table</strong>.</li>
<li>Name it temporarily: <code>job_applications</code>.</li>
<li>Click <strong>Import CSV</strong> and choose your downloaded CSV.</li>
<li>Click <strong>Create</strong>.</li>
<li><em>Notice:</em> Did the table name change to match the CSV file name? Let's rename it to: <code>job_applications</code>.</li>
</ol>
</div>

</div>

Note:
Follow along live with students on screen.
Click Overview -> Data tables -> Create Data table -> type name -> Import CSV -> Create.
Point out that importing CSV often resets or overrides the table name to the filename. Have everyone verify and rename the table back to "job_applications".

---

## Step 3b: Clean &amp; Validate Field Names

<!-- FOLLOW-ALONG BLOCK 3b -->
<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

<p>Before an automation can read or write to a table, the <strong>field schema</strong> needs to be clean.</p>

<div style="background: #f8fafc; border: 2px solid #0284c7; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
<h4 style="color: #0369a1; margin-top: 0;">Follow-Along: Schema Cleaning</h4>
<ul style="margin-left: 20px; font-size: 17px; line-height: 1.6;">
<li><strong>Field Names:</strong> Change spaces and capital letters to clean identifiers (e.g., <code>Company Name</code> ➔ <code>company</code>, <code>Job Title</code> ➔ <code>role</code>, <code>Date Applied</code> ➔ <code>applied_date</code>, <code>Status</code> ➔ <code>status</code>).</li>
<li><strong>Field Types:</strong> Verify data types (Text, Number, Date).</li>
<li><strong>Why this matters:</strong> An MCP tool passes structured JSON keys. Clean field names mean Claude never gets confused about how to address a column!</li>
</ul>
</div>

<div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px 18px; border-radius: 6px; font-size: 16px; color: #166534;">
💡 <em>You are now shaping raw data into a reliable System of Record.</em>
</div>

</div>

Note:
Lead the schema cleaning live on the projector.
Walk through renaming the columns into lowercase, clean names (e.g., company, role, status, applied_date).
Explain: In spreadsheets, human users don't care about spaces or weird capitalization. But APIs and LLMs communicate via structured JSON objects. Clean field names eliminate 90% of tool-call failures.

---

## Step 4: Build Your Custom MCP Server

<!-- FOLLOW-ALONG BLOCK 4 -->
<div style="max-width: 940px; margin: 20px auto; text-align: left; font-size: 18px; line-height: 1.6;">

<div style="background: #f8fafc; border: 2px solid #6366f1; border-radius: 8px; padding: 18px;">
<h4 style="color: #4338ca; margin-top: 0;">Follow-Along Action in n8n:</h4>
<ol style="margin-left: 20px; font-size: 16px;">
<li>Click <strong>Workflows</strong> ➔ <strong>Create Workflow</strong> (name it: <code>Job Tracker MCP Server</code>).</li>
<li>Add Trigger: Search for <strong>MCP Server Trigger</strong>.</li>
<li>Notice the two URLs:
  <ul>
    <li><strong>Test URL:</strong> Active while you are editing in the canvas.</li>
    <li><strong>Production URL:</strong> Active when the workflow is <strong>Published / Active</strong>.</li>
  </ul>
</li>
<li>Attach Tool 1: <strong>Data Table</strong> ➔ Operation: <code>Get Rows</code>.
  <br>Name: <code>get_job_applications</code>
</li>
<li>Attach Tool 2: <strong>Data Table</strong> ➔ Operation: <code>Insert Row</code>.
  <br>Name: <code>add_job_application</code>
</li>
</ol>
</div>

</div>

Note:
Guide students through placing the MCP Server Trigger and attaching the tool nodes.
Emphasize: tool names and descriptions are PROMPTS for Claude. Claude reads the description to decide when to call the tool!

---

## Step 4b: Configure Schema for "Insert Row"

<!-- FOLLOW-ALONG BLOCK 4b -->
<div style="max-width: 940px; margin: 20px auto; text-align: left; font-size: 18px; line-height: 1.6;">

<div style="background: #f8fafc; border: 2px solid #7c3aed; border-radius: 8px; padding: 20px;">
<h4 style="color: #5b21b6; margin-top: 0;">Configuring the Schema on the "Insert Row" Tool:</h4>
<p style="font-size: 16px; color: #334155; margin-bottom: 15px;">
When Claude writes to your table, n8n needs to know which fields to accept and map:
</p>

<ol style="margin-left: 20px; font-size: 16px; line-height: 1.6;">
<li>Double-click your <code>add_job_application</code> tool node.</li>
<li>Select your Data Table: <code>job_applications</code>.</li>
<li>Under <strong>Fields to Send / Schema</strong>, map each field:
  <ul>
    <li><code>company</code></li>
    <li><code>role</code></li>
    <li><code>applied_date</code></li>
    <li><code>status</code></li>
  </ul>
</li>
<li>Set descriptions for each input parameter so Claude knows what format to send.</li>
<li><strong>Toggle the workflow to ACTIVE / Published!</strong> Copy your <strong>Production URL</strong>.</li>
</ol>
</div>

</div>

Note:
Lead the schema configuration on the Insert Row tool live.
Show how to configure the expected parameters so when Claude calls the tool, the arguments map cleanly into table columns.
Remind everyone to toggle to ACTIVE / Published and copy the production URL.

---

## Step 5: Connect MCP Server to Claude

<!-- FOLLOW-ALONG BLOCK 5 -->
<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

<div style="background: #fdf2f8; border-left: 5px solid #db2777; padding: 18px 22px; border-radius: 6px;">
<h4 style="color: #9d174d; margin-top: 0;">Follow-Along Action in Claude.ai:</h4>
<ol style="margin-left: 20px; font-size: 17px; line-height: 1.6;">
<li>In Claude.ai (ensure you are in the <strong>SSC 490 - Fall 2026</strong> team workspace).</li>
<li>Navigate to your Project Connectors or Account Settings ➔ <strong>Add Custom Connector (MCP)</strong>.</li>
<li>Paste your n8n <strong>Production URL</strong>.</li>
</ol>
</div>

<div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 16px; margin-top: 20px;">
<strong style="color: #b91c1c;">⚠️ Heads Up — Known n8n Quirk:</strong>
<p style="margin: 6px 0 0 0; font-size: 16px; color: #7f1d1d;">
Claude.ai will prompt you to "Sign in to n8n" even if authentication is set to None. Click through and authenticate!
</p>
</div>

</div>

Note:
Warn the students out loud before they click: the n8n auth modal will pop up. Do not panic, click through it.
Verify that both tools (`get_job_applications` and `add_job_application`) show up in Claude.

---

## Step 6: Test Live in Claude!

<!-- FOLLOW-ALONG BLOCK 6 -->
<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

<p>Open a fresh chat in Claude with your new MCP connector enabled:</p>

<div style="background: #f8fafc; border: 2px solid #10b981; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
<strong style="color: #065f46;">Prompt 1 (Read Test):</strong>
<pre style="background: white; border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; font-size: 16px; margin: 8px 0 0 0;"><code>"What job applications do I currently have tracked in my system?"</code></pre>
</div>

<div style="background: #f8fafc; border: 2px solid #3b82f6; border-radius: 8px; padding: 18px;">
<strong style="color: #1e40af;">Prompt 2 (Write Test):</strong>
<pre style="background: white; border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; font-size: 16px; margin: 8px 0 0 0;"><code>"I just applied to the Junior AI Solutions Consultant role at Auto-Owners Insurance today. Please add this to my tracker with status 'Applied'."</code></pre>
</div>

<p style="font-size: 18px; font-weight: bold; margin-top: 20px; color: #1e293b; text-align: center;">
Now flip back to n8n Data tables. Is the row there? 🎉
</p>

<div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 14px 18px; border-radius: 6px; margin-top: 20px;">
<strong style="color: #334155;">Optional Challenge:</strong>
<p style="margin: 4px 0 0 0; font-size: 15px; color: #475569;">
Can you update your <code>resume-tailor</code> or career coaching skill in Claude so it automatically queries your new n8n MCP Server instead of manual copy/paste?
</p>
</div>

</div>

Note:
Have students celebrate this moment. Last week Claude gave them an error saying it couldn't write. Today, Claude called an API they designed and wrote real data into their database.

---

## Introducing Groups &amp; Breakout Learning

<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

<div style="background: #f8fafc; border: 2px solid #7c3aed; border-radius: 8px; padding: 22px; margin-bottom: 20px;">
<h4 style="color: #5b21b6; margin-top: 0;">Announcing Project Teams:</h4>
<p style="font-size: 17px; margin: 0;">
Check D2L / Discord for your official team assignments.<br>
Before you leave today, <strong>find your group members!</strong>
</p>
</div>

<div style="background: #eff6ff; border-left: 5px solid #2563eb; padding: 18px 22px; border-radius: 6px;">
<h4 style="color: #1e40af; margin-top: 0;">Breakout Learning Module 1:</h4>
<ul style="margin-left: 20px; font-size: 16px; line-height: 1.6;">
<li>A structured, AI-moderated 30-minute team discussion.</li>
<li>Topic: <strong>Your Job Application Tracker Schema</strong> (what you kept, what you cut, and how it serves your career strategy).</li>
<li><strong>Coordinate today:</strong> Pick a 30-minute window with your group before Tuesday!</li>
</ul>
</div>

</div>

Note:
Announce the project teams. Introduce Breakout Learning Module 1. Emphasize that both M1 and the Breakout discussion are due Wednesday, Sep 23 at 11:59 PM.

---

## Runway &amp; Next Steps

<div style="max-width: 900px; margin: 30px auto; text-align: left; font-size: 20px; line-height: 1.8;">

<div style="background: #fdf2f8; border-left: 4px solid #db2777; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
<h4 style="color: #9d174d; margin-top: 0;">Key Dates Ahead:</h4>
<ol style="margin-left: 20px; font-size: 18px;">
<li><strong>Tue Sep 22:</strong> Class: Selected M1 Show &amp; Tell + APIs &amp; Data Sources.</li>
<li><strong>Wed Sep 23 (11:59 PM):</strong>
  <ul>
    <li><strong>Milestone 1 (Career Coach):</strong> Claude Project + 2 Skills + Working Connector + Loom walk-through.</li>
    <li><strong>Breakout Learning Module 1:</strong> Complete 30-minute team discussion.</li>
  </ul>
</li>
<li><strong>Thu Sep 24:</strong> Class: Partner Project Kickoff!</li>
</ol>
</div>

<div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 20px; border-radius: 6px; margin-top: 20px; font-size: 22px; color: #78350f;">
<strong>Remember...</strong>
</div>

</div>

Note:
Remind everyone of next week's agenda:
- Tuesday Sep 22: Selected student M1 show-and-tell, and APIs & Data Sources.
- Wednesday Sep 23 (11:59 PM): Milestone 1 and Breakout Module 1 due in D2L.
- Thursday Sep 24: Partner Project Kickoff!
Dismiss class and make sure teams connect with each other.

---

<div style="max-width: 800px; margin: 80px auto; text-align: center;">

<img src="https://upload.wikimedia.org/wikipedia/commons/f/f5/Notre_Dame_Fighting_Irish_logo.svg?utm_source=commons.wikimedia.org&amp;utm_campaign=index&amp;utm_content=original" alt="Notre Dame Fighting Irish Logo" style="width: 260px; height: auto; margin: 0 auto 30px auto; display: block;">

<h1 style="color: #0c2340; font-size: 56px; margin: 0;">Go Irish!</h1>

</div>

Note:
Go Irish! Dismiss class.
