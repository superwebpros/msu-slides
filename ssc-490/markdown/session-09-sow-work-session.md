## Missing: Two Recordings

<div style="background: #fee2e2; border-left: 8px solid #b91c1c; padding: 30px 36px; border-radius: 10px; margin: 40px auto 0 auto; max-width: 860px; text-align: left; font-size: 22px; line-height: 1.7;">
<strong style="color: #991b1b; font-size: 26px;">LEAP &middot; Samaritas — we have no upload from Sep 24</strong><br><br>
<strong>Team 2</strong> (LEAP) and <strong>Teams 6, 7, 8</strong> (Samaritas): find the recording and upload it <strong>right now</strong>, before you do anything else.<br><br>
<span style="font-size: 20px; color: #334155;">Samaritas: one file covers all three teams. Check the backup recorder too — every copy helps.</span>
</div>

<div style="font-size: 19px; margin: 30px auto 0 auto; max-width: 860px; color: #334155;">
Sep 24 files go in the shared <a href="https://drive.google.com/drive/folders/1AY5OT67pa0bL9Nt06Uqoq5EI9lIl0I9W">client recordings</a> folder, named <code>2026-09-24_&lt;org&gt;_primary.m4a</code>
</div>

Note:
Open here, before anything else. Also messaged in Discord.
If it's uploaded today, ingest runs before Thursday and these four teams aren't debriefed cold.
One Samaritas phone unlocks three debriefs. The interview guide called for a backup recorder in that room — ask who had it.

---

## How Today Goes

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 36px; margin: 40px auto 0 auto; max-width: 900px; text-align: left;">

<div style="background: #f0f9ff; padding: 28px; border-radius: 10px; font-size: 21px; line-height: 1.7;">
<strong style="color: #0369a1; font-size: 24px;">Your team</strong><br>
Draft your Statement of Work with the <strong>SOW Builder</strong> skill in Claude.
</div>

<div style="background: #fef3c7; padding: 28px; border-radius: 10px; font-size: 21px; line-height: 1.7;">
<strong style="color: #92400e; font-size: 24px;">Me</strong><br>
Pulling each team for a <strong>12-minute debrief</strong> on what you heard Thursday.
</div>

</div>

<div style="font-size: 20px; margin: 34px auto 0 auto; max-width: 900px; line-height: 1.8;">
<strong>Today:</strong> Teams 1 &rarr; 3 &rarr; 4 &rarr; 5 &nbsp;&middot;&nbsp; <strong>Thursday:</strong> Teams 2, 6, 7, 8
</div>

Note:
The skill and the debrief ask about the same six things. My questions should land where your draft needs content.
Teams 4 and 5 were in the same room with the same recordings, so they go back to back.
Thursday teams: work the skill today from your notes. You'll have transcripts by Thursday if the recordings come in.
Every debrief is recorded.

---

## The Lab: Three Steps

**Data exists somewhere you don't control. You need it somewhere you do.**

<div style="display: flex; align-items: center; justify-content: center; gap: 18px; margin: 45px auto 0 auto; max-width: 940px; font-size: 21px;">

<div style="background: #f1f5f9; padding: 22px 20px; border-radius: 10px; flex: 1;"><strong>1 · Trigger</strong><br><span style="font-size: 17px; color: #475569;">Execute workflow</span></div>
<div style="font-size: 30px; color: #94a3b8;">&rarr;</div>
<div style="background: #dbeafe; padding: 22px 20px; border-radius: 10px; flex: 1;"><strong>2 · HTTP Request</strong><br><span style="font-size: 17px; color: #475569;">GET from MockAPI</span></div>
<div style="font-size: 30px; color: #94a3b8;">&rarr;</div>
<div style="background: #dcfce7; padding: 22px 20px; border-radius: 10px; flex: 1;"><strong>3 · Data Table</strong><br><span style="font-size: 17px; color: #475569;">Insert row</span></div>

</div>

<div style="font-size: 19px; margin: 36px auto 0 auto; max-width: 900px; color: #334155;">
Stuck? Docs &rarr; your group &rarr; Claude. In that order.
</div>

Note:
This is the Schemas, Types and Four Verbs lab. Everyone builds their own, sitting with their group.
Almost every step of the lab is this same shape: something somewhere else, a pipe, something you own.
Two things to show live before I start debriefs: setting up MockAPI, and dragging a field. Arrow down.

;;;

### 1 · Set Up MockAPI

<div style="font-size: 21px; line-height: 1.9; margin: 30px auto 0 auto; max-width: 820px; text-align: left;">

**1.** Go to <a href="https://mockapi.io">mockapi.io</a> and **sign in with Google** (MSU account)

**2.** Create a project, with any name

**3.** Create a resource called <code>members</code>

