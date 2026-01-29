## SSC 493: AI Workflows & Organizational Intelligence

Week 3 - January 30, 2026

Note:
Today we're covering Em (Embeddings) - the second primitive element. This is foundational for everything: RAG retrieval, semantic search, multi-modal AI. Students move from MockAPI to real production API calls. They'll understand HOW the "retrieval" part of RAG actually works.

---

## Quick Check-In

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**Show of hands:**

✋ Completed all 8 N8N flows from Session 4?<br>
✋ Sent thank you note to business partner?<br>
✋ Have access to partner content/website?

</div>

<div style="background: #fee2e2; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 18px;">
<strong>If missing access:</strong> Email your partner today with me CC'd
</div>

Note:
Quick checks before we dive in. N8N CRUD flows should be complete - that's prerequisite for today. Teams should have sent thank you notes to business partners after discovery session. Most critical: teams need access to partner content for Session 7 (semantic audit). If they don't have access yet, they need to follow up TODAY.

---

## Today's Focus: Em (Embeddings)

<div style="font-size: 14px; margin: 20px auto; max-width: 900px;">

| | Reactive | Retrieval | Orchestration | Validation | Models |
| --- | --- | --- | --- | --- | --- |
| **Primitives** | Prompts (Pr) | <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 4px; display: inline-block;">Embeddings (Em)</span> | | | LLMs (Lg) |
| **Compositions** | Function Calling | Vector DBs (Vx) | RAG (Rg) | Guardrails | Multi-modal |
| **Deployment** | Agents (Ag) | Fine-tuning | Frameworks | Red-teaming | Small Models |
| **Emerging** | Multi-agent | Synthetic Data | | Interpretability | Thinking Models |

</div>

<div style="margin-top: 30px; font-size: 20px; color: #7c3aed; text-align: center;">
Today we learn <strong>Embeddings (Em)</strong> - the second primitive that powers semantic search and RAG retrieval
</div>

Note:
Embeddings are the second primitive element in the AI Periodic Table. Row 1 (primitives), Family 2 (retrieval). This answers the question from Session 3: "How does RAG know which chunks are relevant?" The answer: embeddings convert text to vectors, then we measure similarity. This is foundational - you'll use embeddings in RAG, semantic search, multi-modal processing, everything.

---

## Session Roadmap

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

1. What is a vector? (2D → 3D → 1536D)
2. Cosine similarity explained
3. Reading API documentation
4. **First real API call to OpenAI**
5. Model comparison exercise
6. Debrief: patterns and insights

</div>

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 18px;">
<strong>Today you'll make your first production API call.</strong> No more MockAPI - this is real.
</div>

Note:
Here's the roadmap. We start with spatial intuition (2D vectors with meaningful dimensions), extend to 3D, then abstract to 1536D. You'll learn cosine similarity (how we measure angle/distance between vectors). Then we read real API documentation and make your first production API call to OpenAI embeddings endpoint. You'll compare three different models and discover patterns from your own data.

---

## Remember Session 3?

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

**You asked:**

> "How does RAG know which chunks are relevant?"

**Today we answer that question.**

</div>

<div style="background: #dbeafe; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
RAG uses <strong>embeddings</strong> to convert your question and document chunks into vectors, then measures <strong>similarity</strong> (distance in vector space)
</div>

Note:
In Session 3, we learned WHAT RAG does (retrieve relevant chunks, augment prompt, generate response). But we didn't answer HOW it knows which chunks are relevant. Today we answer that: embeddings convert text to vectors (points in high-dimensional space), and we measure distance/angle between vectors. Chunks closest to your question = most relevant chunks. Simple concept, powerful application.

---

## What is a Vector?

**Start with something you can visualize: 2D space**

<div style="margin: 40px auto; max-width: 800px; height: 500px;">
<canvas id="vectorPlot2D"></canvas>
</div>

<div style="margin-top: 30px; font-size: 18px; color: #6b7280; text-align: center;">
Each animal = point in 2D space. Distance between points = similarity.
</div>

Note:
Start with 2D space you can visualize. Two meaningful dimensions: domestication (X-axis, 0=wild to 5=fully domestic) and size (Y-axis, 0=small to 5=large). Cat at (4, 1) - very domestic, small. Dog at (4.5, 2) - very domestic, medium. Tiger at (0.5, 4) - wild, large. Look at the distances: dog and cat are CLOSE (both domestic). Tiger is FAR from both (wild). Distance in space = similarity. This is the core concept.

;;;

### Adding a Third Dimension

