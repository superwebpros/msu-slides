## Partner Video Feedback

<div style="font-size: 22px; line-height: 2; margin: 40px 0;">

What did your partner say?

- Avatar? Voice? Content?
- What would you change for the next round?

</div>

Note:
Quick round-robin, 60 seconds per team. "What did your partner say about the videos? Did they react to the avatar? The voice? The content itself? What would you change for the next round?" If a team didn't get feedback yet: "That's fine — follow up this week. But notice that the teams who DID get feedback now have a direction. That's the value of shipping early." Spend 5 minutes on sharing, 5 on discussion of common themes, 5 on teams noting action items. Don't let this run long — 15 minutes max, then move on.

---

## New Modality: Text → Image

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**Text models** follow instructions — like talking to an assistant.

**Image models** interpret scene descriptions — like directing a cinematographer.

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
"Make it more professional" works in text.<br>
In images, you need to say <strong>how</strong> — "soft diffused studio lighting, clean white background, shallow depth of field."
</div>

Note:
This is the key mental model shift. "When you prompt a text model, you're giving instructions to an assistant. When you prompt an image model, you're directing a scene — like a film director describing a shot to a cinematographer. The model doesn't reason about what you want. It interprets your words as a scene description." Key differences: text models follow instructions, image models interpret descriptions. "Make it more professional" works in text — the model understands the concept. In images, you need to be specific about HOW — what lighting, what background, what camera angle. Word order matters too — image models (especially FLUX) weigh early tokens more heavily. Front-load what matters most.

---

## The 7 Building Blocks

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

Every image prompt is made of up to **7 building blocks.**

You don't need all 7 every time — but the more you specify, the less the model guesses.

</div>

<div style="background: #f3e8ff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Let's walk through them with one example prompt.
</div>

Note:
"Every image prompt can include up to 7 building blocks. You don't need all 7 every time, but the more you specify, the less the model guesses. And when the model guesses, it usually guesses wrong." We're going to walk through each block one at a time using the same base scene, so you can see what each one controls. Pay attention to how the image changes as we add each piece.

;;;

### 1. Subject + 2. Action/Pose

<div style="display: flex; gap: 20px; align-items: center; margin: 20px 0;">
<div style="flex: 1;">

<div style="font-size: 18px; line-height: 1.8;">

**Subject** — who/what, with 3-5 descriptors

**Action/Pose** — what they're doing

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 16px;">
<code>A man cruising the California coast in a sports car convertible</code>
</div>

</div>
<div style="flex: 1;">
<img src="https://s3.amazonaws.com/resources.superwebpros.com/bb/image/general/038b85fb-1af5-48de-8fad-469e413473ca-gemini_image_gen_img_ya4o4w6xedp-2ilyhtkwy.png" style="max-height: 350px; border-radius: 10px;">
</div>
</div>

Note:
Subject and Action/Pose are the foundation — the "who" and the "what." Here: a man (subject) cruising in a convertible (action). Notice the model fills in everything else — environment, lighting, style, mood. It's decent, but generic. We didn't tell it WHEN, WHERE specifically, HOW to shoot it, or what FEEL we want. Let's start adding blocks.

;;;

### 3. Environment

<div style="display: flex; gap: 20px; align-items: center; margin: 20px 0;">
<div style="flex: 1;">

<div style="font-size: 18px; line-height: 1.8;">

**Environment** — where, surroundings, time

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 16px;">
<code>A man cruising the California coast in a sports car convertible, <strong>winding Pacific Coast Highway with ocean cliffs and crashing waves below</strong></code>
</div>

</div>
<div style="flex: 1;">
<img src="https://s3.amazonaws.com/resources.superwebpros.com/bb/image/general/1b1f2255-b826-4579-8687-cc32c0e0f751-gemini_image_gen_img_kgzy6aotv5glc3zspslat.png" style="max-height: 350px; border-radius: 10px;">
</div>
</div>

Note:
Now we've placed the scene. "Winding Pacific Coast Highway with ocean cliffs and crashing waves" — the model knows exactly where this is happening. Compare to the first image where the background was generic. Environment grounds the image in a specific place and time.

;;;

### 4. Composition

<div style="font-size: 18px; line-height: 1.8; margin: 10px 0;">

**Composition** — camera angle, framing, lens

</div>

