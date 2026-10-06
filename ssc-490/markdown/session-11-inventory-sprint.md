## Please Sit With Your Team

<div style="font-size: 26px; margin: 40px auto 0 auto;">
and post your SOW draft in your Discord channel
</div>

---

## Already in Discord

<div style="font-size: 22px; line-height: 2; margin: 30px auto 0 auto; max-width: 760px; text-align: left;">

**Your team's** Inventory Sheet · Design doc · Project Journal

**Skills:** `inventory-builder` · `partner-correspondence` · `sow-builder`

**Your team's** transcript connector

**Your team's** recordings folder

**Today's doc**

</div>

---

## Today

<div style="font-size: 22px; line-height: 1.9; margin: 30px auto 0 auto; max-width: 700px; text-align: left;">

1 · IMPACT: Inventory<br>
2 · Data types<br>
3 · APIs<br>
4 · API docs and JSON<br>
5 · M2: the assignment<br>
6 · Work time · I meet with each team

</div>

---

## IMPACT

<div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin: 40px auto 0 auto; max-width: 960px; font-size: 17px;">
<div style="background: #18453B; color: #fff; padding: 22px 8px; border-radius: 10px;"><strong style="font-size: 34px;">I</strong><br>Inventory</div>
<div style="background: #f1f5f9; padding: 22px 8px; border-radius: 10px; color: #64748b;"><strong style="font-size: 34px;">M</strong><br>Map</div>
<div style="background: #f1f5f9; padding: 22px 8px; border-radius: 10px; color: #64748b;"><strong style="font-size: 34px;">P</strong><br>Process</div>
<div style="background: #f1f5f9; padding: 22px 8px; border-radius: 10px; color: #64748b;"><strong style="font-size: 34px;">A</strong><br>Anchor</div>
<div style="background: #f1f5f9; padding: 22px 8px; border-radius: 10px; color: #64748b;"><strong style="font-size: 34px;">C</strong><br>Compose</div>
<div style="background: #f1f5f9; padding: 22px 8px; border-radius: 10px; color: #64748b;"><strong style="font-size: 34px;">T</strong><br>Track</div>
</div>

<div style="font-size: 23px; margin: 44px auto 0 auto;">
What does the organization know, and where does it live?
</div>

;;;

### How We Got Here

<div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 50px auto 0 auto; max-width: 980px; font-size: 19px;">
<div style="background: #f1f5f9; padding: 22px 10px; border-radius: 10px; flex: 1;">Connectors + the lab</div>
<div style="color: #94a3b8; font-size: 26px;">&rarr;</div>
<div style="background: #f1f5f9; padding: 22px 10px; border-radius: 10px; flex: 1;">Partner interviews</div>
<div style="color: #94a3b8; font-size: 26px;">&rarr;</div>
<div style="background: #f1f5f9; padding: 22px 10px; border-radius: 10px; flex: 1;">Debrief</div>
<div style="color: #94a3b8; font-size: 26px;">&rarr;</div>
<div style="background: #f1f5f9; padding: 22px 10px; border-radius: 10px; flex: 1;">SOW</div>
<div style="color: #94a3b8; font-size: 26px;">&rarr;</div>
<div style="background: #18453B; color: #fff; padding: 22px 10px; border-radius: 10px; flex: 1;">Inventory</div>
</div>

;;;

### What Inventory Answers

<div style="font-size: 24px; line-height: 2.1; margin: 40px auto 0 auto; max-width: 780px; text-align: left;">

**1.** Which systems hold the partner's information

**2.** What your project needs each system to do

**3.** Whether each system can do it

**4.** What shape the data is in

</div>

;;;

### Two Kinds of System

<div style="font-size: 19px; max-width: 960px; margin: 30px auto 0 auto;">

| | What it is | Examples |
|---|---|---|
| **System of record** | Where the official version of the data lives. If two places disagree, this one wins | A CRM, a booking calendar, an LMS, the spreadsheet that *is* the master list |
| **System of knowledge** | Where know-how lives: how the work is done, what the rules are | A policy manual, a checklist, a training binder, a person's experience |

</div>

---

## Data Types

<div style="font-size: 16px; max-width: 980px; margin: 20px auto 0 auto;">

