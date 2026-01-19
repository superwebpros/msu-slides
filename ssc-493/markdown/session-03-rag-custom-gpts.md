## SSC 493: AI Workflows & Organizational Intelligence

Week 2 - January 21, 2026

Note:
Today we're covering Rg (RAG) - Retrieval Augmented Generation. This is your first composition element where we combine multiple primitives into a useful system.

---

## Housekeeping (15 min)

**Before we start:**

1. **PrinciplesYou Results** - Email me your results if you haven't already
2. **D2L Reflection** - Complete Session 2 reflection in D2L → Quizzes
   - Open on your laptop now
   - Takes 5-10 minutes
   - Reflects on last session's learning

<div style="background: #fef3c7; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>👉 Do this now:</strong> Log into D2L → Quizzes → Session 2 Reflection
</div>

Note:
Give them 10 minutes to complete the reflection. Circulate to make sure everyone has D2L access. This reflection asks them to think about what they learned from comparing models and how prompts/roles/examples changed outputs. While they work, check that everyone has emailed PrinciplesYou results. At 10-minute mark, bring everyone back together for quick debrief.

---

## Looking Ahead: Business Partners

**Next Tuesday, January 27th:**

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

✅ Business partners will join us in class<br>
✅ Team assignments will be announced<br>
✅ You'll conduct discovery interviews<br>
✅ Start planning your semester project

</div>

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Today's RAG lesson</strong> connects directly to what you'll build for your business partner
</div>

Note:
Important announcement: Business partners are coming next Tuesday the 27th. By then, you'll have your team assignments. Today you're learning RAG with Custom GPTs - the simple version. Eventually you'll build production RAG systems for your actual business partners. Keep that in mind as we go through today's material.

---

## Today's Focus: Rg (RAG)

<div style="font-size: 14px; margin: 20px auto; max-width: 900px;">

| | Reactive | Retrieval | Orchestration | Validation | Models |
| --- | --- | --- | --- | --- | --- |
| **Primitives** | <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 4px; display: inline-block;">Prompts (Pr)</span> | Embeddings (Em) | | | <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 4px; display: inline-block;">LLMs (Lg)</span> |
| **Compositions** | Function Calling | Vector DBs (Vx) | <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 4px; display: inline-block;">RAG (Rg)</span> | Guardrails | Multi-modal |
| **Deployment** | <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 4px; display: inline-block;">Agents (Ag)</span> | Fine-tuning | Frameworks | Red-teaming | Small Models |
| **Emerging** | Multi-agent | Synthetic Data | | Interpretability | Thinking Models |

</div>

<div style="margin-top: 30px; font-size: 20px; color: #7c3aed; text-align: center;">
Today we learn <strong>RAG (Rg)</strong> - our first composition element that combines <strong>Prompts (Pr)</strong> and <strong>LLMs (Lg)</strong> with retrieval
</div>

Note:
We're moving from primitives to compositions. Today focuses on RAG (Rg), which sits in row 2 (compositions), family 3 (orchestration). RAG orchestrates multiple primitives together - specifically Prompts (Pr) and LLMs (Lg) that you learned last week, plus Embeddings (Em) and Vector DBs (Vx) that you'll learn more about Thursday. We also touch on Agents (Ag) since Custom GPTs are specialized agents. This is your first time seeing how primitives combine into something more powerful.

---

## Session Roadmap

**What we'll cover today (80 minutes):**

1. The knowledge problem: Why AI "forgets"
2. RAG concept: Retrieve → Augment → Generate
3. Live demo: Build a Custom GPT
4. Hands-on: Create your own Custom GPT

---

## The Knowledge Problem

**Your team constantly needs:**

- Technical documentation and specifications
- Customer-specific context and history
- Product knowledge and best practices
- Competitive positioning

<div style="background: #fee2e2; padding: 25px; border-radius: 10px; margin: 30px 0;">
<strong>But...</strong>
<ul>
<li>New hires take months to learn tribal knowledge</li>
<li>Information lives in email threads and people's heads</li>
<li>Inconsistent messaging across teams</li>
</ul>
</div>

Note:
This is the pain point we're solving. Organizations have valuable knowledge scattered everywhere. Getting AI to use that knowledge is what RAG enables.

;;;

### Why AI "Forgets"

**LLMs are stateless - each conversation starts fresh**

<div style="text-align: left; font-size: 20px; line-height: 1.8; margin: 30px 0;">

**What does "stateless" mean?**
- No persistent memory between sessions
- Previous conversations don't exist to the model
- Each request is completely independent

**Example:**
- Session 1: "My favorite color is blue"
- Session 2 (new chat): "What's my favorite color?"
- AI: "I don't have that information"

