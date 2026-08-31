## Today's Agenda

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; margin: 30px 0; font-size: 20px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 1: Debrief</h4>
<ul style="line-height: 1.8;">
<li>Student workflow presentations</li>
<li>Diagnose what worked, what didn't, why</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 2: N8N Fundamentals</h4>
<ul style="line-height: 1.8;">
<li>How workflows work</li>
<li>Key concepts for confidence</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Part 3: Assignment & Q&A</h4>
<ul style="line-height: 1.8;">
<li>Baserow → Qdrant challenge</li>
<li>Start working</li>
</ul>
</div>

</div>

Note:
Lean deck today. Most learning happens through peer presentations and discussion. Slides support the teaching moments, not replace them. Stay flexible based on what emerges from student presentations.

---

## Session 7 Debrief

Zoom link in D2L

Note:
Frame this positively. Session 7 was designed to be challenging. Everyone engaged, tried different things, got stuck in different places. That diversity of experience is valuable for learning. No judgment - we're diagnosing together.

---

## Presentation Protocol

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 30px 0; font-size: 19px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Student presents (6-8 min):</h4>
<ul style="line-height: 1.8;">
<li>Screenshare N8N workflow</li>
<li>Walk through your approach</li>
<li>"What were you trying to do?"</li>
<li>"Where did you get stuck?"</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Class discussion:</h4>
<ul style="line-height: 1.8;">
<li>Ask clarifying questions</li>
<li>Identify what worked</li>
<li>Diagnose issues together</li>
<li>Extract learnings</li>
</ul>
</div>

</div>

<div style="background: #dbeafe; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 18px; text-align: center;">
<strong>Remember:</strong> We're learning from approaches, not judging them
</div>

Note:
Set the tone: collaborative, curious, supportive. Everyone tried different things - that's exactly what we want to see. Use diagnostic questions: "Show me the data at this node - what's in the JSON?" "When it failed, what did you try?" Watch for: data flow understanding, incremental testing, resource usage (docs, AI, peers).

PROBLEM-SOLVING FRAMEWORK (for instructor discussion):
- The essence: Identify the specific problem + gather resources strategically
- Be specific: "This Qdrant node gives error X" not "it's not working"
- Resources: N8N AI docs, upload workflow JSON to Claude/ChatGPT, YouTube tutorials, team via Slack
- Show: Export workflow → upload to AI for analysis (if time permits)
- This is the meta-lesson from Session 2 - reinforcing how to solve any technical problem

---

## How N8N Workflows Work

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; font-size: 18px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">1. Nodes transform data</h4>
<ul style="line-height: 1.6;">
<li>Every node: Input (JSON) → Do something → Output (JSON)</li>
<li>Think: "What am I putting in? What do I want out?"</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">2. Inspect what's happening</h4>
<ul style="line-height: 1.6;">
<li>Execute node → Click it → Look at output data</li>
<li>Three views: Table, JSON, Schema</li>
<li>Shows what fields you can use next</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">3. Operations matter</h4>
<ul style="line-height: 1.6;">
<li>Most nodes have multiple operations</li>
<li>Example: Baserow "Get All" vs "Get Many"</li>
<li>Read the descriptions - they do different things</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">4. AI connections are different</h4>
<ul style="line-height: 1.6;">
<li>Regular nodes: Sequential flow (this → then this)</li>
<li>AI nodes: Connect TO Vector Store (inputs)</li>
<li>They tell Vector Store: "Use this model/data"</li>
</ul>
</div>

</div>

Note:
Pause after each concept. Use student examples from presentations to illustrate. Don't just talk at them - show in their workflows. Point out: "See this output? Those are the fields available for the next node." For #4, draw on whiteboard or annotate on screen: Show main flow vs AI connections visually. This is what students struggled with most in Session 7.

COMMON PATTERNS (will emerge from debrief, synthesize at end):
- Inspecting data is critical (execute workflow, click each node, look at output)
- Langchain node connections are different (main = sequential, AI = inputs)
- Collections created once, used many times (like database tables)
- Multiple valid approaches (HTTP Request vs Create Collection - both work)
- Understanding matters more than "the right way"

---

## Introducing: Baserow → Qdrant Assignment

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**Why this is simpler than Session 7:**
- ✅ Data already in Baserow (structured and clean)
- ✅ No HTTP requests, no HTML parsing
- ✅ Focus ONLY on: Baserow → Embeddings → Qdrant
- ✅ Several days instead of 50 minutes
- ✅ Can verify with chat workflow immediately

</div>

Note:
Show Baserow table briefly (30 sec) - point out fields: URL, Page Title, Page Description, Page Content. Draw pipeline on whiteboard or show in N8N during demo. Show chat workflow link. Emphasize: simplified, focused, achievable. You have the foundation from Session 7, plus what we learned today.

---

## Assignment Details

<div style="font-size: 28px; line-height: 2; margin: 80px 0; text-align: center;">

**In D2L**

Check D2L for the details

</div>

Note:
Assignment document in D2L has everything they need: detailed hints for each node, YouTube tutorials, chat workflow link, troubleshooting guide. What: Build Baserow → Qdrant indexing workflow. Due: Tuesday Feb 10 by class time. Deliverable: Link to working N8N workflow. Encourage: Start today/tomorrow, not Monday night. Test after every 2-3 nodes. Use Slack with screenshots.

---

## Preview: Tuesday's Session

<div style="font-size: 24px; line-height: 2; margin: 40px 0;">

**Assuming your data is indexed by Tuesday...**

We'll use your indexed knowledge base to:
- Extract topics from partner content
- Identify content coverage patterns
- Generate actionable insights for partners

**This becomes your first real deliverable**

</div>

<div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 19px; text-align: center;">
<strong>No indexed data = will fall behind on deliverables</strong><br>
Please prioritize this homework
</div>

Note:
Set clear expectations. Tuesday's work depends on today's homework. This isn't busy work - it's infrastructure for real partner deliverables. Encourage them: You have the tools, the knowledge, and the resources. Use them. See you Tuesday with indexed data ready to analyze!

---

## Testing Strategy: Build Incrementally

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**Steps:**
1. Create collection (once)
2. Test Baserow retrieval
4. Add vector nodes + configure
5. Run full workflow
6. Verify with chat

<div style="background: #dbeafe; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 18px;">
<strong>Don't build everything at once!</strong> Test after each step.
</div>

</div>

Note:
This is critical. Session 7 taught us: incremental testing catches issues early. Build-test-build-test, not build-build-build-test. Assignment doc has detailed steps for each step.

---

## What We Learned Today

Note:
Synthesize based on what actually emerged from the session. Key points to cover: Learned from Session 7 struggles, built N8N tool fluency (nodes, data flow, connections), launched simpler pipeline challenge. Homework: Baserow → Qdrant indexing workflow due Tuesday by class time. Tuesday: Semantic analysis on indexed data - extract topics, identify patterns, generate insights. Emphasize this is priority homework. Struggle from Session 7 was productive - you were engaged, tried approaches, built foundation. This assignment is more achievable.

---

## Let's Get Started / Q&A

<div style="font-size: 28px; line-height: 2; margin: 80px 0; text-align: center;">

**Remember:**
- Assignment doc is your guide
- Slack channel for questions
- Start early, test incrementally

</div>

Note:
Stay flexible. If energy is high and students want to work, circulate and help. If they want to leave and start on their own, recap key points and dismiss. Watch for: Are they clear on what to do? Do they feel prepared? Adjust Tuesday plan based on expected progress.
