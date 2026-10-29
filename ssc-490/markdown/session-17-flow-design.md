## How We Got Here

<div style="display: grid; grid-template-columns: 150px repeat(5, 1fr); gap: 14px 12px; align-items: start; max-width: 1240px; margin: 36px auto 0 auto; font-size: 19px; text-align: center;">
<div style="text-align: left; font-size: 17px; font-weight: bold; color: #1971c2; padding-top: 30px;">AI basics</div>
<div class="fragment"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 22px 6px; min-height: 92px; display: flex; align-items: center; justify-content: center;">What AI can and can't do</div><div style="font-size: 14px; color: #495057; margin-top: 8px;">shows up as:<br>where AI belongs in the flow</div></div>
<div class="fragment"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 22px 6px; min-height: 92px; display: flex; align-items: center; justify-content: center;">Prompting</div><div style="font-size: 14px; color: #495057; margin-top: 8px;">shows up as:<br>AI steps and your checks</div></div>
<div class="fragment"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 22px 6px; min-height: 92px; display: flex; align-items: center; justify-content: center;">Projects + instructions</div><div style="font-size: 14px; color: #495057; margin-top: 8px;">shows up as:<br>your team Project</div></div>
<div class="fragment"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 22px 6px; min-height: 92px; display: flex; align-items: center; justify-content: center;">Context</div><div style="font-size: 14px; color: #495057; margin-top: 8px;">shows up as:<br>Step 1: what Claude knows</div></div>
<div class="fragment"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 22px 6px; min-height: 92px; display: flex; align-items: center; justify-content: center;">Skills + tools</div><div style="font-size: 14px; color: #495057; margin-top: 8px;">shows up as:<br>flow-design, flow-verify</div></div>
<div style="text-align: left; font-size: 17px; font-weight: bold; color: #1971c2; padding-top: 30px;">AI fundamentals<br><span style="font-weight: normal;">(data foundations)</span></div>
<div class="fragment"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 22px 6px; min-height: 92px; display: flex; align-items: center; justify-content: center;">How data moves: GET POST PUT DELETE</div><div style="font-size: 14px; color: #495057; margin-top: 8px;">shows up as:<br>lookups and sends</div></div>
<div class="fragment"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 22px 6px; min-height: 92px; display: flex; align-items: center; justify-content: center;">Data types</div><div style="font-size: 14px; color: #495057; margin-top: 8px;">shows up as:<br>the Dictionary</div></div>
<div class="fragment"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 22px 6px; min-height: 92px; display: flex; align-items: center; justify-content: center;">Workflows: triggers + transformations</div><div style="font-size: 14px; color: #495057; margin-top: 8px;">shows up as:<br>your canvas</div></div>
<div class="fragment"><div style="background: #ffd8a8; border: 2px solid #e8590c; border-radius: 10px; padding: 22px 6px; min-height: 92px; display: flex; align-items: center; justify-content: center;">Today: put it together</div><div style="font-size: 14px; color: #495057; margin-top: 8px;">shows up as:<br>M3</div></div>
</div>

<div class="vocab" style="margin-top: 30px;"><strong>Workflow:</strong> a series of steps that runs on its own once something starts it</div>

---

## Planning a Workflow: Four Steps

<div style="display: flex; align-items: flex-start; justify-content: center; gap: 10px; max-width: 1240px; margin: 70px auto 0 auto; text-align: center;">
<div style="flex: 1;"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 34px 8px; font-size: 28px;">1 · Context</div><div style="font-size: 19px; color: #495057; margin-top: 14px;">What Claude needs to plan with you</div></div>
<div style="font-size: 34px; padding-top: 34px;">→</div>
<div style="flex: 1;"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 34px 8px; font-size: 28px;">2 · Outcome</div><div style="font-size: 19px; color: #495057; margin-top: 14px;">What the person receives, for one fake record</div></div>
<div style="font-size: 34px; padding-top: 34px;">→</div>
<div style="flex: 1;"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 34px 8px; font-size: 28px;">3 · Trigger</div><div style="font-size: 19px; color: #495057; margin-top: 14px;">What starts it, and what arrives with it</div></div>
<div style="font-size: 34px; padding-top: 34px;">→</div>
<div style="flex: 1;"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 34px 8px; font-size: 28px;">4 · Transformations</div><div style="font-size: 19px; color: #495057; margin-top: 14px;">Everything between trigger and outcome</div></div>
</div>