| Type | Holds | Example | Use it when |
|---|---|---|---|
| **String (text)** | Any text | `Diane Smith` | Names, notes, descriptions |
| **Number** | A numeric value, no quotes | `25`, `2027` | You'll compare, sort or add it |
| **Boolean** | true or false only | `true` | Yes/no questions |
| **Date** | A date (and time) | `2026-10-15` | When something happens or is due |
| **Choice** | One value from a fixed list | `confirmed` | Statuses, categories |
| **List (array)** | Several values | `["English", "Arabic"]` | Something can have several of another thing |
| **Linked record** | A pointer to another table | `Room R-03` | Connecting entities (a booking → a room) |

</div>

;;;

### Object

<div style="font-size: 23px; margin: 30px auto 0 auto;">
One record: named fields inside curly braces
</div>

<div style="display: grid; grid-template-columns: auto auto; gap: 6px 40px; justify-content: center; margin: 34px auto 0 auto; font-family: monospace; font-size: 22px; text-align: left;">
<div>{</div><div></div>
<div>&nbsp;&nbsp;"name": "Sarah Martinez",</div><div style="font-family: sans-serif; color: #475569;">string</div>
<div>&nbsp;&nbsp;"grad_year": 2027,</div><div style="font-family: sans-serif; color: #475569;">number</div>
<div>&nbsp;&nbsp;"dues_paid": true,</div><div style="font-family: sans-serif; color: #475569;">boolean</div>
<div>&nbsp;&nbsp;"interests": ["robotics", "ethics"]</div><div style="font-family: sans-serif; color: #475569;">list</div>
<div>}</div><div style="font-family: sans-serif; color: #475569;">object</div>
</div>

---

## What's an API?

<div style="font-size: 22px; margin: 20px auto 0 auto; max-width: 860px;">
A way for one piece of software to talk to another
</div>

<div style="display: grid; grid-template-columns: 1fr 1.6fr 1fr; align-items: center; gap: 0; margin: 40px auto 0 auto; max-width: 980px;">

<div style="background: #f1f5f9; padding: 26px 10px; border-radius: 10px; font-size: 21px;"><strong>n8n</strong></div>

<div style="font-size: 17px; line-height: 1.4;">
<div style="font-family: monospace; font-size: 17px;"><span style="background: #dbeafe; padding: 2px 6px; border-radius: 4px;">GET</span> <span style="background: #dcfce7; padding: 2px 6px; border-radius: 4px;">…mockapi.io/members</span></div>
<div style="color: #475569; margin-top: 4px;"><span style="color: #1d4ed8;">verb</span> &nbsp;·&nbsp; <span style="color: #15803d;">endpoint</span></div>
<div style="font-size: 30px; color: #64748b;">request &rarr;</div>
<div style="font-size: 30px; color: #64748b; margin-top: 10px;">&larr; response</div>
<div style="font-family: monospace; font-size: 17px;"><span style="background: #fef3c7; padding: 2px 6px; border-radius: 4px;">[ { "name": "Sarah Martinez", … } ]</span></div>
<div style="color: #92400e; margin-top: 4px;">data, as JSON</div>
</div>

<div style="background: #f1f5f9; padding: 26px 10px; border-radius: 10px; font-size: 21px;"><strong>MockAPI</strong></div>

</div>

;;;

### You Already Used One

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 40px auto 0 auto; max-width: 900px; font-size: 20px;">
<div style="background: #f1f5f9; padding: 20px; border-radius: 10px;"><strong>Read</strong><br><code>GET</code></div>
<div style="background: #f1f5f9; padding: 20px; border-radius: 10px;"><strong>Create</strong><br><code>POST</code></div>
<div style="background: #f1f5f9; padding: 20px; border-radius: 10px;"><strong>Update</strong><br><code>PUT</code> / <code>PATCH</code></div>
<div style="background: #f1f5f9; padding: 20px; border-radius: 10px;"><strong>Delete</strong><br><code>DELETE</code></div>
</div>

<div style="font-size: 22px; margin: 40px auto 0 auto;">
<strong>Endpoint:</strong> one specific address in an API that does one thing
</div>

;;;

### Getting In

