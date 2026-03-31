## The Session 20 Blocker

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

Baserow's native MCP didn't work with LibreChat.

That blocked **storage**. It didn't block:

- Brand discovery
- Agent system prompt
- Skill writing
- Image generation

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
The <em>behavior</em> of the system is different from the <em>data access</em>.<br>
When a task is blocked, work on the other tasks. Don't let one broken piece stop everything.
</div>

Note:
"Thursday, Baserow's native MCP server didn't play nice with LibreChat. I troubleshot it over the weekend — it's an SSE connection issue. Not worth fixing. We're going back to N8N MCP, which you already know how to build." But here's the real lesson: "The MCP server not working meant you couldn't STORE images in Baserow. It didn't mean you couldn't GENERATE images. It didn't mean you couldn't build your brand brief. It didn't mean you couldn't write your agent's system prompt or draft your skill prompts." The behavior of the system is different from the data access. "When something breaks, ask yourself: what's the GOAL and what's the TASK? The goal was building a brand-aware image generation system. Storing in Baserow was one task within that. If a task is blocked, work on the other tasks. That's true in this class and it's true in production systems."

;;;

### Goal vs. Task

<img src="assets/goal-vs-task.png" style="max-height: 500px;">

Note:
Show the diagram. "This is what I mean by goal-completion vs. task-completion. The goal has multiple tasks underneath it. If one task is blocked, you still have four others you could be making progress on. Professionals don't stop working when one thing breaks — they route around the problem and keep moving toward the goal. This is a skill you should be developing right alongside the technical ones."

---

## Introducing Fal.ai

<div style="font-size: 18px; line-height: 1.8; margin: 20px 0;">

You've been generating images through **LibreChat** — interactive, conversational.

That's the workshop. For **production**, you need:

</div>

<div style="display: flex; gap: 20px; margin: 20px 0; font-size: 16px;">
<div style="flex: 1; background: #dbeafe; padding: 20px; border-radius: 10px; text-align: center;">
<div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">API Access</div>
HTTP calls from N8N, code, anything.<br>That's how we automate.
</div>
<div style="flex: 1; background: #e8f5e9; padding: 20px; border-radius: 10px; text-align: center;">
<div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Parameter Control</div>
Size, steps, guidance scale, seed —<br>set programmatically, not in a UI.
</div>
</div>

Note:
"You've been using image generation through LibreChat — Gemini, Flux, OpenAI. That works for interactive use. But LibreChat is the workshop. For production — for automation, for pipelines, for building systems your client can use — we need API access. That's Fal.ai." Pull up the model page: https://fal.ai/models/fal-ai/nano-banana-2/api?platform=http. "Two things that matter: API access — this is HTTP, you can call it from N8N, from code, from anything. And parameter control — size, steps, guidance scale, seed. Same variables you experimented with last week, but now you set them in code instead of a UI." Today we're building an N8N workflow that calls this API and stores the results in Baserow.

---

## The Delivery Target

<div style="display: flex; gap: 20px; align-items: center; margin: 0;">
<div style="flex: 1; font-size: 16px;">

| LibreChat | Claude | Role |
|-----------|--------|------|
| Agent prompt | Project instructions | WHO |
| Saved prompts | Skills | WHAT |
| N8N MCP | Connectors | HOW |

</div>
<div style="flex: 2;">
<img src="assets/delivery-architecture.png" style="max-height: 450px; border-radius: 10px;">
</div>
</div>

Note:
"Quick preview of where we're headed. Everything you're building in LibreChat — the agent system prompt, the skills, the MCP servers — transfers to Claude as the delivery format for your clients." Walk through the table. "Don't worry about the details yet — we'll break this down starting next week. For now, know that nothing you build is throwaway. It all transfers." List the skills they'll ultimately build: CRUD Content Calendar, Create Reel Script, Create Carousel, Create Social Post, Create Article. "April 22 is partner delivery day — they come to class, you demo the system live, and hand it off."

---

## Fix the Images Table

<div style="font-size: 16px; margin: 20px 0;">

**Schema change:** Image field is now **URL**, not File.

