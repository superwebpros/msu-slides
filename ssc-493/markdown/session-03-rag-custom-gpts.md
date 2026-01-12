# Session 3: RAG Fundamentals & Custom GPTs

## SSC 493: AI Workflows & Organizational Intelligence

Week 2 - January 20, 2026

Note:
Today we're covering Rg (RAG) - Retrieval Augmented Generation. This is your first composition element where we combine multiple primitives into a useful system.

---

## Where We Are in the Periodic Table

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 40px 0;">

<div>
<strong>Last Week (Primitives):</strong>
<ul>
<li>Pr (Prompts)</li>
<li>Lg (LLMs)</li>
<li>Compared 4 different models</li>
</ul>
</div>

<div style="background: #dcfce7; padding: 20px; border-radius: 10px;">
<strong>Today (First Composition):</strong>
<ul>
<li><strong>Rg (RAG)</strong> - Row 2, G3 (Orchestration)</li>
<li>Combines: Em + Vx + Pr + Lg</li>
<li>Gives AI "memory"</li>
</ul>
</div>

</div>

Note:
We're moving from primitives to compositions. RAG sits in row 2 (compositions), family 3 (orchestration) because it orchestrates embeddings, vector storage, prompts, and LLMs together.

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

---

## Why AI "Forgets"

<div style="text-align: left; font-size: 22px; line-height: 1.8;">

**LLMs are stateless:**
- Each conversation starts fresh
- No persistent memory between sessions
- Context window limits (8K, 32K, 128K tokens)

**Example:**
- Session 1: "My favorite color is blue"
- Session 2: "What's my favorite color?"
- AI: "I don't have that information"

</div>

<div style="background: #fef3c7; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>The AI doesn't "remember" - it only knows what's in the current prompt</strong>
</div>

Note:
This is fundamental to understanding why RAG matters. LLMs don't have memory. They process each request independently. Everything they "know" must be in the prompt.

---

## The RAG Solution

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

---

## RAG vs. Regular Prompting

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

---

## How RAG Works: The Technical View

<div style="text-align: left; font-size: 18px; line-height: 1.8; margin: 30px 0;">

**Step by step:**

1. **Ingestion** (one-time setup):
   - Convert documents to embeddings (Em)
   - Store embeddings in vector database (Vx)

2. **Query time** (every request):
   - User asks question
   - Convert question to embedding
   - Search vector database for similar embeddings
   - Retrieve top matching document chunks
   - Augment prompt with chunks
   - LLM generates response

</div>

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 18px;">
<strong>Elements involved:</strong> Em (embeddings) + Vx (vector DB) + Pr (prompts) + Lg (LLM) = Rg (RAG)
</div>

Note:
This is the full picture. You'll build this exact system by Week 8. Today, we're using Custom GPTs as "simple RAG" to understand the concept.

---

## Custom GPT: Simple RAG

**Custom GPTs are RAG training wheels**

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 40px 0;">

<div>
<h3 style="color: #7c3aed;">What Custom GPTs Do</h3>
<ul style="font-size: 18px;">
<li>You upload files (PDFs, docs, etc.)</li>
<li>OpenAI handles embeddings and vector storage</li>
<li>When you ask a question, it searches files</li>
<li>Includes relevant excerpts in prompt</li>
<li>Generates response based on your docs</li>
</ul>
</div>

<div>
<h3 style="color: #7c3aed;">Perfect For</h3>
<ul style="font-size: 18px;">
<li>Learning the RAG pattern</li>
<li>Personal knowledge bases</li>
<li>Quick prototypes</li>
<li>Non-sensitive information</li>
</ul>
</div>

</div>

Note:
Custom GPTs abstract away the complexity. You don't need to understand embeddings or vector databases yet. Just upload files and it works. Perfect for learning the concept.

---

## Custom GPT vs. Production RAG

