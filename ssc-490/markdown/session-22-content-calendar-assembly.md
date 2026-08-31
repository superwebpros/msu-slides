## Status Check

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

Who has a working fal.ai workflow from Tuesday?

</div>

Note:
"By show of hands — who has a working fal.ai workflow from Tuesday?" For teams where only one person has it working: "The person who got it working is going to walk their partner through it while they build. That's part of the job — being able to explain a system you built. Teaching it is how you verify you understand it." Quick pair-up. Don't spend more than 2 minutes on this.

---

## Today's Architecture

<img src="assets/fal-ai-workflow-v2.png" style="max-height: 450px;">

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 15px 0; font-size: 18px; text-align: center;">
Tuesday: you triggered the workflow manually.<br>
Today: the <strong>agent</strong> triggers it through an <strong>MCP server</strong>.
</div>

Note:
"Tuesday you built a workflow that you triggered manually. Today we make it callable — the MCP server calls it when the agent asks for an image." Walk through the diagram. Two new things: the trigger changes to 'When Executed by Another Workflow' — instead of a button you click, another workflow calls this one. And we add an If branch so the same workflow can either create a new image or edit an existing one. One workflow, two modes. "Then we build the MCP server that wires everything together. By end of class: the agent asks for an image, it flows through the MCP server, calls the workflow, fal.ai generates or edits the image, stores it in Baserow."

---

## Upgrade the Fal.ai Workflow

<div style="font-size: 18px; margin: 20px 0;">

**New trigger:** "When Executed by Another Workflow" — for machines, not humans.

| Parameter | Type | Purpose |
|-----------|------|---------|
| `prompt` | string | The image generation prompt |
| `filename` | string | Descriptive name for storage |
| `create_or_edit` | string | "create" or "edit" |
| `file_url` | string | URL of image to edit (edit mode only) |

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
The Form Trigger is for humans. This trigger is for other workflows.<br>
That's how you make a workflow into a <strong>callable service</strong>.
</div>

Note:
"The Form Trigger and Manual Trigger are for humans. 'When Executed by Another Workflow' is for machines — specifically, for N8N's toolWorkflow node, which we'll build in Part 3. This is how you make a workflow into a callable service." Show the input parameter configuration. "Notice filename and file_url are new. Think about where these come from — the MCP server will pass them in. The agent will decide the filename and, for edits, which image URL to modify." Update the Set node to map the new fields too — straightforward, same pattern as before.

;;;

### The If Branch: Create or Edit

<div style="font-size: 18px; margin: 20px 0;">

After Set, add an **If node**: `create_or_edit` equals `"create"`

- **True →** Generate Image (your existing workflow from Tuesday)
- **False →** Edit Image (new HTTP Request to `/edit` endpoint)

</div>

<div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 16px;">

**The catch:** The edit endpoint needs `image_urls` as an **array**.

N8N's "fields below" mode sends everything as strings — it can't send arrays.

Switch to **"Specify Body: JSON"** and write the payload yourself.

<div style="margin-top: 10px;"><strong>Before you build this:</strong> ask your AI — why can't "fields below" send an array? What's <code>toJsonString()</code> and when do you need it?</div>

</div>

Note:
"Now we add the decision point. After Set, add an If node. The condition: create_or_edit equals 'create'. True goes to your existing Generate Image node — the workflow you built Tuesday. False goes to a new Edit Image node." The edit endpoint is POST to queue.fal.run/fal-ai/nano-banana-pro/edit. Same webhook pattern — same Wait and Retrieve nodes after. Same Baserow storage at the end. "But here's where it gets interesting: the edit endpoint needs image_urls as an array. N8N's HTTP node in 'fields below' mode always sends values as strings. You can't send an array that way. So for the edit node, switch to 'Specify Body: JSON' and write the payload yourself." Don't give them the JSON — they figure out the structure from the docs and their AI conversation. Both branches get the same Wait → Retrieve → Create Row treatment after the HTTP request.

---

## Build the MCP Server

<div style="font-size: 18px; margin: 20px 0;">