**Now add: Carnivore rating (0 = herbivore, 5 = carnivore)**

<div style="margin: 20px auto; max-width: 900px; height: 550px;">
<div id="vectorPlot3D" style="width: 100%; height: 100%;"></div>
</div>

<div style="margin-top: 20px; font-size: 18px; line-height: 1.6;">

**New animals in 3D space:**
- **elephant** (0, 5, 1) - wild, huge, herbivore
- **jaguar** (0, 3, 5) - wild, large, carnivore

**Clusters:** Domestic pets (cat, dog), Wild carnivores (tiger, jaguar), Elephant (alone)

</div>

Note:
Add third dimension: carnivore rating (0=herbivore, 5=carnivore). Elephant (0, 5, 1) - wild, huge, herbivore. Jaguar (0, 3, 5) - wild, large, carnivore. Now clusters form in 3D space: domestic pets (cat, dog) cluster together, wild carnivores (tiger, jaguar) cluster together, elephant is alone (different diet). You can rotate this plot to see the clusters from different angles. The principle is the same: distance in space = similarity. More dimensions = more aspects of meaning captured.

;;;

### Cosine Similarity: Measuring Angle

**How we measure "distance" in vector space**

<div style="margin: 20px auto; max-width: 800px; height: 400px;">
<div id="cosinePlot" style="width: 100%; height: 100%;"></div>
</div>

<div style="margin-top: 30px; font-size: 18px; line-height: 1.6; background: #f0fdf4; padding: 20px; border-radius: 10px;">
<strong>Cosine Similarity:</strong> Small angle = HIGH similarity (0.8-1.0)<br>
Large angle = LOW similarity (0.0-0.3)<br>
<strong>Range:</strong> 0.0 (unrelated) to 1.0 (identical)
</div>

Note:
Cosine similarity measures the angle between vectors. Vectors drawn from origin to each point. Small angle between dog and cat = high similarity (0.85). Large angle between cat and tiger = low similarity (0.25). Range: 1.0 means identical (same direction, 0° angle), 0.0 means completely unrelated (90° angle). This is how RAG finds relevant chunks: it measures cosine similarity between your question vector and all chunk vectors, then retrieves the highest scores.

IMPORTANT CLARIFICATION: The "origin" in this visualization is just a teaching tool to help you see the angle concept. In practice, there's no origin point. Cosine similarity compares two vectors DIRECTLY in 1536D space using the formula: cos(θ) = (A·B) / (||A|| × ||B||). Your query vector Q gets compared to each chunk vector C1, C2, C3, etc. The math measures the angle between them without needing an origin. The model defines a 1536D coordinate system during training - what matters is the relative positions (angles/distances) between vectors in that space, not their absolute position from any origin.

;;;

### Scaling to 1536 Dimensions

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

**2D:** domestication, size<br>
**3D:** domestication, size, carnivore rating<br>
**1536D:** ???

</div>

<div style="background: #fef3c7; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Embeddings use 1536 dimensions</strong> to capture meaning.<br><br>
We can't visualize it, but the math is identical:<br>
<strong>Distance = similarity</strong>
</div>

<div style="font-size: 18px; margin-top: 30px; color: #6b7280; text-align: center;">
Each dimension = a different aspect of meaning (topic, tone, formality, industry, sentiment, etc.)
</div>

Note:
Now scale to 1536 dimensions. We can't visualize it - our brains stop at 3D. But the math is identical: each dimension captures a different aspect of meaning. Could be topic, tone, formality, industry, sentiment, technical vs casual, positive vs negative, abstract vs concrete. The model learns these dimensions during training. When we convert "Michigan State University" to an embedding, it becomes a point in 1536-dimensional space. "Spartans" is nearby. "Pizza recipes" is far away. Distance = similarity, just like dog and cat are close in 2D.

---

## First Real API Call

**Time to call OpenAI's production embeddings API**

<div style="display: grid; grid-template-columns: 1fr 350px; gap: 40px; align-items: center; margin: 40px 0;">

<div>
<h3 style="font-size: 24px; margin-bottom: 20px;">OpenAI Embeddings API</h3>
<p style="font-size: 20px; line-height: 1.8;">
<strong>Endpoint:</strong><br>
POST https://api.openai.com/v1/embeddings<br><br>
<strong>Authentication:</strong><br>
Bearer token (API key)<br><br>
<strong>Body:</strong><br>
{ "input": "your text", "model": "text-embedding-3-small" }
</p>
</div>