| Field | Type | Purpose |
|-------|------|---------|
| Name | Text | Descriptive name |
| Prompt | Long text | The full prompt used |
| Image | **URL** | URL of the generated image |
| Status | Single select | draft / approved / published |
| Notes | Long text | Iteration notes |

**Then:** Build N8N MCP for images table (same pattern as Session 15).

**Then:** Finish your Art Director agent + at least one skill if you haven't.

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
The fal.ai workflow is fire-and-forget — no agent to help you write prompts.<br>
You need to know how to write a good prompt <strong>before</strong> you automate it.
</div>

Note:
Walk through the schema fix quickly. "If you created the images table Thursday, change the Image field from File to URL. If you didn't, create it now." Then N8N MCP — same pattern as content_pillars and reels MCP from Session 15. Different table, same approach. Tool description for Image field: "URL of the generated image. Must be a full image URL." Quick test: read, write a test row, delete it. "Before you move to fal.ai, you need your Art Director agent and at least one skill working. Why? The fal.ai workflow is fire-and-forget — you type a prompt, it generates an image, no conversation. No agent asking clarifying questions. You need to know how to write a good prompt BEFORE you automate it." Some students will be ready in 10 minutes, others need 20-30. Let fast teams move ahead.

---

## Fal.ai API: What Goes In, What Comes Out

<div style="display: flex; gap: 20px; margin: 20px 0; font-size: 14px;">
<div style="flex: 1; background: #dbeafe; padding: 20px; border-radius: 10px;">
<div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Request (what goes in)</div>

```json
{
  "prompt": "your image description",
  "image_size": "landscape_4_3",
  "num_inference_steps": 28,
  "guidance_scale": 3.5,
  "seed": 42
}
```

</div>
<div style="flex: 1; background: #e8f5e9; padding: 20px; border-radius: 10px;">
<div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Response (what comes out)</div>

```json
{
  "images": [{
    "url": "https://fal.media/...",
    "width": 1024,
    "height": 768,
    "content_type": "image/jpeg"
  }],
  "seed": 42,
  "prompt": "your image description"
}
```

</div>
</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 10px 0; font-size: 18px; text-align: center;">
You get back a <strong>URL</strong>, not an image file. That's exactly what your Baserow table stores.
</div>

Note:
"Let's read this like an AI class. What goes IN to this API call? What comes OUT?" Walk through the request: prompt is your image prompt, image_size controls aspect ratio, num_inference_steps is quality vs. speed, guidance_scale is how strictly it follows the prompt, seed gives you reproducibility. These parameters should look familiar from the building blocks exercise. Response: you get back a URL. Not the binary image data — a URL. That's exactly what your Baserow images table stores. See how the pieces connect? "Look at that response object. What else might you want to store in Baserow besides the URL? The seed? The dimensions? The model you used? This is how API response objects inform your database schema."

---

## Webhooks

<div style="font-size: 18px; margin: 20px 0;">

Image generation takes 10-60 seconds. The API doesn't make you wait.

</div>

<div style="font-size: 16px; margin: 20px 0; line-height: 2;">

1. You send a request: **"Generate this image"**
2. Fal.ai says: **"Got it. I'll call you when it's done."**
3. You wait.
4. Fal.ai finishes → **calls YOUR URL** with the result.
5. You process the result.

</div>

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
A webhook is a URL that <strong>you</strong> provide, and the service calls it when something happens.<br>
Your phone number for the API to call you back.
</div>

Note:
"There's a catch. Image generation takes time — sometimes 10-60 seconds. The API doesn't make you sit there waiting. Instead, it uses a pattern called a webhook." Walk through the 5 steps. "A webhook is just a URL that YOU provide, and the service calls it when something happens. It's a callback. Your phone number for the API to call you back."

;;;

### How Webhooks Work

<img src="assets/webhook-explained.png" style="max-height: 500px;">

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 15px 0; font-size: 18px; text-align: center;">
The webhook doesn't <strong>give</strong> you the image. It tells you the job is <strong>done</strong>.<br>
Then you make a separate call to GET the result. Two-step retrieval.
</div>