</div>

Note:
This is fundamental to understanding why RAG matters. LLMs don't have memory between sessions. They process each request independently. Everything they "know" must be in the current prompt. This is why you can't just say "remember this for next time" - there is no "next time" for the model.

;;;

### Context Windows & Token Limits

**Context window = everything the model can "see" at once**

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**Typical context windows (January 2026):**
- GPT-4o / GPT-4 Turbo: **128K tokens** (~96K words)
- Claude Sonnet 4.5: **200K tokens** (~150K words)
- Llama 3.3: **128K tokens** (~96K words)

</div>

<div style="background: #fee2e2; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Problem:</strong> Your business partner's website, docs, and policies won't fit in the context window
</div>

Note:
Context window is the amount of text the model can process in a single request - both your prompt AND the response count against this limit. Even with large context windows like 128K-200K tokens, you can't fit everything your business needs to know. That's where RAG comes in - it intelligently selects JUST the relevant pieces to include in the context window.

;;;

### Why Do Context Windows Exist?

**The hard limits:**

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

1. **Computational cost** - Processing scales quadratically with context length (2x context = 4x compute)
2. **Memory requirements** - Models must hold entire context in GPU memory during processing
3. **Attention mechanism** - Transformer architecture compares every token to every other token
4. **Inference speed** - Longer contexts = slower responses

</div>

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 18px;">
**Why different sizes?** Larger contexts require more expensive hardware and specialized optimization. Smaller, faster models (like GPT-3.5) have smaller windows. Frontier models invest in larger windows but charge premium pricing.
</div>

Note:
Context windows aren't arbitrary - they're constrained by fundamental computer science and economics. The attention mechanism that makes transformers powerful also makes them expensive to scale. Every token in the context must compare to every other token - that's N-squared complexity. Doubling context length quadruples compute cost. Models with larger contexts (Claude 200K, GPT 128K) require specialized hardware, careful optimization, and often charge more. This is why RAG matters - instead of jamming everything into context, we retrieve just what's needed.

;;;

## The Handshake Demo

| n | h |
| --- | --- |
| 2 | 1 |

;;;

### The Knowledge Problem for Businesses

**Your business partner needs AI that knows:**

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

- Product catalog and specifications
- Brand voice and messaging guidelines
- Customer history and preferences
- Company policies and procedures
- Competitive positioning
- Industry-specific terminology

</div>

<div style="background: #fef3c7; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Challenge:</strong> This knowledge changes daily and won't fit in a context window
</div>

Note:
This is the real business problem we're solving. Generic AI gives generic advice. But businesses need AI that knows THEIR specific information. And they need it to stay current - new products launch, policies change, customer preferences evolve. RAG solves this by retrieving current, relevant information on-demand.

---

## The RAG Concept

**RAG = Retrieval Augmented Generation**

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 40px 0; font-size: 18px;">

<div style="background: #dbeafe; padding: 25px; border-radius: 10px;">
<h3 style="color: #1e40af;">1. Retrieve</h3>
<p>Search your documents to find relevant information</p>
</div>

<div style="background: #dcfce7; padding: 25px; border-radius: 10px;">
<h3 style="color: #14532d;">2. Augment</h3>
<p>Add retrieved context to the prompt</p>
</div>

<div style="background: #fef3c7; padding: 25px; border-radius: 10px;">
<h3 style="color: #92400e;">3. Generate</h3>
<p>AI responds using that specific context</p>
</div>

</div>

<div style="text-align: center; font-size: 24px; color: #7c3aed; margin-top: 30px;">
RAG gives AI access to YOUR knowledge
</div>

Note:
This is the pattern. When you ask a question, the system searches your documents, finds relevant chunks, includes them in the prompt, and the AI generates a response based on that context.

;;;

### RAG vs. Regular Prompting

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 40px 0;">

<div style="background: #fee2e2; padding: 25px; border-radius: 10px;">
<h3 style="color: #991b1b;">Without RAG</h3>
<p style="font-size: 16px; line-height: 1.6;">
<strong>You:</strong> "What are our return policies for enterprise customers?"<br><br>
<strong>AI:</strong> "I don't have specific information about your company's return policies. Generally, enterprises might..."
</p>
<p style="margin-top: 15px; color: #991b1b;"><strong>❌ Generic, unhelpful</strong></p>
</div>

<div style="background: #dcfce7; padding: 25px; border-radius: 10px;">
<h3 style="color: #14532d;">With RAG</h3>
<p style="font-size: 16px; line-height: 1.6;">
<strong>You:</strong> "What are our return policies for enterprise customers?"<br><br>
<strong>AI:</strong> "According to your Enterprise Customer Agreement (page 12), enterprise customers have a 90-day return window..."
</p>
<p style="margin-top: 15px; color: #14532d;"><strong>✅ Specific, cites sources</strong></p>
</div>

