## What are Your LLM Best Practices?

<div style="display: grid; grid-template-columns: 1fr 360px; gap: 30px; align-items: center; max-width: 1000px; margin: 40px auto;">
<div>
<h3>Question for reflection:</h3>
<p style="font-size: 22px; line-height: 1.8;">
<strong>"What are your top prompting 'hacks'?"</strong>
</p>
<p style="margin-top: 30px; font-size: 18px; color: #6b7280;">
Scan the QR code or visit:<br>
<strong>slido.com #4027 289</strong>
</p>
</div>
<div style="text-align: center;">
<img src="assets/slido-1.png" alt="Slido QR Code" style="width: 320px; height: 320px;">
</div>
</div>

Note:
As you come in and get settled, take a moment to reflect on your own experiences. What techniques have you discovered on your own? This activates your existing knowledge and helps me understand where you're starting from.

---

## Housekeeping & Last Class Follow-Up

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px auto; max-width: 950px; text-align: left;">

<div style="background: #f8fafc; border-left: 4px solid #7c3aed; padding: 20px 24px; border-radius: 8px;">
<h4 style="color: #7c3aed; margin-top: 0;">Sent in Discord:</h4>
<ul style="font-size: 18px; line-height: 1.8;">
<li>Full lecture slides link</li>
<li>Session overview & key takeaways</li>
<li>Class recording link</li>
<li>Searchable session transcript</li>
</ul>
</div>

<div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 20px 24px; border-radius: 8px;">
<h4 style="color: #2563eb; margin-top: 0;">Also in D2L:</h4>
<ul style="font-size: 18px; line-height: 1.8;">
<li>All session assets & links mirrored in D2L</li>
<li>Required readings & enrichment resources</li>
<li>Weekly reflections dropbox</li>
</ul>
</div>

</div>

Note:
A quick housekeeping note from Tuesday: everything we covered is documented and sent in Discord—including slide decks, session recordings, and full transcripts. If you prefer D2L, all materials and assignment dropboxes are mirrored there as well.

---

## Session Roadmap

**What we'll cover today:**

<div style="font-size: 21px; line-height: 2; margin: 30px 0;">

1. How models work & differ — <span style="color: #6b7280;">25 min</span><br>
2. Hands-on: Multi-model prompting lab — <span style="color: #7c3aed;"><strong>50 min</strong></span><br>
3. Wrap & preview — <span style="color: #6b7280;">5 min</span>

</div>

Note:
We did introductions on Tuesday, so today we get straight to work. Short lecture up front, then a full fifty minutes in the lab. I want you to have time to actually read what the models give you back - that's where the learning is. Last cohort rushed and it cost them.

---

## Today's Focus: Pr + Lg, Sm, Th

<div style="font-size: 14px; margin: 20px auto; max-width: 900px;">

|                  | Reactive                                                                                                             | Retrieval      | Orchestration | Validation       | Models                                                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- | -------------- | ------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Primitives**   | <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 4px; display: inline-block;">Prompts (Pr)</span> | Embeddings     |               |                  | <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 4px; display: inline-block;">LLMs (Lg)</span>            |
| **Compositions** | Function Calling                                                                                                     | Vector DBs     | RAG           | Guardrails       | Multi-modal                                                                                                                  |
| **Deployment**   | Agents                                                                                                               | Fine-tuning    | Frameworks    | Red-teaming      | <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 4px; display: inline-block;">Small Models (Sm)</span>    |
| **Emerging**     | Multi-agent                                                                                                          | Synthetic Data |               | Interpretability | <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 4px; display: inline-block;">Thinking Models (Th)</span> |

</div>

<div style="margin-top: 30px; font-size: 20px; color: #7c3aed; text-align: center;">
Today we focus on the <strong>Models family</strong> plus how to steer them with <strong>Prompts</strong>
</div>

Note:
These are elements from the AI Periodic Table. Highlighted in gray are what we'll cover today: Prompts (Row 1), and three types of models - Large Language Models (Row 1), Small Models (Row 3), and Thinking Models (Row 4). Everything else builds from these foundations.

---

## How LLMs Work: The Training Pipeline

<div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin: 35px auto; max-width: 1000px; flex-wrap: wrap;">

<div style="background: #ede9fe; border: 2px solid #7c3aed; border-radius: 8px; padding: 14px 18px; text-align: center; min-width: 140px;">
<strong style="color: #5b21b6; font-size: 16px;">1. Data Collection</strong><br>
<span style="font-size: 13px; color: #4c1d95;">Web, Books, Code</span>
</div>

<div style="font-size: 24px; color: #7c3aed; font-weight: bold;">➔</div>

<div style="background: #ede9fe; border: 2px solid #7c3aed; border-radius: 8px; padding: 14px 18px; text-align: center; min-width: 140px;">
<strong style="color: #5b21b6; font-size: 16px;">2. Pre-training</strong><br>
<span style="font-size: 13px; color: #4c1d95;">Next-Token Guessing</span>
</div>

<div style="font-size: 24px; color: #7c3aed; font-weight: bold;">➔</div>