<div style="font-size: 19px; max-width: 900px; margin: 26px auto 0 auto;">

| How you log in | What it is |
|---|---|
| **API key** | A password-like code a program uses to prove it's allowed to use an API |
| **OAuth** | A "Sign in with Google/Microsoft" style login that gives a program permission without sharing your password |
| **Password + 2FA** | A password plus a code from your phone. Hard for automation to get past |
| **SSO** | One organization login for many systems |
| **Public** | No login |

</div>

;;;

### Where APIs Sit

<div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 50px auto 0 auto; max-width: 960px; font-size: 20px;">
<div style="background: #f1f5f9; padding: 24px 12px; border-radius: 10px; flex: 1;"><strong>Claude</strong></div>
<div style="color: #94a3b8; font-size: 26px;">&rarr;</div>
<div style="background: #f1f5f9; padding: 24px 12px; border-radius: 10px; flex: 1.3;"><strong>Connector / MCP server</strong></div>
<div style="color: #94a3b8; font-size: 26px;">&rarr;</div>
<div style="background: #18453B; color: #fff; padding: 24px 12px; border-radius: 10px; flex: 1;"><strong>API</strong></div>
<div style="color: #94a3b8; font-size: 26px;">&rarr;</div>
<div style="background: #f1f5f9; padding: 24px 12px; border-radius: 10px; flex: 1;"><strong>The system</strong></div>
</div>

---

## API Docs

<div style="font-size: 21px; margin: 10px auto 0 auto; max-width: 900px;">
The software company's instructions for its API: what you can ask it to do, and how
</div>

<img src="assets/s11-api-docs-anthropic-messages.png" alt="Claude API reference page listing Messages endpoints" style="max-width: 72%; height: auto; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.18); margin-top: 16px;">

<div style="font-size: 20px; margin: 10px auto 0 auto;">
<code>&lt;product&gt; API documentation</code>
</div>

;;;

### One Endpoint

<img src="assets/s11-api-docs-anthropic-create.png" alt="Create a Message docs page" style="max-width: 85%; height: auto; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.18);">

;;;

### JSON

<div style="font-size: 23px; margin: 30px auto 0 auto; max-width: 860px;">
How APIs write data down: objects, lists and values, as text
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px auto 0 auto; max-width: 820px; font-size: 22px;">
<div style="background: #f1f5f9; padding: 20px; border-radius: 10px;"><code>{ }</code><br>object</div>
<div style="background: #f1f5f9; padding: 20px; border-radius: 10px;"><code>[ ]</code><br>list</div>
<div style="background: #f1f5f9; padding: 20px; border-radius: 10px;"><code>"name":</code><br>field</div>
<div style="background: #f1f5f9; padding: 20px; border-radius: 10px;"><code>"text"</code> · <code>1024</code> · <code>true</code><br>values</div>
</div>

;;;

### Reading the Endpoint

<div style="display: grid; grid-template-columns: auto auto; gap: 4px 40px; justify-content: center; margin: 30px auto 0 auto; font-family: monospace; font-size: 20px; text-align: left;">
<div>{</div><div style="font-family: sans-serif; color: #475569;">object</div>
<div>&nbsp;&nbsp;"model": "claude-opus-5",</div><div style="font-family: sans-serif; color: #475569;">string</div>
<div>&nbsp;&nbsp;"max_tokens": 1024,</div><div style="font-family: sans-serif; color: #475569;">number</div>
<div>&nbsp;&nbsp;"stream": false,</div><div style="font-family: sans-serif; color: #475569;">boolean</div>
<div>&nbsp;&nbsp;"messages": [</div><div style="font-family: sans-serif; color: #475569;">list</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;{</div><div style="font-family: sans-serif; color: #475569;">object</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"role": "user",</div><div style="font-family: sans-serif; color: #475569;">string</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"content": "Hello, world"</div><div style="font-family: sans-serif; color: #475569;">string</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;}</div><div></div>
<div>&nbsp;&nbsp;]</div><div></div>
<div>}</div><div></div>
</div>

;;;

### Your Turn

<div style="font-size: 23px; line-height: 2; margin: 40px auto; max-width: 820px; text-align: left;">

**1.** Open <a href="https://platform.claude.com/docs/en/api/messages/create">Create a Message</a>