---

## Step 1: Context

<p class="fd-line">Claude plans with you using only what it can see · What goes in each is your team's call</p>

<img class="fd-img" style="max-height: 555px;" src="assets/flow-design/slide-02-claude-context.png" alt="Claude in the middle of the team Project: files and notes, instructions, connectors, skills and tools">

<div class="vocab"><strong>Context (for Claude):</strong> everything Claude can see when it answers: Project files, instructions, connectors, the chat</div>

---

## Step 2: Outcome

<p class="fd-line">What the person at your client receives, for one fake record. Not "the system will…"<br>Number every piece of data in it</p>

<img class="fd-img fd-frame-early" src="assets/flow-design/frame-01.png" alt="Worked example, frame 1: the outcome">

<div class="vocab"><strong>Fake data:</strong> realistic invented records with no real people's information</div>

---

## Step 3: Trigger

<p class="fd-line">What starts it, and exactly what arrives with it</p>

<img class="fd-img fd-frame-early" src="assets/flow-design/frame-02.png" alt="Worked example, frame 2: the trigger and what arrives with it">

<div class="vocab"><strong>Trigger:</strong> what starts a workflow: a form, a schedule, a new row, an email, a webhook · <strong>Item:</strong> one record moving through the flow</div>

---

## Step 4: Transformations

<div style="font-size: 17px; max-width: 1240px; margin: 16px auto 0 auto;">

| Answer | Meaning | Example (AI Club) | On the drawing | Needs a request? |
|---|---|---|---|---|
| **Changed** | Arrives, in another form | first name from full name | <span style="display: inline-block; width: 26px; height: 16px; background: #ffffff; border: 2px solid #1e1e1e; vertical-align: middle;"></span> white box | Nothing |
| **Computed** | Worked out by a fixed rule | due date = sign-up + 14 days | <span style="display: inline-block; width: 26px; height: 16px; background: #ffffff; border: 2px solid #1e1e1e; vertical-align: middle;"></span> white box | Nothing |
| **Looked up** | Lives in another table or system | interest group, next event | <span style="display: inline-block; width: 26px; height: 16px; background: #a5d8ff; border: 2px solid #1e1e1e; vertical-align: middle;"></span> blue box | GET: from which system? |
| **Judged** | Needs a judgment | a sentence linking major to group | <span style="display: inline-block; width: 26px; height: 16px; background: #d0bfff; border: 2px solid #1e1e1e; vertical-align: middle;"></span> purple box (AI) · <span style="display: inline-block; width: 26px; height: 16px; background: #b2f2bb; border: 2px solid #1e1e1e; vertical-align: middle;"></span> green box (person) | Maybe: what does the AI or person read? |
| **Sent** | Goes out to a person or system | the welcome email | <span style="display: inline-block; width: 26px; height: 16px; background: #ffffff; border: 2px solid #1e1e1e; vertical-align: middle;"></span> white box | POST or PUT: to which system? |

</div>

<div style="font-size: 17px; color: #495057; margin: 10px auto 0 auto;">Already there: arrives with the trigger, unchanged. No step</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-width: 1180px; margin: 18px auto 0 auto; font-size: 17px; line-height: 1.5; text-align: left;">
<div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 14px 20px;">For every GET, POST or PUT, write down:<br>· which system<br>· what you send it (the key: an id, an email)<br>· what comes back, by Dictionary name<br>· what you need to be allowed in (API key, export, login)</div>
<div style="background: #f8f9fa; border: 2px solid #495057; border-radius: 10px; padding: 14px 20px;">Control steps: what happens to the items<br>· filter: only some continue<br>· branch: each goes down one path<br>· split: one item holding a list becomes several<br>· aggregate: several become one</div>
</div>

<div class="vocab"><strong>Transformation:</strong> any change to the data · <strong>Lookup:</strong> finds matching records in another table or system</div>

---

## The Gap, Worked

<img class="fd-img fd-frame-early" src="assets/flow-design/frame-03.png" alt="Worked example, frame 3: where each piece of the outcome comes from">

<div class="vocab"><strong>System of record:</strong> the system whose copy of a piece of data counts as the true one</div>

;;;

### The Dictionary, Explained

