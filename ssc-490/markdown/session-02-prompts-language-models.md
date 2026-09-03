## What are Your LLM Best Practices?

<div style="display: grid; grid-template-columns: 1fr 360px; gap: 30px; align-items: center; max-width: 1000px; margin: 40px auto;">
<div>
<h3>Question for reflection:</h3>
<p style="font-size: 22px; line-height: 1.8;">
<strong>"What are your top prompting 'hacks'?"</strong>
</p>
<p style="margin-top: 30px; font-size: 18px; color: #6b7280;">
Scan the QR code or visit:<br>
<strong style="font-size: 22px; color: #7c3aed;">slido.com #4017 568</strong>
</p>
</div>
<div style="text-align: center;">
<img src="assets/slido-s01.png" alt="Slido QR Code" style="width: 300px; height: 300px;">
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

<div style="font-size: 17px; line-height: 1.6; max-width: 960px; margin: 15px auto; text-align: left;">

The model doesn't process tokens in isolation: **every token looks backwards and forwards** across surrounding tokens to resolve meaning:

<!-- Visual Attention Multiples -->
<div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 15px 0;">

  <!-- Token row with attention directions -->
  <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 18px;">
    <div style="background: #ffffff; border: 1px solid #cbd5e1; padding: 6px 14px; border-radius: 6px; font-family: monospace; font-size: 18px; text-align: center;">The</div>
    <div style="background: #fef3c7; border: 2px solid #d97706; padding: 6px 14px; border-radius: 6px; font-family: monospace; font-size: 18px; text-align: center;">
      <strong>capital</strong><br><span style="font-size: 11px; color: #92400e;">Looks ➔ forward</span>
    </div>
    <div style="background: #ffffff; border: 1px solid #cbd5e1; padding: 6px 14px; border-radius: 6px; font-family: monospace; font-size: 18px; text-align: center;">of</div>
    <div style="background: #ede9fe; border: 2px solid #7c3aed; padding: 6px 14px; border-radius: 6px; font-family: monospace; font-size: 18px; text-align: center;">
      <strong>France</strong><br><span style="font-size: 11px; color: #5b21b6;">Anchor Context</span>
    </div>
    <div style="background: #dbeafe; border: 2px solid #2563eb; padding: 6px 14px; border-radius: 6px; font-family: monospace; font-size: 18px; text-align: center;">
      <strong>is</strong><br><span style="font-size: 11px; color: #1e40af;">Looks ⬅ backward</span>
    </div>
  </div>

  <!-- Small Multiples: Disambiguation Pairs -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px;">
    <div style="background: #ffffff; padding: 12px 14px; border-radius: 6px; border-left: 4px solid #d97706;">
      <strong>Without Attention (Isolated Words):</strong><br>
      • <code>"capital"</code> = financial money? uppercase letter? punishment?<br>
      • <code>"France"</code> = European nation? soccer team? geography?
    </div>
    <div style="background: #ffffff; padding: 12px 14px; border-radius: 6px; border-left: 4px solid #16a34a;">
      <strong>With Attention (Looking Both Ways):</strong><br>
      • <code>"capital"</code> attends to <code>"France"</code> ➔ <em>seat of government</em><br>
      • <code>"is"</code> attends back to both ➔ <em>demands city entity "Paris"</em>
    </div>
  </div>

</div>

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

## Prompting as "Steering" the Model

<div style="max-width: 920px; margin: 30px auto; font-size: 21px; line-height: 1.8; text-align: left;">

Think of an LLM as a **vast landscape of probable completions**:

- Left to itself with a vague prompt ("write about marketing"), the model wanders into the **statistical average**—generic, safe, bland text.
- **Your prompt acts like a rudder or steering wheel:**
  - **Persona & Context:** Steers toward an expert mindset (e.g., *"You are a senior fitness studio marketing director"*).
  - **Constraints & Bounds:** Steers away from fluff and sets strict boundaries (e.g., *"Under $2,000/mo, self-implemented only"*).
  - **Examples (Few-shot):** Steers tone and structure directly into the target zone.

</div>

