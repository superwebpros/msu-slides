## Check-In & Housekeeping

<div style="display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: center; max-width: 960px; margin: 25px auto;">
<div style="text-align: left; font-size: 18px; line-height: 1.7;">

<h3>Session 4: RAG &amp; Connectors</h3>
<p>Open your laptop, Claude.ai, and your Google Workspace.</p>

<div style="background: #fdf2f8; border-left: 4px solid #db2777; padding: 12px 16px; border-radius: 6px; margin: 12px 0;">
<strong style="color: #9d174d;">The Runway to Milestone 1:</strong>
<ul style="margin: 4px 0 0 16px; font-size: 15px; line-height: 1.5;">
<li><strong>Today is the LAST in-person build session before M1 is due.</strong></li>
<li><strong>Next Week:</strong> Jesse is at a conference in Atlanta.</li>
<li><strong>Tue Sep 15:</strong> Guest lecture on AI Ethics + in-class build time.</li>
<li><strong>Thu Sep 17:</strong> Breakout Module 1 (collaborative design debrief).</li>
<li><strong>Mon Sep 21:</strong> Milestone 1 (Career Coach) due in D2L.</li>
</ul>
</div>

<div style="background: #f5f3ff; border: 2px solid #7c3aed; padding: 14px 18px; border-radius: 8px; margin-top: 15px;">
<strong style="color: #5b21b6; font-size: 17px;">Today's Live Poll Question:</strong>
<p style="font-size: 17px; color: #1e293b; margin: 6px 0 0 0;">
<strong>"Would you rather take an exam from memory or open book? Why?"</strong>
</p>
</div>

</div>
<div style="text-align: center;">
<img src="assets/poll-s05-qr.png" alt="Live Poll QR Code" style="width: 220px; height: 220px; border: 2px solid #cbd5e1; border-radius: 8px; padding: 6px; background: white;">
<div style="font-size: 12px; color: #6b7280; margin-top: 6px;">Live Poll: <strong style="color: #7c3aed;">msu-slides-poll.jesse-41b.workers.dev/s05</strong></div>
</div>
</div>

Note:
Welcome everyone to Session 4. Set the stakes immediately: today is the LAST instructor-present build session before Milestone 1 is due on September 21. Have students answer the live poll question right as they walk in: "Would you rather take an exam from memory or open book? Why?"

---

## Quick Skill Check from Tuesday

<div style="max-width: 900px; margin: 35px auto; text-align: left; font-size: 21px; line-height: 1.8;">

On Tuesday, everyone set up a Claude Project and built their first skill (**Resume Tailoring** using the WHO method):

<div style="background: #f8fafc; border: 2px solid #7c3aed; padding: 25px; border-radius: 10px; margin: 25px 0;">
<ul style="margin: 0 0 0 20px;">
<li>Who ran their skill against a real job posting after class?</li>
<li style="margin-top: 15px;"><strong>What did it get wrong?</strong></li>
</ul>
</div>

</div>

Note:
Cold-call 2-3 students to share what their skill produced when given a real job posting. Look for where the skill was missing outside information or where it got stuck.

---

## How RAG Works

<div style="max-width: 860px; margin: 20px auto; text-align: center;">
<img src="assets/rag-base-layer.svg" alt="How RAG Works Diagram" style="width: 100%; max-height: 480px; border: 1px solid #cbd5e1; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
</div>

Note:
Walk through this conceptual diagram:
In our minds, training data is the base layer. A bigger model has a bigger base, and a smaller model has a smaller base.
When you add specific, verified information on top (you AUGMENT the data), the model becomes dramatically better at answering questions about that specific data — regardless of model size!

---

## What RAG Actually Is

### Retrieval-Augmented Generation

<div style="max-width: 960px; margin: 25px auto; text-align: left;">

RAG is a simple 3-step pattern:

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin: 25px 0;">

<div style="background: #f8fafc; border-top: 4px solid #7c3aed; border-radius: 8px; padding: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
<strong style="color: #5b21b6; font-size: 18px;">1. You Ask</strong>
<p style="font-size: 15px; color: #334155; margin-top: 8px; line-height: 1.5;">
A specific question enters the system (e.g., <em>"What certifications match an economics major?"</em>).
</p>
</div>