**2.** Copy the page into Claude

**3.** Ask Claude to explain what you're looking at

</div>

;;;

### Working With AI on This

<div style="font-size: 23px; line-height: 2; margin: 40px auto; max-width: 860px; text-align: left;">

**1.** Find the documentation yourself

**2.** Give Claude the relevant pages, and ask it to answer from them and cite them

**3.** Open every citation and check it

</div>

---

## M2: Inventory Design Doc

<div style="font-size: 22px; margin: 16px auto 0 auto; max-width: 900px; line-height: 1.5;">
Your answers to the four Inventory questions, written down,<br>so your team, your partner and I can plan the workflow from them
</div>

<div style="font-size: 19px; max-width: 920px; margin: 22px auto 0 auto;">

| Part | What it is |
|---|---|
| **Inventory Sheet** | The machine-readable inventory: Systems, Requirements, Field definitions, Data sample |
| **Design doc** | The same findings explained in plain language for your partner |
| **Project Journal** | How the team tracks the work: who's assigned what, the research agenda, the partner log |

</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px auto 0 auto; max-width: 920px; text-align: left; font-size: 18px; line-height: 1.6;">
<div style="background: #e0f2fe; padding: 16px 22px; border-radius: 10px;"><strong>Read: today's doc</strong><br>M2 tab · M2 Examples tab · Glossary &amp; Data Types tab</div>
<div style="background: #dcfce7; padding: 16px 22px; border-radius: 10px;"><strong>Fill in: your team's files</strong><br>Inventory Sheet · Design doc · Project Journal</div>
</div>

<div style="font-size: 21px; margin: 22px auto 0 auto;">Due <strong>Thu Oct 15</strong></div>

;;;

### M2 at a Glance

<div style="display: grid; grid-template-columns: 1.15fr 90px 1fr; grid-template-rows: auto auto; gap: 14px 0; margin: 18px auto 0 auto; max-width: 1000px; text-align: left; font-size: 16px;">

<div style="border: 2px solid #15803d; border-radius: 10px; overflow: hidden;">
<div style="background: #15803d; color: #fff; padding: 8px 14px; font-size: 19px;"><strong>Inventory Sheet</strong></div>
<div style="padding: 10px 14px; line-height: 2.1;">
<div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0;"><span><strong>Systems</strong></span><span style="color: #475569;">Steps 1 · 3</span></div>
<div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0;"><span><strong>Requirements</strong></span><span style="color: #475569;">Steps 2 · 3</span></div>
<div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0;"><span><strong>Field definitions</strong></span><span style="color: #475569;">Step 5</span></div>
<div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0;"><span><strong>Data sample</strong></span><span style="color: #475569;">Step 5</span></div>
<div style="display: flex; justify-content: space-between;"><span>Status ✅ ❓ ⚠️ on every tab</span><span style="color: #475569;">Step 4</span></div>
</div>
</div>

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; color: #64748b; font-size: 14px; text-align: center; line-height: 1.2;">
<div style="font-size: 30px;">&rarr;</div>explained<br>in
</div>

<div style="border: 2px solid #1d4ed8; border-radius: 10px; overflow: hidden;">
<div style="background: #1d4ed8; color: #fff; padding: 8px 14px; font-size: 19px;"><strong>Design doc</strong></div>
<div style="padding: 10px 14px; line-height: 1.75;">
<div style="display: flex; justify-content: space-between;"><span>1 · The project<br>2 · Systems<br>3 · What we'll track<br>4 · Gaps<br>5 · Open questions<br>6 · Assumptions</span><span style="color: #475569;">Step 6</span></div>
<div style="display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; margin-top: 4px;"><span>7 · Partner review</span><span style="color: #475569;">After M2</span></div>
</div>
</div>

