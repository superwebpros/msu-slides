## Opening: What Went Wrong, What Surprised You

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**Audio Regeneration:** Same inputs → different outputs

**URL Hallucination:** Sources that 404'd in NotebookLM

</div>

Note:
Two real problems. Start with audio regeneration: "Who regenerated an audio overview from the same sources? What was different?" Get 2-3 students to share. Push: "Which version was better? How did you decide? When you build an agent, it won't regenerate and compare. It takes the first output." Then URL hallucination: "How many of you had URLs that 404'd?" Expect most hands. Discuss the Fetch tool as a validation step. Frame the cost question: "If you were building an agent chain that validates sources automatically — what model would you use? The most expensive one? Or the cheapest one that can make a binary yes/no check?" URL validation = low-complexity, high-volume → cheapest model. Bridge: "You've hit two real problems every AI system faces: nondeterminism and hallucination. Both get worse when you remove the human. Context engineering is how you manage both."

---

## The 3-Phase Arc

<div style="text-align: center; margin: 20px 0;">
<img src="assets/three-phase-arc-phase2.svg" alt="3-Phase Arc: Phase 2 Agent highlighted" style="max-width: 90%; height: auto;">
</div>

Note:
"Thursday you were here — Phase 1, interactive. You steered every step. Today we move to Phase 2. You're going to build an agent — a system prompt that encodes YOUR quality standards — and let it run with less steering. The agent reads your pillars via MCP, writes reels via MCP. You delegate, then review. The question you'll answer by the end of class: does the agent produce work that's as good as what you did interactively? Better? Worse? Different?"

---

## Today's Periodic Table Focus

<div style="font-size: 20px; margin: 20px 0; text-align: center;">

**New element today:** Agents (Ag)

</div>

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; max-width: 500px; margin: 30px auto; font-size: 14px; text-align: center;">

<div style="background: #fef3c7; padding: 10px; border-radius: 8px; border: 3px solid #f59e0b;"><strong>Ag</strong><br>Agents</div>
<div style="background: #dbeafe; padding: 10px; border-radius: 8px; border: 2px solid #1971c2;"><strong>Pr</strong><br>Prompts</div>
<div style="background: #dbeafe; padding: 10px; border-radius: 8px; border: 2px solid #1971c2;"><strong>Fc</strong><br>Function Calling</div>
<div style="background: #dbeafe; padding: 10px; border-radius: 8px; border: 2px solid #1971c2;"><strong>Mm</strong><br>Multi-modal</div>

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
An agent = <strong>system prompt</strong> + <strong>tools</strong> + <strong>behavioral boundaries</strong>
</div>

Note:
Pull up the Miro periodic table. The big new element is Ag — Agents. Until now, you've been prompting manually. An agent is a system prompt that defines how the AI should behave, plus tools it can use, plus constraints on what it should and shouldn't do. Pr is deepened — system prompts vs. user prompts. Context engineering as a discipline. Fc is applied — the agent uses MCP tools autonomously. Mm carries over from Thursday.

---

## What is Context Engineering?

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

Not just prompt engineering — it's **everything** the model sees:

system prompt + tools + examples + message history

</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
"Find the smallest set of <strong>high-signal tokens</strong> that maximize the likelihood of your desired outcome."<br>
<span style="font-size: 14px; color: #868e96;">— Anthropic, <em>Effective Context Engineering for AI Agents</em></span>
</div>

Note:
Don't over-explain this. They'll learn context engineering by doing the experiment. Frame the distinction: "Prompt engineering is writing one good prompt. Context engineering is managing EVERYTHING the model sees — system prompt, tool descriptions, examples, conversation history — across multiple turns. As agents run longer, context becomes a finite resource. The model has a limited attention budget, like human working memory. More tokens = more noise = worse performance. So the goal is: smallest set of high-signal tokens that get the job done." Reference the full article for anyone who wants to go deeper: anthropic.com/engineering/effective-context-engineering-for-ai-agents

;;;

### Right Altitude

<div style="font-size: 14px; color: #868e96; margin-bottom: 10px;">Specific enough to guide behavior, flexible enough to provide strong heuristics the model can adapt.</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; font-size: 16px;">