<div style="background: #f8fafc; border-top: 4px solid #2563eb; border-radius: 8px; padding: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
<strong style="color: #1e40af; font-size: 18px;">2. System Retrieves</strong>
<p style="font-size: 15px; color: #334155; margin-top: 8px; line-height: 1.5;">
The system searches a trusted external store and pulls out the exact relevant records.
</p>
</div>

<div style="background: #f8fafc; border-top: 4px solid #16a34a; border-radius: 8px; padding: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
<strong style="color: #15803d; font-size: 18px;">3. Model Generates</strong>
<p style="font-size: 15px; color: #334155; margin-top: 8px; line-height: 1.5;">
The model answers the question <strong>grounded directly in those retrieved records</strong>.
</p>
</div>

</div>

<div style="background: #ede9fe; padding: 16px 20px; border-radius: 8px; font-size: 18px; color: #5b21b6; text-align: center;">
<strong>RAG is a pattern, not a product.</strong> It is simply fetching the verified source before answering.
</div>

</div>

Note:
Emphasize that RAG is a pattern. Ask -> Retrieve -> Generate. The difference between answering from pre-training memory vs. answering from retrieved records is provenance.

---

## How We Access RAG: Connectors

<div style="max-width: 920px; margin: 30px auto; text-align: left; font-size: 20px; line-height: 1.8;">

In production AI systems, **RAG is almost always accessed through Connectors.**

- Connectors are the bridges that allow Claude to reach into external databases, files, and services.
- Connectors fundamentally take on **two distinct shapes**:
  1. **Information Connectors (RAG):** Pulling external knowledge *IN* to read.
  2. **Action Connectors (Tools):** Triggering operations *OUT* to write or change state.

<div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 16px 20px; border-radius: 6px; margin-top: 25px; font-size: 18px;">
Today we will look at connectors that do both, but it is essential to keep them distinct: <strong>RAG gives AI information; Tools give AI action.</strong>
</div>

</div>

;;;

### Connectors = Information (Eyes) vs. Action (Hands)

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 18px; line-height: 1.7;">

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">

<div style="background: #eff6ff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px;">
<h4 style="color: #1e40af; margin-top: 0;">👀 Information (Eyes · Read / RAG)</h4>
<p style="font-size: 15px; color: #1e3a8a; line-height: 1.6;">
Reaching outside to pull verified knowledge <strong>IN</strong>.
</p>
<ul style="font-size: 15px; color: #1e3a8a; margin-top: 8px;">
<li>Baserow (MSU Career Services database)</li>
<li>Archie MCP (Course documents &amp; transcripts)</li>
<li>Google Drive file search</li>
</ul>
</div>

<div style="background: #fdf4ff; border: 2px solid #a855f7; border-radius: 8px; padding: 20px;">
<h4 style="color: #7e22ce; margin-top: 0;">🛠️ Action (Hands · Write / Tools)</h4>
<p style="font-size: 15px; color: #6b21a8; line-height: 1.6;">
Reaching outside to push changes <strong>OUT</strong> into the world.
</p>
<ul style="font-size: 15px; color: #6b21a8; margin-top: 8px;">
<li>Creating a new spreadsheet file</li>
<li>Sending a notification or message</li>
<li>Writing an application tracker entry</li>
</ul>
</div>

</div>

<div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 18px; border-radius: 6px; font-size: 16px; color: #475569; text-align: center;">
Remember: <strong>RAG is the AI's eyes. Tools are the AI's hands.</strong>
</div>

</div>

---

## Let's Configure Your First Connector!

<div style="max-width: 920px; margin: 30px auto; text-align: left; font-size: 19px; line-height: 1.8;">

Follow these steps in Claude.ai to enable the **MSU Career Services Connector**:

<ol style="margin-left: 20px; font-size: 18px; line-height: 1.8;">
<li>Navigate to your **Career Coach Project** in Claude.ai.</li>
<li>Look for the **Integrations / Connectors** section on the project dashboard.</li>
<li>Enable the **MSU Career Services** connector for your project.</li>
<li>Verify that the connector shows an active/connected status.</li>
</ol>

