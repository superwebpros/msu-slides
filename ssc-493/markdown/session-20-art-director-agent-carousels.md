## The Content System So Far

<img src="assets/content-system-pipeline.png" style="max-height: 500px;">

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Every piece traces back to a pillar. Every pillar traces back to a validated gap.<br>
Today we add the <strong>visual production layer</strong>.
</div>

Note:
"Before we dive into building, zoom out. Look at what you've built over the last five weeks." Walk through the pipeline on screen. "Nothing we've built has been arbitrary. Every reel traces back to a pillar. Every pillar traces back to a validated content gap from your semantic audit. Today we're adding images to this system — carousels and social graphics. But they're not random images. They're visual micro-content derived from the same pillar content. That's what makes the content strategy dense and coherent." Spend 2-3 minutes on this — it grounds the session.

---

## We Use AI to Make More AI

<div style="font-size: 18px; line-height: 1.8; margin: 20px 0;">

Session 17: We used an LLM to write the **Reel Agent's** system prompt.

Today: We feed brand visuals to an LLM to write the **Art Director Agent**.

Then: We use AI to write the Art Director's **skills**.

</div>

<div style="background: #f3e8ff; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 18px;">
<div style="text-align: center; margin-bottom: 10px;"><strong>Your job as a human:</strong></div>
<div style="display: flex; gap: 20px; text-align: center;">
<div style="flex: 1;">Define <strong>goals</strong></div>
<div style="flex: 1;">Set <strong>outcomes</strong></div>
<div style="flex: 1;">Establish <strong>guardrails</strong></div>
</div>
<div style="text-align: center; margin-top: 15px;">
You are <strong>directing</strong> the AI. The AI does the work.<br>
Think less about <em>task-completion</em>. Think more about <strong>goal-completion</strong>.
</div>
</div>

Note:
"There's a pattern that's been weaving through the last few sessions that I want to name explicitly. In Session 17, we used an LLM to help us write the Reel Agent's system prompt. Today, we're going to feed brand visuals to an LLM and have it help us write the Art Director agent. And then we're going to use AI to write that agent's skills. AI building AI building AI." Pause and let that land. "So what's YOUR job? Your job is to organize goals, outcomes, and guardrails. You decide WHAT you're trying to achieve, HOW you'll know it worked, and WHERE the boundaries are. You are directing the AI — like a film director. The director doesn't operate the camera, doesn't act the scene, doesn't edit the footage. But without the director, none of those pieces come together into something coherent." "Professionally, this is a mental model shift. Stop thinking about task-completion — 'I need to write a prompt.' Start thinking about goal-completion — 'I need a brand-consistent visual system that my partner can use after the semester.' The tasks are how you get there. But the AI can handle a lot of the tasks if you define the goal clearly enough."

---

## Agent / Skill / Tool

<div style="display: flex; gap: 15px; margin: 20px 0; font-size: 16px;">
<div style="flex: 1; background: #dbeafe; padding: 20px; border-radius: 10px; text-align: center;">
<div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">AGENT</div>
<div style="font-size: 14px; color: #666; margin-bottom: 10px;">WHO</div>
Brand identity, guidelines, tone, personality.<br><strong>Stays constant.</strong>
</div>
<div style="flex: 1; background: #e8f5e9; padding: 20px; border-radius: 10px; text-align: center;">
<div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">SKILLS</div>
<div style="font-size: 14px; color: #666; margin-bottom: 10px;">WHAT</div>
Specific structured tasks.<br><strong>Swappable.</strong>
<div style="font-size: 14px; margin-top: 10px; color: #555;">"Create Carousel"<br>"Make Social Graphic"<br>"Generate Thumbnail"</div>
</div>
<div style="flex: 1; background: #fef3c7; padding: 20px; border-radius: 10px; text-align: center;">
<div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">TOOLS</div>
<div style="font-size: 14px; color: #666; margin-bottom: 10px;">HOW</div>
Capabilities the agent uses.<br><strong>Attached to the agent.</strong>
<div style="font-size: 14px; margin-top: 10px; color: #555;">Image Gen<br>Baserow MCP</div>
</div>
</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Build the agent <strong>once</strong>, give it different <strong>skills</strong> for different jobs.
</div>

Note:
"On Tuesday you learned to write image prompts by hand. Now you're building a system that writes them for you. But we're not just building one agent — we're building an architecture." Draw this on the board or show the slide. "Your partner's brand identity doesn't change between a carousel and a social graphic. The colors are the same. The tone is the same. So why rebuild the agent every time you want a different output? You don't. You build the agent ONCE with brand knowledge, then give it different SKILLS for different jobs." Agent = WHO. Skills = WHAT. Tools = HOW. "You already built an agent (the reel agent in Session 17). That agent had tools (Baserow MCP). Today we're adding the third piece: skills." In LibreChat, skills are implemented as 'saved prompts.' It's not the perfect abstraction, but it teaches the concept. Later, when we package for client delivery, you'll use the real skills format (agentskills.io — an open standard).