<div style="background: #d3f9d8; padding: 15px; border-radius: 8px; border-left: 4px solid #2f9e44;">
<strong>Variant C:</strong><br>
"Each reel makes ONE point. Use confident language. 80-120 words."<br><br>
<em>Clear heuristics — guides without prescribing every detail.</em>
</div>

<div style="background: #ffe3e3; padding: 15px; border-radius: 8px; border-left: 4px solid #e03131;">
<strong>Variant B:</strong><br>
"If healthcare → empathetic. If tech → excited. Exactly 95 words. Hook must be a question."<br><br>
<em>Brittle if-else logic that breaks on any edge case.</em>
</div>

</div>

Note:
This maps directly to the Anthropic article's "Finding the Right Altitude" section. Two failure modes: overly complex, brittle if-else logic (Variant B) versus vague guidance that assumes shared context (Variant A). The sweet spot is specific enough to guide behavior but flexible enough to provide heuristics the model can adapt. Variant C hits this — it says "80-120 words" not "exactly 95 words." It says "confident tone" not "if healthcare, use empathetic tone." The article recommends: start minimal on your best model, then add instructions based on failure modes you discover during testing. That's exactly what the experiment teaches.

;;;

### Signal Density

<div style="font-size: 14px; color: #868e96; margin-bottom: 10px;">Every instruction should change the output. If you remove it and nothing changes, it's noise.</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; font-size: 16px;">

<div style="background: #d3f9d8; padding: 15px; border-radius: 8px; border-left: 4px solid #2f9e44;">
<strong>High signal:</strong><br>
"Confident tone: use 'will', 'does' — never 'might', 'could', 'perhaps'."<br><br>
<em>Measurably changes every sentence the agent writes.</em>
</div>

<div style="background: #ffe3e3; padding: 15px; border-radius: 8px; border-left: 4px solid #e03131;">
<strong>Low signal:</strong><br>
"Write high-quality, engaging, professional content that resonates with the target audience."<br><br>
<em>Sounds good. Changes nothing. The model was already trying to do that.</em>
</div>

</div>

Note:
The Anthropic article frames context as a finite resource — the model has a limited "attention budget" like human working memory. As token count increases, the model's ability to recall information decreases. They call this "context rot." So every token in your system prompt needs to earn its place. "Write high-quality content" is wasted tokens — the model defaults to that. "Use 'will' not 'might'" actually changes behavior. The test: delete the instruction, run the agent again. Did the output change? If not, cut it. You're freeing up attention budget for the instructions that matter.

;;;

### Examples > Rules

<div style="font-size: 14px; color: #868e96; margin-bottom: 10px;">"For an LLM, examples are the 'pictures' worth a thousand words." — Anthropic</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; font-size: 16px;">

<div style="background: #d3f9d8; padding: 15px; border-radius: 8px; border-left: 4px solid #2f9e44;">
<strong>Variant C/D:</strong><br>
One annotated example: "↑ Notice: one point, specific data, confident language, clear takeaway."<br><br>
<em>Diverse, canonical examples that portray expected behavior.</em>
</div>

<div style="background: #ffe3e3; padding: 15px; border-radius: 8px; border-left: 4px solid #e03131;">
<strong>Variant B:</strong><br>
"Never use 'innovative'. Always mention company name. Takeaway must start with 'Remember:'."<br><br>
<em>Laundry list of edge-case rules. Agent follows blindly.</em>
</div>

</div>

Note:
The article is explicit: "Curate diverse, canonical examples that effectively portray expected behavior rather than exhaustive edge cases." The anti-pattern is "stuffing laundry lists of edge cases into prompts attempting to articulate every possible rule." That's exactly what Variant B does. Variant C shows one annotated example — the agent learns the PATTERN, not just the FORMAT. Variant D adds a second example with a different hook style, showing the agent acceptable variation. The article recommends diverse examples over exhaustive rules every time.

;;;

### Tools as Instructions

<div style="font-size: 14px; color: #868e96; margin-bottom: 10px;">"Input parameters must be descriptive and unambiguous." — Anthropic</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; font-size: 16px;">

<div style="background: #d3f9d8; padding: 15px; border-radius: 8px; border-left: 4px solid #2f9e44;">
<strong>Descriptive:</strong><br>
MCP field: "Hook: The opening 3-second attention-grabbing statement that stops the scroll"<br><br>
<em>Field description tells the agent exactly what belongs here.</em>
</div>