<div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; border-radius: 6px; margin-top: 20px; font-size: 16px;">
Once enabled, every chat inside this Project has the ability to query this database!
</div>

</div>

---

## RAG #1: The MSU Career Services Database

<div style="max-width: 940px; margin: 20px auto; text-align: left;">

<div style="background: #f8fafc; border: 2px solid #7c3aed; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px;">
<strong style="color: #5b21b6; font-size: 16px;">The Test Prompt:</strong>
<div style="font-family: monospace; font-size: 16px; color: #1e293b; margin-top: 6px;">
"What professional associations serve criminal justice majors in Michigan?"
</div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">

<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px;">
<h4 style="color: #0f172a; margin-top: 0;">Step 1: Without Connector</h4>
<p style="font-size: 15px; color: #334155; line-height: 1.6;">
Open a regular chat (or turn the connector off).<br>
Paste the prompt.<br><br>
<em>Observe what it returns.</em>
</p>
</div>

<div style="background: #f5f3ff; border: 2px solid #7c3aed; border-radius: 8px; padding: 18px;">
<h4 style="color: #5b21b6; margin-top: 0;">Step 2: With Connector Enabled</h4>
<p style="font-size: 15px; color: #334155; line-height: 1.6;">
In your project with the connector enabled, ask the exact same question.<br><br>
<em>What changed? What did you notice?</em>
</p>
</div>

</div>

</div>

Note:
Do not give away the difference beforehand! Let them run both prompts and tell you what they observe. The connected query cites vetted resources that MSU licenses for them.

---

## Let's Explore the Connection

<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.8;">

Before we build on top of this connector, let's inspect what it can actually do:

<div style="background: #f8fafc; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
<strong style="color: #1e40af; font-size: 18px;">Ask Claude in Chat:</strong>
<p style="font-size: 18px; font-family: monospace; color: #0f172a; margin: 10px 0 0 0;">
"What tools does this connector expose, and how do they work?"
</p>
</div>

<p style="font-size: 17px; color: #6b7280;">
Notice how Claude explains the tables and querying functions available to it.
</p>

</div>

;;;

### Seeing Tools Inside Claude's Interface

<div style="max-width: 920px; margin: 30px auto; text-align: left; font-size: 19px; line-height: 1.8;">

You can also inspect available connector tools directly inside the Claude UI:

- Look at the chat input box or project settings under **Tools &amp; Connectors**.
- Click the connector icon to expand the list of exposed functions (e.g., query, search, list tables).
- When Claude runs a query during a chat, notice the expandable tool-call block showing the exact query it sent and the records it received back!

</div>

---

## Making a Skill to Fit This Data

<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.8;">

Now that we've explored what the connector exposes:

<div style="background: #f5f3ff; border: 2px solid #7c3aed; padding: 24px; border-radius: 10px; margin: 20px 0;">
<h3 style="color: #5b21b6; margin-top: 0;">Let's imagine we want to make a skill to fit this data:</h3>
<p style="font-size: 20px; color: #1e293b; margin-bottom: 0;">
<strong>How would we pursue that?</strong>
</p>
</div>

<p style="font-size: 17px; color: #475569;">
Work with Claude to customize a skill for interacting with this data. What boundaries should it have? When should it query the database, and when should it leave you alone?
</p>

</div>

;;;

### Key Questions When Designing the Skill

<div style="max-width: 940px; margin: 20px auto; text-align: left; font-size: 17px; line-height: 1.7;">

As you work with Claude to build your skill, consider:

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">

<div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 18px; border-radius: 6px;">
<h4 style="color: #1e40af; margin-top: 0;">1. Trigger Boundaries</h4>
<p style="font-size: 15px; line-height: 1.6;">
• <strong>Strategy Mode:</strong> Exploring certifications, career paths, or affiliations ➔ Query the connector!<br>
• <strong>Execution Mode:</strong> Tailoring a specific resume bullet ➔ Don't touch the connector!
</p>
</div>

<div style="background: #f8fafc; border-left: 4px solid #7c3aed; padding: 18px; border-radius: 6px;">
<h4 style="color: #7c3aed; margin-top: 0;">2. Output Hygiene</h4>
<p style="font-size: 15px; line-height: 1.6;">
• Should it dump raw database rows, or synthesize recommendations around your major?<br>
• <strong>Links:</strong> Make sure it returns direct clickable URLs inline so you don't have to hunt down resources.
</p>
</div>