<div style="background: #ede9fe; border: 2px solid #7c3aed; border-radius: 8px; padding: 14px 18px; text-align: center; min-width: 140px;">
<strong style="color: #5b21b6; font-size: 16px;">3. Fine-tuning</strong><br>
<span style="font-size: 13px; color: #4c1d95;">Instructions & QA</span>
</div>

<div style="font-size: 24px; color: #7c3aed; font-weight: bold;">➔</div>

<div style="background: #ede9fe; border: 2px solid #7c3aed; border-radius: 8px; padding: 14px 18px; text-align: center; min-width: 140px;">
<strong style="color: #5b21b6; font-size: 16px;">4. Alignment (RLHF)</strong><br>
<span style="font-size: 13px; color: #4c1d95;">Human Feedback</span>
</div>

<div style="font-size: 24px; color: #7c3aed; font-weight: bold;">➔</div>

<div style="background: #f3f4f6; border: 2px solid #6b7280; border-radius: 8px; padding: 14px 18px; text-align: center; min-width: 140px;">
<strong style="color: #374151; font-size: 16px;">5. Deployment</strong><br>
<span style="font-size: 13px; color: #4b5563;">Safety & Eval</span>
</div>

</div>

;;;

**High-level LLM Training Process:**

1. **Data Collection:** Gather massive amounts of text data from the internet, books, code repositories, research papers, etc., then clean and filter it.

2. **Pre-training:** Train the base model to predict the next word/token across trillions of words. The model learns grammar, world facts, and reasoning patterns.

;;;

### Deep Dive: What is Pre-Training?

<div style="font-size: 20px; line-height: 1.8; max-width: 950px; margin: 30px auto; text-align: left;">

Think of pre-training as **predicting the redacted word across civilization's library**:

- The model isn't memorizing answers in a database; it is learning a massive **map of associations**.
- To accurately guess the blank in:  
  <div style="background: #f1f5f9; padding: 12px 18px; border-radius: 6px; font-family: monospace; margin: 12px 0;">
  "The Supreme Court ruled that the statute was [____] under the Fourteenth Amendment."
  </div>
- The model *must* learn American legal history, constitutional grammar, judicial tone, and political science.

</div>

<div style="background: #ede9fe; padding: 16px 20px; border-radius: 8px; margin-top: 20px; font-size: 18px; color: #5b21b6;">
<strong>Takeaway for Social Science:</strong> Pre-training builds a dense web of human associations. How you prompt is how you navigate that web.
</div>

Note:
Pre-training is by far the most expensive part of building an LLM. It takes months and tens of millions of dollars on thousands of GPUs. The model plays a relentless game of "fill in the blank" across billions of web pages. Because it has to predict text accurately across every field—from clinical medicine to Michigan politics—it develops an internal representation of language, reasoning, and domain relationships.

;;;

3. **Fine-tuning (Instruction Tuning):** Further train the base model on curated question-and-answer pairs so it learns to follow instructions rather than just continuing raw text.

4. **Alignment (RLHF - Reinforcement Learning from Human Feedback):** Human evaluators rank model responses, teaching it to be helpful, harmless, and honest—reinforcing desired behavior and suppressing harmful output.

;;;

5. **Evaluation & Deployment:** Test the model on standard benchmarks, safety red-teaming, and bias evaluations before releasing it behind APIs and chat interfaces.

---

## Live Demo: Same Prompt, Different Models

<div style="max-width: 900px; margin: 30px auto; font-size: 21px; line-height: 1.8;">

Let's do a quick live test in LibreChat before we look under the hood:

<div style="background: #f5f3ff; border: 2px solid #7c3aed; padding: 20px; border-radius: 10px; margin: 25px 0;">
<strong>Prompt:</strong> "Analyze why Michigan's manufacturing economy shifted toward automotive automation in the 1980s."
</div>

Comparing:
- **Claude Opus 5** (Frontier: large, deep, high reasoning)
- **Claude Haiku 4.5** (Fast: small, instant, cheap)

</div>

<div style="font-size: 18px; color: #7c3aed; text-align: center;">
Both models come from the same company (Anthropic) — notice how training scale and parameter size change the depth of response.
</div>

Note:
Watch the difference in how they respond. Haiku answers almost instantly with solid bullet points. Opus takes longer, writes with richer historical texture, and synthesizes economic policy with technological change. They're built by the same engineering team, but sized and trained for very different operational tradeoffs.

---

## How LLMs Work: Tokens

- Tokens are the basic units of text that LLMs process, similar to how words work in human language.
- A token can be a whole word, part of a word, or even a single character
- LLMs read input and generate output by processing sequences of these tokens

;;;

### For Example

- Tokenization -> "Token" + "ization"
- Understanding -> "under" + "standing"
- Hello World! -> "hello" + "world" + "!"

;;;

### Tokens Not Standardized

- Different providers use different tokenization algorithms like BPE (Byte Pair Encoding), WordPiece, or SentencePiece.
- The choice depends on factors like the languages they want to support, desired vocabulary size (typically 30K-100K tokens), computational efficiency, and how well it handles rare words or multiple languages.