<div style="text-align: center;">
<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://platform.openai.com/docs/api-reference/embeddings" alt="OpenAI Embeddings API Docs QR Code" style="width: 300px; height: 300px; border: 2px solid #e5e7eb; border-radius: 10px;">
<p style="margin-top: 15px; font-size: 16px; color: #6b7280;">API Documentation</p>
</div>

</div>

<div style="background: #fee2e2; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 18px;">
<strong>No more MockAPI.</strong> This is production - real costs, real responses.
</div>

Note:
Time for your first real API call. The endpoint is POST https://api.openai.com/v1/embeddings. You'll authenticate with a Bearer token (API key). Request body has two fields: "input" (your text) and "model" (which embedding model to use). Response is JSON with an array of 1536 numbers - that's your embedding vector. Scan the QR code to read the full API documentation. This is production - real costs (tiny, but real), real responses from OpenAI servers.

;;;

### Reading API Documentation

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**What to look for in API docs:**

1. **Endpoint URL** - Where to send the request
2. **HTTP method** - GET, POST, PUT, DELETE
3. **Authentication** - How to prove you're authorized
4. **Request format** - What fields to include
5. **Response format** - What you'll get back
6. **Error codes** - What went wrong (401, 400, 429)

</div>

<div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 18px;">
<strong>Skill:</strong> Reading API docs is critical for building AI systems. Every API follows this pattern.
</div>

Note:
Before we make the call, learn to read API documentation. Every API doc has these sections: (1) Endpoint URL - where to send the request, (2) HTTP method - POST in this case, (3) Authentication - how to prove you're authorized (Bearer token), (4) Request format - what fields to include in body, (5) Response format - what structure you'll get back, (6) Error codes - 401 means auth failed, 400 means bad request, 429 means rate limit. This skill transfers - every API follows this pattern.

---

## Live Demo: First API Call

<div style="text-align: center; font-size: 48px; color: #7c3aed; margin: 80px 0;">
<strong>N8N Workflow Demo</strong>
</div>

<div style="display: grid; grid-template-columns: 1fr 350px; gap: 40px; align-items: center; margin: 40px 0;">

<div>
<p style="font-size: 22px; line-height: 1.8;">
<strong>Import workflow:</strong><br>
Download from shared folder and import into N8N<br><br>
<strong>Execute together:</strong><br>
See 1536-number array output
</p>
</div>

<div style="text-align: center;">
<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://drive.google.com/drive/u/0/folders/1LtfzA-_4FtMxAS76pS1VJ2l7Yq8WzKKx" alt="N8N Workflow QR Code" style="width: 300px; height: 300px; border: 2px solid #e5e7eb; border-radius: 10px;">
<p style="margin-top: 15px; font-size: 16px; color: #6b7280;">Import N8N Workflow</p>
</div>

</div>

Note:
LIVE DEMO TIME. Scan the QR code to access the shared Google Drive folder with the N8N workflow JSON. Import it into your N8N instance. I'll execute it together with you on screen. Input text: "Michigan State University Spartans". Model: text-embedding-3-small. Click execute. Observe the response: data[0].embedding is an array of 1536 numbers. That's the vector representation of the text. Scroll through it - each number is a coordinate in 1536-dimensional space. This is what embeddings ARE.

---

## Model Comparison

**Three embedding models to test**

<div style="font-size: 18px; margin: 30px 0;">

| Model | Dimensions | Cost/1M tokens | Year | Notes |
|-------|------------|----------------|------|-------|
| **text-embedding-ada-002** | 1536 | $0.10 | 2022 | Poor calibration - everything scores high |
| **text-embedding-3-small** | 1536 | $0.02 | 2024 | Good calibration - industry standard |
| **text-embedding-3-large** | 3072 | $0.13 | 2024 | Best discrimination - more nuance |

</div>

<div style="background: #fef3c7; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 18px;">
<strong>Same dimensions ≠ same quality</strong><br>
ada-002 and 3-small both have 1536D, but 3-small performs much better (newer training)
</div>

Note:
Three models to compare. ada-002: 1536 dimensions, $0.10 per million tokens, from 2022 - poorly calibrated, gives everything high scores. 3-small: 1536 dimensions, $0.02 per million tokens, from 2024 - well calibrated, industry standard. 3-large: 3072 dimensions, $0.13 per million tokens, from 2024 - best discrimination and nuance. Key insight: same dimensions doesn't mean same quality. ada-002 and 3-small both have 1536D, but 3-small is much better because it has newer, better training. Different coordinate systems.

---

## Hands-On Exercise

**Fill out Google Sheet with similarity scores**

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**Query:** "AI in healthcare"