<table style="width: 100%; font-size: 16px; border-collapse: collapse; margin: 30px 0;">
<thead>
<tr style="background: #f3f4f6;">
<th style="padding: 15px; text-align: left; border: 1px solid #e5e7eb;">Feature</th>
<th style="padding: 15px; text-align: left; border: 1px solid #e5e7eb;">Custom GPT</th>
<th style="padding: 15px; text-align: left; border: 1px solid #e5e7eb; background: #dcfce7;">Production RAG</th>
</tr>
</thead>
<tbody>
<tr>
<td style="padding: 15px; border: 1px solid #e5e7eb; font-weight: bold;">Setup Time</td>
<td style="padding: 15px; border: 1px solid #e5e7eb;">15 minutes</td>
<td style="padding: 15px; border: 1px solid #e5e7eb; background: #f0fdf4;">Hours to days</td>
</tr>
<tr>
<td style="padding: 15px; border: 1px solid #e5e7eb; font-weight: bold;">Data Control</td>
<td style="padding: 15px; border: 1px solid #e5e7eb;">Lives on OpenAI servers</td>
<td style="padding: 15px; border: 1px solid #e5e7eb; background: #f0fdf4;">Your servers</td>
</tr>
<tr>
<td style="padding: 15px; border: 1px solid #e5e7eb; font-weight: bold;">Updates</td>
<td style="padding: 15px; border: 1px solid #e5e7eb;">Manual re-upload</td>
<td style="padding: 15px; border: 1px solid #e5e7eb; background: #f0fdf4;">Auto-sync</td>
</tr>
<tr>
<td style="padding: 15px; border: 1px solid #e5e7eb; font-weight: bold;">Integration</td>
<td style="padding: 15px; border: 1px solid #e5e7eb;">None</td>
<td style="padding: 15px; border: 1px solid #e5e7eb; background: #f0fdf4;">CRM, ERP, databases</td>
</tr>
<tr>
<td style="padding: 15px; border: 1px solid #e5e7eb; font-weight: bold;">Security</td>
<td style="padding: 15px; border: 1px solid #e5e7eb;">Trust OpenAI</td>
<td style="padding: 15px; border: 1px solid #e5e7eb; background: #f0fdf4;">Your standards</td>
</tr>
<tr>
<td style="padding: 15px; border: 1px solid #e5e7eb; font-weight: bold;">Best For</td>
<td style="padding: 15px; border: 1px solid #e5e7eb;">Learning, personal use</td>
<td style="padding: 15px; border: 1px solid #e5e7eb; background: #f0fdf4;">Business systems</td>
</tr>
</tbody>
</table>

Note:
Custom GPTs are great for learning and personal use. Production RAG systems give you full control, real-time updates, system integration, and security. By Week 8, you'll build the production version.

---

## Live Demo: Build a Custom GPT

<div style="text-align: center; font-size: 28px; color: #7c3aed; margin: 40px 0;">
<p><strong>Let me show you how to build one in 15 minutes</strong></p>
</div>

**Scenario:** Create a GPT that helps with career/job search

**What we'll do:**
1. Navigate to Custom GPT creation
2. Configure instructions
3. Upload resume, portfolio, job descriptions
4. Test with questions
5. Show the difference vs. regular ChatGPT

Note:
LIVE DEMO TIME. Navigate to ChatGPT, create a GPT. Instructions: "You are a career advisor who helps me tailor job applications based on my resume and the specific roles I'm interested in." Upload resume, portfolio, sample job descriptions. Test: "What experience from my background should I highlight for a [specific role]?" Show how it cites specific experiences vs. generic advice.

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

## Hands-On: Build Your Own Custom GPT

**Next 40 minutes - you'll create a Custom GPT for personal use**

**Your task:**
1. Navigate to ChatGPT and create a new GPT
2. Configure it as a career/job search advisor
3. Upload your resume, portfolio, and job descriptions you're interested in
4. Write instructions (e.g., "Help me tailor applications")
5. Test it with specific questions
6. Verify it cites your documents

**Success looks like:** Your GPT answers questions using specific information from your uploaded files

Note:
This is individual work, but feel free to help each other with technical issues. The goal is to experience the RAG pattern firsthand. By the end, you should have a working tool you can actually use for job searching.

---

## Troubleshooting Tips

**If your Custom GPT isn't working:**

- **Not retrieving from files?**
  - Check file formats (PDF, DOCX, TXT work best)
  - Re-upload files
  - Make questions more specific to your content

- **Generic responses?**
  - Improve your instructions
  - Upload better documents
  - Ask questions that require specific knowledge

- **Can't access Custom GPT creation?**
  - Need ChatGPT Plus subscription
  - See instructor for backup access

Note:
These are the common issues. Most problems are either file format issues or instructions not being specific enough. I'll circulate to help troubleshoot.

---

## What Makes a Good Custom GPT?

**Three keys to success:**

1. **Clear Instructions**
   - Define the role explicitly
   - Specify the tone and style
   - Give examples of good responses

2. **Quality Documents**
   - Well-organized, accurate content
   - Specific rather than generic
   - Up-to-date information

3. **Good Questions**
   - Specific enough to trigger retrieval
   - Focused on information in your docs
   - Test edge cases

Note:
The quality of your Custom GPT depends on all three. Vague instructions + poor documents + generic questions = mediocre results. Specific instructions + quality docs + targeted questions = powerful tool.

---

## Testing Your Custom GPT

**Try these test questions:**

1. **Specific knowledge test:** "What experience from my background relates to [specific skill]?"
2. **Comparison test:** Ask the same question to regular ChatGPT - compare responses
3. **Citation test:** "Where in my resume does it mention [specific project]?"
4. **Application test:** "Draft a cover letter paragraph highlighting my [relevant experience] for [job title]"