Note:
**BPE (Byte Pair Encoding):** Iteratively merges the most frequently occurring pairs of characters or tokens in the training data to build up a vocabulary from individual characters to common subwords.
**WordPiece:** Similar to BPE but chooses merges based on which pair maximizes the likelihood of the training data, rather than just raw frequency.
**SentencePiece:** Treats text as raw Unicode characters (no pre-tokenization needed) and applies algorithms like BPE or unigram, making it language-agnostic and able to handle spaces as regular characters.

;;;

### Why This Matters

You're billed per token, not per word

Note:
This is how LLMs actually see text. They don't see whole words - they break everything into subword pieces called tokens. Common prefixes, suffixes, and roots get their own tokens. This lets models understand new words they've never seen by recognizing familiar pieces.

---

## What Happens When You "Talk" to an LLM

<div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin: 30px auto; max-width: 1000px; flex-wrap: wrap;">

<div style="background: #f3f4f6; border-radius: 8px; padding: 12px 14px; text-align: center;">
<strong style="font-size: 15px;">1. Tokenize</strong><br><span style="font-size: 12px; color: #6b7280;">Text ➔ Token IDs</span>
</div>
<div style="color: #7c3aed; font-weight: bold;">➔</div>

<div style="background: #f3f4f6; border-radius: 8px; padding: 12px 14px; text-align: center;">
<strong style="font-size: 15px;">2. Embed</strong><br><span style="font-size: 12px; color: #6b7280;">IDs ➔ Vectors</span>
</div>
<div style="color: #7c3aed; font-weight: bold;">➔</div>

<div style="background: #ede9fe; border: 2px solid #7c3aed; border-radius: 8px; padding: 12px 14px; text-align: center;">
<strong style="font-size: 15px; color: #5b21b6;">3. Attention</strong><br><span style="font-size: 12px; color: #5b21b6;">Context & Weight</span>
</div>
<div style="color: #7c3aed; font-weight: bold;">➔</div>

<div style="background: #f3f4f6; border-radius: 8px; padding: 12px 14px; text-align: center;">
<strong style="font-size: 15px;">4. Predict</strong><br><span style="font-size: 12px; color: #6b7280;">Probability Dist.</span>
</div>
<div style="color: #7c3aed; font-weight: bold;">➔</div>

<div style="background: #f3f4f6; border-radius: 8px; padding: 12px 14px; text-align: center;">
<strong style="font-size: 15px;">5. Select & Repeat</strong><br><span style="font-size: 12px; color: #6b7280;">Next Token Chosen</span>
</div>

</div>

<p style="font-size: 20px; color: #6b7280; text-align: center; margin-top: 20px;">
Let's follow one sentence step-by-step ⬇
</p>

;;;

### Step 1: Tokenization & Embedding

<div style="font-size: 20px; line-height: 1.8; max-width: 900px; margin: 20px auto; text-align: left;">

Our input sentence:
<div style="background: #f1f5f9; padding: 12px 20px; border-radius: 8px; font-family: monospace; font-size: 22px; color: #0f172a; margin: 15px 0;">
"The capital of France is"
</div>

1. **Tokens:** Split into vocabulary units:
   <div style="display: flex; gap: 8px; margin: 10px 0;">
   <span style="background: #e2e8f0; padding: 4px 10px; border-radius: 4px; font-family: monospace;">The</span>
   <span style="background: #e2e8f0; padding: 4px 10px; border-radius: 4px; font-family: monospace;">capital</span>
   <span style="background: #e2e8f0; padding: 4px 10px; border-radius: 4px; font-family: monospace;">of</span>
   <span style="background: #e2e8f0; padding: 4px 10px; border-radius: 4px; font-family: monospace;">France</span>
   <span style="background: #e2e8f0; padding: 4px 10px; border-radius: 4px; font-family: monospace;">is</span>
   </div>

2. **Embedding:** Each token maps to a high-dimensional vector (coordinates representing semantic meaning).

</div>

;;;

### Step 2: Attention in Transformer Layers

<div style="font-size: 20px; line-height: 1.8; max-width: 900px; margin: 20px auto; text-align: left;">

The model doesn't process tokens in isolation:

- **Self-Attention:** Every token looks at every other token to establish meaning in context.
- When processing **"is"**, attention heads link back strongly to **"capital"** and **"France"**.
- This tells the model: *"We are not discussing French cuisine or vacation spots; we are answering a geographical entity query."*

</div>

;;;

### Step 3 & 4: Prediction & Generation Loop

<div style="font-size: 19px; line-height: 1.7; max-width: 900px; margin: 20px auto; text-align: left;">

The final layer produces a probability distribution over the entire vocabulary:

<div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px 20px; border-radius: 8px; margin: 15px 0; font-family: monospace;">
• " Paris"  ─── 94.2%  ████████████████████ (Selected)<br>
• " a"      ───  2.4%  █<br>
• " located"───  1.1%  ▌<br>
• " one"    ───  0.6%  ▎<br>
• " Lyon"   ───  0.2%  ▏
</div>