**Test candidates:**
1. "Medical diagnosis using machine learning"
2. "Artificial intelligence transforms hospitals"
3. "Pizza recipes for beginners" ← Should be LOW!
4. "Machine learning in agriculture"
5. "Healthcare data privacy"

</div>

<div style="background: #dcfce7; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 18px;">
<strong>For each candidate:</strong> Get similarity scores from all 3 models (3-small, 3-large, ada-002)
</div>

Note:
Time for hands-on work. You'll use the N8N workflow to calculate similarity scores. Query is "AI in healthcare". Test 5 candidates: two clearly related (medical diagnosis, AI in hospitals), one clearly unrelated (pizza recipes - this is the test case), and two partially related (ML in agriculture, healthcare privacy). For each candidate, get similarity scores from all three models. Fill out the Google Sheet. You'll discover patterns from YOUR data, not from slides.

;;;

### Demo One Together

<div style="text-align: center; font-size: 32px; color: #7c3aed; margin: 60px 0;">
<strong>Live Walkthrough</strong>
</div>

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

**Steps:**
1. Open N8N workflow
2. Set query: "AI in healthcare"
3. Set candidate: "Medical diagnosis using machine learning"
4. Execute workflow
5. Code node outputs 3 similarity scores (one per model)
6. Copy scores to Google Sheet

</div>

Note:
Let's do one together. Open the N8N workflow. Find the "Set Query & Candidate" node. Query: "AI in healthcare". Candidate: "Medical diagnosis using machine learning". Execute workflow. The code node at the end calculates cosine similarity for all three models. You'll see three scores output - one for 3-small, one for 3-large, one for ada-002. Copy those scores to your Google Sheet. Now repeat for the remaining 4 candidates. Work individually - this is your data to discover patterns from.

---

## Debrief: What Did You Notice?

<div style="background: #dbeafe; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Discussion:</strong> Look at your completed Google Sheet
</div>

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**Questions:**

1. Which model gave the highest scores overall?
2. Which model best filtered out "pizza" as unrelated?
3. Can you compare 3-small's 0.68 to ada-002's 0.91?
4. What does it mean when 3-large gives 0.015 vs 3-small gives 0.07 for pizza?

</div>

Note:
DISCUSSION TIME. Everyone should have filled-out sheets. Let's discuss what you observed. Question 1: Which model gave highest scores overall? (Answer: ada-002 - poorly calibrated, everything scores high). Question 2: Which model best filtered out pizza? (Answer: probably 3-large - better discrimination). Question 3: Can you compare scores across models? (Answer: NO - different scales, like Fahrenheit vs Celsius). Question 4: What does lower score mean? (Answer: more confident it's unrelated - 3-large's 0.015 shows stronger discrimination than 3-small's 0.07, but both correctly say "not related").

;;;

### Key Insights from Your Data

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 40px 0; font-size: 18px;">

<div style="background: #fee2e2; padding: 25px; border-radius: 10px;">
<h4 style="color: #991b1b;">Cross-Model Comparison</h4>
<p style="margin-top: 15px; line-height: 1.6;">
<strong>You CAN'T compare scores across models.</strong><br><br>
Different models = different coordinate systems/scales.<br><br>
Like comparing 70°F to 70°C - same number, different meaning.
</p>
</div>

<div style="background: #dcfce7; padding: 25px; border-radius: 10px;">
<h4 style="color: #14532d;">Within-Model Comparison</h4>
<p style="margin-top: 15px; line-height: 1.6;">
<strong>Magnitude matters WITHIN a model.</strong><br><br>
0.85 > 0.45 = more similar<br><br>
Lower score = more confident it's unrelated (better discrimination)
</p>
</div>

<div style="background: #fef3c7; padding: 25px; border-radius: 10px;">
<h4 style="color: #92400e;">Dimensionality</h4>
<p style="margin-top: 15px; line-height: 1.6;">
<strong>More dimensions ≠ better.</strong><br><br>
3-large (3072D) has better nuance than 3-small (1536D), but training quality matters more than dimension count.
</p>
</div>

<div style="background: #f3e8ff; padding: 25px; border-radius: 10px;">
<h4 style="color: #6b21a8;">Model Choice</h4>
<p style="margin-top: 15px; line-height: 1.6;">
<strong>We'll use text-embedding-3-small</strong><br><br>
Cost/quality balance, good discrimination, industry standard for production.
</p>
</div>

</div>