<p class="fd-line">The data under each step is what moves through the workflow<br>Every field is a Dictionary row: type, where it comes from, who creates or changes it</p>

<img class="fd-img" style="max-height: 440px;" src="assets/flow-design/slide-05-dictionary-explained.png" alt="Three steps with their data highlighted, and the Dictionary rows they need">

<div class="vocab"><strong>Dictionary:</strong> the Inventory Sheet tab that records every field: type, where it comes from, what changes it</div>

;;;

### Why the Dictionary Matters

<p class="fd-line">It tells people and Claude exactly what information moves, and when</p>

<img class="fd-img" src="assets/flow-design/slide-06-dictionary-why.png" alt="For people: finding what broke. For Claude: exact field names and types">

---

## One Step per Missing Piece

<p class="fd-line">Each step: what it gets, what it sets, what it changes<br>Every arrow says what moves, and how many</p>

<img class="fd-img fd-frame-early" src="assets/flow-design/frame-04.png" alt="Worked example, frame 4: one step per missing piece">

<div class="vocab"><strong>Input / output:</strong> what a step receives / what it passes on · <strong>List:</strong> several items moving together; the arrow says how many</div>

;;;

### The Data After Each Step

<p class="fd-line">The tables show which fields exist at each point. Every one has a Dictionary row</p>

<img class="fd-img fd-frame" src="assets/flow-design/frame-05.png" alt="Worked example, frame 5: the data after each step">

;;;

### Assumptions: Sticky Notes

<p class="fd-line">A sticky note on every step that depends on something you don't know:<br>assumptions you're making, or questions you have</p>

<img class="fd-img fd-frame" src="assets/flow-design/frame-06.png" alt="Worked example, frame 6: sticky notes on each assumption">

<div class="vocab"><strong>Assumption:</strong> something the flow depends on that you don't control</div>

;;;

### Failure Points: Where Does the Item Go?

<p class="fd-line">When it fails: where the item goes, and who finds out. An item never just disappears</p>

<img class="fd-img fd-frame" src="assets/flow-design/frame-07.png" alt="Worked example, frame 7: failure points">

<div class="vocab"><strong>Failure point:</strong> where a step can fail, and where the item goes when it does</div>

---

## Verify: Walk One Record Through

<p class="fd-line">Today: by hand, on one fake record</p>

<img class="fd-img" src="assets/flow-design/slide-08-verify-walk.png" alt="Walking one record through the AI Club flow, field by field">

---

## When You're Waiting on Something

<p class="fd-line">Type the fields you need · Build on fake rows<br>Don't just stop: check the docs and forums, and search the web for a reasonable hypothesis of what you'll get</p>

<img class="fd-img" src="assets/flow-design/slide-09-waiting-on-access.png" alt="A field-mapping step after the trigger, and a Dictionary row marked waiting on">

<div class="vocab"><strong>Field mapping:</strong> one step that renames a source's fields to your Dictionary names</div>

---

## Explain It, and the Dates

<div style="font-size: 20px; max-width: 1100px; margin: 24px auto 0 auto;">

| When | What |
|---|---|
| **Thu Oct 29** | Step 1 (Claude's context) · Steps 2–4a on your canvas · flows-in-scope list drafted |
| **Fri Oct 30** | Client questions sent for anything you're waiting on · a short call requested for anything that blocks you |
| **Tue Nov 3, end of day** | Every flow in scope drawn through Step 4b, saved in your project folder · Dictionary rows for every field |
| **Wed Nov 4** | Steps 4c–4d · verify pass · Steps tab |
| **Thu Nov 5** | M3 initial artifacts due · peer walkthroughs in class |
| **Week of Nov 9** | Walkthrough with your client |
| **Tue Nov 10** | Every team starts building. Teams whose canvas Jesse has checked may start earlier, on fake data |

</div>

---

## Your Turn

<div style="font-size: 26px; line-height: 2; margin: 40px auto 0 auto; max-width: 900px; text-align: left;">

**Step 1:** organize your team Project<br>
**Steps 2–4a:** on your canvas, as a whole team<br>
**Claude:** only to check (prompt in the session doc)<br>
**Steps 4b–4d:** steps, data, Dictionary rows, sticky notes, failure points<br>
**Save** the file to your project folder before you leave

</div>
