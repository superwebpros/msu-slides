## Build Week: Nov 10 → Nov 24

<div style="font-size: 20px; max-width: 1100px; margin: 24px auto 0 auto;">

| When | What |
|---|---|
| **Tue Nov 10, in class** | Project instructions fixed, context test passed · /build-plan run · Build plan and Partner needs tabs in your Inventory Sheet |
| **Wed Nov 11** | D2L, one per team: workflow map, agenda for your next client meeting, link to your Sheet with the Dictionary |
| **Before class Thu Nov 12** | Build plan team-confirmed, with Why (team's words) on every task |
| **This week** | PM reaches out to your client: workflow walkthrough + access you still need (Jesse reviews the email first) |
| **Before your client meeting** | 30-minute Zoom with Jesse |
| **Thu Nov 12 →** | Build, infrastructure first: logins, storage, the trigger |
| **Tue Nov 24** | **M4:** working automation in your partner's hands for testing |

</div>

---

## Where We Are

<div style="display: flex; align-items: stretch; justify-content: center; gap: 8px; max-width: 1240px; margin: 50px auto 0 auto; text-align: center; font-size: 21px;">
<div style="flex: 1;"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 26px 4px;">Inventory</div><div style="font-size: 15px; color: #495057; margin-top: 10px;">Inventory Sheet, Dictionary</div></div>
<div style="font-size: 28px; padding-top: 26px;">→</div>
<div style="flex: 1;"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 26px 4px;">Map</div><div style="font-size: 15px; color: #495057; margin-top: 10px;">Excalidraw workflows</div></div>
<div style="font-size: 28px; padding-top: 26px;">→</div>
<div style="flex: 1;"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 26px 4px;">Process</div><div style="font-size: 15px; color: #495057; margin-top: 10px;">context, outcome, trigger, transformations</div></div>
<div style="font-size: 28px; padding-top: 26px;">→</div>
<div style="flex: 1.3;"><div style="background: #ffd8a8; border: 2px solid #e8590c; border-radius: 10px; padding: 26px 4px;"><strong>Automate &amp; Agentify</strong></div><div style="font-size: 15px; color: #495057; margin-top: 10px;">now</div></div>
<div style="font-size: 28px; padding-top: 26px;">→</div>
<div style="flex: 1;"><div style="background: #f8f9fa; border: 2px solid #adb5bd; border-radius: 10px; padding: 26px 4px; color: #868e96;">Compose</div></div>
<div style="font-size: 28px; padding-top: 26px;">→</div>
<div style="flex: 1;"><div style="background: #f8f9fa; border: 2px solid #adb5bd; border-radius: 10px; padding: 26px 4px; color: #868e96;">Track &amp; Tweak</div></div>
</div>

<p class="fd-line" style="margin-top: 50px;">Before building, add three things to the design:</p>

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1100px; margin: 18px auto 0 auto; font-size: 20px; text-align: center;">
<div class="fragment" style="background: #b2f2bb; border: 2px solid #2f9e44; border-radius: 10px; padding: 16px;"><strong>Approvals</strong><br><span style="font-size: 17px;">who checks before anything is sent or changed</span></div>
<div class="fragment" style="background: #ffc9c9; border: 2px solid #e03131; border-radius: 10px; padding: 16px;"><strong>Guardrails</strong><br><span style="font-size: 17px;">what a step must never do</span></div>
<div class="fragment" style="background: #fff3bf; border: 2px solid #f08c00; border-radius: 10px; padding: 16px;"><strong>Exceptions</strong><br><span style="font-size: 17px;">where an item goes when something fails</span></div>
</div>

---

## What a Build Plan Is

<p class="fd-line">Every task needed to build your workflow, written down before anything is built</p>

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1200px; margin: 30px auto 0 auto; font-size: 19px; line-height: 1.45; text-align: left;">
<div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 16px 20px;"><strong>Testable</strong><br>Every task has a fake record and the result it should produce. Done when its test passes</div>
<div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 16px 20px;"><strong>Hand-off-able</strong><br>Requirements an AI agent can build from: here, Claude connected to n8n</div>
<div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 16px 20px;"><strong>Connected</strong><br>Links how we think about the work (SOW, canvas) to what an agent needs to build what we mean</div>
</div>

<div style="font-size: 19px; max-width: 1150px; margin: 26px auto 0 auto;">

| Artifact | Its job | For |
|---|---|---|
| **Statement of work (SOW)** | What has to get done. Source of truth for scope | Client and team |
| **Excalidraw workflows** | How the work flows, so your client can follow it | Client |
| **n8n workflows** | What actually runs. One canvas flow can become several | The build |

</div>

<div class="vocab">They won't match one to one · If the build has to differ from the canvas, <strong>update the canvas</strong> so your client's picture stays true</div>

---

## Step 0 · Install the Skills

<p class="fd-line">Everyone, 5 minutes · Download each one and upload it to Claude, same as flow-design</p>

<div style="font-size: 21px; max-width: 1050px; margin: 30px auto 0 auto;">

| Skill | What it does |
|---|---|
| **project-instructions** | Checks and drafts your team Project's instructions |
| **build-plan** | Checks your context, Dictionary and workflow, then writes the build plan |
| **flow-design** <span style="color: #e8590c;">updated</span> | Adds storage, branch conditions and judged steps |
| **flow-verify** <span style="color: #e8590c;">updated</span> | Adds checks for branches and storage |

</div>

<div class="vocab">Already have flow-design and flow-verify? Replace them. Both were updated today · Zips are in the session doc</div>

---

## Step 1 · Project Instructions

<p class="fd-line">Every chat in your Project starts from the Project instructions. When they're thin, Claude guesses</p>

<div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 28px; max-width: 1200px; margin: 24px auto 0 auto; font-size: 19px; line-height: 1.5; text-align: left;">
<div>

1. New chat in your team Project → **/project-instructions**
2. It checks connectors, searches Drive and transcripts, asks for the rest
   - **Link** what you keep editing (Inventory Sheet, Journal)
   - **Upload** what doesn't change (SOW, canvas exports, partner materials)
3. It drafts: Partner and project · Scope · Context index · Rules · How we work. **Check every line against its source**
4. Paste it into the Project instructions yourself
5. New chat → run the context test

</div>
<div style="background: #ffd8a8; border: 2px solid #e8590c; border-radius: 10px; padding: 18px 22px;">
<strong>The context test</strong><br>Without pasting anything, Claude:<br>
<span class="fragment">① names your partner and contact</span><br>
<span class="fragment">② quotes one requirement</span><br>
<span class="fragment">③ lists your main entity's fields from the Sheet</span><br>
<span class="fragment">④ names the flows in scope</span><br><br>
<strong>Done when all four are right</strong>
</div>
</div>

<div class="vocab"><strong>Context index:</strong> the list in your Project instructions of every source Claude can use, how to reach it and what it holds</div>

Note:
Same idea as the instructions file software teams write for a coding agent (CLAUDE.md, AGENTS.md). Whole team, ~20 min.

---

## Step 2 · Build Plan

<div style="display: flex; align-items: flex-start; justify-content: center; gap: 8px; max-width: 1240px; margin: 30px auto 0 auto; text-align: center; font-size: 18px;">
<div style="flex: 1;"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 18px 6px;"><strong>/build-plan</strong></div><div style="font-size: 15px; color: #495057; margin-top: 8px;">new chat in your Project</div></div>
<div style="font-size: 26px; padding-top: 16px;">→</div>
<div style="flex: 1;"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 18px 6px;"><strong>Checks</strong></div><div style="font-size: 15px; color: #495057; margin-top: 8px;">context · Dictionary · workflow</div></div>
<div style="font-size: 26px; padding-top: 16px;">→</div>
<div style="flex: 1;"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 18px 6px;"><strong>Adds 2 tabs</strong></div><div style="font-size: 15px; color: #495057; margin-top: 8px;">Build plan · Partner needs<br>(fails? fix Sheets connector)</div></div>
<div style="font-size: 26px; padding-top: 16px;">→</div>
<div style="flex: 1;"><div style="background: #ffd8a8; border: 2px solid #e8590c; border-radius: 10px; padding: 18px 6px;"><strong>Findings</strong></div><div style="font-size: 15px; color: #495057; margin-top: 8px;">team decides each:<br>fix now, or gather task</div></div>
<div style="font-size: 26px; padding-top: 16px;">→</div>
<div style="flex: 1;"><div style="background: #e7f5ff; border: 2px solid #1971c2; border-radius: 10px; padding: 18px 6px;"><strong>Writes the plan</strong></div><div style="font-size: 15px; color: #495057; margin-top: 8px;">one task per row</div></div>
<div style="font-size: 26px; padding-top: 16px;">→</div>
<div style="flex: 1;"><div style="background: #b2f2bb; border: 2px solid #2f9e44; border-radius: 10px; padding: 18px 6px;"><strong>You confirm</strong></div><div style="font-size: 15px; color: #495057; margin-top: 8px;">assign · Why (team's words) · team-confirmed</div></div>
</div>

<p class="fd-line" style="margin-top: 34px;">Each task row: canvas step · fields in and out · login · storage · <strong>approval</strong> · <strong>guardrail</strong> · <strong>on failure</strong> · <strong>test</strong> · notes and gotchas</p>

<div style="background: #f8f9fa; border: 2px solid #495057; border-radius: 10px; padding: 14px 22px; max-width: 1000px; margin: 26px auto 0 auto; font-size: 19px; line-height: 1.5;">
<strong>Done when</strong> every task has a test and a teammate, and every gap is a gather task or a Partner needs row.<br>Anyone on the team can explain any task by walking through its test.
</div>

<div class="vocab"><strong>Gather task:</strong> find missing info (docs page, recording, partner question) · <strong>Partner need:</strong> something only your client can give: access, a shared Sheet, an answer · SOW item with no workflow? It hands you off to /flow-design</div>

---

## Logins and Storage

<p class="fd-line">Your job: know which login each system needs and what to ask your client for. Jesse sets up logins in n8n<br><strong style="color: #e03131;">Never paste an API key, password or token into a chat</strong></p>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 26px; max-width: 1240px; margin: 18px auto 0 auto; font-size: 16px;">
<div>

| Login | What it is | Example |
|---|---|---|
| **None** | Data lives inside n8n | n8n Data Table |
| **API key** | A secret string a program sends with each request | Jev |
| **Service account** | A robot Google account; client shares the Sheet with it | Google Sheets |
| **OAuth** | A person signs in once and grants access | Most other cloud apps. **Flag early** |

</div>
<div>

| Store in | When | Why |
|---|---|---|
| **n8n Data Table** | Only the workflow reads it, or fake rows | No login. **Start here** |
| **Google Sheet** | Someone at your client needs to see or edit it | What clients already use |
| **Client's own system** | It's the system of record | A second copy drifts |

</div>
</div>

<div class="vocab"><strong>Credential:</strong> where n8n stores a login, so workflows can use it without anyone seeing it · <strong>Save step:</strong> writes a record to a Data Table, Sheet or your client's system</div>

---

<!-- .slide: data-background-color="#f3f0ff" -->

## Judged Steps

<p class="fd-line">Anywhere your workflow says <span style="background: #d0bfff; padding: 2px 10px; border-radius: 6px;">judged</span>, name the kind</p>

<div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; max-width: 1200px; margin: 36px auto 0 auto; font-size: 20px; text-align: center;">
<div style="background: #d0bfff; border: 2px solid #7048e8; border-radius: 10px; padding: 20px 4px;"><strong>classify</strong></div>
<div style="background: #d0bfff; border: 2px solid #7048e8; border-radius: 10px; padding: 20px 4px;"><strong>score</strong></div>
<div style="background: #d0bfff; border: 2px solid #7048e8; border-radius: 10px; padding: 20px 4px;"><strong>yes/no</strong></div>
<div style="background: #ffffff; border: 2px solid #7048e8; border-radius: 10px; padding: 20px 4px;">extract</div>
<div style="background: #ffffff; border: 2px solid #7048e8; border-radius: 10px; padding: 20px 4px;">generate</div>
<div style="background: #ffffff; border: 2px solid #7048e8; border-radius: 10px; padding: 20px 4px;">agent</div>
</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 1200px; margin: 8px auto 0 auto; font-size: 16px; color: #5f3dc4; text-align: center;">
<div>↑ Jev: a decision model</div>
<div>↑ an LLM (or an agent)</div>
</div>

<div style="font-size: 32px; margin: 56px auto 0 auto; max-width: 1000px; line-height: 1.5;" class="fragment">
<strong>AI answers the narrow question.</strong><br>A <strong>written rule</strong> makes the decision.
</div>

Note:
This is the key idea for today. Interview coach, prospecting, gift entry all have a judged step. "Judged" alone isn't buildable: name the kind.

---

## What Jev Is

<p class="fd-line">A <strong>System One model</strong> from TypeSafe, built for fast, structured decisions that software can use directly</p>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; max-width: 1150px; margin: 30px auto 0 auto; font-size: 20px; line-height: 1.6; text-align: left;">
<div style="background: #f8f9fa; border: 2px solid #495057; border-radius: 10px; padding: 20px 24px;">
<strong>An LLM</strong> (Claude, GPT)<br>
✓ understands language and images<br>
→ <strong>writes</strong>: replies, code, explanations<br>
→ the answer can be anything
</div>
<div style="background: #f3f0ff; border: 2px solid #7048e8; border-radius: 10px; padding: 20px 24px;">
<strong>Jev</strong> (a decision model)<br>
✓ understands language and images<br>
→ <strong>picks</strong>: from the answers <em>you</em> give it<br>
→ returns a typed answer + probabilities for every option
</div>
</div>

<p class="fd-line" style="margin-top: 30px; font-size: 26px;">"AI-powered software, not agents"<br><span style="font-size: 19px; color: #495057;">Your workflow stays in control; the model answers narrow questions inside it</span></p>

<div class="vocab"><strong>Decision model:</strong> picks from answers you define, instead of writing text · "System One" echoes System 1, fast thinking (our reading, not TypeSafe's claim)</div>

---

## Why It Matters

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 22px; max-width: 1150px; margin: 34px auto 0 auto; font-size: 20px; line-height: 1.5; text-align: left;">
<div class="fragment" style="background: #f3f0ff; border: 2px solid #7048e8; border-radius: 10px; padding: 18px 22px;"><strong>It can't invent an answer</strong><br>Every answer is one of your options, so the next step always gets a value it expects</div>
<div class="fragment" style="background: #f3f0ff; border: 2px solid #7048e8; border-radius: 10px; padding: 18px 22px;"><strong>It tells you how sure it is</strong><br>Probabilities are <em>calibrated</em>: across many answers they reflect real uncertainty. No single answer is guaranteed</div>
<div class="fragment" style="background: #f3f0ff; border: 2px solid #7048e8; border-radius: 10px; padding: 18px 22px;"><strong>It's fast and cheap</strong><br>Many questions about the same item go in one request and run in parallel</div>
<div class="fragment" style="background: #b2f2bb; border: 2px solid #2f9e44; border-radius: 10px; padding: 18px 22px;"><strong>Your rules stay in charge</strong><br>The threshold is visible, your client can change it, and the same answers always lead to the same decision</div>
</div>

<p class="fd-line fragment" style="margin-top: 30px;">Modern AI work: not one big model doing everything, but <strong>narrow, checkable decisions inside a process</strong></p>

<div class="vocab"><strong>Calibrated:</strong> trained so probabilities match how often answers turn out right, across many answers</div>

---

## When to Use It, and When Not

<div style="font-size: 18px; max-width: 1200px; margin: 20px auto 0 auto;">

| Your step needs to… | Use | Example |
|---|---|---|
| Pick one label from a fixed list (**classify**) | <span style="background: #d0bfff; padding: 1px 8px; border-radius: 4px;">Jev Choice</span> | Which category does this request belong to? |
| Rate against described levels (**score**) | <span style="background: #d0bfff; padding: 1px 8px; border-radius: 4px;">Jev Score</span> | How well does this answer follow situation, action, result? |
| Answer a **yes/no** question | <span style="background: #d0bfff; padding: 1px 8px; border-radius: 4px;">Jev Noul</span> | Did the candidate say when they can start? |
| Pull specific fields out of text (**extract**) | LLM, structured output | The answer to each of the seven interview questions |
| Write text a person reads (**generate**) | LLM | The feedback report for the job seeker |
| Decide which steps to take, in what order | Agent (rare in v1) | Research a company until it can qualify it |
| Apply a fixed rule: a date, a match, a threshold | **Rule step. No AI** | Gift capacity of $25K or more |

</div>

Note:
Last row matters most: if you can write the rule, don't spend AI on it.

---

## The Four Question Types

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; max-width: 1220px; margin: 34px auto 0 auto; font-size: 18px; line-height: 1.45; text-align: left;">
<div style="background: #f3f0ff; border: 2px solid #7048e8; border-radius: 10px; padding: 16px 18px;"><div style="font-size: 26px; font-weight: bold; color: #5f3dc4;">Choice</div><br><strong>You give:</strong> options, each with a description<br><br><strong>It returns:</strong> the option picked, probabilities for every option, confidence</div>
<div style="background: #f3f0ff; border: 2px solid #7048e8; border-radius: 10px; padding: 16px 18px;"><div style="font-size: 26px; font-weight: bold; color: #5f3dc4;">Score</div><br><strong>You give:</strong> levels, low to high, each described in words<br><br><strong>It returns:</strong> a score (can fall between levels), probabilities, confidence</div>
<div style="background: #f3f0ff; border: 2px solid #7048e8; border-radius: 10px; padding: 16px 18px;"><div style="font-size: 26px; font-weight: bold; color: #5f3dc4;">Noul</div><br><strong>You give:</strong> a statement<br><br><strong>It returns:</strong> the probability (0 to 1) that the statement is true</div>
<div style="background: #f8f9fa; border: 2px solid #adb5bd; border-radius: 10px; padding: 16px 18px;"><div style="font-size: 26px; font-weight: bold; color: #495057;">Box</div><br><strong>You give:</strong> an image and what to find<br><br><strong>It returns:</strong> the four edges of a box around it</div>
</div>

<div class="vocab"><strong>Primitive:</strong> one of Jev's question types · <strong>Probability:</strong> how likely each option is, per the model</div>

---

## What the API Expects

<div class="api-grid" style="display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 24px; max-width: 1240px; margin: 10px auto 0 auto; text-align: left; align-items: start;">
<div style="font-size: 18px; line-height: 1.5;">

**One request**<br>
`POST https://api.typesafe.ai/v1/systemone`<br>
Key in a header: `Authorization: Bearer …`<br>
<span style="color: #495057;">In n8n: an HTTP Request node with the credential Jesse set up. You never see the key.</span>

**The body: three fields**

<div style="background: #e7f5ff; border-left: 5px solid #1971c2; padding: 6px 12px; margin: 8px 0;"><code>model</code>: which model answers. <code>jev-latest</code></div>
<div style="background: #fff3bf; border-left: 5px solid #f08c00; padding: 6px 12px; margin: 8px 0;"><code>state</code>: the content to judge. Text, or JSON with named fields</div>
<div style="background: #f3f0ff; border-left: 5px solid #7048e8; padding: 6px 12px; margin: 8px 0;"><code>questions</code>: each with an id you choose, a type, instructions, criteria. Answers come back under the same ids</div>

</div>
<div>

```json [1|2-5|6-17]
{ "model": "jev-latest",
  "state": {
    "question": "Tell me about a time you solved a problem at work.",
    "answer": "At the food bank our sign-in sheet kept getting lost, so I set up a shared spreadsheet and showed the other volunteers how to use it. Check-in went from about ten minutes to two."
  },
  "questions": {
    "structure": { "type": "score",
      "instructions": "How well does the `answer` follow situation, action, result?",
      "criteria": ["No structure", "Situation only",
        "Situation and action", "Situation, action and a clear result"] },
    "specificity": { "type": "score",
      "instructions": "How specific is the `answer` about what the speaker did and what changed?",
      "criteria": ["Vague", "Some detail", "Specific actions",
        "Specific actions and a measurable result"] },
    "answered": { "type": "noul",
      "instructions": "The `answer` responds to the `question` that was asked." }
  } }
```

</div>
</div>

<div class="vocab"><strong>Payload:</strong> the body of a request: model, state, questions · <strong>State:</strong> the content you send Jev to judge · All fake data</div>

Note:
Point out: state is JSON with named fields, so instructions can point at `answer` vs `question`. Two Score questions + one Noul, one request.

---

## What Came Back

<p class="fd-line">"Tell me about a time you solved a problem at work." · three answers, scored Nov 10</p>

<table style="font-size: 18px; max-width: 1220px; margin: 18px auto 0 auto; line-height: 1.35;">
<thead><tr><th style="text-align:left;">Answer</th><th style="width:7.5em; text-align:center;"><span class="fragment" data-fragment-index="1">structure</span></th><th style="width:7.5em; text-align:center;"><span class="fragment" data-fragment-index="2">specificity</span></th><th style="width:7.5em; text-align:center;"><span class="fragment" data-fragment-index="3">answered</span></th><th style="width:7.5em; text-align:center;"><span class="fragment" data-fragment-index="4">rule</span></th></tr></thead>
<tbody>
<tr><td style="text-align:left;"><strong>A.</strong> "At the food bank our sign-in sheet kept getting lost, so I set up a shared spreadsheet and showed the other volunteers how to use it. Check-in went from about ten minutes to two."</td><td style="text-align:center;"><span class="fragment" data-fragment-index="1"><strong>3.0</strong></span></td><td style="text-align:center;"><span class="fragment" data-fragment-index="2"><strong>3.0</strong></span></td><td style="text-align:center;"><span class="fragment" data-fragment-index="3"><strong>0.97</strong></span></td><td style="text-align:center; font-size:16px;"><span class="fragment" data-fragment-index="4">passes</span></td></tr>
<tr><td style="text-align:left;"><strong>B.</strong> "At my last job things were disorganized, so I helped fix the scheduling. It worked out a lot better after that."</td><td style="text-align:center;"><span class="fragment" data-fragment-index="1"><strong>2.9</strong></span></td><td style="text-align:center;"><span class="fragment" data-fragment-index="2"><strong>0.34</strong></span></td><td style="text-align:center;"><span class="fragment" data-fragment-index="3"><strong>0.89</strong></span></td><td style="text-align:center; font-size:16px;"><span class="fragment" data-fragment-index="4">coach reviews</span></td></tr>
<tr><td style="text-align:left;"><strong>C.</strong> "I am a hard worker and I am good with people. I always try my best."</td><td style="text-align:center;"><span class="fragment" data-fragment-index="1"><strong>0.01</strong></span></td><td style="text-align:center;"><span class="fragment" data-fragment-index="2"><strong>0.0</strong></span></td><td style="text-align:center;"><span class="fragment" data-fragment-index="3"><strong>0.17</strong></span></td><td style="text-align:center; font-size:16px;"><span class="fragment" data-fragment-index="4">coach reviews</span></td></tr>
</tbody>
</table>

<div style="display: grid; max-width: 1220px; margin: 22px auto 0 auto; font-size: 18px; text-align: left; line-height: 1.4;">
<div class="fragment fade-in-then-out" data-fragment-index="1" style="grid-area: 1 / 1; background: #e7f5ff; border-left: 5px solid #1971c2; padding: 10px 16px;"><strong>structure</strong> (Score): How well does the answer follow situation, action, result? &nbsp;0 No structure · 1 Situation only · 2 Situation and action · 3 Situation, action and a clear result</div>
<div class="fragment fade-in-then-out" data-fragment-index="2" style="grid-area: 1 / 1; background: #e7f5ff; border-left: 5px solid #1971c2; padding: 10px 16px;"><strong>specificity</strong> (Score): How specific is the answer about what the speaker did and what changed? &nbsp;0 Vague · 1 Some detail · 2 Specific actions · 3 Specific actions and a measurable result</div>
<div class="fragment fade-in-then-out" data-fragment-index="3" style="grid-area: 1 / 1; background: #f3f0ff; border-left: 5px solid #7048e8; padding: 10px 16px;"><strong>answered</strong> (Noul): the probability that "the answer responds to the question that was asked" is true, from 0 to 1</div>
<div class="fragment" data-fragment-index="4" style="grid-area: 1 / 1; background: #ffffff; border: 2px solid #1e1e1e; padding: 10px 16px;"><strong>The rule decides, not Jev:</strong> any dimension below 1.5, or answered below 0.7 → a coach reviews. A total-only rule ("under 3") would pass B at 3.24.</div>
</div>

Note:
Read the three answers first; have the room rank them. Then reveal one column at a time with its rubric, so students compare the same question across answers. B is the point: it has the shape of a good answer (structure 2.9) but almost no substance (specificity 0.34). One overall score would hide that; separate dimensions tell the coach exactly what to work on. Scores can move slightly between runs (C's answered was 0.16 on one run, 0.17 on another).

---

## How a Rubric Gets Scored

<div style="display: flex; align-items: flex-start; justify-content: center; gap: 10px; max-width: 1240px; margin: 40px auto 0 auto; text-align: center; font-size: 19px;">
<div style="flex: 1;"><div style="background: #b2f2bb; border: 2px solid #2f9e44; border-radius: 10px; padding: 22px 8px;"><strong>Rubric</strong></div><div style="font-size: 15px; color: #495057; margin-top: 10px;">from your <strong>client's</strong> materials, not the model · one dimension per thing they care about</div></div>
<div style="font-size: 28px; padding-top: 22px;">→</div>
<div style="flex: 1;"><div style="background: #d0bfff; border: 2px solid #7048e8; border-radius: 10px; padding: 22px 8px;"><strong>Jev: one Score per dimension</strong></div><div style="font-size: 15px; color: #495057; margin-top: 10px;">levels described in words, low → high · all in one request · narrow beats one big question</div></div>
<div style="font-size: 28px; padding-top: 22px;">→</div>
<div style="flex: 1;"><div style="background: #ffffff; border: 2px solid #1e1e1e; border-radius: 10px; padding: 22px 8px;"><strong>Rule: combine</strong></div><div style="font-size: 15px; color: #495057; margin-top: 10px;">total, or weights:<br><code>relevance × 0.3 + impact × 0.3 + …</code></div></div>
<div style="font-size: 28px; padding-top: 22px;">→</div>
<div style="flex: 1;"><div style="background: #ffffff; border: 2px solid #1e1e1e; border-radius: 10px; padding: 22px 8px;"><strong>Rule: decide</strong></div><div style="font-size: 15px; color: #495057; margin-top: 10px;">pass or fail · which list · whether a person reviews</div></div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-width: 1100px; margin: 44px auto 0 auto; font-size: 19px; line-height: 1.5; text-align: left;">
<div style="background: #fff3bf; border: 2px solid #f08c00; border-radius: 10px; padding: 14px 20px;">The weights live in the <strong>rule</strong>, where your client can read and change them</div>
<div style="background: #fff3bf; border: 2px solid #f08c00; border-radius: 10px; padding: 14px 20px;">Every Choice gets a <strong>"none of these"</strong> option (<code>other</code>, <code>off_topic</code>), so nothing is forced into a label</div>
</div>

<div class="vocab"><strong>Rubric:</strong> the dimensions and described levels an item is scored against · <strong>Composite score:</strong> several scores combined by a rule, with weights you choose</div>

---

## Confidence: When to Act, When a Person Checks

<p class="fd-line">Choice and Score return <strong>confidence</strong> (0 to 1): how concentrated the probabilities are</p>

<div style="display: flex; max-width: 1100px; margin: 36px auto 0 auto; font-size: 21px; text-align: center; border-radius: 10px; overflow: hidden; border: 2px solid #495057;">
<div style="flex: 1; background: #ffc9c9; padding: 26px 10px;"><strong>Low</strong><br><span style="font-size: 18px;">Don't act.<br>A person reviews it</span></div>
<div style="flex: 1; background: #fff3bf; padding: 26px 10px;"><strong>Medium</strong><br><span style="font-size: 18px;">Flag it, or ask<br>someone to confirm</span></div>
<div style="flex: 1; background: #b2f2bb; padding: 26px 10px;"><strong>High</strong><br><span style="font-size: 18px;">Act<br>automatically</span></div>
</div>
<div style="display: flex; justify-content: space-between; max-width: 1100px; margin: 6px auto 0 auto; font-size: 16px; color: #495057;"><span>0</span><span>← where you draw the lines is a team + client call →</span><span>1</span></div>

<p class="fd-line" style="margin-top: 36px;">Where you draw the lines depends on <strong>what goes wrong if the answer is wrong</strong></p>

<div style="background: #f8f9fa; border: 2px solid #495057; border-radius: 10px; padding: 14px 22px; max-width: 950px; margin: 22px auto 0 auto; font-size: 19px;">In your build plan this is an <strong>approval</strong> and an <strong>exception</strong>: name who reviews low-confidence items and where they go</div>

<div class="vocab"><strong>Confidence:</strong> one number (0 to 1); high = probability sits on one answer, low = spread out</div>

---

## Jev in Your Canvas and Build Plan

<div class="jev-check" style="font-size: 22px; margin: 34px auto 0 auto; max-width: 1050px; text-align: left;">

<span style="display: inline-block; width: 26px; height: 16px; background: #d0bfff; border: 2px solid #1e1e1e; vertical-align: middle;"></span> A purple AI box, with its kind on it: classify, score, yes/no<br>
**Every answer is a field:** a Dictionary row with its type (`structure_score`: number 0–3)<br>
**Criteria** (options or rubric levels) in a linked doc or tab, named on the step<br>
**Missing input:** say what happens (question not answered, call ended early)<br>
**2–3 fake test cases** with the answer each should get, including **one that's hard to call**. These become the step's tests

</div>

---

## This Week

<div style="display: flex; align-items: center; gap: 36px; max-width: 1240px; margin: 30px auto 0 auto;">
<div style="flex: 1; font-size: 21px; line-height: 1.7; text-align: left;">

**PM → client:** schedule a walkthrough of your workflows + ask for the access in Partner needs. Jesse reviews the email first (partner-correspondence skill)<br>
**D2L, Wed Nov 11:** workflow map, client meeting agenda, link to your Sheet with the Dictionary<br>
**30-min Zoom with Jesse** before your client meeting: run it as if Jesse were your client. Open with your agenda, walk the workflows, give status, say what you need (Communication tab)<br>
**Thursday:** build from your approved plan, Claude connected to n8n. Record each test in the Test result column

</div>
<div style="text-align: center; flex: 0 0 240px;">
<img src="assets/s20-todays-doc-qr.png" alt="QR code for the Build Week session doc" style="width: 220px; height: auto; margin: 0;">
<p style="font-size: 17px; margin: 6px 0 0 0;"><a href="https://docs.google.com/document/d/1MdrQwEhPp2tQ63fQVINzCqTXdtvPFFrg-X9krSHfPrI/edit?tab=t.lunrtit8o3yl">Today's doc</a><br><span style="color: #6b7280;">all links, incl. D2L and skills</span></p>
</div>
</div>

<p class="fd-line" style="margin-top: 20px; color: #495057;">Office hours: calendly.com/jesseflores/office-hours</p>

---

## Your Turn

<div style="font-size: 26px; line-height: 2; margin: 40px auto 0 auto; max-width: 950px; text-align: left;">

**Step 0:** install the four skills (5 min)<br>
**Step 1:** /project-instructions → paste → pass the context test (20 min)<br>
**Step 2:** /build-plan → decide every finding → assign every task<br>
**Judged steps:** name the kind · Jev ones get criteria, Dictionary rows, test cases<br>
**Before Thursday:** Why filled in, Status = team-confirmed

</div>