<div style="background: #ffe3e3; padding: 15px; border-radius: 8px; border-left: 4px solid #e03131;">
<strong>Ambiguous:</strong><br>
MCP field: "Hook: text"<br><br>
<em>Agent puts anything here — full script, title, random text.</em>
</div>

</div>

Note:
The Anthropic article has a whole section on tools: "Tools should be self-contained and robust to error, extremely clear regarding intended use, with input parameters that are descriptive and unambiguous." They also warn against bloated tool sets — "if a human engineer can't definitively say which tool applies in a situation, an AI agent can't do better." Your MCP field descriptions ARE tool parameters. When the agent calls "Create reels row," it reads those descriptions to decide what data goes in each field. "Hook: text" is ambiguous — the agent might dump anything there. "Hook: The opening 3-second attention-grabbing statement that stops the scroll" is descriptive and unambiguous. The system prompt isn't the only place you give the agent instructions — your tools are instructions too.

---

## Quick Demo: Agent Builder

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

1. Select **Agents** from endpoint menu
2. Open **Agent Builder** in Side Panel
3. Fill in: Name, Description, **Instructions** (system prompt)
4. Select model
5. **Add Tools** → select your MCP server(s)
6. Save

</div>

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
The hard part isn't clicking buttons — it's writing the instructions.
</div>

Note:
Screen share. Walk through the LibreChat Agent Builder UI fast. Show: endpoint menu → Agents. Side panel → Agent Builder. Name it "Reel Script Agent". Description: "Creates short-form video scripts from content pillar transcripts". Instructions: "This is where the system prompt goes — your agent's brain. We'll workshop this in a minute." Select model. Add Tools → expand MCP server → check content_pillars read, reels read, reels write. Save. "That's the mechanics. 2 minutes. The hard part is the next 25."

---

## Phase 1: The Experiment

---

### 4 Variants, 1 Pillar

<div style="font-size: 18px; margin: 20px 0;">

Each team member builds a different agent. **Same pillar, different system prompts.**

| Variant | Style | Key Trait |
|---------|-------|-----------|
| **A** | Bare Minimum | Two sentences. No format, no rules. |
| **B** | Micromanager | Rigid rules for every scenario. |
| **C** | Right Altitude | Clear task + format + rules + 1 example |
| **D** | Right Altitude + Few-Shot | Variant C + second example showing variation |

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Full variant text is in your D2L assignment.
</div>

Note:
"Instead of me telling you what makes a good system prompt, you're going to find out. Each person builds a reel agent with a DIFFERENT system prompt. You all run it on the SAME pillar. Then you compare." Quickly walk through the variants — don't read them out, just characterize: A is bare bones, B is over-specified, C is balanced with one example, D adds a second example. "Each variant is deliberately different. Some are better than others. Your job is to figure out which and WHY." If teams have fewer than 4 members, skip D. If more than 4, double up. They have 12 minutes to build and run, then 8 minutes to compare.

---

## Run the Experiment

<div style="font-size: 20px; line-height: 1.8; margin: 40px 0;">

1. Pick ONE shared pillar (must have transcript)
2. Each member: build your variant agent
3. Run: *"Create reel scripts from my pillar about [topic]"*
4. Check Baserow — don't touch each other's output

</div>

Note:
12 minutes. Circulate. Common issues: MCP tools not appearing (is the n8n workflow active?), agent not using tools (did they check the specific tools, not just add the server?), agent ignoring format (Variant A will do this — that's the point). Don't fix problems yet — let the experiment show the differences. If a team finishes early, have them look at the reels table and start noting differences.

---

## Compare Results

<div style="font-size: 18px; margin: 20px 0;">

Look at all four outputs in Baserow side by side:

- Which variant produced the strongest **hooks**?
- Which scripts are most **specific to your partner**?
- Which followed the **format** best?
- Which felt most **ready to use**?
- How many **turns** did each variant need?

</div>


<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 16px; text-align: center;">
<strong>Phase 1 deliverable:</strong> Group reflection email comparing variants (due before Thursday)
</div>

Note:
8 minutes for group comparison, then 2 minutes for 1-2 groups to share out. Listen for: "A just dumped generic scripts", "B was too rigid — the 95-word limit made the scripts awkward", "C was the most usable", "D's hooks were more varied because of the second example." Surface the principles as they report — write on whiteboard. Don't lecture. Let them discover: Right Altitude (not too vague, not too rigid), Signal Density (every instruction should change behavior), Tools as Instructions (MCP field descriptions matter), Examples > Rules (one annotated example taught more than all of B's rules). "You didn't need me to lecture on these. You discovered them by running the experiment."