<div style="background: #ede9fe; padding: 18px 24px; border-radius: 8px; margin-top: 25px; font-size: 19px; color: #5b21b6; text-align: center;">
Prompting isn't about polite manners or magic keywords — it's about <strong>steering the probability distribution into the exact token space you want</strong>.
</div>

Note:
This is why prompt engineering works. The model contains many possible perspectives. A vague prompt gets an average answer because that's the center of the probability distribution. When you provide clear constraints, examples, and roles, you steer the model away from the generic center into the specific, high-capability corner of its training data.

---

## Don't Prompt Like Peter Parker

<iframe width="720" height="405" src="https://www.youtube-nocookie.com/embed/M1D2zTJhIss?start=10&end=120" title="Peter Parker Messes Up Dr Strange's Spell" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); margin: 15px auto; display: block;"></iframe>

<p style="font-size: 16px; color: #6b7280; text-align: center; margin-top: 10px;">
<a href="https://www.youtube.com/watch?v=M1D2zTJhIss" target="_blank">Watch on YouTube (Spider-Man: No Way Home)</a>
</p>

Note:
Play about 60 to 90 seconds here—up to where Strange shuts down the spell. Watch what Peter does: he asks for an extreme spell, then changes the parameters over and over mid-casting until the entire spell spins out of control. We see students do this every single semester in prompt engineering.

;;;

### Anatomy of a Prompting Disaster

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 20px auto; max-width: 950px; text-align: left;">

<div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px;">
<h4 style="color: #991b1b; margin-top: 0; font-size: 18px;">Peter's 4 Blunders:</h4>
<ul style="font-size: 15px; line-height: 1.7;">
<li><strong>Constraint Creep:</strong> Tacking on exception after exception mid-stream (MJ, Ned, Aunt May, Happy).</li>
<li><strong>Assuming Mind-Reading:</strong> Expecting Strange to guess what a "normal life" looks like without examples.</li>
<li><strong>One-Way Monologue:</strong> Never letting Strange ask questions or diagnose the real problem.</li>
<li><strong>Context Pollution:</strong> Trying to patch a collapsing spell while reality is actively tearing apart.</li>
</ul>
</div>

<div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; border-radius: 8px;">
<h4 style="color: #15803d; margin-top: 0; font-size: 18px;">The LLM Reality:</h4>
<ul style="font-size: 15px; line-height: 1.7;">
<li><strong>Conflicted Attention:</strong> Piling on contradictory rules guarantees bland or broken completions.</li>
<li><strong>Show, Don't Tell:</strong> Without examples, models guess the average interpretation.</li>
<li><strong>Ask First:</strong> The best results come when you let the AI interview you.</li>
<li><strong>Start Fresh:</strong> When a chat goes off the rails, don't keep arguing—start a new chat!</li>
</ul>
</div>

</div>

<div style="text-align: center; font-size: 18px; color: #7c3aed; margin-top: 15px;">
<em>"You changed my spell five times while I was casting it!"</em> — Dr. Strange
</div>

---

## The 4 Core Principles of Steering

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 30px auto; max-width: 950px; text-align: left;">

<div style="background: #f8fafc; border-top: 4px solid #7c3aed; padding: 20px; border-radius: 8px;">
<h4 style="color: #5b21b6; margin-top: 0; font-size: 18px;">1. Be Clear, Direct & Bounded</h4>
<p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 8px 0;">
State the exact goal upfront. Give positive instructions and <strong>negative bounds</strong> (e.g., *"Under $2k/mo, self-implemented only"*). Stop adding rules mid-air.
</p>
</div>