</div>

<div style="text-align: center; font-size: 17px; color: #7c3aed; font-weight: bold;">
Draft your skill in Claude, test it live, and add it to your Project Skills tab!
</div>

</div>

---

## RAG #2: Archie (Course Transcripts &amp; Docs)

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

Our second worked example is **Archie**, our course assistant:

- Archie is a custom MCP server that retrieves over our syllabus, session slide decks, assignment briefs, and **live class transcripts**.
- When you ask Archie a question, it retrieves the relevant excerpts and answers grounded in what happened in class.

<div style="background: #eff6ff; border: 2px solid #2563eb; border-radius: 8px; padding: 18px; margin: 20px 0;">
<strong style="color: #1e40af;">Connect Archie via Remote MCP:</strong><br>
<div style="font-family: monospace; font-size: 13px; word-break: break-all; margin-top: 8px; color: #1e293b;">
https://archie.jesse-41b.workers.dev/mcp/5208a43589497b3cb8196765db711ebd4659841962ae15fb
</div>
</div>

<p style="font-size: 17px; color: #475569;">
Test it by asking: <em>"What did Jesse say in class on Tuesday about the three tests for a skill?"</em>
</p>

</div>

---

## Building the Tracker — And Hitting the Wall

### Step 1: Connect to Google Drive

<div style="max-width: 920px; margin: 30px auto; text-align: left; font-size: 19px; line-height: 1.8;">

Now we shift from **Information (RAG)** to **Action (Tools)**:

1. In Claude.ai, open your **Connectors / Integrations** settings.
2. Select **Google Drive** and authenticate with your MSU Google account.
3. Verify that Google Drive is connected to your project.

<div style="background: #f8fafc; border-left: 4px solid #16a34a; padding: 14px 18px; border-radius: 6px; margin-top: 20px; font-size: 16px;">
This connector allows Claude to interact with files in your Google Drive.
</div>

</div>

;;;

### Step 2: Explore Google Drive Tools

<div style="max-width: 920px; margin: 30px auto; text-align: left; font-size: 19px; line-height: 1.8;">

Just like we did with Career Services, let's explore the tool surface:

<div style="background: #f8fafc; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
<strong style="color: #1e40af; font-size: 18px;">Ask Claude in Chat:</strong>
<p style="font-size: 18px; font-family: monospace; color: #0f172a; margin: 10px 0 0 0;">
"What tools do you have for Google Drive, and what can you do with them?"
</p>
</div>

<p style="font-size: 17px; color: #6b7280;">
Pay close attention to what actions are listed.
</p>

</div>

;;;

### Step 3: Design Your Application Tracker

<div style="max-width: 920px; margin: 25px auto; text-align: left; font-size: 18px; line-height: 1.7;">

Now, work with Claude to propose a clean design for your **Job Application Tracker** in Google Sheets:

<div style="background: #f8fafc; border: 2px solid #7c3aed; padding: 20px; border-radius: 8px; margin: 20px 0;">
<strong>Your Task:</strong><br>
Ask Claude to suggest a practical column schema for tracking 30–50 job applications over the next six months.
</div>