</div>

Note:
See the difference? Without RAG, the AI gives generic advice. With RAG, it cites your actual policy documents. That's the power of retrieval.

;;;

### How RAG Works: The Technical View

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; font-size: 18px;">

<div style="background: #dbeafe; padding: 25px; border-radius: 10px;">
<h4>1. Ingestion (one-time setup)</h4>
<ul style="margin-top: 15px; line-height: 1.8;">
<li>Break documents into chunks</li>
<li>Convert chunks to embeddings (Em)</li>
<li>Store embeddings in vector database (Vx)</li>
</ul>
</div>

<div style="background: #dcfce7; padding: 25px; border-radius: 10px;">
<h4>2. Query time (every request)</h4>
<ul style="margin-top: 15px; line-height: 1.8;">
<li>User asks question</li>
<li>Convert question to embedding</li>
<li>Search vector DB for similar chunks</li>
<li>Retrieve top matches</li>
<li>Augment prompt with chunks</li>
<li>LLM generates response</li>
</ul>
</div>

</div>

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 18px;">
<strong>Composition:</strong> Em (embeddings) + Vx (vector DB) + Pr (prompts) + Lg (LLM) = <strong>Rg (RAG)</strong>
</div>

Note:
This is the full technical picture. By Week 8, you'll build this entire system from scratch. Today, we're using Custom GPTs as "training wheels RAG" - OpenAI handles all the technical complexity (embeddings, vector storage, retrieval) behind the scenes. This lets you focus on understanding the CONCEPT and VALUE of RAG before you build the real thing. Next session (Thursday), we'll start learning about embeddings - how text becomes numbers that represent meaning.

---

## Demos: RAG in Action

**Custom GPTs are RAG training wheels**

<div style="font-size: 20px; line-height: 1.8; margin: 40px 0;">

**What Custom GPTs Do:**
- You upload files (PDFs, docs, etc.)
- OpenAI handles embeddings and vector storage
- When you ask a question, it searches files
- Includes relevant excerpts in prompt
- Generates response based on your docs

**Perfect for:** Learning the RAG pattern, personal knowledge bases, quick prototypes

</div>

Note:
Custom GPTs abstract away the complexity. You don't need to understand embeddings or vector databases yet. Just upload files and it works. Perfect for learning the concept.

;;;

### Demo 1: RAG in LibreChat

<div style="text-align: center; font-size: 32px; color: #7c3aed; margin: 60px 0;">
<strong>Live Demo</strong>
</div>

**Comparing: Regular prompting vs. RAG**

Note:
DEMO SETUP: Have LibreChat open with product launches RAG already configured. Screen share and walk through this:

**Demo Part 1 - WITHOUT RAG (5 min):**
1. Open LibreChat in a regular chat (no RAG enabled)
2. Ask: "Tell me about recent product launches"
3. Observe: Model gives generic advice or makes things up
4. Point out: "See? It has no idea what OUR products are. It's guessing."

**Demo Part 2 - WITH RAG (5 min):**
1. Switch to RAG-enabled chat (or enable RAG in same chat)
2. Ask same question: "Tell me about recent product launches"
3. Observe: Model retrieves specific product launch content from uploaded docs
4. Point out the citations/sources shown
5. Ask follow-up: "What were the key features of [specific product]?"
6. Show how it retrieves and cites specific documents

**Key Teaching Points:**
- WITHOUT RAG: Generic, unhelpful, potentially wrong
- WITH RAG: Specific, accurate, cites sources
- This is the difference RAG makes for businesses
- Your business partners need THIS - AI that knows THEIR content

**Technical Note:** Make sure product launches RAG has several documents indexed (press releases, feature lists, launch announcements) so retrieval is obvious and varied.

;;;

### Demo 2: Build Career Development Coach

<div style="display: grid; grid-template-columns: 1fr 350px; gap: 40px; align-items: center; margin: 40px 0;">

<div>
<h3 style="font-size: 28px; color: #7c3aed; margin-bottom: 20px;">Build Together: Custom GPT</h3>
<p style="font-size: 22px; line-height: 1.8;">
Follow along on your laptop<br><br>
<strong>Scan QR code or visit:</strong><br>
chatgpt.com
</p>
</div>

<div style="text-align: center;">
<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://chatgpt.com" alt="ChatGPT QR Code" style="width: 300px; height: 300px; border: 2px solid #e5e7eb; border-radius: 10px;">
</div>