<div style="background: #f8fafc; border-top: 4px solid #2563eb; padding: 20px; border-radius: 8px;">
<h4 style="color: #1e40af; margin-top: 0; font-size: 18px;">2. Use Examples (Show, Don't Tell)</h4>
<p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 8px 0;">
One sample output is worth 500 words of adjectives. Show the model the exact tone, structure, and depth you expect.
</p>
</div>

<div style="background: #f8fafc; border-top: 4px solid #059669; padding: 20px; border-radius: 8px;">
<h4 style="color: #065f46; margin-top: 0; font-size: 18px;">3. Invite Participation (Co-Pilot)</h4>
<p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 8px 0;">
Turn the monologue into a dialogue. Instruct the model: <em>"Ask me 3 clarifying questions before you generate the plan."</em>
</p>
</div>

<div style="background: #f8fafc; border-top: 4px solid #d97706; padding: 20px; border-radius: 8px;">
<h4 style="color: #92400e; margin-top: 0; font-size: 18px;">4. Separate Instructions from Data</h4>
<p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 8px 0;">
Use markdown headers, bullet blocks, or tags (<code>&lt;context&gt;</code>, <code>&lt;rules&gt;</code>). Prevent the model from confusing source data with instructions.
</p>
</div>

</div>

<div style="background: #fef3c7; padding: 12px 20px; border-radius: 8px; margin-top: 15px; font-size: 16px; color: #92400e; text-align: center;">
<strong>Golden Rule:</strong> When a conversation gets derailed, don't keep patching it. <strong>Copy what worked and start a fresh chat.</strong>
</div>

Note:
We've cut the old 2023 prompting list down to the four that actually matter in 2026. Notice how each one fixes one of Peter's mistakes. In modern frontier models, you don't need to tweak temperature sliders or tell models to 'think step by step'—they do that natively. What matters is bounding your request, showing examples, collaborating, and keeping your instructions clean.

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

## Hands-On: Multi-Model Discovery Lab

**50 Minutes · Work with Your Table Partner**

<div style="margin-top: 30px; font-size: 22px; color: #7c3aed;">
<strong>Goal:</strong> Empirically benchmark 4 models across Provider × Model Scale × Prompt Steering
</div>

<div style="margin-top: 25px; font-size: 19px; color: #15803d; line-height: 1.8;">
You are not just chatting—you are running a controlled experiment and recording observations in a <strong>Lab Notebook</strong>.
</div>

Note:
We've restructured the lab around your table pairings. Each pair of students has 4 models running side-by-side in LibreChat. You will send prompts once, observe all four responses, and document what happens in your cloned Google Doc notebook.

;;;

## Step 1: Clone Your Lab Notebook

<div style="display: grid; grid-template-columns: 1fr 320px; gap: 30px; align-items: center; max-width: 1000px; margin: 30px auto;">
<div style="text-align: left;">
<h3 style="margin-top: 0; color: #7c3aed; font-size: 26px;">Clone the Discovery Lab Doc:</h3>
<p style="font-size: 20px; line-height: 1.6; margin: 20px 0;">
Scan the QR code or click:<br>
<a href="https://docs.google.com/document/u/0/d/1MdrQwEhPp2tQ63fQVINzCqTXdtvPFFrg-X9krSHfPrI/copy?pli=1" target="_blank" style="word-break: break-all; font-size: 18px;">
<strong>Make a Copy of the Lab Notebook</strong>
</a>
</p>
<p style="font-size: 16px; color: #6b7280; line-height: 1.6;">
One partner clones the document and shares edit access with the other. You will submit your completed notebook in D2L at the end of class.
</p>
</div>
<div style="text-align: center;">
<img src="assets/lab-notebook-qr.png" alt="Lab Notebook QR Code" style="width: 280px; height: 280px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</div>
</div>

;;;

## Step 2: Your Table Pairings (A – F)

<div style="font-size: 15px; margin: 15px auto; max-width: 980px;">

| Group | Provider A (Small + Large) | Provider B (Small + Large) |
| :---: | :--- | :--- |
| **Group A** | **Anthropic:** Claude Haiku 4.5 · Claude Opus 5 | **OpenAI:** GPT-5.4 · GPT-5.6 |
| **Group B** | **Anthropic:** Claude Haiku 4.5 · Claude Opus 5 | **Google:** Gemini 3.7 Flash · Gemini 3.7 Pro |
| **Group C** | **Anthropic:** Claude Haiku 4.5 · Claude Opus 5 | **Groq:** GPT-OSS-20B · GPT-OSS-120B |
| **Group D** | **OpenAI:** GPT-5.4 · GPT-5.6 | **Google:** Gemini 3.7 Flash · Gemini 3.7 Pro |
| **Group E** | **OpenAI:** GPT-5.4 · GPT-5.6 | **Groq:** GPT-OSS-20B · GPT-OSS-120B |
| **Group F** | **Google:** Gemini 3.7 Flash · Gemini 3.7 Pro | **Groq:** GPT-OSS-20B · GPT-OSS-120B |

</div>

<div style="margin-top: 15px; font-size: 17px; color: #7c3aed; text-align: center;">
In LibreChat: Select <strong>Comparison Mode</strong> ➔ Add your 4 assigned models side-by-side.
</div>

Note:
Check your table letter (A through F). That tells you which two providers you are testing. For each provider, pick their fast/small model and their frontier/large model. All four will sit side by side in LibreChat.

;;;

## The 5 Lab Experiments

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px auto; max-width: 950px; text-align: left; font-size: 15px;">

<div style="background: #f8fafc; border-left: 4px solid #ef4444; padding: 14px 18px; border-radius: 6px;">
<strong>Exp 1: The "Peter Parker" Baseline</strong><br>
<span style="color: #6b7280;">Vague, unbounded prompt. Compare speed, fluff, and raw provider voice.</span>
</div>

<div style="background: #f8fafc; border-left: 4px solid #7c3aed; padding: 14px 18px; border-radius: 6px;">
<strong>Exp 2: Clear, Direct & Bounded</strong><br>
<span style="color: #6b7280;">Add k/mo & 5 hr/wk limits. Watch which models respect negative constraints.</span>
</div>

<div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 18px; border-radius: 6px;">
<strong>Exp 3: Few-Shot Steering</strong><br>
<span style="color: #6b7280;">Provide 2 winning ad examples. Can small models match frontier quality?</span>
</div>

<div style="background: #f8fafc; border-left: 4px solid #059669; padding: 14px 18px; border-radius: 6px;">
<strong>Exp 4: The "Call MIT First" Test</strong><br>
<span style="color: #6b7280;">Interview mode: instruct models to ask 3 diagnostic questions before planning.</span>
</div>

</div>

<div style="background: #f8fafc; border-left: 4px solid #d97706; padding: 14px 18px; border-radius: 6px; max-width: 950px; margin: 15px auto; text-align: left; font-size: 15px;">
<strong>Exp 5: Separating Instructions from Data</strong> — Feed messy raw client intake notes inside <code>&lt;client_notes&gt;</code> tags to test extraction and business synthesis.
</div>

<div style="text-align: center; font-size: 17px; color: #15803d; margin-top: 15px;">
Follow the step-by-step instructions and record your findings directly in your cloned Google Doc!
</div>

---

## Key Takeaways

**1. Model Selection & Economics:**
- Models come in distinct tiers: **Frontier, Balanced, Fast, Thinking**
- Price spread is **300x** (from /bin/bash.15 to 80 per 1M tokens) — calibrate model tier to task complexity
- **Provider DNA:** Anthropic, OpenAI, Google, and Groq have distinct philosophical voices and behaviors

;;;

**2. The 4 Principles of Steering:**
- **Be Clear, Direct & Bounded:** Set constraints and negative bounds upfront
- **Use Examples (Few-Shot):** Show, don't just tell — examples steer tone faster than adjectives
- **Invite Participation (Co-Pilot):** Ask the model to interview you before generating
- **Separate Instructions from Data:** Use tags/headers so source data doesn't contaminate rules

;;;

**3. The Golden Rules for Your Semester Project:**
- **The Equalizer:** A small, fast model with a great prompt regularly matches or beats a frontier model with a lazy prompt.
- **The Anti-Peter Rule:** If a chat conversation derails, stop arguing with it. **Copy what worked, close the tab, and start a fresh chat.**

> Prompting is the steering wheel. The model is just the engine.

Note:
These are the foundational lessons from today. You now understand how to choose models strategically AND how to get better results through effective steering. You benchmarked this empirically in the lab today across 4 models. These principles work across every provider, and they form the bedrock for everything we build this semester.

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