**The Loop:**  
`" Paris"` is appended to the input: `"The capital of France is Paris"`.  
The entire updated string goes through the model again to predict the next token (period, explanation, etc.) until a stop condition is reached.

</div>

---

## Context, Context Windows & Tokens

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px auto; max-width: 950px; text-align: left;">

<div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 22px; border-radius: 8px;">
<h4 style="color: #15803d; margin-top: 0;">Context Window = Working Memory</h4>
<ul style="font-size: 17px; line-height: 1.7;">
<li>The total token limit for prompt + history + output in one session.</li>
<li>Modern windows range from 128K to 1M+ tokens (entire books!).</li>
<li>Larger windows allow models to find nuanced associations across vast documents without forgetting instructions.</li>
</ul>
</div>

<div style="background: #fdf4ff; border-left: 4px solid #a855f7; padding: 22px; border-radius: 8px;">
<h4 style="color: #7e22ce; margin-top: 0;">Thinking Models & Reasoning Tokens</h4>
<ul style="font-size: 17px; line-height: 1.7;">
<li>Traditional models output words immediately.</li>
<li>Reasoning models (Claude thinking, o1/o3) generate hidden <strong>thinking tokens</strong> before answering.</li>
<li>They explore paths, verify logic, and self-correct.</li>
<li><strong>Cost:</strong> More tokens consumed and higher latency for substantially higher analytical accuracy.</li>
</ul>
</div>

</div>

Note:
Context window is the model's active working memory. When you have a long chat or upload large PDFs, you are filling that window. And with reasoning models, notice that they generate tokens you might not even see directly—hidden thinking tokens that plan out the answer before the final text appears. They spend more token budget to deliver higher reliability.

---

## Different Models Have Different "Sizes"

Some models are 'small' and some models are 'large'

;;;

## Size & Parameters

- **Parameters** - The numerical values (numbers) in the neural network that are learned during training. They determine how the model processes information and what patterns it recognizes.

- **Size** - Refers to the total count of these parameters (e.g., 70B = 70 billion parameters). More parameters = larger model file, more memory needed, slower inference.

Note:
Weights represent the learned transformations and relationships in the network, not specific tokens or concepts.
They're the numbers that define:

- How to convert token IDs into embeddings (embedding layer weights)
- How tokens should pay attention to each other (attention weights)
- How to transform information between layers (feedforward weights)
- What patterns, grammar rules, facts, and reasoning steps to apply
  They don't directly "mean" anything human-readable—they're just mathematical values that, when combined through billions of calculations, produce intelligent behavior. The model learned these specific numbers by adjusting them during training to minimize prediction errors.

;;;

## Why this Matters

- Larger open-weight models (e.g. **GPT-OSS-120B**) are generally more capable but require expensive GPUs, cost more to run, and respond slower.
- Smaller open-weight models (e.g. **GPT-OSS-20B**) are faster, cheaper, and can run on consumer hardware but are less capable.

;;;

## A Caveat You Need to Carry

**Nobody publishes parameter counts for the frontier models anymore.**

Anthropic, OpenAI, and Google do not disclose how big Claude, GPT, or Gemini are.

<div style="margin-top: 30px; font-size: 20px; color: #7c3aed;">
So use <strong>price and latency</strong> as your observable proxies for "size."<br>
A model that costs 25x more per output token is telling you something.
</div>

Note:
This is important and it trips people up. You'll read "GPT is a trillion parameters" on the internet - that's a rumor, not a spec sheet. The only models with published parameter counts are the open-weight ones you can download, like the GPT-OSS family. For everything else, the price sheet is the closest thing you get to a size chart. Expensive and slow usually means big. Cheap and fast usually means small or heavily distilled.

;;;

## In General

- You'd use a massive model for complex reasoning tasks, but a smaller model works fine for simple tasks like classification or when you need real-time responses.
- It's about balancing performance, cost, and speed.

---

## Model Categories: Size vs Capability

<div style="font-size: 17px; line-height: 1.6; margin: 20px 0;">

| Category       | What it means                 | Examples (Aug 2026)                             | Strengths                     | Weaknesses                 |
| -------------- | ----------------------------- | ----------------------------------------------- | ----------------------------- | -------------------------- |
| **Frontier**   | Top of a lab's lineup         | Claude Opus 5, GPT-5.6                          | Best reasoning, complex tasks | Expensive, slower          |
| **Balanced**   | The everyday workhorse        | Claude Sonnet 5, GPT-5.4                        | Good quality, reasonable cost | Not best at everything     |
| **Fast/Small** | Cheap enough to run at volume | Claude Haiku 4.5, Gemini 3.7 Flash, GPT-OSS-20B | Very fast, very cheap         | Less capable on hard tasks |
| **Thinking**   | Reasons before it answers     | Claude Fable 5, GPT-5.4 Pro                     | Extended reasoning            | Very expensive, very slow  |

</div>