</div>

Note:
WORKSHOP TIME (35 minutes total). Students work alongside instructor. This is pair programming style - you do it on screen, they do it on their laptops simultaneously.

**Introduction (5 min):**
"We're building a Career Development Coach that helps with resumes and job applications. The clever part: ONE GPT handles two scenarios - students with resumes AND students without resumes. It adapts based on what you upload."

**Build Process - Follow Along (25 min):**

**Step 1: Navigate to Custom GPT creation (2 min)**
- Open ChatGPT Plus
- Click "Explore GPTs" in sidebar
- Click "Create" in top right
- Name: "Career Development Coach"

**Step 2: Configure Instructions (10 min)**
Paste this system prompt (share via screen or handout):

```
You are a Career Development Coach specializing in helping students and early-career professionals advance their careers.

Your capabilities:
1. Resume Building: If the user doesn't have a resume, guide them through creating one using industry best practices (chronological format, action verbs, quantifiable achievements)
2. Resume Optimization: If the user uploads a resume, analyze it and help tailor it for specific job opportunities
3. Job Application Strategy: Help users understand job postings, identify relevant skills, and position themselves effectively

When a user first interacts with you:
- Ask if they have an existing resume
- If yes: Request upload and proceed with optimization
- If no: Guide them through building one from scratch

Tone: Supportive, strategic, results-oriented
Format: Provide clear action items and specific suggestions
Focus: Measurable outcomes - "Add 3 quantifiable achievements to your experience section" not "make it better"
```

**Walk through the prompt:**
- Line by line, explain what each section does
- Point out the adaptive logic (with/without resume)
- Emphasize the "measurable outcomes" focus

**Step 3: Upload Knowledge (5 min)**
- If students have resumes: Upload now
- If students don't: That's fine! GPT will guide resume creation
- Point out: "This upload is what enables RAG. Without it, you get generic advice. With it, you get personalized guidance."

**Step 4: Test It (8 min)**
Have a sample job posting ready (share link or paste). Students test:

Test Question 1: "I want to apply for this role. How should I tailor my resume?" [paste job description]
- Students WITH uploaded resumes: See personalized advice based on their experience
- Students WITHOUT resumes: Get guided through what experience would be relevant

Test Question 2: "What skills should I highlight for this position?"
- Observe how answers differ based on upload presence

**Circulate while students work:**
- Help troubleshoot upload issues
- Encourage students to test with/without upload to see difference
- Ask: "What changed when you uploaded your resume?"

**Student Customization Time (5 min):**
"Now make it yours:"
- Tweak the system prompt (add industry focus, change tone, add constraints)
- Upload additional documents (portfolios, cover letters, writing samples)
- Test with different job postings
- Experiment: Remove uploaded file and ask same question - what changes?

;;;

### Demo 3: Testing Different Models

<div style="text-align: center; font-size: 32px; color: #7c3aed; margin: 60px 0;">
<strong>Live Demo: Same Prompt, Different Models</strong>
</div>

**How do different models respond to the same system prompt?**

Note:
DEMO TIME (10 minutes). Show how the same system prompt produces different outputs with different models.

**Setup (2 min):**
- "We built a Career Coach in Custom GPT (uses GPT-4o)"
- "Let's test the SAME system prompt with different models in LibreChat"
- "Same instructions, same context, different model = different personality/style"

**Transfer Process - Live Demo (5 min):**

**Step 1: Copy system prompt from Custom GPT**
- Open Custom GPT configuration
- Copy the entire system prompt
- Show students where it lives in the interface

**Step 2: Create LibreChat preset**
- Navigate to LibreChat (have it open in another tab)
- Click presets/agents dropdown
- Create new preset
- Name: "Career Development Coach"
- Paste system prompt into "System Message" field
- Save preset

**Step 3: Test with Claude Sonnet 4.5 (3 min)**
- Select Claude model
- Ask: "I want to apply for a software engineering role. What should I highlight?"
- Observe response style and structure
- Compare to GPT-4o response from Custom GPT

**Step 4: Try Gemini or other model (optional, time permitting)**
- Switch to Gemini
- Same question
- Observe differences in tone, detail level, response structure

**Key Teaching Points:**
- Same system prompt + different models = different response personalities
- GPT-4o: [observe characteristics]
- Claude Sonnet: [observe characteristics] - typically more detailed, structured
- Models have different "personalities" even with identical instructions
- Choose model based on task needs: speed vs. detail, cost vs. quality
- System prompts are portable across platforms and models

---

