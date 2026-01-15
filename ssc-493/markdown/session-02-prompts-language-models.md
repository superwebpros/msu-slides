---
title: "Session 2: Prompts & Language Models"
course: "ssc-493"
week: 1
session: 2
date: "2026-01-15"
duration: 80
obsidian_vault_link: "/Users/jesseflores/vaults/courses/msu-ai-course/course-calendar.md#Week 1 Session 2"
published_slide_url: "https://msu-slides.superwebpros.com/ssc-493/session-02-prompts-language-models.html"
learning_objectives:
  - Explain how LLMs are trained and what makes models different
  - Compare outputs from 4+ different models using the same prompt
  - Apply basic prompting strategies across multiple models
  - Select appropriate models based on cost, quality, speed, and task requirements
---

<div style="text-align: center;">
<h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Session 2: Prompts & Language Models</h1>

<h2 style="font-size: 1.8rem; margin-bottom: 1rem;">SSC 493: AI Workflows & Organizational Intelligence</h2>

<p style="font-size: 1.2rem;">Spring 2026 • Michigan State University</p>
</div>

Note:
Welcome to Session 2. Today we're diving into the first two primitives from the AI Periodic Table: Pr (Prompts) and Lg (Language Models). By the end of today, you'll understand how different models behave differently and how to steer them effectively.

---

## Session Roadmap

**What we'll cover today (80 minutes):**

1. Get to know each other (10 min)
2. Warmup: Your current AI practices (5 min)
3. How models work & differ (20 min)
4. Hands-on: Multi-model prompting lab (40 min)
5. Wrap & preview (5 min)

Note:
Today's packed with hands-on work. We'll start by getting to know each other, then dive into understanding how models work, and spend most of our time experimenting with different prompting strategies across multiple models.

---

## Get to Know Each Other

**Let's go around the room - share briefly:**

1. Your name
2. Where you're from
3. Your major
4. What you'd like to do after graduating

<div style="margin-top: 40px; font-size: 18px; color: #6b7280;">
~2-3 minutes each • No pressure, just introduce yourself!
</div>

Note:
This is informal - just want to get a sense of who everyone is and where you're headed. We'll be working together all semester, so let's start building that rapport.

---

## Warmup: What Do You Already Know?

**Quick discussion:**

- What have you already learned or tried to "steer AI"?
- What are your current "best practices" for getting good results?
- Any techniques that work particularly well for you?

<div style="margin-top: 40px; font-size: 18px; color: #6b7280;">
Take 2 minutes to share - what's worked for you?
</div>

Note:
You've all used AI tools before. What have you figured out on your own? Some of you probably have techniques you swear by. Let's hear them. This activates your existing knowledge and helps me understand where you're starting from.

---

## Today's Focus: Pr + Lg

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 40px 0;">

<div style="background: #f0f9ff; padding: 30px; border-radius: 10px;">
<h3 style="color: #0284c7;">Pr: Prompts</h3>
<p style="font-size: 18px; line-height: 1.6;">
Row 1 (Primitives)<br><br>
<strong>Instructions you give to AI</strong><br><br>
How you steer model behavior through language
</p>
</div>

<div style="background: #ede9fe; padding: 30px; border-radius: 10px;">
<h3 style="color: #7c3aed;">Lg: Large Language Models</h3>
<p style="font-size: 18px; line-height: 1.6;">
Row 1 (Primitives)<br><br>
<strong>The models themselves</strong><br><br>
ChatGPT, Claude, Gemini, Llama, etc.
</p>
</div>

</div>

Note:
These are two of the three primitives from Row 1 of the AI Periodic Table. Everything else builds from these foundations. Master prompting and understand models, and you can work with any AI system.

---

## How LLMs Work: The Basics

**Three key concepts:**

<div style="font-size: 20px; line-height: 2; margin: 40px 0;">

1. **Tokens:** LLMs break text into ~750 words = 1,000 tokens
2. **Training:** Models learn patterns from massive datasets
3. **Prediction:** They predict the next token based on probability

</div>

<div style="margin-top: 40px; font-size: 22px; color: #7c3aed;">
LLMs don't "know" things - they predict likely continuations
</div>

Note:
This is fundamental. LLMs don't have a database of facts. They're statistical models that learned patterns from training data. When you prompt them, they're predicting what tokens are most likely to come next based on those patterns.

---

## What Makes Models Different?

**Three main factors:**

<div style="font-size: 20px; line-height: 2; margin: 40px 0;">

1. **Parameters:** Model size (20B vs 120B vs 1.8T)
   - More parameters ≠ always better (tradeoff with speed/cost)

