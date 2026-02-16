## First: Check D2L

<div style="font-size: 24px; line-height: 2; margin: 40px 0; text-align: center;">

**I've posted my Workflow 1 & 2 solutions**

1. Download them from D2L
2. Compare against your own workflows
3. Make sure your Baserow tables look like mine:
   - `raw_topics` — populated with topics
   - `themes` — 10-15 consolidated themes

</div>

<div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 19px; text-align: center;">
<strong>If your tables aren't populated, import my solutions and run them now.</strong><br>
We need everyone ready for Workflow 3 today.
</div>

Note:
Give students 5-10 minutes to check their work against yours. If anyone is behind, they should import the solution JSONs and run them immediately. Don't let infrastructure hold up the class — the learning continues even with imported solutions because they still need to understand the patterns to build WF3. Walk around and verify Baserow tables while they check.

---

## Today's Focus: Workflow 3

<div style="font-size: 20px; margin: 20px 0;">

```
 sitemap          ✅ Done
       │
 ┌─────────────┐
 │ Workflow 1   │  ✅ Done (or imported)
 └──────┬──────┘
 raw_topics      ✅ Done
       │
 ┌─────────────┐
 │ Workflow 2   │  ✅ Done (or imported)
 └──────┬──────┘
 themes          ✅ Done
       │
 ┌─────────────┐
 │ Workflow 3   │  ← TODAY
 └──────┬──────┘
 theme_coverage  → Powers your partner report
```

</div>

Note:
Quick orientation. Everything above the line should be done. Today we build the final piece: Workflow 3. This takes your themes, searches Qdrant for matching pages, and produces the coverage data that powers your partner report. But before we build it, we need to talk about something we've been doing without really explaining it: chunking.

---

## Wait — What's in Qdrant, Exactly?

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

When you indexed your partner's content in Session 8, you didn't store whole pages.

You stored **chunks**.

</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 20px 0; font-size: 18px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 10px;">One page in Baserow:</h4>
<p>"AI Ethics in Healthcare. Artificial intelligence is transforming medical diagnosis... [2,000 words]"</p>
</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 10px;">Multiple chunks in Qdrant:</h4>
<ul style="line-height: 1.8;">
<li>Chunk 1: "AI Ethics in Healthcare..." (500 words)</li>
<li>Chunk 2: "Medical diagnosis using..." (500 words)</li>
<li>Chunk 3: "Patient data privacy..." (500 words)</li>
<li>Chunk 4: "Future of AI in..." (500 words)</li>
</ul>
</div>

</div>

Note:
"Remember when I told you to 'set chunking to X' during Session 8? We never really talked about WHY we chunk. Let's fix that." Embedding models have a maximum input size. More importantly, a 2,000-word page covers many topics — if you embed the whole thing, the vector is a blurry average of everything on the page. Chunking breaks it into focused pieces so each vector represents a specific section of content. Better chunks = better search results.

---

## Why Chunking Matters for Search

<div style="font-size: 19px; margin: 20px 0;">

**Without chunking** (embed whole page):

```
Page about "AI Ethics + Healthcare + Privacy + Future"
  → One embedding that's a blurry average of all 4 topics
  → Search for "Privacy" → mediocre match (diluted by other topics)
```

**With chunking** (embed sections):

```
Chunk 1: "AI Ethics"        → strong match for ethics searches
Chunk 2: "Healthcare AI"    → strong match for healthcare searches
Chunk 3: "Patient Privacy"  → strong match for privacy searches
Chunk 4: "Future of AI"     → strong match for future searches
```

</div>

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Chunking gives us <strong>precise</strong> matches instead of <strong>blurry</strong> ones
</div>

Note:
This is the key insight. An embedding for a whole page is like asking "what is this page generally about?" — the vector points in a vague direction. Chunks let us ask "what is THIS SECTION specifically about?" — precise vectors. The tradeoff: one page might have 4 chunks in Qdrant. So when we search, the same page could show up multiple times (once per chunk). This creates a problem we need to solve...

---

## The Problem: Duplicate Results

<div style="font-size: 19px; margin: 20px 0;">