**Things to think about as you review Claude's suggestions:**
- *Will you actually fill this in?* (A column that requires 10 minutes of manual research after every application will end up blank).
- *Fixed Stages vs. Free Text:* "Phone Screen", "Interview Round 1", "Offer" beat messy paragraph notes (you can't filter on prose!).

</div>

;;;

### Step 4: Claude Creates the Sheet

<div style="max-width: 920px; margin: 30px auto; text-align: left; font-size: 19px; line-height: 1.8;">

When you are satisfied with the columns you and Claude designed:

<div style="background: #f5f3ff; border: 2px solid #7c3aed; padding: 22px; border-radius: 8px; margin: 20px 0;">
<strong>Direction:</strong><br>
Ask Claude to create the Google Sheet in your Google Drive with those chosen columns.
</div>

- Claude calls the Google Drive file creation tool.
- Check your Google Drive: your tracking spreadsheet is created and ready!

</div>

;;;

### Step 5: The Wall

<div style="max-width: 920px; margin: 30px auto; text-align: left; font-size: 20px; line-height: 1.8;">

Now give Claude the next instruction:

<div style="background: #fef2f2; border: 2px solid #ef4444; padding: 22px; border-radius: 8px; margin: 25px 0;">
<strong style="color: #b91c1c; font-size: 20px;">Your Next Direction:</strong><br>
Ask Claude to add a dummy row to your spreadsheet representing a job you found today.
</div>

<p style="text-align: center; font-size: 24px; color: #991b1b; font-weight: bold;">
What happened?
</p>

</div>

;;;

### The Lesson: Tool Surfaces

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.7;">

The wrong diagnosis: *"Spreadsheets aren't databases"* or *"AI failed."*  
(Claude just created the file two minutes ago!)

<div style="background: #fdf4ff; border-left: 4px solid #a855f7; padding: 18px 22px; border-radius: 8px; margin: 20px 0;">
<strong style="font-size: 22px; color: #7e22ce;">The Real Diagnosis:</strong><br>
<strong>A connector is only as capable as the specific tools it exposes.</strong>
</div>

The Google Drive connector exposes:
1. `create_file` ✅
2. `copy_file` ✅
3. `read_file` ✅
4. `trash_file` ✅
❌ `append_row` **does not exist.**

</div>

;;;

### Finding a Workaround

<div style="max-width: 920px; margin: 30px auto; text-align: left; font-size: 20px; line-height: 1.8;">

<div style="background: #f8fafc; border: 2px solid #7c3aed; padding: 22px; border-radius: 8px; margin: 20px 0;">
<strong style="color: #5b21b6; font-size: 20px;">Your Challenge:</strong><br>
Work with Claude to try and find a workaround.  
<em>Can your Claude find a practical way to format and get data into your spreadsheet?</em>
</div>

<p style="font-size: 18px; color: #475569;">
Spend a few minutes experimenting with Claude to see what solutions it proposes.
</p>

</div>

---

## Milestone 1 Clarification & Wrap-Up

<div style="max-width: 940px; margin: 25px auto; text-align: left; font-size: 18px; line-height: 1.7;">

### What We Expect for Milestone 1 (Due Mon Sep 21):

<div style="background: #f8fafc; border: 2px solid #16a34a; border-radius: 8px; padding: 20px; margin: 15px 0;">
<ul style="font-size: 16px; line-height: 1.7;">
<li><strong>Loom Walkthrough Only (3–5 min):</strong> Run through your system live on camera.</li>
<li><strong>No Auto-Writing Expected:</strong> We do NOT expect Claude to magically auto-populate your Google Sheet. Using a copy-paste row format into your sheet is completely expected!</li>
<li><strong>Working Connectors for M1:</strong> The working connectors are:
  <ol style="margin-top: 6px;">
  <li>The <strong>MSU Career Services connector</strong> (Information / RAG)</li>
  <li>The <strong>Google Sheet connector</strong> (used to create and house your tracker)</li>
  </ol>
</li>
</ul>
</div>

**What I'm Grading:** Evidence of comprehension. Did you configure a Project? Did you build working Skills? Can you explain the difference between a prompt, a skill, and a connector?

</div>

;;;

### What to Do Before Next Week

<div style="max-width: 900px; margin: 25px auto; text-align: left; font-size: 19px; line-height: 1.8;">

<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 22px;">
<ol style="margin-left: 20px;">
<li><strong>Keep Both Connectors Live:</strong> Make sure Career Services and Google Drive are connected in your Claude workspace.</li>
<li><strong>Test Your 2 Skills:</strong> Run real queries through <code>resume-tailor-who</code> and your new career strategist skill.</li>
<li><strong>Add at Least 3 Real Rows:</strong> Log 3 real jobs you'd actually apply for into your Google Sheet tracker.</li>
<li><strong>Stuck? Ask Archie!</strong> Archie has our course materials and transcripts loaded.</li>
</ol>
</div>

<p style="text-align: center; font-size: 20px; color: #7c3aed; margin-top: 25px; font-weight: bold;">
Have a great session with Maya on Tuesday — I'll see you when I'm back from Atlanta!
</p>

</div>