Note:
Walk through the diagram. "Your N8N workflow sends the request to fal.ai with a webhook URL — that's the resumeUrl from N8N's Wait node. Fal.ai queues the job and immediately responds with a request ID. Your workflow pauses at the Wait node. When fal.ai finishes generating the image, it calls YOUR webhook URL — that's the callback. The Wait node wakes up. But here's the key: the callback just says 'the job is done' and gives you the request ID. You still need to make a GET request to actually retrieve the image data. Two-step retrieval." In N8N, the Wait for Webhook node handles the pause-and-resume. The fal_webhook query parameter tells fal.ai where to call back.

---

## Build the Workflow

<img src="assets/fal-ai-workflow.png" style="max-height: 300px;">

<div style="font-size: 16px; margin: 20px 0;">

**Section 1: Test your connection**
```
Manual Trigger → Set (prompt) → HTTP Request
```

**Section 2: The webhook pipeline**
```
Form Trigger → Set → HTTP Request (+ fal_webhook) → Wait → Retrieve Image → Baserow
```

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 10px 0; font-size: 18px; text-align: center;">
The key: <code>fal_webhook</code> query parameter → <code>{{ $execution.resumeUrl }}</code>
</div>

Note:
Demo build on the projector in two sections. Section 1 (5 min): sanity check. Manual trigger → Set node with test prompt → HTTP Request POST to queue.fal.run/fal-ai/nano-banana-pro. Auth: HTTP Header Auth, header "Authorization", value "Key YOUR_API_KEY". Run it. "What did we get back? A request_id and some URLs — but no image. The API said 'I got your request, I'll work on it.' But we never told it where to send the result." Section 2 (10 min): the real pipeline. Form Trigger with Prompt field → Set → HTTP Request with fal_webhook query parameter set to $execution.resumeUrl → Wait for webhook (POST) → GET request to retrieve the finished image using request_id from callback → Baserow create row. "Run it. Submit a prompt through the form. Watch the workflow pause at the Wait node. When fal.ai finishes, the workflow resumes." Then students build their own (15 min). Circulate: "What URL does the POST go to? What did the webhook callback actually contain? What would you change about the Baserow schema?"

;;;

### Schema Discussion

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

Now that you've seen what Fal.ai returns — does your images table capture everything useful?

</div>

<div style="font-size: 18px; margin: 20px 0;">

What might you add?

- `model` — which fal.ai model was used (reproducibility)
- `seed` — reproduce exact results
- `dimensions` — width x height
- `pillar` — link back to the content pillar (system thinking)

</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
The API response object tells you what's available.<br>
Your use case tells you what matters.
</div>

Note:
"Quick question for everyone: now that you've seen what fal.ai returns, does your Baserow images table capture everything useful? What's missing?" Let students suggest additions. The pillar field is the system thinking one — linking images back to content pillars means the whole system stays connected. "This is how you should always think about schemas: what data does the system produce, and what do I need to capture for it to be useful later?"

---

## Deliverables

<div style="display: flex; gap: 20px; margin: 20px 0; font-size: 16px;">
<div style="flex: 1; background: #e8f5e9; padding: 20px; border-radius: 10px;">
<div style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">Today</div>

- Images table fixed (URL field)
- N8N MCP for images working
- Fal.ai webhook workflow running
- At least 1 image in Baserow via pipeline

</div>
<div style="flex: 1; background: #dbeafe; padding: 20px; border-radius: 10px;">
<div style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">For Thursday</div>

- 3 images via fal.ai workflow in Baserow
- Art Director agent + skill (if not done)
- Baserow audit — list every table, mark junk vs. production
- **Invite your partner to class April 22** — delivery day

</div>
</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
<strong>Thursday:</strong> Wire fal.ai as MCP tool + Baserow data cleanup.<br>
<strong>Next Tuesday:</strong> Final project sprint begins. Every session has a checkpoint from here to delivery.
</div>

Note:
"Thursday we do two things: connect your fal.ai workflow as an MCP tool so your Art Director agent can trigger it, and clean up your Baserow data. I know it's a mess — multiple tables from different experiments, inconsistent schemas. We consolidate before the final sprint." Homework: finish brand discovery and Art Director agent if not done. Generate 3 images through fal.ai workflow with partner-relevant prompts. Audit your Baserow workspace — list every table, which are junk, which matter. And critically: "Invite your business partner to class on April 22. That's delivery day — they come in, you demo the system live, and hand it off. Send the invite this week."