2. **Training Data:** What the model learned from
   - Claude: Careful, nuanced, technical precision
   - GPT-4: Broad general knowledge
   - Gemini: Optimized for multimodal tasks

3. **Optimization Goals:** What they were tuned for
   - Speed vs quality vs cost vs safety

</div>

Note:
This is why the same prompt produces different outputs. Models have different architectures, training data, and optimization goals. Understanding these differences helps you pick the right model for the job.

---

## Model Selection: The Tradeoffs

<div style="font-size: 16px; margin: 20px 0;">

| Model | Cost | Quality | Speed | Best For |
|-------|------|---------|-------|----------|
| **GPT-4o** | $$$ | Excellent | Fast | Complex reasoning, creative tasks |
| **Claude Sonnet** | $$$ | Excellent | Fast | Technical precision, long context |
| **Gemini Flash** | $ | Good | Very Fast | High-volume, multimodal, cost-sensitive |
| **Groq/Llama** | $ | Good | Very Fast | Speed optimization, open source |

</div>

<div style="margin-top: 30px; font-size: 20px; color: #dc2626;">
<strong>No "best" model - only the right model for your task</strong>
</div>

Note:
This is critical for real projects. If you're generating 10,000 product descriptions, Gemini Flash might save you $500 vs GPT-4. If you need careful legal analysis, Claude Sonnet is worth the cost. You'll experiment with all four today.

---

## Token Pricing: Why It Matters

**Pricing comparison (per 1M tokens):**

<div style="font-size: 18px; line-height: 2; margin: 40px 0;">

- **GPT-4o Mini:** $0.15 input / $0.60 output
- **Claude Sonnet:** ~$3 input / $15 output
- **Gemini Flash:** $0.08 input / $0.30 output

</div>

<div style="margin-top: 30px; font-size: 20px; color: #15803d;">
<strong>Real scenario:</strong> Generate 1,000 blog posts (500 words each)<br>
GPT-4o: ~$400 • Claude: ~$1,000 • Gemini: ~$200
</div>

Note:
This is why understanding tokens and pricing matters. When you're building production systems for businesses, these costs add up fast. Choosing the right model for the task can save thousands of dollars.

---

## Prompting Strategies: The Toolkit

**Three fundamental techniques you'll test today:**

<div style="font-size: 20px; line-height: 2; margin: 40px 0;">

1. **Zero-Shot:** Just ask directly
   - "Write a product description for noise-cancelling headphones"

2. **Few-Shot:** Show examples of what you want
   - Give 2-3 examples, then ask for more

3. **Chain-of-Thought (CoT):** Ask model to think step-by-step
   - "Think through this step by step..."

</div>

Note:
These three techniques work across all models. Zero-shot is fastest but least controlled. Few-shot guides the model with examples. Chain-of-thought makes the model show its reasoning, which often improves accuracy for complex tasks.

---

## Live Demo: Same Prompt, Four Models

**Let's see the differences in action**

<div style="margin: 40px 0; padding: 30px; background: #f9fafb; border-radius: 10px;">

<strong>Test Prompt:</strong><br>
<em>"Write a product description for noise-cancelling headphones aimed at remote workers."</em>

<div style="margin-top: 30px; font-size: 18px;">
We'll run this across:<br>
• GPT-4o<br>
• Claude Sonnet<br>
• Gemini Flash<br>
• Groq/Llama
</div>

</div>

Note:
Watch for these differences: length and detail, tone and style, speed of response, and whether they add features not mentioned in the prompt. This is what you'll explore in depth during the hands-on session.

---

## Hands-On: Multi-Model Prompting Lab

**Next 40 minutes - you'll experiment with:**

<div style="font-size: 18px; line-height: 1.8; margin: 30px 0;">

✅ LibreChat interface across 4+ models<br>
✅ Interactive workbook with 6-8 exercises<br>
✅ Testing zero-shot, few-shot, and chain-of-thought prompting<br>
✅ Comparing outputs across models<br>
✅ Submitting your observations

</div>

<div style="margin-top: 40px; font-size: 22px; color: #7c3aed;">
<strong>Goal:</strong> Develop intuition for model selection and prompting strategies
</div>

Note:
This is individual work. You'll get hands-on with LibreChat and complete structured exercises adapted from Anthropic's prompt engineering tutorial. The workbook will guide you through specific prompting challenges across multiple models.

---

## Workbook Structure

**You'll complete 6-8 exercises testing different strategies:**

<div style="font-size: 16px; line-height: 1.6; margin: 30px 0;">