## Key Takeaways from Demo

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 40px 0;">

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px;">
<h4 style="color: #0369a1;">No Coding Required</h4>
<p style="font-size: 16px; margin-top: 15px; line-height: 1.6;">
This is about organizing knowledge, not programming
</p>
</div>

<div style="background: #f0fdf4; padding: 25px; border-radius: 10px;">
<h4 style="color: #15803d;">Your Data = Advantage</h4>
<p style="font-size: 16px; margin-top: 15px; line-height: 1.6;">
Generic AI is a commodity; connected AI is differentiation
</p>
</div>

<div style="background: #fef3c7; padding: 25px; border-radius: 10px;">
<h4 style="color: #92400e;">Quality of Sources Matters</h4>
<p style="font-size: 16px; margin-top: 15px; line-height: 1.6;">
Garbage in = garbage out. Good documents = good answers
</p>
</div>

<div style="background: #fce7f3; padding: 25px; border-radius: 10px;">
<h4 style="color: #831843;">Quick ROI</h4>
<p style="font-size: 16px; margin-top: 15px; line-height: 1.6;">
Setup: 15-30 minutes. Time saved: hours per week
</p>
</div>

</div>

Note:
These are the key insights. RAG is powerful but simple. The quality of your knowledge base determines the quality of responses. And the ROI is immediate - once you have good documents, the time savings are massive.

---

## Next Session Preview

**Thursday: Embeddings & APIs**

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

**Questions we'll answer:**
- How does "retrieve" actually work in RAG?
- How does text become numbers that represent meaning?
- What are embeddings and why do they matter?
- How do you make API calls to create embeddings?

</div>

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Bridge:</strong> Today you used RAG. Thursday you'll learn how it works under the hood.
</div>

<div style="background: #fef3c7; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 18px;">
<strong>📝 Session 3 Reflection:</strong> There will be a D2L reflection available at the end of today's class. We'll complete it at the start of Thursday's session.
</div>

Note:
Today was the "what" and "why" of RAG. Thursday is the "how." You'll learn about embeddings - the technology that makes semantic search possible. And you'll make your first API calls to create embeddings yourself. This is where we start getting technical. Session 5 (Tuesday next week) is when you'll meet your business partners. Remind them there will be a D2L reflection posted after class that they'll complete at the start of Thursday's session - same pattern as today.

---

## Key Concepts to Remember

<div style="text-align: left; font-size: 20px; line-height: 2; margin: 40px 0;">

1. **RAG = Retrieve → Augment → Generate**
2. **Rg (RAG) is a composition element** - combines Em, Vx, Pr, Lg
3. **Custom GPTs are simple RAG**
4. **Quality of knowledge base = quality of responses**
5. **Generic AI is commodity; connected AI is differentiation**

</div>

Note:
These are the key takeaways. If you remember nothing else, remember that RAG gives AI access to specific knowledge, and that makes all the difference.

---

## Bonus Resource: Career Prompts Library

<div style="display: grid; grid-template-columns: 1fr 400px; gap: 40px; align-items: center; margin: 40px 0;">

<div>
<h3 style="font-size: 24px; margin-bottom: 20px;">45+ Career-Focused Prompts</h3>
<p style="font-size: 20px; line-height: 1.8;">
✅ Resume optimization<br>
✅ Cover letter templates<br>
✅ Interview preparation<br>
✅ LinkedIn profile writing<br>
✅ Job search strategy<br>
✅ Salary negotiation
</p>
<p style="margin-top: 30px; font-size: 18px; color: #6b7280;">
<strong>Scan QR code or visit:</strong><br>
github.com/superwebpros/athena-win-resources
</p>
</div>

<div style="text-align: center;">
<img src="https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=https://github.com/superwebpros/athena-win-resources" alt="GitHub Career Prompts QR Code" style="width: 350px; height: 350px; border: 2px solid #e5e7eb; border-radius: 10px;">
</div>

</div>

Note:
This is a bonus resource for students to bookmark. 45+ prompts specifically for career development - resume building, cover letters, interview prep, LinkedIn optimization, job search strategy, salary negotiation. They can use these prompts in their Custom GPT or directly with any AI model. Encourage them to scan now and bookmark for future reference. This is from the Athena WIN project - career advancement resources.

---

## Questions?

**Ask now or reach out:**

- Email: jesse@superwebpros.com
- Office hours: By appointment
- LibreChat: msu-ai.superwebpros.com

<div style="margin-top: 40px; font-size: 24px; color: #7c3aed;">
Thursday: Embeddings & APIs
</div>

Note:
Open floor for questions. Remind them: Custom GPTs are theirs to keep and use. This is a practical tool for their actual job search. Thursday we go technical - embeddings and API calls. Come ready to code (light coding, but still coding).