<div style="margin-top: 30px; font-size: 19px; color: #7c3aed;">
<strong>Key insight:</strong> You can't just use the biggest model for everything - cost & speed matter
</div>

Note:
This framework helps you categorize models, and the framework outlives any specific name in that Examples column. Frontier models are the most capable but expensive. Balanced models hit a sweet spot for most tasks. Fast models are great for high-volume simple tasks. Thinking models spend extra compute reasoning before they answer - on some of these, like Fable 5, the thinking is always on and you can't turn it off. Note how fast that Examples column ages: every model in it is newer than this course's first offering, eight months ago. Learn the categories, not the names.

;;;

## Model Pricing: August 2026

<div style="font-size: 14px; margin: 20px 0;">

| Provider      | Model            | Category | Input (per 1M) | Output (per 1M) | Use Case                            |
| ------------- | ---------------- | -------- | -------------- | --------------- | ----------------------------------- |
| **OpenAI**    | GPT-5.4 Pro      | Thinking | $30.00         | $180.00         | Deep research, hardest problems     |
| **Anthropic** | Claude Fable 5   | Thinking | $10.00         | $50.00          | Long-horizon reasoning              |
| **Anthropic** | Claude Opus 5    | Frontier | $5.00          | $25.00          | Technical precision, long documents |
| **OpenAI**    | GPT-5.6          | Frontier | $4.00          | $20.00          | Complex reasoning, creative writing |
| **OpenAI**    | GPT-5.4          | Balanced | $2.50          | $15.00          | General purpose                     |
| **Anthropic** | Claude Sonnet 5  | Balanced | $2.00          | $10.00          | Best quality/cost balance           |
| **Anthropic** | Claude Haiku 4.5 | Fast     | $1.00          | $5.00           | High-volume, speed-critical         |
| **Google**    | Gemini 3.7 Flash | Fast     | $0.75          | $3.75           | High volume, multimodal             |
| **Groq**      | GPT-OSS-120B     | Fast     | $0.15          | $0.60           | Fast inference, open weights        |

</div>

<div style="margin-top: 20px; font-size: 18px; color: #6b7280;">
<strong>Note:</strong> Published list prices as of Aug 31, 2026. Batch processing offers 50% discounts on most providers. <em>Check the price sheet yourself before you quote a number - this table will be wrong by Thanksgiving.</em>
</div>

Note:
This is real current pricing, pulled the week before class. Look at the spread: GPT-5.4 Pro costs three hundred times what GPT-OSS-120B costs per output token. Three hundred. But Pro is worth it when you need maximum quality on a hard problem. For your semester projects you'll learn to mix models - frontier for the critical content, fast models for bulk operations. Batch processing cuts costs in half if you're not in a rush. And notice the date on this slide: last spring's version of this deck said January 2026 and every single row on it is now obsolete. Pricing and model lineups turn over about every quarter. Get in the habit of checking.

---

## Prompting: The Other Half of the Equation

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 40px 0;">

<div style="background: #fef3c7; padding: 30px; border-radius: 10px;">
<h3 style="color: #92400e;">The Model</h3>
<ul style="font-size: 17px; line-height: 1.8;">
<li>Parameters & training data</li>
<li>Speed & cost characteristics</li>
<li>Baseline capabilities</li>
</ul>
<p style="margin-top: 20px; color: #92400e;"><strong>What the model brings</strong></p>
</div>

<div style="background: #dbeafe; padding: 30px; border-radius: 10px;">
<h3 style="color: #1e3a8a;">The User</h3>
<ul style="font-size: 17px; line-height: 1.8;">
<li>Prompt engineering skills</li>
<li>Domain knowledge</li>
<li>Ability to iterate & refine</li>
</ul>
<p style="margin-top: 20px; color: #1e3a8a;"><strong>What you bring</strong></p>
</div>

</div>

<div style="text-align: center; font-size: 22px; color: #7c3aed; margin-top: 20px;">
<strong>Both matter!</strong> A great prompt on a weak model beats a bad prompt on a strong model
</div>

Note:
This is crucial to understand. The model is only half the equation. Your skill as a prompter - how you frame the task, provide context, show examples - is equally important. You can get amazing results out of Haiku with expert prompting, and terrible results out of Opus 5 with lazy prompting. Today's lab teaches you the prompting half.

---

## Prompt Engineering Principles

1. Be clear and direct
2. Use examples
3. Invite participation
4. Use Chains of Thought (CoT)
5. Separate instruction from Data
6. Use roles
7. Tweak parameters

Note:
These seven work across every model - they're not tricks for one product. We'll practice six of them in the lab in a few minutes; the seventh, tweaking parameters, is your take-home. Two to flag now: chain-of-thought makes the model show its reasoning, which usually improves accuracy on anything with constraints in it. And inviting participation - asking the model to interview you - is the one most people never try and the one that changes output the most.

---

## Prompting as "Steering" the Model

<div style="max-width: 920px; margin: 30px auto; font-size: 21px; line-height: 1.8; text-align: left;">

Think of an LLM as a **vast landscape of probable completions**:

- Left to itself with a vague prompt ("write about marketing"), the model wanders into the **statistical average**—generic, safe, bland text.
- **Your prompt acts like a rudder or steering wheel:**
  - **Persona / Role:** Steers toward an expert mindset (e.g., *"You are a senior fitness studio marketing director"*).
  - **Constraints:** Steers away from fluff and sets strict boundaries (e.g., *"Under $2,000/mo, self-implemented only"*).
  - **Examples (Few-shot):** Steers tone and structure directly into the target zone.

</div>

<div style="background: #ede9fe; padding: 18px 24px; border-radius: 8px; margin-top: 25px; font-size: 19px; color: #5b21b6; text-align: center;">
Prompting isn't about polite manners or magic keywords — it's about <strong>steering the probability distribution into the exact token space you want</strong>.
</div>

Note:
This is why prompt engineering works. The model contains many possible perspectives. A vague prompt gets an average answer because that's the center of the probability distribution. When you provide clear constraints, examples, and roles, you steer the model away from the generic center into the specific, high-capability corner of its training data.

---

## Accessing Course LibreChat

<div style="display: grid; grid-template-columns: 1fr 300px; gap: 30px; align-items: center; max-width: 950px; margin: 40px auto;">
<div style="text-align: left;">
<h3 style="margin-top: 0; color: #7c3aed;">Log in for today's lab:</h3>
<p style="font-size: 22px; margin: 15px 0;">
<a href="https://msu-ai.superwebpros.com/" target="_blank"><strong>https://msu-ai.superwebpros.com</strong></a>
</p>
<p style="font-size: 18px; color: #4b5563; line-height: 1.6;">
LibreChat is our multi-model testbed. Today we'll use its <strong>comparison mode</strong> to test prompts across different model tiers side-by-side in real time.
</p>
</div>
<div style="text-align: center;">
<img src="assets/librechat-qr.png" alt="LibreChat QR Code" style="width: 260px; height: 260px;">
</div>
</div>

Note:
For today's lab, LibreChat is our primary tool because it lets us fan out a single prompt to multiple models at the same time and compare their outputs side by side. Log in now with your course credentials.

---

## Hands-On: Multi-Model Prompting Lab

**Now it's time to experiment — 50 minutes:**

<div style="margin-top: 40px; font-size: 22px; color: #7c3aed;">
<strong>Goal:</strong> Develop intuition for model selection and prompting strategies
</div>

<div style="margin-top: 30px; font-size: 19px; color: #15803d;">
<strong>Read the outputs.</strong> Actually read them. That's the assignment.
</div>

Note:
This is individual work in LibreChat, structured exercises adapted from Anthropic's prompt engineering tutorial. One thing I want to say up front: do not race. The cohort that took this last spring got the most out of it when they slowed down and actually read what came back. If you finish an exercise early, go deeper on it rather than jumping ahead.

;;;

## Three Models. One Per Category.

<div style="font-size: 19px; margin: 30px auto; max-width: 880px;">

| Category     | Model            | Why it's here                                             |
| ------------ | ---------------- | --------------------------------------------------------- |
| **Frontier** | Claude Opus 5    | Ceiling of what's possible right now                      |
| **Balanced** | GPT-5.4          | Different lab, mid-tier — isolates _provider_ from _tier_ |
| **Fast**     | Claude Haiku 4.5 | Cheap and quick — is it good enough?                      |

</div>

<div style="margin-top: 24px; font-size: 18px; color: #6b7280;">
<strong>Finished early?</strong> Add <strong>Claude Sonnet 5</strong> — it completes the Anthropic ladder (Opus → Sonnet → Haiku) so you can see tier effects with the provider held constant.
</div>

<div style="margin-top: 20px; font-size: 17px; color: #92400e;">
If a name in the dropdown doesn't match exactly, pick the nearest model in that category and note which one you used.
</div>

Note:
Three models, not six. Last cohort tried six and it was too many - people were still reading model four when we needed to move on. Three is enough to see the pattern. The comparison you care about is across the categories, not between two specific product names. And write down which models you actually used, because your reflection needs to name them.

;;;

## Example Case Study

You are a marketing consultant who just signed a local Pilates studio as a client. Our goal is to help them generate a plan to scale their business.

;;;

## Exercise 1: Zero-Shot Baseline

> Principle: Be clear and direct

What to observe:

- Which model is fastest?
- Which model provides the most helpful answer?
- Which model provides the most over-confident answer?
- Which model provides the least helpful answer?

;;;

### Exercise 1

#### Prompt

```
Generate a marketing plan for local Pilates studio.
```

<div style="background: #ede9fe; border: 2px solid #7c3aed; padding: 18px 24px; border-radius: 8px; margin-top: 24px; font-size: 18px; text-align: left;">
<strong>Use LibreChat Comparison Mode:</strong> Select <strong>Claude Opus 5</strong>, <strong>GPT-5.4</strong>, and <strong>Claude Haiku 4.5</strong> side-by-side. Send the prompt once and observe all three outputs simultaneously.
</div>

---

