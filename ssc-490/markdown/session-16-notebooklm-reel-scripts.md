## Content Pillar Status Check


Note:
Go team by team. Quick — 60 seconds each. This is critical: they need approved pillars with verified sources to do today's work. If a team has fewer than 5, they can still participate but should keep generating pillars as homework tonight. Don't dwell on problems — note who's behind and move on. "If you have 5 solid pillars, you're good for today. If you have more, even better."

---

## The 3-Phase Arc

<div style="text-align: center; margin: 20px 0;">
<img src="assets/three-phase-arc.svg" alt="3-Phase Arc: Interactive → Agent → Automated Chain" style="max-width: 90%; height: auto;">
</div>

Note:
Draw this on the whiteboard. "Here's where today fits in the bigger picture. Today is Phase 1 — you do everything interactively. You steer the AI at every step. You review. You push back. You decide what's good enough. Next week, Phase 2: you'll take what you learned today and build an agent — a system prompt that encodes YOUR quality standards so the AI can run with less steering. Sessions 19+, Phase 3: wire agents together in N8N, remove the human entirely, batch production at scale. The question you'll need to answer: which approach produces the best work? It's not obvious. Sometimes the human in the loop wins."

---

## Today's Periodic Table Focus

<div style="font-size: 20px; margin: 20px 0; text-align: center;">

**New element today:** Multi-modal (Mm)

</div>

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; max-width: 500px; margin: 30px auto; font-size: 14px; text-align: center;">

<div style="background: #fef3c7; padding: 10px; border-radius: 8px; border: 3px solid #f59e0b;"><strong>Mm</strong><br>Multi-modal</div>
<div style="background: #dbeafe; padding: 10px; border-radius: 8px; border: 2px solid #1971c2;"><strong>Pr</strong><br>Prompts</div>
<div style="background: #dbeafe; padding: 10px; border-radius: 8px; border: 2px solid #1971c2;"><strong>Fc</strong><br>Function Calling</div>
<div style="background: #dbeafe; padding: 10px; border-radius: 8px; border: 2px solid #1971c2;"><strong>Fw</strong><br>Frameworks</div>

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Mm = turning text into audio, audio into text, text into video scripts.<br>
Content moves across <strong>modes</strong> — that's multimodal AI.
</div>

Note:
Pull up the Miro periodic table. The big new element is Mm — multi-modal. Until now, everything has been text in, text out. Today, text becomes audio (NotebookLM), audio becomes text (transcription), and text becomes video scripts (decomposition). Content is moving across modes. That's what multimodal means in practice — not just that the AI can handle images, but that your content pipeline transforms material between formats. Pr is reinforced (manual prompting for reel scripts). Fc is reinforced (MCP writes to Baserow). Fw is reinforced (Baserow as the content management layer).

---

## Today's Pipeline

<div style="text-align: center; margin: 20px 0;">
<img src="assets/session-16-pipeline.svg" alt="Today's Pipeline: Pillar → Sources → NotebookLM → SuperScribe → Transcript → Reel Scripts → Baserow" style="max-width: 95%; height: auto;">
</div>

</div>

Note:
Walk through the pipeline. "Here's the full flow. You start with an approved pillar from Baserow. Grab the sources from the Resources field. Feed them into NotebookLM. Generate an audio overview — this is multimodal, text to audio. Download the audio. Transcribe it with SuperScribe — audio back to text, but now it's synthesized across all your sources. Store the transcript in Baserow. Then take the transcript and decompose it into 3-5 reel scripts using LibreChat. Store those reels in a new Baserow table via MCP. By the end of class, you should have transcripts for 1-2 pillars and a batch of reel scripts."

---

## What Is NotebookLM?

<div style="font-size: 19px; line-height: 1.8; margin: 30px 0;">

- Google's AI research assistant
- Upload sources → it reads and connects them
- **Audio Overview**: generates a podcast-style conversation that synthesizes your sources
- Same inputs can produce different outputs each time

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
NotebookLM doesn't just summarize — it finds <strong>connections between sources</strong> that you might miss
</div>