;;;

### What's New Today: Native MCP

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

In Week 8, you **built** your own MCP server with N8N.

Today, you're using one that **Baserow ships as a product feature**.

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Always check if an app ships a native MCP server.<br>
But it's good to know you can build your own when one doesn't exist.
</div>

Note:
"Notice something: Fc (Function Calling) is evolving. In Week 8, you built your own MCP server with N8N — custom logic, your own endpoints. Today, you're using Baserow's native MCP server. Baserow built it and ships it as a product feature. This is where the industry is going — every app will ship its own MCP server. The tradeoff: N8N was powerful because you could add custom logic — embeddings, search, conditional workflows. Baserow's native MCP is simpler: plug in a token and your tables are available as tools. But there's a catch — by default it exposes EVERYTHING. Every table, every field. That's a problem. Why?" Let students answer — they should get to: context window overload, irrelevant data, potential data leakage. "Right. So we need to manage permissions."

---

## Baserow MCP Setup

<div style="font-size: 16px; margin: 20px 0;">

**Create `images` table in Baserow UI:**

| Field | Type | Purpose |
|-------|------|---------|
| Name | Text | Descriptive name |
| Prompt | Long text | The full prompt used |
| Image | File | Generated image file |
| Style | Single select | carousel / social-graphic / thumbnail / hero |
| Status | Single select | draft / approved / published |
| Notes | Long text | Iteration notes |

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Your image library — every image stored with its prompt so you can reproduce, iterate, or hand off.
</div>

Note:
Walk them through creating this table in the Baserow UI. "This table is your image library. Every image you generate gets stored here with its prompt — so you can reproduce it, iterate on it, or hand it off to your partner." MCP can't create tables — only CRUD on rows — so this has to be done in the UI. This should take about 5 minutes.

;;;

### Create Restricted Database Token

<div style="font-size: 18px; margin: 20px 0;">

**Settings → Database Tokens → New Token**

Set default to **Deny All**, then enable only:

| Table | Create | Read | Update |
|-------|--------|------|--------|
| content_pillars | | x | |
| reels | x | x | x |
| images | x | x | x |

**Then connect to LibreChat** with your token.

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Every table the MCP can see gets loaded into the agent's context.<br>
20 tables = thousands of wasted tokens. <strong>Restrict to only what this agent needs.</strong>
</div>

Note:
"By default, Baserow's MCP server exposes EVERYTHING — every table, every field. That's a problem. Why?" Let students answer — context window overload, irrelevant data. "Right. So we set default to Deny All, then manually enable only what this agent needs." Reference: https://baserow.io/user-docs/mcp-server. Test it: open a plain conversation with the MCP connected and ask it to list your tables. You should see ONLY content_pillars, reels, and images. If you see everything, your permissions aren't set correctly. Circulate: "What tables did you give access to? What happens if you give read access to everything?"

---

## Brand Aesthetic Discovery

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

You know your partner's brand **feels** a certain way.

You need to describe it in **Grammar of Design vocabulary**.

Use AI as a design partner — upload visuals + the Grammar reference.

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
The brand brief you create here becomes the <strong>core</strong> of your Art Director agent.
</div>

Note:
"Here's the problem: your partner has a visual brand, but you probably can't describe it in the vocabulary that image models need. You might say 'it feels professional' or 'it's kind of warm.' That's not enough for an image prompt." Same pattern as Session 17: use AI as a partner to help you articulate something you can sense but can't express. Upload partner visuals + Grammar of Design reference. Have a real conversation — push back, refine, add context the AI can't see. End up with a brand brief: 1-2 paragraphs using Grammar of Design vocabulary. "This is the meta-skill again: using AI to build more AI. The brand brief becomes the core of your Art Director agent's system prompt." They should spend about 15-20 minutes on this. It's the foundation — if the brief is weak, the agent will be weak. Circulate: "What terms from the Grammar did the AI use that you wouldn't have thought of? Did the AI see patterns across the images you hadn't noticed?"

---

## Build Your Art Director Agent

<div style="font-size: 18px; margin: 20px 0;">

Same process as Session 17 — build the system prompt **conversationally**:

1. Share the [context engineering article](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
2. Build the system prompt section by section:
   - **Brand Identity** — paste your brand brief
   - **Role** — what this agent is and how it behaves
   - **Process** — general workflow for any image request
   - **Quality Rules** — brand-specific constraints
   - **Tool Usage** — how to use image gen + Baserow
3. Create agent in LibreChat Agent Builder

</div>

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Tools live on the <strong>agent</strong>. Task instructions live in the <strong>skill</strong>.<br>
The agent doesn't know WHAT to create yet — that's the skill's job.
</div>

Note:
"Same approach as Session 17. You shared the context engineering article when building the reel agent. Do it again here — the AI will apply those principles to your Art Director system prompt." Walk them through: Agent Builder → name it "Art Director - [Partner Name]" → model of their choice (they compared on Tuesday) → tools: image gen + Baserow MCP → paste system prompt. Emphasize the separation: "Brand guidelines are in the AGENT. Tools are on the AGENT. The agent doesn't know what KIND of content to create yet — that's the skill's job." Before moving to skills, have them do the bridge step: ask the agent to describe its tools (names, capabilities, parameters). They save this output — they'll need it when building skills so the AI knows what tools are available.

---

## Create Skills (Saved Prompts)

<div style="font-size: 18px; margin: 20px 0;">

Skills tell the agent **what** to do with its tools.

**Build conversationally** — share with the AI:
1. [Agent Skills standard](https://agentskills.io/home) — best practices
2. Your agent's tool descriptions — so it references tools correctly
3. Your brand brief + system prompt — context for what already exists

</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
The AGENT knows the brand. The SKILL knows the task.<br>
Together they produce brand-consistent content without rewriting instructions every time.
</div>

Note:
"The agent knows WHO (the brand). Now you need to tell it WHAT. Skills are structured task prompts." Share three things with the AI: the Agent Skills standard (agentskills.io), tool descriptions from the bridge step, and context of the conversation so far. Same conversational building pattern as Session 17. Save each skill as a saved prompt in LibreChat. Test: select agent, invoke saved prompt, fill in variables. Watch the agent use brand guidelines (system prompt) + task structure (skill) + tools (image gen + Baserow). "And you built all three layers by having conversations with AI."

;;;

### Two Skills to Build

<div style="display: flex; gap: 20px; margin: 20px 0; font-size: 16px;">
<div style="flex: 1; background: #dbeafe; padding: 20px; border-radius: 10px;">
<div style="font-size: 22px; font-weight: bold; margin-bottom: 15px;">"Create Carousel"</div>

- Multi-slide series from a **content pillar**
- Visual consistency across all slides
- Hook slide → content slides → CTA slide
- Variables: # slides, platform, topic
- Store in Baserow with style = "carousel"

</div>
<div style="flex: 1; background: #e8f5e9; padding: 20px; border-radius: 10px;">
<div style="font-size: 22px; font-weight: bold; margin-bottom: 15px;">"Make Social Graphic"</div>

- Single standalone image
- Complements a social post about a **pillar topic**
- Stops the scroll, reinforces the concept
- Variables: platform, topic, post context
- Store in Baserow with style = "social-graphic"

</div>
</div>

Note:
Build the carousel skill first. The skill should have fill-in variables (number of slides, platform, topic), define carousel structure (hook slide, content slides, CTA slide), specify visual consistency, and tell the agent to store in Baserow with style="carousel". Save as a saved prompt in LibreChat. Test: select agent, invoke saved prompt, fill in variables (3 slides, Instagram, a topic from their pillars). If time, repeat for "Make Social Graphic" — same process, different content type. Key difference: social graphic is a single image, not a series. It complements a post — the post has text from pillar content, the graphic makes someone stop scrolling long enough to read it.

---

## Deliverables

<div style="display: flex; gap: 20px; margin: 20px 0; font-size: 16px;">
<div style="flex: 1; background: #e8f5e9; padding: 20px; border-radius: 10px;">
<div style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">Today</div>

- Baserow `images` table + restricted MCP token
- Brand aesthetic brief completed
- Art Director agent created
- At least 1 skill tested

</div>
<div style="flex: 1; background: #dbeafe; padding: 20px; border-radius: 10px;">
<div style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">For Tuesday</div>

- 3+ carousel images in Baserow
- Social graphic skill (if not done today)
- Partner **Fal.ai account** + $25 loaded

</div>
</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
<strong>Tuesday:</strong> Fal.ai automation + production-scale image generation.<br>
Same arc — interactive → agent → automated.
</div>

Note:
"Look at the system you have now: semantic audit → content pillars → transcripts → reel scripts → videos → and now carousels and social graphics. All connected. All traceable to pillar content. All on-brand." Homework: finish the social graphic skill if you didn't get to it. Generate at least 3 carousel images using your Art Director agent — store in Baserow. Iterate on your agent's system prompt if brand consistency isn't right. Partner Fal.ai account with $25 loaded — we need it next week for automation. "The pattern should feel familiar now: interactive first (Tuesday), agent + skills (today), automation next (Tuesday). Same arc as reels. And every piece connects back to the same pillar content."
