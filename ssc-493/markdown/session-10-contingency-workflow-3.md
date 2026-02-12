## Bonus: Workflow 3 — Similarity Search

<div style="font-size: 22px; line-height: 2; margin: 40px 0; text-align: center;">

**If you've finished Workflows 1 & 2, here's what comes next**

</div>

Note:
Contingency slides. Only use these if teams finish Workflows 1-2 during class and are ready to move forward. Otherwise, save for Tuesday's Session 11.

---

## What Workflow 3 Does

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**For each theme in your `themes` table:**

1. Take theme name + description
2. Convert that text into an embedding (vector)
3. Search Qdrant: "Which pages are most similar to this theme?"
4. Qdrant returns pages ranked by similarity (0–1 score)
5. Store each match in `theme_coverage`

</div>

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
This is where your Session 8 indexing work pays off
</div>

Note:
"Remember when you indexed all your partner's content into Qdrant with embeddings? This is why. Now we query those embeddings with theme text to find which pages relate to which themes." The relevance score tells us HOW related: 0.7+ is strong, 0.4-0.7 moderate, below 0.4 is a gap. This produces the data that powers your partner report.

---

## The Nodes You'll Need

<div style="font-size: 19px; margin: 20px 0;">

| Node | Purpose |
|------|---------|
| **Baserow — Get All** | Pull all themes from `themes` table |
| **Loop (Split In Batches)** | Process one theme at a time |
| **Edit Fields** | Combine theme name + description into search text |
| **OpenAI Embeddings** | Convert search text → 1536-dim vector |
| **HTTP Request** | Send vector to Qdrant search endpoint |
| **Split Out** | Unpack Qdrant results (multiple matches per theme) |
| **Baserow — Create Row** | Store each match in `theme_coverage` |

</div>

Note:
Walk through each node. The new pieces here vs Workflows 1-2:
- OpenAI Embeddings node: calls text-embedding-3-small, returns a vector array
- HTTP Request to Qdrant: POST to /collections/{name}/points/query with the vector
- The Qdrant response contains an array of matches with scores — Split Out unpacks those

The loop + split out pattern is the same as Workflow 1. The difference is what's inside the loop: embeddings + Qdrant instead of Information Extractor.

---

## Qdrant Search: The HTTP Request

<div style="font-size: 18px; margin: 20px 0;">

**POST** `https://your-qdrant-url/collections/{collection}/points/query`

```json
{
  "query": [0.023, -0.041, 0.087, ...],
  "limit": 10,
  "with_payload": true,
  "params": {
    "group_by": "source_id",
    "group_size": 1
  }
}
```

</div>

<div style="font-size: 18px; margin: 10px 0;">

**Response gives you:** page matches with similarity scores (0–1)

</div>

Note:
The query field is the embedding vector from OpenAI. The group_by: source_id ensures we get one result per page (not multiple chunks from the same page). Limit 10 means top 10 most similar pages per theme. Students will need their Qdrant collection name and URL from Session 8. The with_payload: true returns the page metadata (title, URL) alongside the score.

If students struggle with the HTTP Request node configuration:
- Method: POST
- URL: their Qdrant endpoint + /collections/COLLECTION_NAME/points/query
- Body: JSON, with the embedding vector injected via expression
- The vector expression: {{ $json.embedding }} (from the OpenAI node output)

---

## Interpreting Scores

<div style="font-size: 20px; margin: 30px 0;">

| Score Range | Coverage Level | What It Means |
|-------------|---------------|---------------|
| **0.70+** | Strong | Page directly addresses this theme |
| **0.45–0.70** | Moderate | Theme is mentioned or partially covered |
| **0.30–0.45** | Weak | Tangentially related at best |
| **Below 0.30** | Gap | No meaningful coverage |

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
These thresholds are starting points — adjust based on what you see in your data
</div>

Note:
These are approximate. The actual thresholds depend on the content and embeddings model. Students should look at their data and calibrate: "Does a 0.5 score feel like real coverage when I read the page?" Encourage them to spot-check a few results manually. This is the "data-informed, not data-driven" mindset — the scores start the conversation, the partner meeting gives context.

---

## Try It

<div style="font-size: 24px; line-height: 2; margin: 40px 0; text-align: center;">

**Start building Workflow 3**

You'll need:
- Your Qdrant collection name from Session 8
- Your OpenAI API key
- Your `themes` table populated

</div>

Note:
Only for teams that have finished Workflows 1-2 and have populated themes tables. If they get stuck on the Qdrant HTTP request, help them test it in isolation first — use a hardcoded vector to verify the endpoint works, then wire up the OpenAI embedding output. We'll cover this more formally on Tuesday regardless.