<div style="display: flex; gap: 20px; align-items: center; margin: 10px 0;">
<div style="flex: 1; text-align: center;">
<img src="https://s3.amazonaws.com/resources.superwebpros.com/bb/image/general/1b629f32-f874-45c0-a45a-788e949386d4-gemini_image_gen_img_bke2i3fofzq9sda7zgj9n.png" style="max-height: 280px; border-radius: 10px;">
<div style="font-size: 14px; margin-top: 8px;"><code>wide-angle tracking shot from above</code></div>
</div>
<div style="flex: 1; text-align: center;">
<img src="https://s3.amazonaws.com/resources.superwebpros.com/bb/image/general/a7a95123-6e43-4f7d-9751-f5621c3630ed-gemini_image_gen_img_knf8wljgwzxqwu8nhcr-v.png" style="max-height: 280px; border-radius: 10px;">
<div style="font-size: 14px; margin-top: 8px;"><code>dutch angle tilted shot, dynamic</code></div>
</div>
</div>

Note:
Composition is how the camera sees the scene. Same subject, same environment — but the wide tracking shot feels cinematic and expansive, while the dutch angle feels dynamic and off-balance. This is just camera placement. A close-up of the driver's face would tell yet another story. Composition controls what the viewer focuses on and how the image feels spatially.

;;;

### 5. Lighting

<div style="display: flex; gap: 20px; align-items: center; margin: 20px 0;">
<div style="flex: 1;">

<div style="font-size: 18px; line-height: 1.8;">

**Lighting** — the single biggest quality lever beginners miss

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 16px;">
<code>A man cruising the California coast in a sports car convertible, winding Pacific Coast Highway with ocean cliffs, <strong>golden hour sunlight streaming from the left, long warm shadows across the road, sun flare on the windshield</strong></code>
</div>

</div>
<div style="flex: 1;">
<img src="https://s3.amazonaws.com/resources.superwebpros.com/bb/image/general/2c85ad7b-80c9-4cb8-9cfe-08b7fa205dc2-gemini_image_gen_img_ylxdgo6feqhkga-xff2md.png" style="max-height: 350px; border-radius: 10px;">
</div>
</div>

Note:
Lighting is the single biggest quality lever that beginners miss. "Golden hour sunlight streaming from the left, long warm shadows, sun flare on the windshield." Compare this to flat midday light — same scene, completely different mood. Lighting controls emotion more than any other block. This is why the Grammar of Design has 30+ lighting terms. When an image looks "off" but you can't explain why, it's usually the lighting.

;;;

### 6. Style + 7. Mood

<div style="display: flex; gap: 20px; align-items: center; margin: 20px 0;">
<div style="flex: 1;">

<div style="font-size: 18px; line-height: 1.8;">

**Style** — photo? illustration? what kind?

**Mood** — the emotional tone

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 16px;">
<code>...sun flare on the windshield, <strong>cinematic film photography with shallow depth of field, free-spirited and aspirational atmosphere</strong></code>
</div>

</div>
<div style="flex: 1;">
<img src="https://s3.amazonaws.com/resources.superwebpros.com/bb/image/general/f81b6d1b-4c5e-4b72-822d-93155d0d59a7-gemini_image_gen_img_hit31qv-n342zymmyvgvf.png" style="max-height: 350px; border-radius: 10px;">
</div>
</div>

Note:
Style tells the model WHAT KIND of image — "cinematic film photography with shallow depth of field" is very different from "flat vector illustration" or "oil painting." Mood is the emotional wrapper — "free-spirited and aspirational" vs. "dark and moody" would produce dramatically different results even with everything else the same. Together, these two blocks are the finishing touches that make an image feel intentional rather than random.

;;;

### All 7 Together

<div style="display: flex; gap: 20px; align-items: center; margin: 20px 0;">
<div style="flex: 1;">

<div style="font-size: 14px;">

```
A man cruising the California coast
in a sports car convertible, winding
Pacific Coast Highway with ocean cliffs
and crashing waves below, tracking shot
from slightly above and behind, golden
hour sunlight streaming from the left,
long warm shadows across the road, sun
flare on the windshield, cinematic film
photography with shallow depth of field,
free-spirited and aspirational atmosphere
```

</div>

<div style="background: #f3e8ff; padding: 12px; border-radius: 10px; margin: 10px 0; font-size: 16px; text-align: center;">
The more you specify, the less the model guesses.
</div>

</div>
<div style="flex: 1;">
<img src="https://s3.amazonaws.com/resources.superwebpros.com/bb/image/general/d0dd7262-c318-428a-82c2-c13b654a12ac-gemini_image_gen_img_llr9ovzkqm38x_ubmqx3o.png" style="max-height: 380px; border-radius: 10px;">
</div>
</div>