<div style="grid-column: 1 / 4; border: 2px solid #b45309; border-radius: 10px; overflow: hidden; display: flex;">
<div style="background: #b45309; color: #fff; padding: 12px 16px; font-size: 19px; display: flex; align-items: center;"><strong>Project Journal</strong></div>
<div style="display: flex; flex: 1; justify-content: space-around; align-items: center; padding: 10px 6px; gap: 6px; text-align: center; line-height: 1.3;">
<div><strong>Index</strong><br><span style="color: #475569;">Setup</span></div>
<div><strong>Team</strong><br><span style="color: #475569;">Step 1</span></div>
<div><strong>Partner contacts</strong><br><span style="color: #475569;">Step 1</span></div>
<div><strong>Research agenda</strong><br><span style="color: #475569;">Steps 2 · 4</span></div>
<div><strong>Partner log</strong><br><span style="color: #475569;">All along</span></div>
<div><strong>Decisions</strong><br><span style="color: #475569;">All along</span></div>
<div><strong>Journal</strong><br><span style="color: #475569;">All along</span></div>
</div>
</div>

</div>

;;;

### Who Does What

<div style="display: flex; justify-content: center; gap: 14px; margin: 6px auto 0 auto; font-size: 17px;"><div style="background: #e0f2fe; padding: 6px 14px; border-radius: 6px;"><strong>Read:</strong> M2 tab → Who does what</div><div style="background: #dcfce7; padding: 6px 14px; border-radius: 6px;"><strong>Fill in:</strong> Journal → Team</div></div>

<div style="font-size: 20px; max-width: 900px; margin: 30px auto 0 auto;">

| | |
|---|---|
| **Project manager** | Runs Step 1, assigns each system, keeps the Journal, sends anything that goes to the partner |
| **Assigned to** | The teammate who researches a system end to end |
| **Client owner** | The person *at the partner* who uses or maintains a system |

</div>

;;;

### Step 1 · Gather

<div style="display: flex; justify-content: center; gap: 14px; margin: 6px auto 0 auto; font-size: 17px;"><div style="background: #e0f2fe; padding: 6px 14px; border-radius: 6px;"><strong>Read:</strong> M2 tab → Step 1 · M2 Examples tab → Step 1</div><div style="background: #dcfce7; padding: 6px 14px; border-radius: 6px;"><strong>Fill in:</strong> Inventory Sheet → Systems</div></div>

<div style="font-size: 21px; margin: 20px auto 0 auto;">What systems are involved?</div>

<div style="font-size: 19px; max-width: 900px; margin: 22px auto 0 auto;">

| Systems tab | |
|---|---|
| **System** | Software, a spreadsheet, a shared inbox, a binder, a person who "just knows" |
| **Existing or Proposed** | Used today, or something we're suggesting |
| **Record or knowledge** | System of record · system of knowledge |
| **Client owner** | A person, not a department · or ❓ |
| **Where you learned it** | Recording + chunk, email, document |
| **Assigned to** | One teammate |

</div>

;;;

### Step 2 · Requirements

<div style="display: flex; justify-content: center; gap: 14px; margin: 6px auto 0 auto; font-size: 17px;"><div style="background: #e0f2fe; padding: 6px 14px; border-radius: 6px;"><strong>Read:</strong> M2 tab → Step 2 · M2 Examples tab → Step 2</div><div style="background: #dcfce7; padding: 6px 14px; border-radius: 6px;"><strong>Fill in:</strong> Inventory Sheet → Requirements</div></div>

<div style="font-size: 21px; margin: 16px auto 0 auto;">What does the project need each system to do?</div>

<div style="font-size: 18px; max-width: 920px; margin: 20px auto 0 auto;">

| | |
|---|---|
| **Requirement** | Something the project needs a system to do, in the partner's terms |
| **Entity** | The thing it's about: a donor, a booking, a prospect |
| **Action** | Read, create, update or delete |
| **System** | Which system it touches |
| **Possible?** | Unknown, until Step 3 |
| **Why it matters** | What breaks if the answer is no |

</div>

;;;

### Step 2 · Example

<div style="display: flex; justify-content: center; gap: 14px; margin: 6px auto 0 auto; font-size: 17px;"><div style="background: #e0f2fe; padding: 6px 14px; border-radius: 6px;"><strong>Read:</strong> M2 Examples tab → Step 2</div><div style="background: #dcfce7; padding: 6px 14px; border-radius: 6px;"><strong>Fill in:</strong> Inventory Sheet → Requirements</div></div>

<div style="font-size: 16px; max-width: 1000px; margin: 26px auto 0 auto;">