Search Qdrant for theme "AI Ethics":

```
Result 1: Page 5, Chunk 3  → score: 0.72
Result 2: Page 5, Chunk 1  → score: 0.68
Result 3: Page 3, Chunk 2  → score: 0.65
Result 4: Page 5, Chunk 4  → score: 0.61
Result 5: Page 8, Chunk 1  → score: 0.58
```

**Page 5 shows up 3 times!**

We want **one result per page** — the best match.

</div>

Note:
This is why we can't just use the regular Qdrant search endpoint. If a page has 4 chunks and 3 of them match our theme, we get 3 results for the same page. That wastes our result slots and makes the data messy. We need a way to say "give me one result per page, and pick the best-scoring chunk to represent it." That's exactly what the groups endpoint does.

---

## The Solution: Qdrant Groups

<div style="font-size: 19px; margin: 20px 0;">

Instead of `/points/query` we use **`/points/query/groups`**

```
Search with group_by: "metadata.source_id"

Result 1: Page 5  → score: 0.72 (best chunk)
Result 2: Page 3  → score: 0.65 (best chunk)
Result 3: Page 8  → score: 0.58 (best chunk)
```

**One result per page. Best chunk wins.**

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
<code>group_by</code> says: "group all chunks from the same page, keep only the top score"
</div>

Note:
The groups endpoint is the key piece of Workflow 3. It does the same vector similarity search but groups results by a metadata field — in our case, source_id (which identifies which page a chunk came from). group_size: 1 means "one hit per group" — so we get exactly one result per page, with the highest-scoring chunk representing the whole page. This is a Qdrant-specific feature. Other vector databases have similar concepts (Pinecone has namespaces, Weaviate has grouping) but the API is different.

---

## What Workflow 3 Does

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**For each theme in your `themes` table:**

1. Combine theme name + description into text
2. Send to OpenAI → get back 1,536-number embedding
3. Send embedding to Qdrant groups endpoint → get page matches with scores
4. Store each match in `theme_coverage` table
5. Loop to next theme

</div>

Note:
Same loop pattern as Workflow 1 — process one theme at a time. The new pieces are: OpenAI Embeddings API call (HTTP Request) and the Qdrant grouped search (HTTP Request). The response from Qdrant is nested (groups → hits), so we need Split Out to unpack it. Let me show you the actual HTTP requests.

---

## The Two HTTP Requests

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; font-size: 16px;">

<div>
<h4 style="color: #0369a1; margin-bottom: 10px;">1. OpenAI Embeddings</h4>

```
POST api.openai.com/v1/embeddings

{
  "model": "text-embedding-3-small",
  "input": "AI Ethics & Governance.
    Ethical considerations and
    responsible AI practices"
}
```

Returns: `[0.002, -0.009, 0.014, ...]`

</div>

<div>
<h4 style="color: #0369a1; margin-bottom: 10px;">2. Qdrant Grouped Search</h4>

```
POST qdrant-url/collections/
  {name}/points/query/groups

{
  "query": [0.002, -0.009, ...],
  "group_by": "metadata.source_id",
  "limit": 10,
  "group_size": 1,
  "with_payload": true
}
```

Returns: pages with scores

</div>

</div>

Note:
These are the two new HTTP Request nodes in Workflow 3. Everything else is patterns they've already used (loop, split out, edit fields, baserow create row).

OpenAI: Takes the theme text, returns a 1536-dimensional vector. Model MUST be text-embedding-3-small — same model used when indexing in Session 8. Different model = different vector space = meaningless comparisons.

Qdrant: Takes that vector, searches the collection, groups by source_id so we get one result per page. The response is nested JSON (groups array → each group has a hits array). We need to Split Out twice to unpack it.

---

## Similarity Scores: What They Are

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

A score measures **how close two vectors are** in 1,536-dimensional space.

</div>

<div style="font-size: 19px; margin: 20px 0;">

```
Theme: "AI Ethics & Governance"  →  embedding  →  search Qdrant

  Page: "AI Ethics in Healthcare"     → 0.72  (very related)
  Page: "Data Privacy Guidelines"     → 0.65  (related)
  Page: "Our Company History"         → 0.31  (not really)
```