1. **Being Clear and Direct** - Get models to skip preamble
2. **Output Control** - Strict formatting constraints
3. **Zero-Shot Classification** - Categorize customer emails
4. **Few-Shot Learning** - Same task with examples
5. **Chain-of-Thought** - Complex reasoning tasks
6. **Temperature Experiment** - Creativity vs accuracy

</div>

<div style="margin-top: 30px; font-size: 18px; color: #6b7280;">
Minimum 4 exercises required • Submit via form before next session
</div>

Note:
Each exercise is designed to teach you something specific about prompting. You'll test the same prompts across multiple models and observe differences. This builds your intuition for when to use which model and which technique.

---

## Getting Started: LibreChat Setup

**Steps to begin:**

<div style="font-size: 20px; line-height: 2; margin: 40px 0;">

1. Open LibreChat (credentials from Session 1)
2. Verify you can access all 4 models
3. Get the interactive workbook (distributed now)
4. Start with Exercise 1

</div>

<div style="margin-top: 40px; font-size: 18px; background: #fef3c7; padding: 20px; border-radius: 10px;">
<strong>If you have tech issues:</strong> Raise your hand immediately - we'll troubleshoot
</div>

Note:
I'll be circulating to help with any technical issues and answer questions. Try to complete at least 4 exercises during class time. If you don't finish all 6-8, complete them before next session.

---

## Work Time: 40 Minutes

<div style="text-align: center; margin: 80px 0;">
<h2 style="font-size: 3rem; color: #7c3aed;">🚀 Get started!</h2>

<p style="font-size: 24px; margin-top: 40px; color: #6b7280;">
Experiment • Compare • Observe • Learn
</p>
</div>

Note:
I'll give you a 10-minute warning before we wrap up. Focus on learning, not just completing exercises. Pay attention to what works and what doesn't. These insights will serve you throughout the course.

---

## Debrief: What Did You Notice?

**Quick discussion - share your observations:**

- Which model surprised you the most?
- Which prompting strategy worked best?
- Any unexpected results?
- What would you use each model for?

Note:
Let's hear what you discovered. This is where individual observations become collective learning. What patterns emerged?

---

## Key Takeaways

<div style="font-size: 20px; line-height: 2; margin: 40px 0;">

✅ **Different models = different strengths** (cost, quality, speed, task fit)

✅ **Same prompt → different outputs** (model selection matters!)

✅ **Prompting strategies work across all models:**
   - Be clear and direct
   - Show examples (few-shot)
   - Ask models to think step-by-step (CoT)

✅ **Pr (Prompts) + Lg (LLMs) = foundation for everything else**

</div>

Note:
These are the core lessons from today. You now understand that model selection is a strategic decision based on requirements. And you have three fundamental prompting techniques you can apply anywhere.

---

## Preview: Session 3 - RAG & Custom GPTs

**Thursday we'll cover:**

<div style="font-size: 20px; line-height: 2; margin: 40px 0;">

📚 **Rg (RAG)** - Retrieval Augmented Generation<br>
🧠 How to give AI "memory" with your documents<br>
🛠️ Hands-on: Build a Custom GPT with your resume

</div>

<div style="margin-top: 40px; font-size: 22px; color: #15803d;">
Today: steering models • Next: giving them memory
</div>

Note:
Today you learned to steer models with prompts. But they don't remember things between conversations. Next session introduces RAG - how to upload your own documents and give AI access to specific knowledge. You'll build something immediately useful.

---

## Deliverable: Complete Workbook

**Due before Session 3:**

<div style="font-size: 20px; line-height: 2; margin: 40px 0;">

✅ Complete at least 4 of 6-8 workbook exercises<br>
✅ Test prompts across multiple models<br>
✅ Submit observations via form [link provided]

</div>

<div style="margin-top: 40px; font-size: 18px; background: #dbeafe; padding: 20px; border-radius: 10px;">
<strong>What we're looking for:</strong> Thoughtful analysis of model differences and prompting strategies - not just "this one is better"
</div>

Note:
Focus on why models behave differently, not just which one you prefer. Evidence of testing multiple strategies. Clear reasoning about tradeoffs. This is your first individual deliverable.

---

## Questions?

<div style="text-align: center; margin: 80px 0;">
<h2 style="font-size: 2.5rem; color: #7c3aed;">See you Thursday!</h2>

<p style="font-size: 20px; margin-top: 40px;">
Office hours: See syllabus<br>
Email: jesse@superwebpros.com
</p>
</div>

Note:
Great work today. You now have hands-on experience with multiple models and prompting strategies. Complete the workbook exercises and we'll dive into RAG next session.