## Exercise 2

> Principle: Be clear and direct

What to observe:

- How does bounding the 'set' of possibilities impact the result?

;;;

### Exercise 2

> Note: Start a new comparison chat session

#### Prompt

```
Generate a marketing plan for local Pilates studio. Only give me solutions I can self-implement for less than $2,000/month
```

<div style="background: #ede9fe; border: 2px solid #7c3aed; padding: 18px 24px; border-radius: 8px; margin-top: 24px; font-size: 18px; text-align: left;">
<strong>Comparison Mode:</strong> Continue with <strong>Opus 5 · GPT-5.4 · Haiku 4.5</strong> side-by-side. Compare how each model adapts to the budget constraint.
</div>

---

## Exercise 3

> Principle: Use Chains of Thought/Planning

What to observe:

- How do the models change when you ask it to think or plan?
- Which model(s) change the most? The least? Why do you suppose that is?

;;;

### Exercise 3

#### Prompt

```
Generate a marketing plan for my local Pilates studio. Think step-by-step through the time and money constraints I may have. Then, give me a plan I can self-implement for less than $2,000/month. Justify your reasoning.
```

Models to use — **comparison mode**:

- Claude Opus 5 · GPT-5.4 · Claude Haiku 4.5

---

## Exercise 4

> Principle: Invite Participation

What to observe

- How does working with an LLM vs "using" an LLM change the output?

;;;

### Exercise 4

#### Prompt

```
I need to generate a marketing plan for my local Pilates studio. I would like you to help me put it together. Please ask me questions to answer so that I can get a high-quality personalized plan for my studio.
```

Models to use — **comparison mode**:

- Claude Opus 5 · GPT-5.4 · Claude Haiku 4.5

---

## Exercise 5

> Principles: Use Examples, Separate Instruction from Data

What to observe:

- How do examples affect the outcome of what's generated?

;;;

### Exercise 5a

#### Prompt

```
I am offering a new member 30-day $7 trial for my new pilates studio to bring people in for the back-to-school season. Please write me a Facebook ad for this offer.
```

Models to use — **comparison mode**:

- Claude Opus 5 · GPT-5.4 · Claude Haiku 4.5

;;;

### Exercise 5b

### Prompt

```
I am offering a new member 30-day $7 trial for my new pilates studio to bring people in for the back-to-school season. Please write me a Facebook ad for this offer. Use a tone based on the following examples:
<example>
Try the low-impact fitness method Jennifer Aniston calls a “game-changer.”

✨ “Within weeks I felt stronger, leaner, and my back pain started to fade. This is the only workout I’ve stuck with.” – Amanda K.

✅ Joint-friendly, results you can see and feel
✅ Functional, Pilates-inspired movements that sculpt head to toe
✅ Clinically proven to reduce lower back pain

👉 Get started risk-free for 30 days with a new-member bundle. Love it or send it back for a full refund.
</example>
<example>
Did you know only 6% of sports science research focuses on women? 🤯

That’s why Pvolve ran clinical studies of our own — and the results speak for themselves:

✨ +23% more daily energy
✨ +21% more flexibility
✨ +19% more hip strength & function

And members also saw:
💪 Stronger balance & mobility
🔥 Lean muscle (without bulk)
❤️ Healthier blood markers
🌟 Better overall quality of life

The best part? Every bundle comes with a 30-day money-back guarantee. Don’t love it? Send it back—on us.
</example>
<example>
Too busy to workout? Pvolve makes it easy. Transform your body in 30 minutes a day with the low-impact method everyone’s talking about.

💪 Total-Body Sculpting From Home
🏋️ Functional, Pilates-Inspired Movements
🧠 Backed by Clinical Research
🌟 Loved by Jennifer Aniston

👉 Try any bundle risk-free for 30 days — streaming included.
</example>
```

Models to use — **comparison mode**:

- Claude Opus 5 · GPT-5.4 · Claude Haiku 4.5

---

## Exercise 6 — Optional / Take-Home

<div style="background: #f3f4f6; border-left: 5px solid #6b7280; padding: 20px 28px; margin: 30px auto; max-width: 900px; font-size: 19px;">
We are <strong>not</strong> doing this one in class. It's here so you can run it on your own — and it's a good thing to reference in your reflection.
</div>

> Principle: Tweak parameters

What to observe:

- How does temperature affect the quality and tone of response?
- Are some models more sensitive than others?

_Note: turn off thinking/reasoning to see this in effect_

Note:
Straight talk: this exercise did not fit in eighty minutes last time and I'm not going to pretend it does. It's genuinely interesting, so I'm giving it to you as a take-home instead of rushing exercises 1 through 5 to squeeze it in. If you run it, bring it up in your reflection.

;;;

### Exercise 6a/b

### Prompt

```
I am offering a new member 30-day $7 trial for my new pilates studio to bring people in for the back-to-school season. Please write me a Facebook ad for this offer.
```

Temperatures to use: 1, 0.2

Models to use:

- Claude Opus 5 · GPT-5.4 · Claude Haiku 4.5

---

