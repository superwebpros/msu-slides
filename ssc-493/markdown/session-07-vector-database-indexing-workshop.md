## SSC 493: AI Workflows & Organizational Intelligence

Week 4 - February 3, 2026

Note:
Workshop session. Students spend 50+ minutes building in teams. Frame the problem (10 min), circulate and observe (50 min), debrief learnings (20 min). This is productive struggle - use docs, use AI, use each other. Foundation from Sessions 4-6 enables this work.

---

## Today's Focus: Vector Databases + Workflows

<div style="font-size: 14px; margin: 20px auto; max-width: 900px;">

| | Reactive | Retrieval | Orchestration | Validation | Models |
| --- | --- | --- | --- | --- | --- |
| **Primitives** | <span style="background: #fbbf24; padding: 5px 10px; border-radius: 4px; display: inline-block;">Prompts (Pr)</span> | <span style="background: #fbbf24; padding: 5px 10px; border-radius: 4px; display: inline-block;">Embeddings (Em)</span> | | | <span style="background: #fbbf24; padding: 5px 10px; border-radius: 4px; display: inline-block;">LLMs (Lg)</span> |
| **Compositions** | <span style="background: #fbbf24; padding: 5px 10px; border-radius: 4px; display: inline-block;">Function Calling</span> | <span style="background: #fbbf24; padding: 5px 10px; border-radius: 4px; display: inline-block;">Vector DBs (Vx)</span> | <span style="background: #fbbf24; padding: 5px 10px; border-radius: 4px; display: inline-block;">RAG (Rg)</span> | Guardrails | Multi-modal |
| **Deployment** | Agents (Ag) | Fine-tuning | <span style="background: #fbbf24; padding: 5px 10px; border-radius: 4px; display: inline-block;">Frameworks (Fw)</span> | Red-teaming | Small Models |
| **Emerging** | Multi-agent | Synthetic Data | | Interpretability | Thinking Models |

</div>

<div style="margin-top: 30px; font-size: 20px; color: #f59e0b; text-align: center;">
Building stateful infrastructure: <strong>Embeddings (Em)</strong> + <strong>Vector DBs (Vx)</strong> via <strong>N8N Frameworks (Fw)</strong>
</div>

Note:
Three elements converge today: Embeddings (Em) from Session 6, Vector Databases (Vx) for persistent storage, and N8N Frameworks (Fw) to orchestrate the pipeline. This is where primitives become compositions - you're building infrastructure that enables semantic analysis.

---

## Where We Are

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**Sessions 1-6:** Foundation complete
- APIs + HTTP requests (Session 4)
- Business partners met (Session 5)
- Embeddings + semantic similarity (Session 6)

**Today:** Build indexing infrastructure

**Thursday:** Semantic analysis (gap detection)

**Feb 11:** First deliverable to partners

</div>

Note:
Foundation from 6 sessions enables today's work. The indexed content you create becomes the knowledge base you analyze Thursday and deliver Feb 11.

---

## The Challenge

<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px; margin: 10px 0 0 0; align-items: center;">

<div style="text-align: center;">
<img src="https://s3.amazonaws.com/resources.superwebpros.com/bb/image/general/example_pipeline.png" alt="Data Insertion Pipeline" style="max-width: 90%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
</div>

<div style="font-size: 19px; line-height: 1.8;">

**Collection:**

`<your-team>-partner-content-v1`

**Questions:**
- How to create a collection?
- What embedding model? Why?
- What metadata should you track?

</div>

</div>

Note:
Pipeline diagram shows the flow. Don't explain every step - let them figure it out. This is the ingest pipeline - the "write" side. Thursday they'll build the "read" side (semantic analysis queries).

---

## Success Criteria

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**By end of class:**

- ✅ Qdrant collection created
- ✅ At least 3 partner URLs content extracted
- ✅ Content indexed with embeddings
- ✅ Metadata attached (URL, title, etc.)
- ✅ Verify in Qdrant dashboard

</div>

Note:
This is what "done" looks like. Three URLs successfully indexed is the goal. Quality over quantity. They need to understand the pipeline, not index 100 pages.