Note:
"NotebookLM is different from just asking ChatGPT to summarize your sources. It reads ALL your sources together and finds connections between them. The audio overview is a podcast-style conversation that synthesizes everything — it's not a summary, it's a synthesis. And here's the interesting part: if you generate the audio overview twice from the same sources, you get different results. Different emphasis, different examples, sometimes different insights. We'll use that later today."

---

## Demo: NotebookLM → Audio → Transcript

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

1. Create notebook → name it after your pillar
2. Add 3-5 sources from Resources field
3. Generate Audio Overview (5-7 min)
4. Download the audio file
5. Upload to [SuperScribe](https://www.superwebpros.com/tools/transcribe)
6. Get: transcript + semantic clusters

</div>

Note:
DEMO THIS LIVE with a pre-generated audio (don't wait 5 min). Show: create the notebook, add sources, explain what Audio Overview does, then switch to the pre-generated audio. Upload to SuperScribe, show the transcript and the semantic clusters. "The transcript is 2,000-3,000 words of synthesized content. The semantic clusters tell you what topics the audio actually covered and how much. Use the clusters to verify — did the audio actually talk about what you expected?" Then show pasting the transcript into the Baserow Transcript field. "Now your pillar row has everything: topic, description, sources, analysis, AND the synthesized transcript."

---

## Demo: Reel Script Decomposition

<div style="font-size: 18px; line-height: 1.6; margin: 20px 0;">

**Take ONE transcript → break it into 3-5 reel scripts**

Each reel = 80-120 words, one clear point:


> [HOOK - 3 seconds]
> Strong statement or question that stops the scroll
> 
> [SETUP - 10 seconds]
> Quick context
>
> [INSIGHT - 30 seconds]
> Main point with specific example
> 
> [TAKEAWAY - 10 seconds]
> Clear action or key learning

</div>

Note:
"You have a 2,000-3,000 word transcript that synthesizes multiple sources. Nobody watches a 15-minute video on Instagram. So we decompose it. One transcript becomes 3-5 reel scripts, each making ONE clear point, each 30-60 seconds. This is content atomization — taking one dense piece and extracting multiple smaller pieces." Show the prompt in LibreChat. Walk through one output. "See the structure? Hook, Setup, Insight, Takeaway. Notice — I had to write this whole prompt. I had to paste the transcript. I had to specify the format. Next session, we build an agent that already knows all of this."

---

## Playbook References

<div style="font-size: 20px; line-height: 2; margin: 40px 0;">

**NotebookLM → Audio → Pillar Content:**

https://www.superwebpros.com/articles/notebooklm-audio-overview-pillar-content

**Create Reel Scripts from Your Content:**

https://www.superwebpros.com/articles/create-reel-scripts

</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
These playbooks have the full step-by-step process.
</div>

Note:
Point them to the playbooks. "These are your reference guides. They have the exact prompts, the exact steps, screenshots. If you get stuck, check the playbook before you ask me." The NotebookLM playbook covers source selection, notebook creation, audio generation, and what to do with the output. The reel scripts playbook covers the decomposition prompt, review criteria, and iteration strategies.

---

## Step 1: Create `reels` Table

<div style="font-size: 18px; margin: 20px 0;">

| Field | Type | Purpose |
|-------|------|---------|
| **Title** | Short text | Reel name |
| **Pillar** | Link to Content Pillars | Which pillar it came from |
| **Hook** | Long text | Opening 3-second hook |
| **Script** | Long text | Full script (Hook → Setup → Insight → Takeaway) |
| **Status** | Single select | Draft / Reviewed / Approved / Produced |
| **Platform** | Multiple select | IG Reels / TikTok / YT Shorts / LinkedIn |
| **Notes** | Long text | Production notes, feedback |

</div>

Note:
Create this table and then immediately add it to your MCP server. In n8n, on the Search Baserow trigger, add two new tools: GET rows from reels, and CREATE row in reels. Important: write clear descriptions on each field in the CREATE tool. The AI uses those descriptions to know what goes where. "Hook: The opening 3-second attention-grabbing statement" — that tells the AI to put a punchy one-liner there, not the full script. Re-activate the workflow after adding the tools.

---

## Step 2: NotebookLM → SuperScribe Pipeline

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

Pick **3-5 approved pillars** and process each:

1. Create NotebookLM notebook → add sources
2. Generate audio overview (stagger — don't wait idle)
3. Download → upload to SuperScribe
4. Copy transcript → paste in Baserow Transcript field

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Start the next notebook while the audio generates. Don't sit idle.
</div>

Note:
15 minutes for this. They should stagger their work — start notebook 1, generate audio, while it's processing set up notebook 2. When audio 1 is done, download and transcribe while audio 2 generates. Circulate and check: "How many sources did you add?" "Did you listen to the first minute? Does it cover your topic?" "Did you check the semantic clusters?"

---

## Step 3: Generate Reel Scripts via MCP

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

Use LibreChat with MCP tools connected:

1. Paste the reel script prompt + transcript
2. Iterate with LLM to get reels that sound good/engaging, based on your client's vibe
3. Instruct system to save approved scripts in Baserow
4. Review what got stored — right data in right fields?

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
<strong>Don't just accept the first output.</strong> Review. Push back. Iterate.<br>
That's what being human-in-the-loop means.
</div>

Note:
This is where the human-in-the-loop matters. They paste the prompt, the AI generates scripts AND writes them to Baserow via MCP. But they need to CHECK: Is the hook in the Hook field? Is the script specific to their partner? Are the hooks strong enough? If not, push back: "These are too broad. Use more specific details from the transcript." "The hooks aren't strong enough." "Script 3 covers two ideas — split it." The iteration is the point. Next session they'll encode these quality standards into a system prompt.

---

## Step 4: Audio Regeneration Exercise

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

For ONE pillar you already processed:

1. Same NotebookLM notebook, same sources
2. Generate a **second** audio overview
3. Transcribe with SuperScribe
4. **Keep both transcripts** — compare them

</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Same inputs. Different outputs. What changed? What does that mean for automation?
</div>

Note:
5 minutes. This exercise is critical setup for Session 17. When they build an autonomous agent, it takes the first output without comparing. It won't regenerate and pick the better version. "Don't delete the first version. Keep both. We'll discuss what changed at the start of Session 17. What topics got different emphasis? Which version was better? How would you decide? This tells you something important about when to trust AI output and when to keep a human in the loop."

---

## Deliverable Reminder

<div style="font-size: 18px; margin: 20px 0;">

| What | When |
|------|------|
| Content pillar Google Sheet to partner | **Tuesday, March 17** |
| 10+ pillar transcripts in Baserow | Before Session 17 (Tuesday) |
| 10+ Reel scripts for 3-5 pillars in reels table | Before Session 17 (Tuesday) |
| Audio regeneration comparison notes | Bring to Session 17 |

</div>

Note:
Walk through each item. The Google Sheet deliverable is the big one — export the approved content pillars from Baserow into a Google Sheet and share with their partner by Tuesday. "I'm reaching out to all your partners tomorrow to update them on what's coming. By Tuesday, your pillar list should be in their inbox." The system prompt notes are for Session 17 — they'll need to think about: if you were writing instructions for an AI to do what you did today, what would you tell it?

---

## Tuesday Preview

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**Session 17: Building Your First Content Agent**

- Turn today's prompts into a system prompt
- Build a LibreChat agent that reads pillars and writes reels
- Less steering, more delegation

</div>

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Think about: what rules does the agent need? What should it always do? Never do?<br>
How do you encode <strong>your</strong> quality judgment into instructions for an AI?
</div>

Note:
"Tuesday we start with a discussion about the audio regeneration exercise. Then you take the reel prompt you used today and turn it into something more powerful — a LibreChat agent with a system prompt. Your MCP server already connects to both tables. The difference: today YOU steered every interaction. Tuesday, the agent handles more of that autonomously. Start thinking now: what makes a good system prompt? What rules? What format? What should the agent always do? Never do? How do you encode your quality judgment?" Also: "Talk to your business partners about HeyGen and Submagic accounts — we'll need those for Sessions 19-20."
