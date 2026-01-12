---
title: "Session 1: Course Framework & Team Formation"
course: "ssc-493"
week: 1
session: 1
date: "2026-01-13"
duration: 80
tags:
  - ssc493
  - claude
  - spring2026
  - unit-0
obsidian_vault_link: "/Users/jesseflores/vaults/courses/msu-ai-course/units/unit-0-foundations/00-01-course-framework-team-formation.md"
published_slide_url: "https://msu-slides.superwebpros.com/ssc-493/session-01-course-framework.html"
learning_objectives:
  - Identify the components of the AI periodic table
  - Navigate the course structure and understand expectations
  - Complete PrinciplesYou assessment for team formation
  - Articulate personal learning goals for the semester
---

# Session 1: Course Framework & Team Formation

## SSC 493: AI Workflows & Organizational Intelligence

Spring 2026 • Michigan State University

Note:
Welcome to SSC 493. This is the first session where we establish the framework we'll use throughout the entire course. We're building real AI systems for real businesses this semester.

---

## Ground Rules

- There are no dumb questions
- Ask questions anytime
- Participate actively
- We're learning together

Note:
Set collaborative tone from the start. This is a hands-on, project-based course. Everyone is learning together.

---

## Session Roadmap

**What we'll cover today (80 minutes):**

1. Course overview & expectations
2. The AI Periodic Table framework
3. PrinciplesYou assessment & team formation prep
4. Goal-setting for the semester

---

## The Challenge

**Does the world of AI feel a bit like this to you?**

<div style="text-align: center; font-size: 24px; margin: 40px 0; color: #6b7280;">
A thousand terms all flying around...
</div>

- Agents
- RAG
- Embeddings
- Guardrails
- Vector databases
- Function calling
- Multi-modal AI

**...and you're just supposed to know how it all fits together?**

Note:
This is the problem we're solving. The AI landscape is overwhelming. Everyone's talking about these terms, but there's no clear organizing structure.

---

## The Solution

**What if we could organize AI like chemistry organizes the elements?**

<div style="text-align: center; font-size: 28px; margin: 40px 0; color: #7c3aed;">
Welcome to the AI Periodic Table
</div>

Note:
Just like chemistry has the periodic table to organize elements into families with predictable properties, we're going to use a framework to organize all AI technologies.

---

## The AI Periodic Table

<div style="text-align: center; font-size: 20px; margin: 30px 0;">
**4 Rows × 5 Families = Your Mental Model for AI**
</div>

### The 4 Rows