A **separate workflow** that makes your fal.ai workflow callable by agents.

**Two tools on the MCP trigger:**

</div>

<div style="display: flex; gap: 20px; margin: 20px 0; font-size: 16px;">
<div style="flex: 1; background: #dbeafe; padding: 20px; border-radius: 10px;">
<div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">toolWorkflow</div>
Calls your fal.ai workflow by ID.<br>
Passes: prompt, filename, create_or_edit, file_url.<br>
Uses <code>$fromAI()</code> for parameter descriptions.
</div>
<div style="flex: 1; background: #e8f5e9; padding: 20px; border-radius: 10px;">
<div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">baserowTool</div>
Searches your existing images table.<br>
Agent can look up what's already been generated before creating new.
</div>
</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 15px 0; font-size: 18px; text-align: center;">
Connect to LibreChat on your Art Director agent. Test end-to-end.
</div>

Note:
"The MCP server is a separate N8N workflow — not the fal.ai workflow itself." It has an mcpTrigger node with two tool outputs: a toolWorkflow node that calls the fal.ai workflow by ID, and a baserowTool node for searching existing images. "The mcpTrigger exposes this workflow as an MCP server via SSE. LibreChat connects to it the same way you've connected MCP servers before." Demo on projector: new workflow → mcpTrigger → toolWorkflow (configure workflow ID, map 4 parameters with $fromAI() descriptions) → baserowTool for image search → both as ai_tool outputs → activate → copy MCP URL. Students build and connect to LibreChat on their Art Director agent. Test: ask the agent to generate an image for a content pillar. Verify image appears in Baserow. Success check: agent receives request → MCP triggers fal.ai workflow → image generated and stored → agent reports back the URL.

---

## Baserow Cleanup

<div style="font-size: 18px; margin: 20px 0;">

Open your workspace. Every table: **Keep**, **Delete**, or **Merge**.

</div>

<div style="font-size: 16px; margin: 20px 0;">

**Core tables to keep:**

| Table | Purpose |
|-------|---------|
| `content_pillars` | 30 researched topics + transcripts |
| `reels` | Reel scripts from pillars |
| `images` | Generated images with prompts |
| `content_calendar` | Scheduled content across all types (create if missing) |

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Your Claude connector will expose these table names.<br>
Messy names make for messy tools. <strong>snake_case, descriptive.</strong>
</div>

Note:
"Quick but important. Open your Baserow workspace. Make a list — every table you have. Mark it Keep, Delete, or Merge. Then delete the junk." Core tables: content_pillars, reels, images, content_calendar. Create content_calendar if it doesn't exist yet — they'll need it for the final project. "If your table names are inconsistent, fix them now. snake_case, descriptive. Your Claude connector will expose these table names — messy names make for messy tools." This continues Tuesday before the final project starts. 10 minutes max — just get the obvious junk deleted and names fixed.

---

## Deliverables

<div style="display: flex; gap: 20px; margin: 20px 0; font-size: 16px;">
<div style="flex: 1; background: #e8f5e9; padding: 20px; border-radius: 10px;">
<div style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">Today</div>

- Fal.ai workflow upgraded (create + edit)
- MCP server built and connected
- Agent → MCP → fal.ai → Baserow tested
- Baserow junk tables deleted

</div>
<div style="flex: 1; background: #dbeafe; padding: 20px; border-radius: 10px;">
<div style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">For Tuesday</div>

- Finish anything not done today
- Read the final project assignment
- **Partner invite sent for April 22** — delivery day
- Baserow workspace clean and ready

</div>
</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
<strong>Tuesday:</strong> Final project sprint begins. Claude Project setup + first two skills.<br>
Every session from here to April 22 has a checkpoint.
</div>

Note:
"Starting Tuesday: the final project. First milestone is Claude Project setup + first two skills. Read the assignment — it's posted." The partner invite is critical — April 22 is delivery day. "If you haven't sent it, send it today. They need to be in the room." Every session from here has a checkpoint. The system you've been building all semester — semantic audit, content pillars, transcripts, reels, images — it all comes together into a deliverable product your partner can use.