Note:
Key insights from YOUR data: (1) Cross-model comparison doesn't work - different models use different scales/coordinate systems, like °F vs °C. ada-002's 0.91 doesn't mean "better" than 3-small's 0.68. (2) Within a model, magnitude matters - 0.85 is more similar than 0.45. Lower scores mean more confident it's unrelated (better discrimination). (3) Dimensionality isn't everything - 3-large has more dimensions than 3-small, so better nuance, but training quality matters more. ada-002 and 3-small both have 1536D, but 3-small performs way better. (4) For your projects, we'll use text-embedding-3-small - best cost/quality balance, good discrimination, industry standard.

---

## Connecting to RAG

**How embeddings power retrieval**

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

**RAG retrieval process:**

1. User asks: "What are your return policies?"
2. Convert question to embedding (1536D vector)
3. Compare to ALL document chunk embeddings (cosine similarity)
4. Retrieve chunks with highest similarity scores
5. Include those chunks in prompt to LLM
6. LLM generates response using retrieved context

</div>

<div style="background: #f0fdf4; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 18px;">
<strong>That's how RAG knows which chunks are relevant:</strong> semantic similarity in vector space
</div>

Note:
Now connect this to RAG from Session 3. When you ask "What are your return policies?", RAG converts that question to an embedding (1536D vector). Then it compares that vector to ALL document chunk embeddings using cosine similarity. Chunks with highest scores (closest in vector space) are the most relevant chunks. Those get retrieved and included in the prompt to the LLM. The LLM generates a response using that specific context. This is HOW retrieval works - semantic similarity in vector space. Next session: we'll build a real vector database and chunk documents.

---

## Preview: Session 7

**Tuesday: Vector Databases & Document Chunking**

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

**What's coming:**
- Vx (Vector Databases) - Qdrant setup
- Document chunking strategies
- Indexing your business partner's content
- First semantic audit of partner website

</div>

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>You'll index real business content next session</strong> - make sure you have access!
</div>

Note:
Next session: vector databases (Qdrant) and document chunking. You'll learn different chunking strategies (fixed-size, semantic, recursive) and see how they affect search results. Then you'll index your business partner's website content into Qdrant and run your first semantic audit. This is the first technical deliverable for your business partners - you need access to their content. If you don't have it yet, follow up TODAY.

;;;

### Before Next Session

<div style="background: #fee2e2; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Critical: Access to partner content</strong><br><br>
Email your business partner if you don't have website/content access yet. CC me on the email.
</div>

<div style="font-size: 20px; line-height: 1.8; margin: 40px 0;">

**Deliverables:**
- Completed Google Sheet (submit link)
- Post-class reading: OpenAI Embeddings API docs (linked in D2L)

**Team work:**
- Confirm access to partner website and content
- Schedule team meeting to prep for Session 7 semantic audit

</div>

Note:
Before next session: CRITICAL - you must have access to your business partner's content. If you don't have it yet, email them today with me CC'd. Deliverables: submit your completed Google Sheet with all similarity scores and observations. Read the OpenAI Embeddings API documentation (link in D2L) to reinforce what we covered. Team work: confirm content access and schedule a team meeting to prep for the semantic audit in Session 7.

---

## Key Concepts to Remember

<div style="text-align: left; font-size: 20px; line-height: 2; margin: 40px 0;">

1. **Embeddings convert text to vectors** in 1536D space
2. **Distance in vector space = semantic similarity**
3. **Cosine similarity:** 1.0 = identical, 0.0 = unrelated
4. **Can't compare across models** - different coordinate systems
5. **Within a model, magnitude matters** - higher = more similar
6. **RAG uses embeddings** to find relevant chunks via similarity search

</div>

Note:
Key takeaways: Embeddings convert text to vectors (points in 1536-dimensional space). Distance in that space equals semantic similarity. Cosine similarity measures the angle: 1.0 is identical, 0.0 is unrelated. You can't compare scores across different models (different scales). Within the same model, magnitude matters - higher scores mean more similar. RAG uses embeddings to find relevant chunks by measuring similarity between your question and all document chunks. This is the foundation for everything you'll build.

---

## Questions?

**Ask now or reach out:**

- Email: jesse@superwebpros.com
- Office hours: By appointment
- LibreChat: msu-ai.superwebpros.com

<div style="margin-top: 40px; font-size: 24px; color: #7c3aed;">
Tuesday: Vector Databases & Chunking Strategies
</div>

Note:
Open floor for questions. Make sure you understand embeddings conceptually - this is foundational. If you're stuck on API calls, come to office hours. Next session we build on this: vector databases, chunking, and indexing real business content. See you Tuesday!