<div style="margin-top: 30px; font-size: 20px; color: #7c3aed;">
Your GPT should cite specific details from YOUR documents
</div>

Note:
These test questions help you verify the GPT is actually using your files. If it gives generic answers, something's wrong. If it cites specific experiences, projects, or details from your documents, it's working.

---

## Share: What Did You Learn?

**Quick debrief (10 minutes)**

- What surprised you about building a Custom GPT?
- How did responses differ from regular ChatGPT?
- What would you use this for in real work?
- What challenges did you encounter?

Note:
Let's hear from 3-4 people. This helps everyone learn from each other's experiences.

---

## Business Applications

**How could you use Custom GPTs in a business context?**

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin: 30px 0; font-size: 18px;">

<div>
<strong>Sales & Customer Success:</strong>
<ul>
<li>RFQ response assistant</li>
<li>Product specification lookup</li>
<li>Customer history reference</li>
<li>Competitive positioning</li>
</ul>
</div>

<div>
<strong>Operations & HR:</strong>
<ul>
<li>Policy and procedure guide</li>
<li>Onboarding assistant</li>
<li>Training materials helper</li>
<li>Internal documentation search</li>
</ul>
</div>

</div>

<div style="background: #fee2e2; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 18px;">
<strong>⚠️ Caution:</strong> Don't upload sensitive, confidential, or proprietary information to Custom GPTs (data lives on OpenAI servers)
</div>

Note:
These are real use cases businesses are implementing right now. But remember the security limitation - Custom GPTs are for non-sensitive information only. That's why we'll build production RAG systems later.

---

## Next Week: Business Partners

**Session 4 (Thursday): Business Partner Discovery**

- Teams announced
- Meet your business partner (in-class or virtual)
- Conduct discovery interview
- Understand their content, audience, goals

**Why today's lesson matters:**
- You'll eventually build a RAG system for your business partner
- Custom GPT is the simple version
- Production RAG (Weeks 6-8) is what you'll deliver

Note:
Today was about understanding the concept. In a few weeks, you'll build the production version connected to your business partner's actual content and systems.

---

## Looking Ahead: The RAG Journey

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 25px; margin: 40px 0; font-size: 16px;">

<div style="background: #f3f4f6; padding: 20px; border-radius: 10px; opacity: 0.7;">
<strong>Week 2 (Today)</strong>
<p style="margin-top: 10px;">Custom GPT - Simple RAG</p>
</div>

<div style="background: #dbeafe; padding: 20px; border-radius: 10px;">
<strong>Week 6</strong>
<p style="margin-top: 10px;">Configure Qdrant, index business content</p>
</div>

<div style="background: #dcfce7; padding: 20px; border-radius: 10px;">
<strong>Week 8</strong>
<p style="margin-top: 10px;">Full RAG system connected to LibreChat via MCP</p>
</div>

</div>

<div style="text-align: center; font-size: 22px; color: #7c3aed; margin-top: 30px;">
You're building toward production-grade AI systems
</div>

Note:
This is the progression. Today is your introduction. By Week 8, you'll have built the real thing with vector databases, embeddings, and production integrations.

---

## Deliverables Due Before Next Session

**Individual:**
- ✅ Working Custom GPT for personal use (resume/career helper)
- ✅ Screenshots or be ready to demo
- ✅ Reflection: What did you learn about RAG?

**Preparation for Session 4:**
- Watch "Business Discovery Interview Techniques" (20 min)
- Read Playbook 00 (Topic Discovery) - preview sections
- Draft 5 questions to ask your business partner

Note:
Come ready to meet your business partner. This is where the rubber meets the road - you're about to start working on a real project.

---

## Key Concepts to Remember

<div style="text-align: left; font-size: 20px; line-height: 2; margin: 40px 0;">

1. **RAG = Retrieve → Augment → Generate**
2. **Rg (RAG) is a composition element** - combines Em, Vx, Pr, Lg
3. **Custom GPTs are simple RAG** - great for learning, not for production
4. **Quality of knowledge base = quality of responses**
5. **Generic AI is commodity; connected AI is differentiation**

</div>

Note:
These are the key takeaways. If you remember nothing else, remember that RAG gives AI access to specific knowledge, and that makes all the difference.

---

## Questions?

**Ask now or reach out:**

- Office hours: [Calendly link]
- Email: jesse@superwebpros.com
- Course materials: [Link to resources]

<div style="margin-top: 40px; font-size: 24px; color: #7c3aed;">
Next session: Meet your business partner!
</div>

Note:
Excited to see what you build. Next session is a big milestone - you're starting your real project with your real business partner.