| Requirement | Entity | Action | System | Possible? |
|---|---|---|---|---|
| Staff can see a list of donors whose email, address or phone is missing or out of date | Constituent | read | Little Green Light | Unknown |
| Staff can update a donor's mailing address in LGL when Constant Contact has a newer one | Street address | update | Little Green Light | Unknown |
| Staff can combine two records for the same donor | Constituent | update + delete | Little Green Light | Unknown |

</div>

;;;

### Step 2 · Your Research Agenda

<div style="display: flex; justify-content: center; gap: 14px; margin: 6px auto 0 auto; font-size: 17px;"><div style="background: #e0f2fe; padding: 6px 14px; border-radius: 6px;"><strong>Read:</strong> M2 tab → Step 2</div><div style="background: #dcfce7; padding: 6px 14px; border-radius: 6px;"><strong>Fill in:</strong> Journal → Research agenda</div></div>

<div style="font-size: 20px; max-width: 920px; margin: 30px auto 0 auto;">

| | Who can answer | Example |
|---|---|---|
| **Research** | The docs, or a test | "Can the Little Green Light API update a constituent's address?" |
| **Partner** | Only the partner | "Which of your two calendars is the one you actually book rooms in?" |

</div>

<div style="font-size: 21px; margin: 26px auto 0 auto;">Every Unknown is a task in the Journal, assigned, with a due date</div>

;;;

### Step 3 · Research

<div style="display: flex; justify-content: center; gap: 14px; margin: 6px auto 0 auto; font-size: 17px;"><div style="background: #e0f2fe; padding: 6px 14px; border-radius: 6px;"><strong>Read:</strong> M2 tab → Step 3 · M2 Examples tab → Step 3</div><div style="background: #dcfce7; padding: 6px 14px; border-radius: 6px;"><strong>Fill in:</strong> Inventory Sheet → Requirements, Systems</div></div>

<div style="font-size: 21px; margin: 16px auto 0 auto;">Can the system do it?</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 26px auto 0 auto; max-width: 920px; text-align: left; font-size: 19px; line-height: 1.7;">

<div style="background: #f1f5f9; padding: 22px 26px; border-radius: 10px;">
<strong>Each requirement</strong><br>
Possible? Yes · No · Maybe<br>
How: API · connector · MCP · export · by hand · paper · a person<br>
Docs link
</div>

<div style="background: #f1f5f9; padding: 22px 26px; border-radius: 10px;">
<strong>Each system, once</strong><br>
How you log in<br>
What it exports<br>
Limits and terms
</div>

</div>

;;;

### Step 4 · Mark

<div style="display: flex; justify-content: center; gap: 14px; margin: 6px auto 0 auto; font-size: 17px;"><div style="background: #e0f2fe; padding: 6px 14px; border-radius: 6px;"><strong>Read:</strong> M2 tab → Step 4 · M2 Examples tab → Step 4</div><div style="background: #dcfce7; padding: 6px 14px; border-radius: 6px;"><strong>Fill in:</strong> Inventory Sheet → Status column, every tab</div></div>

<div style="font-size: 20px; max-width: 900px; margin: 30px auto 0 auto;">

| Mark | Means | Requires |
|---|---|---|
| ✅ | Confirmed | Something you can point to |
| ❓ | Asked and waiting | A matching task in the Journal |
| ⚠️ | Our assumption | One line saying why |

</div>

;;;

### Step 5 · Type It

<div style="display: flex; justify-content: center; gap: 14px; margin: 6px auto 0 auto; font-size: 17px;"><div style="background: #e0f2fe; padding: 6px 14px; border-radius: 6px;"><strong>Read:</strong> M2 tab → Step 5 · Glossary &amp; Data Types tab</div><div style="background: #dcfce7; padding: 6px 14px; border-radius: 6px;"><strong>Fill in:</strong> Inventory Sheet → Field definitions, Data sample</div></div>

<div style="font-size: 21px; margin: 16px auto 0 auto;">What exactly will we track?</div>

<div style="font-size: 19px; max-width: 900px; margin: 22px auto 0 auto;">