---

## Phase 2: Build Your Real Agent

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

Don't copy-paste the best variant — **build your system prompt through conversation with Claude.**

1. Start from your best variant as a **reference**, not a template
2. Use the builder prompt in D2L — Claude reads your MCP data first
3. Build section by section: Task → Format → Quality Rules → Examples
4. Check MCP field descriptions — they're instructions too
5. Save the agent

</div>

Note:
10 minutes. The assignment has a detailed prompt template where students open a fresh LibreChat chat (NOT the agent) and work with Claude to build their system prompt section by section. Claude reads their content_pillars table and partner data via MCP first, then drafts each section and asks the student to approve or push back. This forces them to think about every decision. Key circulating questions: "What did you change from the variant? Why?" "Show me your example — is it annotated? Does it teach the agent something?" "Did Claude pull your partner data before drafting?" Common issues: MCP tools not appearing (is n8n workflow active?), agent ignoring instructions (system prompt too vague), students just copy-pasting instead of building conversationally.

---

## Run Your Agent + Iterate

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

Process **3-5 pillars** through your agent

- Review what lands in Baserow
- Compare to your Session 16 interactive output
- Track: how many **turns** to get usable output?

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
If output is <em>consistently</em> weak, <strong>fix the system prompt</strong> — not the individual reels.
</div>


Note:
25 minutes total — 15 for running + iterating, 10 for circulating group discussions. Key insight at each group: "When you were interactive, YOU were the quality control. With the agent, the SYSTEM PROMPT is the quality control. If the prompt is weak, every output is weak. If it's strong, you get consistent quality at scale." Ask each team: "Show me your agent output vs. your Thursday interactive output. Which is better?" "How many turns?" "What's in your system prompt that made the biggest difference?" "Where does the agent still fall short?" The tradeoff: interactive gives more control per item but takes more turns. Agent gives throughput with less control. Neither is always better.

---

## Deliverable Reminder

<div style="font-size: 18px; margin: 20px 0;">

| What | When |
|------|------|
| Group reflection email | Before Thursday (March 19) |
| Agent run on ALL remaining pillars | Before Thursday |
| Iterate system prompt based on results | Before Thursday |
| Reels added to content calendar | Before Tuesday |
| HeyGen + Submagic accounts confirmed | Before Thursday |

</div>

Note:
Walk through each. The reflection email: subject line "[Team Name] - Session 17 Context Engineering Observations". Include variant comparison summary, final system prompt, turns comparison (interactive vs. agent), surprises, what you'd change. Doesn't need to be long — 1 page. The big homework: run the agent on ALL remaining approved pillars. Every pillar should have 3-5 reels. Iterate on the system prompt if output is weak. Mark 5-8 best scripts as "Reviewed" — those are the ones you'll turn into videos Thursday. HeyGen and Submagic: if your partner hasn't set up accounts, it needs to happen before Thursday. No accounts = no video production.

---

## Thursday Preview

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

**Session 18: HeyGen Videos & Submagic Enhancement**

- Take reel scripts from Baserow → HeyGen avatar videos
- Add captions, B-roll, effects with Submagic
- By Thursday: social-ready videos from pillar transcripts

</div>

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Have your 5-8 best scripts ready.<br>
Make sure HeyGen + Submagic accounts are set up.
</div>

Note:
"Thursday we take these reel scripts and turn them into actual videos. HeyGen creates AI avatar videos from your scripts, Submagic adds captions, B-roll, and effects. By Thursday's end, you'll have social-ready videos that started as pillar transcripts last Tuesday." Emphasize: have 5-8 scripts ready and marked as Reviewed. HeyGen and Submagic accounts MUST be set up. "Talk to your business partners today if they haven't done it."