Note:
Here's the full prompt with all 7 blocks. Subject, action, environment, composition, lighting, style, mood — each one constraining the model so it produces what YOU envisioned, not what its training data averaged. "The more you specify, the less the model guesses. And when the model guesses, it usually guesses wrong." Now — how do you know what words to use for lighting, composition, style? That's what the Grammar of Design is for.

---

## Set Up Your Image Gen Agent

<div style="font-size: 18px; margin: 20px 0;">

Image gen in LibreChat works through **agents with image tools**. Each person creates a different agent:

| Person | Image Tool |
|--------|------------|
| A | Flux image generation |
| B | Gemini image generation |
| C | OpenAI / GPT-Image generation |

**System prompt for all:**
```
You are an agent who specializes in image generation
using the image generation tool you have access to.
```

</div>

<div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Same prompts, different models. You'll compare at the end.
</div>

Note:
This is a LibreChat-specific setup step. Image generation doesn't work from the regular chat — you need an agent with an image tool attached. Each person creates a different agent with a different image model. The system prompt is deliberately minimal — we want to see what each model does with the same inputs, not steer the agent's behavior. Walk them through: Agents → Agent Builder → name it "Image Gen - [Model] - [Your Name]" → add the ONE image tool → save → switch to your agent. This should take 2-3 minutes. If a team has only 2 people, skip one model. If 4+, double up. This mirrors the reel variant experiment — fixed input, vary the engine, compare.

---

## Grammar of Design

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

Your **visual vocabulary menu** — hundreds of terms organized by category:

Lighting · Composition · Style · Color · Mood · Texture

Each term has a plain-English description of what it actually produces.

</div>


Note:
The Grammar of Design is on D2L. "Think of this like a menu at a restaurant. You don't need to memorize it. You scan it until you find what you want — or discover something you didn't know existed. The biggest barrier to good image prompts is vocabulary: you can't ask for something if you don't know the word for it." Have them open it now. They'll use it throughout the exercise. Quick preview: lighting alone has 30+ terms across types, qualities, named setups, time-of-day, and mood lighting. Composition has shot types, camera angles, depth of field, lens types. Style has photography, illustration, art movements, rendering styles. This is their cheat sheet.

---

## Now You Try It

<div style="font-size: 18px; margin: 20px 0;">

Everyone generates the **same subject** with progressively better prompts:

| Level | What You Do | What You Learn |
|-------|------------|----------------|
| **0** | Pick 3 unknown terms, test on a coffee cup | Expand your vocabulary |
| **1** | "An MSU Spartan" — raw, unstructured | See what the model guesses |
| **2** | Structured prompt with all 7 blocks | See the quality jump |
| **3** | Change ONE variable at a time | Build intuition for each block |

</div>

<div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
Full prompts and comparison tables are in your D2L assignment.
</div>

Note:
This follows the assignment doc step by step. Same approach as the reel variant experiment: fixed input, vary the technique, compare. Added twist: each person is using a different model, so they'll also compare across Flux vs. Gemini vs. OpenAI. Part 0 (10 min): vocabulary exploration. Pick 3 unknown terms — one each from lighting, style, and mood — and test on "coffee cup on a wooden table, [term]". Compare with teammates: did the same term produce similar results across models? Level 1 (10 min): raw prompt, "An MSU Spartan". Level 2 (10 min): structured prompt with all 7 blocks. Level 3 (15 min): change one variable exercises. Images take 1-3 minutes to render — while one renders, prep the next prompt. Don't wait idle.

---

## Deliverables

<div style="font-size: 20px; line-height: 2; margin: 30px 0;">

**Today:** Levels 1-3 complete with observation notes emailed to me

**For Thursday:**
- Partner creates a **Fal.ai account** (fal.ai) + adds **$25**

</div>

<div style="background: #dbeafe; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; text-align: center;">
<strong>Thursday:</strong> Art Director agent + carousel design for your partner.<br>
Same pattern — you did it interactively today, Thursday you build an agent.
</div>

Note:
"Today you learned how to write image prompts by hand. On Thursday, you're going to build an agent that does this for you — an Art Director that interviews you about what you want and constructs the prompt. Same pattern as Session 17: you did reels interactively first, then built an agent. Now you're doing the same thing with images." Homework: partner needs a Fal.ai account with $25 for testing — they'll need it starting next week for automation. And bring 2-3 examples of their existing visual content (website screenshots, social posts, brand guidelines) — these become style references for the Art Director agent on Thursday.