</div>

<div style="font-size: 19px; margin: 20px 0;">

Higher = more semantically similar. Useful for **ranking** and **comparing**.

</div>

Note:
Quick refresher from Session 6. Cosine similarity between two vectors. 1.0 would be identical text. 0.0 would be completely unrelated. In practice, scores for different content tend to cluster in the 0.3-0.8 range. The absolute number matters less than the relative ranking: 0.72 is "more related" than 0.31.

---

## Similarity Scores: What They're NOT

<div style="font-size: 19px; margin: 20px 0;">

**Not a grade.** 0.45 doesn't mean "45% about this topic."

**Not a percentage.** It's a distance measure, not a ratio.

**Not the full picture.** A page with one great paragraph on ethics buried in 2,000 words about healthcare → moderate score.

**Not fixed.** Change your theme description → different embedding → different scores.

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Scores start the conversation with your partner — they don't end it
</div>

Note:
THIS IS CRITICAL for the partner report. Students will be tempted to present scores as definitive answers. They need to understand limitations NOW.

"Don't say: 'Your page scored 0.45 on AI Ethics, which is bad.'"
"DO say: 'AI Ethics appears less prominent in your content compared to Healthcare Applications.'"

Frame as patterns and relative strengths, not absolute judgments. The scores are data-informed conversation starters. The partner meeting is where context meets data. This connects to the "data-informed, not data-driven" philosophy from the unit overview.

---

## Build Time: Workflow 3

<div style="font-size: 22px; line-height: 2; margin: 30px 0; text-align: center;">

**You'll need:**
- Your Qdrant collection name (from Session 8)
- Your OpenAI API key
- Your `themes` table populated

</div>

<div style="background: #dbeafe; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 18px; text-align: center;">
Test on <strong>one theme first</strong> before running the full loop
</div>

Note:
Let them build. Circulate and help. The most common sticking points will be:
1. Getting the OpenAI HTTP Request configured (headers, body format)
2. Getting the Qdrant grouped search JSON body right
3. Unpacking the nested response (two Split Outs: one for groups, one for hits)
4. Referencing the loop data in the final Edit Fields node

Suggest: build without the loop first. Hard-code one theme, get OpenAI + Qdrant working, verify the response, THEN wrap it in the loop.

---

## Assignment: Due Thursday

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**1. Finish Workflow 3** — `theme_coverage` table fully populated

**2. Research task:** Read the Qdrant docs on the groups endpoint, then ask an AI:

> "Why does the Qdrant API have a separate `/points/query/groups` endpoint instead of just using `/points/query`? When would you need grouped results vs regular results?"

Bring your answer to Thursday's class.

**3. Spot-check your data** — pick 2-3 high-scoring results, read the actual page. Does the score feel right?

</div>

Note:
The research task serves two purposes: (1) reinforces why we use groups instead of regular search — they'll explain chunking back to themselves, and (2) practices using AI to understand technical documentation, which is a skill they'll use constantly. The spot-check builds intuition about what scores mean before they have to present them to partners.

Qdrant groups docs: https://qdrant.tech/documentation/concepts/search/#grouped-search

Thursday is about interpreting results and building the partner report using AI (LibreChat). They need to walk in with completed data — no building workflows on Thursday.

---

## Thursday Preview

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**Thursday: Interpret results & build your partner report**

- Export Baserow data → upload to LibreChat
- AI helps you analyze coverage patterns
- Draft your Semantic Content Audit Report
- Practice your partner conversation

</div>

<div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 30px 0; font-size: 19px; text-align: center;">
<strong>Come with all 4 tables populated.</strong> Thursday is analysis, not building.
</div>

Note:
Thursday's session is where all the technical work becomes a business deliverable. They'll use LibreChat to analyze their data and draft report sections. Report is due to Jesse by COB Friday for review before partner meetings. The report is their first real client-facing deliverable. It needs to be professional, data-informed, and framed as a conversation starter — not a prescription.