| Field definitions | |
|---|---|
| **Field** | One piece of information: a donor's email, a booking's date |
| **Type** | From the data types table |
| **Comes from** | Which system, or "we create it" |
| **Created by / changed by** | A person, a form, a sync, the AI, the workflow |

</div>

<div style="font-size: 20px; margin: 20px auto 0 auto;"><strong>Data sample:</strong> 3–5 fake rows, one column per field</div>

;;;

### Step 6 · Design Doc

<div style="display: flex; justify-content: center; gap: 14px; margin: 6px auto 0 auto; font-size: 17px;"><div style="background: #e0f2fe; padding: 6px 14px; border-radius: 6px;"><strong>Read:</strong> M2 tab → Step 6 · M2 Examples tab → Step 6</div><div style="background: #dcfce7; padding: 6px 14px; border-radius: 6px;"><strong>Fill in:</strong> Design doc</div></div>

<div style="font-size: 21px; line-height: 1.8; margin: 26px auto 0 auto; max-width: 760px; text-align: left;">

**1.** The project, in your partner's words

**2.** Systems: what each can and can't do

**3.** What we'll track

**4.** Gaps

**5.** Open questions

**6.** Assumptions

</div>

;;;

### After M2 · Partner Review Call

<div style="display: flex; justify-content: center; gap: 14px; margin: 6px auto 0 auto; font-size: 17px;"><div style="background: #e0f2fe; padding: 6px 14px; border-radius: 6px;"><strong>Read:</strong> M2 tab → After M2</div><div style="background: #dcfce7; padding: 6px 14px; border-radius: 6px;"><strong>Fill in:</strong> Journal → Partner log · Design doc → Partner review</div></div>

<div style="font-size: 24px; margin: 50px auto 0 auto;">
30 minutes · Systems and Requirements · <em>What's missing?</em>
</div>

;;;

### Dates

<div style="font-size: 20px; max-width: 860px; margin: 26px auto 0 auto;">

| When | What |
|---|---|
| **Tue Oct 6** | PM picked · workspace set up · Gather |
| **Wed Oct 7** | Individual lab due |
| **Thu Oct 8** | SOW to partner · Sheet review |
| **Fri Oct 9** | Partner questions go out |
| **Tue Oct 13** | Inventory Sheet done · Sheet review |
| **Thu Oct 15** | **M2** |

</div>

---

## Today's Setup

<div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 36px; margin: 24px auto 0 auto; max-width: 1000px; text-align: left;">

<div style="font-size: 19px; line-height: 1.6;">

**1 ·** Check your transcript connector

**2 ·** Install `inventory-builder` and `partner-correspondence`

**3 ·** Pick a project manager

**4 ·** Open your team's Sheet, design doc and Journal

**5 ·** In the Sheet, rename <em>Dictionary</em> → <em>Field definitions</em> and the entity tab → <em>Data sample</em>

**6 ·** Create a team Claude Project with the guardrails

**7 ·** Gather

</div>

<div style="background: #f1f5f9; padding: 24px 26px; border-radius: 10px; font-size: 19px; line-height: 1.6; align-self: start;">
<strong style="font-size: 22px;">Record your working session</strong><br><br>
Upload it to your team's recordings folder<br><br>
<code style="font-size: 15px;">2026-10-06_team-working-session.m4a</code>
</div>

</div>

---

## When I Meet With Your Team

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 44px auto 0 auto; max-width: 860px; font-size: 22px;">
<div style="background: #f1f5f9; padding: 26px 18px; border-radius: 10px;"><strong>1</strong><br>Your lab</div>
<div style="background: #f1f5f9; padding: 26px 18px; border-radius: 10px;"><strong>2</strong><br>Your SOW</div>
<div style="background: #f1f5f9; padding: 26px 18px; border-radius: 10px;"><strong>3</strong><br>M2</div>
</div>

---

## Today's Doc

<img src="assets/s11-todays-doc-qr.png" alt="QR code for the Inventory Sprint session doc" style="width: 260px; height: auto; margin-top: 30px;">

<p style="font-size: 20px;"><a href="https://docs.google.com/document/d/1MdrQwEhPp2tQ63fQVINzCqTXdtvPFFrg-X9krSHfPrI/edit?tab=t.v0k55b1xjcno">Open the doc</a></p>