---

## Technical Hints

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 25px; margin: 30px 0; font-size: 17px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">1. Past workflows</h4>
<ul style="line-height: 1.8;">
<li>Session 4: HTTP GET/POST patterns</li>
<li>Last week: Vector store in-memory</li>
<li>Reference what you've built</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">2. Documentation</h4>
<ul style="line-height: 1.8;">
<li>Google "qdrant api docs"</li>
<li>API endpoints: Collections, points</li>
<li>Required vs. optional params</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">3. Course AI (Archie)</h4>
<ul style="line-height: 1.8;">
<li>Has web search tool</li>
<li>Knows past workflows</li>
<li>Use as pair programmer</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">4. N8N Documentation</h4>
<ul style="line-height: 1.8;">
<li>AI-powered docs</li>
<li>Export workflows → paste into AI</li>
<li>Search for examples</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">5. Triggers</h4>
<ul style="line-height: 1.8;">
<li>Manual: Click to run</li>
<li>Form: User input</li>
<li>Which makes sense?</li>
</ul>
</div>

</div>

Note:
Breadcrumbs, not solutions. Hint 1: Working HTTP request workflows from Session 4. Hint 2: Qdrant docs are well-written. Hint 3: Course AI (Archie) has web search tool and context on past work. Hint 4: N8N has AI-powered docs. Export workflows as JSON for AI review. Hint 5: Different triggers enable different architectures. Manual for testing, Form for user input.

---

## Team Collaboration Strategy

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 40px 0; font-size: 18px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Parallel Prototyping</h4>
<ul style="line-height: 1.8;">
<li>Everyone has N8N instance</li>
<li>Work in parallel, communicate constantly</li>
<li>Compare approaches after 15 min</li>
<li>Converge on working solution</li>
</ul>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 15px;">Workflow</h4>
<ol style="line-height: 1.8;">
<li>Everyone prototypes (different approaches OK)</li>
<li>Share discoveries in real-time</li>
<li>Compare what worked</li>
<li>Help everyone get there</li>
</ol>
</div>

</div>

Note:
NOT one person coding while others watch. Everyone prototypes simultaneously. Diversity of approaches speeds up discovery. Share and converge. Parallel exploration, collaborative convergence.

;;;

### Use Slack Effectively

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 40px 0; font-size: 18px;">

<div>
<h4 style="color: #16a34a; margin-bottom: 15px;">✅ DO</h4>
<ul style="line-height: 1.8;">
<li>Post links to useful docs</li>
<li>Share error screenshots</li>
<li>Export/share workflows (JSON)</li>
<li>Quick questions/answers</li>
</ul>
</div>

<div>
<h4 style="color: #dc2626; margin-bottom: 15px;">❌ DON'T</h4>
<ul style="line-height: 1.8;">
<li>Long debates (talk out loud instead)</li>
<li>Stay silent when stuck</li>
<li>Work in isolation</li>
</ul>
</div>

</div>

<div style="background: #dbeafe; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 18px; text-align: center;">
<strong>Pattern:</strong> Export → Share → Import → Converge
</div>

Note:
Slack for artifacts, not discussions. Post links, screenshots, workflows. Talk out loud for debugging. Export/share/import pattern: When someone gets it working, export N8N workflow as JSON, post to Slack, teammates import and learn.

---

## Thursday Preview

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**Once you have indexed content, you can analyze it.**

**Thursday's work:**
- Semantic gap analysis
- Topic coverage assessment
- Content recommendations for partners

**Output:** Actionable insights powered by your knowledge base

</div>

Note:
The vector database is the foundation. Thursday: use LLMs to extract topics, vector similarity to find gaps, generate semantic audit reports. First deliverable to partners.

---

## Resources Available

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

- N8N instance
- Qdrant dashboard
- Slack channel
- Course AI (Archie)
- Partner website URLs

</div>

Note:
Step back and let them work. Circulate every 5-10 minutes. Ask Socratic questions when stuck. Only intervene if truly blocked. Watch team dynamics - silent teams need prompting. Check Slack for activity. Take notes for debrief.