1. **Primitives** - The atomic elements (can't break them down further)
2. **Compositions** - Combining primitives into systems
3. **Deployment** - Putting systems into production
4. **Emerging** - Cutting-edge technologies (rapidly evolving)

### The 5 Families

- **G1: Reactive** - Making things happen
- **G2: Retrieval** - Finding and remembering
- **G3: Orchestration** - Coordinating multiple pieces
- **G4: Validation** - Quality control and safety
- **G5: Models** - The foundation everything reacts around

Note:
This framework will be your constant reference point. Every session, we'll say "Today we're covering Rg (RAG), which sits in row 2 (compositions), family 3 (orchestration)." You'll always know where you are.

---

## Row 1: Primitives

**The atomic elements - can't break these down further**

| Element | Name | What It Is |
|---------|------|------------|
| **Pr** | Prompts | Instructions you give to AI |
| **Em** | Embeddings | Numerical representations of meaning |
| **Lg** | Large Language Models | The models themselves (ChatGPT, Claude, etc.) |

<div style="margin-top: 30px; font-size: 20px; color: #7c3aed;">
Everything else in AI is built from combining these three primitives.
</div>

Note:
These are foundational. You'll work with prompts every single day. Embeddings are how AI understands semantic meaning. LLMs are the models that power everything. Master these, and you can understand any AI system.

---

## Row 2: Compositions

**Combining primitives into useful systems**

| Element | Name | Description |
|---------|------|-------------|
| **Fc** | Function Calling | AI calls external tools (APIs, databases) |
| **Vx** | Vector Databases | Storage for semantic search |
| **Rg** | RAG | Retrieval Augmented Generation - AI with "memory" |
| **Gr** | Guardrails | Quality control and safety filters |
| **Mm** | Multi-modal | Processing text, images, audio, video |

Note:
This is where things get practical. RAG lets AI access your company's knowledge. Vector databases store embeddings for fast semantic search. You'll build all of these this semester.

---

## Row 3: Deployment

**Putting AI systems into production**

| Element | Name | Description |
|---------|------|-------------|
| **Ag** | Agents | Think-act-observe loops, autonomous AI |
| **Ft** | Fine-Tuning | Training models on your specific data |
| **Fw** | Frameworks | Platforms like N8N for orchestration |
| **Rt** | Red Teaming | Adversarial testing to find vulnerabilities |
| **Sm** | Small Models | Fast, cheap, specialized models |

Note:
Deployment is where theory becomes practice. You'll build agents that run automatically. You'll use N8N to orchestrate workflows. This is production-ready AI.

---

## Row 4: Emerging

**Cutting-edge technologies (evolving rapidly)**

| Element | Name | Description |
|---------|------|-------------|
| **Ma** | Multi-Agent | Specialized AIs working together |
| **Sy** | Synthetic Data | Using AI to generate training data |
| **In** | Interpretability | Understanding why AI makes decisions |
| **Th** | Thinking Models | Models that reason step-by-step |

Note:
This row is evolving fastest. Multi-agent systems are becoming standard. Thinking models (like OpenAI's o1) spend time reasoning before answering. You'll experiment with these.

---

## The Reactive Family (G1)

**Making things happen - from control to autonomy**

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; margin: 40px 0; font-size: 18px;">

<div style="background: #f0f9ff; padding: 20px; border-radius: 10px;">
<strong>Pr (Prompts)</strong><br>
Row 1: Primitives<br>
<em>You control output</em>
</div>

<div style="background: #dbeafe; padding: 20px; border-radius: 10px;">
<strong>Fc (Function Calling)</strong><br>
Row 2: Compositions<br>
<em>AI takes actions</em>
</div>

<div style="background: #bfdbfe; padding: 20px; border-radius: 10px;">
<strong>Ag (Agents)</strong><br>
Row 3: Deployment<br>
<em>AI works autonomously</em>
</div>

</div>

**The progression:** Control → Action → Autonomy

Note:
Notice the progression. Prompts are you controlling AI. Function calling is AI taking actions with tools. Agents are AI working autonomously toward goals. This is the reactive family.

---

## The Retrieval Family (G2)

**Finding and remembering - three time scales of memory**

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; margin: 40px 0; font-size: 18px;">

<div style="background: #f0fdf4; padding: 20px; border-radius: 10px;">
<strong>Em (Embeddings)</strong><br>
Row 1: Primitives<br>
<em>Encode meaning</em>
</div>

<div style="background: #dcfce7; padding: 20px; border-radius: 10px;">
<strong>Vx (Vector DBs)</strong><br>
Row 2: Compositions<br>
<em>Store for search</em>
</div>

<div style="background: #bbf7d0; padding: 20px; border-radius: 10px;">
<strong>Ft (Fine-Tuning)</strong><br>
Row 3: Deployment<br>
<em>Bake into model</em>
</div>

</div>

**The progression:** Encode → Store → Internalize

Note:
Embeddings encode meaning as numbers. Vector databases store those embeddings for fast search. Fine-tuning bakes knowledge directly into model weights. Three ways AI "remembers."

---

## Example: Production RAG System

**Let's see how elements combine to create a real AI system**

<div style="text-align: left; font-size: 20px; line-height: 1.8; margin: 30px 0;">

**The Pattern:**
1. **Em** (Embeddings) - Convert your documents to vectors
2. **Vx** (Vector Database) - Store embeddings in Qdrant
3. **Rg** (RAG) - User asks question → retrieve relevant docs → augment prompt
4. **Lg** (LLM) - Generate answer grounded in your data
5. **Gr** (Guardrails) - Wrap in safety filters

</div>

<div style="text-align: center; font-size: 24px; color: #7c3aed; margin-top: 40px;">
That's 5 elements working together = production AI chatbot
</div>

Note:
This is what you'll build. By Week 8, your team will have a RAG system connected to a business partner's content. You'll use embeddings, vector databases, RAG, LLMs, and guardrails all working together.

---

## Example: Agentic Loop

**Another common pattern - agents that DO things**

<div style="text-align: left; font-size: 20px; line-height: 1.8; margin: 30px 0;">

**The Goal:** Book me a flight to Tokyo next month under $800

**The Pattern:**
1. **Ag** (Agent) - Breaks goal into steps (search flights → check calendar → compare prices → book)
2. **Fc** (Function Calling) - Calls external APIs (flight search, calendar, payment)
3. **Observe** - Gets results, decides next action
4. **Fw** (Framework) - N8N orchestrates the whole loop

</div>

<div style="text-align: center; font-size: 24px; color: #7c3aed; margin-top: 40px;">
Think. Act. Observe. Repeat until goal achieved.
</div>

Note:
This is what makes agents powerful. They don't just respond - they plan, take action, observe results, and keep going until the goal is met. You'll build multi-agent systems that work like this.

---

## Your Challenge

**Next time someone pitches you an AI feature, ask:**

- What elements are they using?
- What reactions are they running?
- Are they missing a safety element (Gr)?
- Are they over-engineering the orchestration?
- Are they using a thinking model (Th) when a small model (Sm) would work?

<div style="margin-top: 40px; font-size: 24px; color: #7c3aed;">
This framework lets you decode any AI system
</div>

Note:
This is your superpower. When someone says "We're building an AI agent with RAG," you'll know exactly what they mean and what questions to ask.

---

## Course Mapping to Periodic Table

**By the end of this course, you'll have hands-on experience with:**

- **Row 1 (Primitives):** Pr, Em, Lg
- **Row 2 (Compositions):** Rg, Vx, Mm, Fc, Gr
- **Row 3 (Deployment):** Ag, Fw, Sm
- **Row 4 (Emerging):** Ma, Th

<div style="margin-top: 30px; font-size: 22px; color: #15803d;">
That's 11+ elements of the AI Periodic Table
</div>

Note:
You'll cover most of the table. Every session references this framework so you always know where you are in the AI landscape.

---

## What You'll Build This Semester

**Technical Portfolio:**
- Multi-agent content automation system
- RAG implementation with vector database
- N8N workflow orchestration
- Production-quality documentation

**Business Deliverables:**
- Q3 content calendar for real business
- 3+ weeks of publication-ready content
- Working system with training materials

Note:
You're not just learning theory. You're building real systems that create real business value for real partners.

---

## Course Structure

**28 sessions (14 weeks × 2 sessions), 80 minutes each**

- **15 min:** Deliverable review & debug
- **20 min:** New concept introduction (mini-lecture + demo)
- **40 min:** Hands-on work (individual + team collaboration)
- **5 min:** Preview next session

**Pre-class:** Video walkthroughs, playbook readings, deliverables
**Outside class:** Team meetings 1× per week

Note:
This is a hands-on course. You'll spend most of your time building, not listening to lectures.

---

## Grading: The GWC Framework

**Three dimensions (inspired by Traction/EOS methodology):**

**Get it:** Do you understand the concepts?
- Can explain AI Periodic Table elements
- Demonstrates conceptual understanding
- Asks insightful questions

**Want it:** Are you engaged and contributing?
- Completes deliverables on time
- Participates actively in class
- Shows initiative and ownership

**Capacity:** Can you execute the skills?
- Deliverables meet quality standards
- Technical implementation works
- Applies feedback effectively

Note:
You're rated weekly on these three dimensions: +, +/-, or -. This isn't about perfection - it's about effort, engagement, and growth.

---

## Pass Requirements

**To pass SSC 493, you must meet ALL of these:**

1. ✅ **12 of 14 weekly deliverables completed** (85%)
2. ✅ **GWC rating average ≥ +/-** (meets expectations)
3. ✅ **Peer evaluation average ≥ 3/5**
4. ✅ **Business partner rating ≥ "Meets expectations"**
5. ✅ **Final presentation attendance**

**Note:** This is Pass/No Pass - no letter grades

Note:
The bar is clear. Show up, do the work, collaborate well, deliver value to your business partner. That's how you pass.

---

## Business Partners

**You'll work with real businesses this semester**

**What they provide:**
- Content, access to systems, business context
- Feedback on deliverables
- Final evaluation of your work

**What they receive:**
- Q3 content calendar (May-August 2026)
- 3+ weeks of publication-ready content
- Working automation system
- Documentation and training

Note:
These are real stakes. Your business partner is counting on you. Treat this like a professional engagement.

---

## Hands-On: PrinciplesYou Assessment

**Next 30 minutes:**

1. Go to https://principlesyou.com/
2. Complete the assessment (25-30 min)
3. Review your results
4. Think about your strengths

**Why we're doing this:**
- Teams formed based on balanced strengths
- You'll understand your working style
- Helps with role assignment in Week 2

Note:
This is not a test. There are no right answers. Be honest. We use this to create balanced teams where everyone's strengths complement each other.

---

## Goal-Setting Exercise

**While you wait for PrinciplesYou results, answer these:**

1. What do you want to learn this semester?
2. What's your prior experience with AI tools?
3. What concerns do you have about the course?
4. What business problem interests you most?

Note:
Be thoughtful. These answers help me understand where you're starting from and what success looks like for you.

---

## Next Session Preview

**Session 2: Prompts & Language Models (Thursday)**

We'll dive into:
- **Pr** (Prompts) - How prompting steers AI behavior
- **Lg** (LLMs) - Understanding language models
- Hands-on: Compare 4 different AI models with same prompt
- See why prompting is a skill

**Pre-class:**
- Watch "Models Explained" video (15 min)
- Review: 8 Semantic Strength Principles
- Ensure LibreChat access works

Note:
Next session is hands-on from the start. You'll see firsthand why the same prompt produces different outputs across different models.

---

## Deliverables Due Before Next Session

**Individual:**
- ✅ Complete PrinciplesYou assessment (if not done in class)
- ✅ Submit goals statement
- ✅ Complete prior knowledge survey

**Bring to next session:**
- Laptop
- Completed PrinciplesYou results
- Questions about periodic table framework

Note:
Come ready to dive in. Session 2 is all hands-on model comparison work.

---

## Questions?

**Ask now or reach out:**

- Office hours: [Calendly link]
- Email: jesse@superwebpros.com
- Course materials: [Link to resources]

<div style="margin-top: 40px; font-size: 24px; color: #7c3aed;">
Welcome to SSC 493. Let's build some AI systems.
</div>

Note:
Excited to have you here. This is going to be a challenging, hands-on, rewarding semester. You're going to build real systems and create real business value.