**4.** Three fields, all **String**: <code>name</code> &middot; <code>email</code> &middot; <code>major</code>

**5.** Copy your endpoint URL

</div>

<div style="background: #f0f9ff; padding: 18px 26px; border-radius: 10px; margin: 26px auto 0 auto; max-width: 820px; font-size: 19px;">
<code>https://&lt;your-project-id&gt;.mockapi.io/members</code><br>
<span style="font-size: 17px; color: #475569;">Different for every person. Every request in the lab goes to it.</span>
</div>

Note:
Demo this live. Sign in, create project, create the members resource, add the three fields.
MockAPI adds its own fields like createdAt. Leave them.
Point out that you just defined a schema: which fields exist and what kind of value each one holds.
Then POST a member from n8n and GET it back, so they see the id the server assigned.

;;;

### 2 · Drag a Field Across

<img src="assets/n8n-data-table-insert-row.gif" alt="Dragging fields from the n8n INPUT panel into a Data Table Insert row node" style="max-width: 82%; height: auto; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.15);">

<div style="font-size: 19px; margin: 14px auto 0 auto; max-width: 860px; color: #334155;">
Drag from the <strong>INPUT</strong> panel on the left into the column box. Don't type the value.
</div>

Note:
Watch where the cursor goes. Drag name into name, email into email, major into major.
Ask them: when you drop it in, what actually lands in the box? It isn't Sarah's name. It's a reference.
Check the item count. Four members in, the node runs four times. One instruction, repeated per item.

---

## Install the SOW Builder Skill

<div style="font-size: 22px; line-height: 2; margin: 40px auto; max-width: 820px; text-align: left;">

**1.** Download <a href="https://drive.google.com/file/d/1y8_FEIo-CY6RaAR-tKqy9IEOWzoabxv-/view"><code>sow-builder.zip</code></a> <span style="font-size: 18px; color: #64748b;">(Drive &rarr; MSU/SSC490/Resources)</span>

**2.** In Claude: **Customize &rarr; Skills &rarr; Upload a skill**

**3.** Upload the zip. Don't unzip it.

**4.** Start a chat: *"We need to write our SOW."*

</div>

<div style="font-size: 18px; color: #475569;">Also posted in your team's Discord channel.</div>

Note:
Have your interview capture page and project brief ready. The skill asks for them first.
It works through one section at a time. Let it. The point is that you think about each piece.

---

## Your Team's Research Corpus

<div style="font-size: 22px; line-height: 1.8; margin: 34px auto 0 auto; max-width: 860px; text-align: left;">

Your partner interview is transcribed and searchable. <strong>Your team's MCP server is already added to Claude</strong>. Just turn it on in the chat.

</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin: 30px auto 0 auto; max-width: 860px; text-align: left; font-size: 19px; line-height: 1.6;">

<div style="background: #f0f9ff; padding: 22px; border-radius: 10px;">
<code>search_transcripts</code><br>Ask a question, get the passages that answer it
</div>

<div style="background: #f0f9ff; padding: 22px; border-radius: 10px;">
<code>get_transcript_window</code><br>Read the conversation around a passage
</div>

</div>

<div style="background: #dcfce7; padding: 22px 28px; border-radius: 10px; margin: 30px auto 0 auto; max-width: 860px; font-size: 21px;">
Best first question: <em>"What did they say about how this works today that we didn't write down?"</em>
</div>

Note:
Scoping is enforced on the server. Your team can't reach another team's partner conversation, and they can't reach yours.
Don't ask for a summary first. Ask it for what your notes missed.
Use it with the skill: when the SOW Builder asks "what specifically?", check the transcript instead of guessing.
Thursday teams: the server works, but there's nothing in it until your recording is uploaded.

;;;

### MCP Server URLs — for reference

<div style="font-size: 17px;">

| Team | Project | URL |
|---|---|---|
| 1 | CAMW interview coach | `…/mcp/ssc490/camw-interview-coach` |
| 2 | LEAP prospecting | `…/mcp/ssc490/leap-prospecting` |
| 3 | CFC room scheduling | `…/mcp/ssc490/cfc-room-scheduling` |
| 4 | CIS gift entry | `…/mcp/ssc490/cis-gift-entry` |
| 5 | CIS sponsor prospecting | `…/mcp/ssc490/cis-sponsor-prospecting` |
| 6 | Samaritas training records | `…/mcp/ssc490/samaritas-training-records` |
| 7 | Samaritas credentialing | `…/mcp/ssc490/samaritas-credentialing` |
| 8 | Samaritas policy tracking | `…/mcp/ssc490/samaritas-policy-tracking` |

</div>

<div style="font-size: 17px; color: #475569; margin-top: 16px;">
Base: <code>https://msu-n8n.superwebpros.com</code> &middot; Streamable HTTP &middot; no auth
</div>