## Exercise 7 — Back in the Room

> Principle: Use Roles

What to observe:

- How do 'roles' make it "easier" for an LLM to get to an outcome faster?
- How do 'roles' reduce your work as a human?

;;;

### Exercise 7

#### Role Prompt

```
You are an expert Facebook ad copywriter. You use best practices as exemplified by these examples to craft high-quality ads for local pilates studios:
<example>
Try the low-impact fitness method Jennifer Aniston calls a “game-changer.”

✨ “Within weeks I felt stronger, leaner, and my back pain started to fade. This is the only workout I’ve stuck with.” – Amanda K.

✅ Joint-friendly, results you can see and feel
✅ Functional, Pilates-inspired movements that sculpt head to toe
✅ Clinically proven to reduce lower back pain

👉 Get started risk-free for 30 days with a new-member bundle. Love it or send it back for a full refund.
</example>
<example>
Did you know only 6% of sports science research focuses on women? 🤯

That’s why Pvolve ran clinical studies of our own — and the results speak for themselves:

✨ +23% more daily energy
✨ +21% more flexibility
✨ +19% more hip strength & function

And members also saw:
💪 Stronger balance & mobility
🔥 Lean muscle (without bulk)
❤️ Healthier blood markers
🌟 Better overall quality of life

The best part? Every bundle comes with a 30-day money-back guarantee. Don’t love it? Send it back—on us.
</example>
<example>
Too busy to workout? Pvolve makes it easy. Transform your body in 30 minutes a day with the low-impact method everyone’s talking about.

💪 Total-Body Sculpting From Home
🏋️ Functional, Pilates-Inspired Movements
🧠 Backed by Clinical Research
🌟 Loved by Jennifer Aniston

👉 Try any bundle risk-free for 30 days — streaming included.
</example>
```

Models to use — **comparison mode**:

- Claude Opus 5 · GPT-5.4 · Claude Haiku 4.5

Note:
This one goes in the system prompt field, not the chat box - that's the whole point of a role. Then send a plain one-line request as your user message and notice how much less you had to say to get a good ad. Flag me down if you can't find where the system prompt lives in LibreChat.

---

## Key Takeaways

**Model Selection:**

- Models come in categories: Frontier, Balanced, Fast, Thinking
- Parameters = learned patterns stored in the model — and for frontier models, nobody publishes the count
- Pricing varies **300x** across the table we looked at — match model to task complexity
- The categories are durable. The model names are not.

;;;

**Prompting Principles You Practiced:**

- Be clear and direct
- Use examples (few-shot learning)
- Invite participation - work WITH the model
- Use chains of thought for complex reasoning
- Separate instructions from data
- Assign roles to shape responses
- Tweak parameters (temperature) for creativity vs consistency — _your take-home_

> Prompting matters as much as model choice

Note:
These are the core lessons from today. You now understand how to choose models strategically AND how to get better results through effective prompting. Six of these seven you practiced in the room; the temperature one is yours to run on your own. All seven work across every model and they're the foundation for the rest of the course.

---

## Preview: Session 3 - Claude Projects

**Tuesday, September 8:**

<div style="font-size: 20px; line-height: 2; margin: 40px 0;">

**Claude Projects** - persistent context you build once and reuse<br>
Give a model your documents, your instructions, your standing context<br>
Hands-on: start the <strong>Project for your own résumé & career coaching</strong>

</div>

<div style="margin-top: 30px; font-size: 19px; color: #6b7280;">
This is the start of <strong>Milestone 1</strong> — due Session 6, Sep 17.
</div>

<div style="margin-top: 30px; font-size: 22px; color: #15803d;">
Today: steering models • Next: giving them memory
</div>

Note:
Today you learned to steer models with prompts. But every chat you opened today started from nothing - the model has no idea who you are or what you told it an hour ago. Next session we fix that with Claude Projects: you load in documents and standing instructions once, and every conversation in that Project starts from there. And you're not building a toy - you're building the career-coaching system for yourself, with your own résumé in it. That Project is Milestone 1, due Session 6. Bring your résumé, and anything else that describes your work - portfolio, writing samples, job descriptions you're interested in.

---

## Bring to Session 3

**On your laptop, Tuesday:**

<div style="font-size: 20px; line-height: 2; margin: 30px 0;">

- Your **résumé** (current version, any format)
- Any **writing samples** or portfolio pieces
- 2-3 **job postings** you'd actually want
- Your Claude.ai Team login, working

</div>

Note:
Please don't show up Tuesday planning to write your résumé during class. Bring what you have, even if it's rough - rough is fine, the Project will help you improve it. And confirm your Claude.ai Team seat works before Tuesday. Email me tonight if it doesn't.

---

## Deliverable: Class Learnings

**Due before Session 3 (Tuesday, Sep 8):**

- Reflection: **Session 2 - Prompting & Model Selection**

Note:
Focus on why models behave differently, not just which one you prefer. Name the specific models you tested. Evidence of trying multiple strategies. Clear reasoning about tradeoffs. This is your first individual deliverable.