Note:
Only needed if a connector is missing. They're already added to Claude.

---

## Future Recordings

**Every conversation after Sep 24 goes in your team's folder**

<div style="font-size: 16px;">

| Team | Upload here |
|---|---|
| 1 · CAMW | [drive folder](https://drive.google.com/drive/folders/13gEz6bf0aj2FqdVrWGnuUv74nv8D-0Yu) |
| 2 · LEAP | [drive folder](https://drive.google.com/drive/folders/18cLR4VsUTzM-fL2aTpxmU7LYhdFZ9992) |
| 3 · CFC | [drive folder](https://drive.google.com/drive/folders/1e_7OYt_NfeCF_Frbpe7rtnmCKC2AxRko) |
| 4 · CIS gift entry | [drive folder](https://drive.google.com/drive/folders/1LNxM4rFblU8WT21eTQRobiLrnrO99eBx) |
| 5 · CIS sponsors | [drive folder](https://drive.google.com/drive/folders/1v5CV4tcP1xHTisaNv140htlgpT2Ck0mz) |
| 6 · Samaritas training | [drive folder](https://drive.google.com/drive/folders/1VMWMixIiB76USepC9ReauWWJv0D4PKTG) |
| 7 · Samaritas credentialing | [drive folder](https://drive.google.com/drive/folders/1A1NOMn3UGwV7nSo8rZ-AljhHVJl1ZAuM) |
| 8 · Samaritas policy | [drive folder](https://drive.google.com/drive/folders/16WId-lQud-kNP2SXNwzocrkrIOWrA5pY) |

</div>

<div style="background: #f0f9ff; padding: 18px 26px; border-radius: 10px; margin: 22px auto 0 auto; max-width: 820px; font-size: 20px;">
Name it <code>YYYY-MM-DD_who-you-talked-to.m4a</code><br><span style="font-size: 17px; color: #475569;">e.g. <code>2026-10-14_kirsten-followup.m4a</code></span>
</div>

Note:
Every partner conversation after Sep 24 goes here. Drop it in and it gets transcribed, indexed, and announced in your Discord channel.
The folder tells us the project, so the filename only has to say who you talked to.
Upload every recorder's copy. Two mics in one room is better coverage, not a duplicate.
Sep 24 is the exception: those files go in the shared client recordings folder.

---

## The Six Sections

**What the skill drafts, and what I'll ask about**

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px 30px; margin: 30px auto 0 auto; max-width: 900px; text-align: left; font-size: 20px; line-height: 1.5;">

<div><strong>1 · What we heard</strong><br><span style="color: #475569;">Their process, start to finish, in their words</span></div>
<div><strong>2 · The one problem</strong><br><span style="color: #475569;">One. Not three. And why that one</span></div>
<div><strong>3 · In scope / out of scope</strong><br><span style="color: #475569;">How will they know it's done?</span></div>
<div><strong>4 · What we need from you</strong><br><span style="color: #475569;">Which system, what access, who says yes</span></div>
<div><strong>5 · How this runs</strong><br><span style="color: #475569;">Partner has something to test by Nov 24</span></div>
<div><strong>6 · Open questions</strong><br><span style="color: #475569;">Everything you don't know yet</span></div>

</div>

<div style="background: #fef3c7; padding: 18px 26px; border-radius: 10px; margin: 30px auto 0 auto; max-width: 900px; font-size: 20px;">
Nothing goes in that your partner didn't actually tell you. If you don't know, it's an open question.
</div>

Note:
Section 1 is the one I'll spend the most time on. Bring the names of actual things: the spreadsheet, the form, the system.
Section 5 is mostly pre-filled by the skill from the course calendar.
Six honest open questions is a good SOW at this stage. A polished one with invented detail will embarrass you in front of a client.

---

## Today's Doc — Scan Now

<div style="background: #dbeafe; padding: 30px; border-radius: 12px; margin: 35px auto 0 auto; max-width: 480px;">
<img src="assets/s09-todays-doc-qr.png" alt="QR code for today's assignment doc" style="width: 240px; height: auto; background: #fff; padding: 6px; border-radius: 6px;">
<p style="font-size: 18px; margin-top: 14px;"><a href="https://docs.google.com/document/d/1MdrQwEhPp2tQ63fQVINzCqTXdtvPFFrg-X9krSHfPrI/edit?tab=t.pixu0jw12r18">Open the doc</a></p>
</div>

<div style="font-size: 19px; margin: 26px auto 0 auto; color: #475569;">
Everything for today is in here. Leave this slide up while you work.
</div>

Note:
Give them a full minute to scan. Leave this slide up for the rest of class while you run debriefs.
