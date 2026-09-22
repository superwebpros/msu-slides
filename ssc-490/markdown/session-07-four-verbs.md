## First: Thursday Is Partner Kickoff

**Thursday, September 24 — your business partners are in the room**

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

✅ Meet your business partner<br>
✅ Conduct discovery interview<br>
✅ Learn about their business, audience, content needs<br>
✅ Start planning your semester project

</div>

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Come ready to listen, ask questions, and take good notes</strong>
</div>

Note:
OPEN WITH THIS (5 min). Logistically the most important thing today, so it leads.
Thursday Sep 24 - partners in the room. Teams are already assigned. They conduct a discovery interview: how the work actually happens today, what systems they touch, what access would be needed.
This is client work - treat it professionally. Come prepared with questions, take good notes, listen more than you talk.
Take questions here before moving on. Everything after this is the four verbs.

---

## Discussion: Two Questions from Friday

<div style="font-size: 24px; line-height: 2; margin: 50px 0;">

<div style="background: #dbeafe; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
<strong>Maya's question</strong>
</div>

<div style="background: #dcfce7; padding: 25px; border-radius: 10px;">
<strong>Nikolai's question</strong>
</div>

</div>

Note:
DISCUSSION (open). Pick up Maya's and Nikolai's questions from Friday. Open-ended - let it run where it goes.

---

## Your MCP Server and Team Claude

<div style="font-size: 20px; line-height: 1.8; margin: 35px 0;">

Claude does not allow team members to add MCP connectors unless they are the account owner. It's their security policy.

</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 35px 0; font-size: 18px;">

<div style="background: #dbeafe; padding: 25px; border-radius: 10px;">
<h3 style="color: #1e40af;">Have your own paid Claude account?</h3>
<p style="margin-top: 15px; line-height: 1.6;">Add the connector there and see it work.</p>
</div>

<div style="background: #dcfce7; padding: 25px; border-radius: 10px;">
<h3 style="color: #14532d;">Don't, but want to see it?</h3>
<p style="margin-top: 15px; line-height: 1.6;">I'll make a separate video showing how to do it in LibreChat.</p>
</div>

</div>

Note:
It IS a Claude limitation - non-owners can't add MCP connectors on a team account. Their security policy.
Two options: own paid account, or wait for the LibreChat video.

---

## Today's Learning Objectives

**What we're covering in this session**

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

1. **Explain** how the internet works using HTTP requests and responses
2. **Identify** the four core HTTP verbs (GET, POST, PUT, DELETE)
3. **Execute** HTTP requests using N8N workflow automation
4. **Demonstrate** CRUD operations via API calls

</div>

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Hands-on session:</strong> You'll make real API calls using N8N
</div>

Note:
Today we're learning the plumbing - how systems talk to each other using APIs and HTTP. This is foundational knowledge for everything we'll build this semester. We'll use N8N to make API calls hands-on. Set clear expectations: this is a demo-heavy, follow-along session where they'll practice making API calls in real-time.

---

## Today's Focus: Fw (Frameworks)

<div style="font-size: 14px; margin: 20px auto; max-width: 900px;">

| | Reactive | Retrieval | Orchestration | Validation | Models |
| --- | --- | --- | --- | --- | --- |
| **Primitives** | <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 4px; display: inline-block;">Prompts (Pr)</span> | Embeddings (Em) | | | <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 4px; display: inline-block;">LLMs (Lg)</span> |
| **Compositions** | Function Calling | Vector DBs (Vx) | <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 4px; display: inline-block;">RAG (Rg)</span> | Guardrails | Multi-modal |
| **Deployment** | Agents (Ag) | Fine-tuning | <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 4px; display: inline-block;">Frameworks (Fw)</span> | Red-teaming | Small Models |
| **Emerging** | Multi-agent | Synthetic Data | | Interpretability | Thinking Models |

</div>

<div style="margin-top: 30px; font-size: 20px; color: #7c3aed; text-align: center;">
Today we learn <strong>Frameworks (Fw)</strong> - workflow automation using <strong>N8N</strong> to orchestrate API calls
</div>

Note:
We're moving into the Deployment row of the periodic table. You've already learned Primitives (Pr, Lg) and Compositions (Rg). Today we're learning about Frameworks (Fw) - specifically N8N, a workflow automation platform that orchestrates API calls. This is how you connect different systems together into automated workflows. N8N sits in the Deployment row because it's the orchestration layer that brings everything together - you'll use it to connect AI models, databases, and services throughout the semester.

;;;

### Bridge to Today's Session

**You've already been moving information. Today: the plumbing underneath.**

<div style="font-size: 21px; line-height: 1.9; margin: 35px 0;">

✅ Claude read your résumé and the Career Services resources<br>
✅ Claude created and read your Google Sheet tracker<br>
✅ Last Thursday, Claude (was supposed to write) a row into your own n8n Data Table<br><br>
❓ So what is actually happening when information moves?

</div>

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
Every one of those was a <strong>request going out</strong> and an <strong>answer coming back</strong>.<br>
Today we name the four requests.
</div>

Note:
They have already watched information move all semester - Projects, Skills, connectors, the Sheet, and last Thursday their own MCP server writing into a Data Table.
Today is the plumbing underneath that, not a new capability.

---

## How the Internet Works

<div style="max-width: 720px; margin: 10px auto 0 auto;">
<img src="assets/how-the-internet-works.svg" alt="You send a request — a verb and a URL. The server sends back a response with the data." style="width: 100%; height: auto;">
</div>

<div style="font-size: 18px; line-height: 1.6; margin: 14px auto 0 auto; max-width: 780px; color: #334155;">
Think of the internet as a massive filing cabinet: each <strong>server</strong> is a cabinet, each <strong>URL</strong> is a drawer and folder path, and the <strong>verbs</strong> are the actions — open, add, update, remove.
</div>

Note:
Use the filing cabinet analogy to make this concrete. The internet isn't magic - it's organized data storage and retrieval. Servers are filing cabinets. URLs tell you exactly where to find a file (which cabinet, which drawer, which folder). HTTP verbs are the actions you take: GET = read a file, POST = add a new file, PUT = update a file, DELETE = remove a file.
Walk the graphic left to right: you send a verb plus a URL, the server sends back the answer. Every single thing they've done this semester is that round trip.

---

## URL Anatomy

**Breaking down a web address**

```
https://api.example.com/users/123?name=John
│      │                │       │   └─ Query parameters
│      │                │       └─ Path (resource ID)
│      │                └─ Endpoint path
│      └─ Domain
└─ Protocol (HTTP + SSL = HTTPS)
```

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 18px;">
<strong>Protocol:</strong> Rules for communication (HTTP/HTTPS)<br>
<strong>Domain:</strong> Server address (like a street address)<br>
<strong>Path:</strong> Specific resource (like an apartment number)<br>
<strong>Query params:</strong> Additional filters/options (like delivery instructions)
</div>

Note:
Walk through URL anatomy piece by piece. This is important because students will be constructing URLs in N8N. Protocol (HTTPS = HTTP + encryption). Domain (server address). Path (specific resource). Query parameters (additional data). Use the real-world analogy: domain is like a street address, path is like an apartment number, query params are like delivery instructions.

---

## The Four Verbs, Everywhere You Already Look

<div style="font-size: 17px; margin: 25px auto; max-width: 980px;">

| | Instagram | Any website | Your Google Sheet connector | Your tracker |
| :-- | :-- | :-- | :-- | :-- |
| **GET** | scrolling the feed | loading the page | Claude reads your sheet | read your applications |
| **POST** | new post | submitting a form | Claude appends a row | add an application |
| **PUT** | editing the caption | updating your profile | <strong style="color: #dc2626;">Claude can't</strong> | update a status |
| **DELETE** | deleting the post | unsending a DM | <strong style="color: #dc2626;">Claude can't</strong> | remove one |

</div>

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
Google handed Claude <strong>GET</strong> and <strong>POST</strong>, and withheld <strong>PUT</strong> and <strong>DELETE</strong>.
</div>

Note:
Read across the rows: same verb, four contexts, identical mechanic.
Then the third column: this is why Claude could add a row to the Google Sheet but not change one.

---

## Quick Check — Answer in the Zoom Chat

<div style="font-size: 23px; line-height: 1.9; margin: 60px 0;">
Five questions. <strong>One word each, in the chat.</strong><br><br>
<span style="font-size: 19px;">GET · POST · PUT · DELETE — that's the whole answer key.</span>
</div>

Note:
We're virtual today - answers go in the Zoom chat, no poll tool.
Read each question, give them a beat, then read the chat out loud.

;;;

### You scroll Instagram and more posts load.

<div style="text-align: center; font-size: 40px; margin: 90px 0 25px 0;"><strong>Which verb?</strong></div>

<div style="text-align: center; font-size: 19px; color: #64748b;">One word in the chat.</div>

Note:
GET.

;;;

### You post a new photo.

<div style="text-align: center; font-size: 40px; margin: 90px 0 25px 0;"><strong>Which verb?</strong></div>

<div style="text-align: center; font-size: 19px; color: #64748b;">One word in the chat.</div>

Note:
POST.

;;;

### You edit the caption on that photo.

<div style="text-align: center; font-size: 40px; margin: 90px 0 25px 0;"><strong>Which verb?</strong></div>

<div style="text-align: center; font-size: 19px; color: #64748b;">One word in the chat.</div>

Note:
PUT. Watch for POST answers - the photo already exists.

;;;

### You unsend a DM.

<div style="text-align: center; font-size: 40px; margin: 90px 0 25px 0;"><strong>Which verb?</strong></div>

<div style="text-align: center; font-size: 19px; color: #64748b;">One word in the chat.</div>

Note:
DELETE.

;;;

### Claude could add a row to your Sheet but not change one.

<div style="text-align: center; font-size: 38px; margin: 90px 0 25px 0;"><strong>Which verb was it missing?</strong></div>

<div style="text-align: center; font-size: 19px; color: #64748b;">One word in the chat.</div>

Note:
PUT. This is the one that matters - if the room gets it, move on to n8n.

---

## CRUD Walkthrough with N8N

**Hands-on: Making API calls**

<div style="font-size: 24px; line-height: 1.8; margin: 40px 0;">

📋 You'll learn:<br><br>
✅ How to configure HTTP Request nodes in N8N<br>
✅ How to execute GET, POST, PUT, DELETE requests<br>
✅ How to read JSON responses<br>
✅ How to observe API behavior

</div>

Note:
WORKSHOP TIME (40 min total). This is the meat of today's session. Students will make API calls using N8N. They'll practice all four HTTP verbs (GET, POST, PUT, DELETE) against a MockAPI endpoint. They'll see JSON responses. They'll understand how data structures work. This is hands-on, follow-along instruction. You do it on screen, they do it on their laptops simultaneously.

;;;

### Setup: Accessing N8N

**Getting started**

<div style="background: #dbeafe; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>1.</strong> Access course N8N instance at <a href="https://msu-n8n.superwebpros.com" target="_blank" style="color: #1e40af; text-decoration: underline;"><strong>https://msu-n8n.superwebpros.com</strong></a><br><br>
<strong>2.</strong> Import starter workflow: <a href="https://bit.ly/4rvXvHi" target="_blank" style="color: #1e40af; text-decoration: underline;"><strong>https://bit.ly/4rvXvHi</strong></a>
</div>

Note:
SETUP TIME (5 min). Make sure every student can access N8N. Provide the instance URL: https://msu-n8n.superwebpros.com. Share the starter workflow link: https://bit.ly/4rvXvHi. Students import the workflow. You'll give a quick tour of the N8N interface in real-time: nodes (individual operations), connections (data flow), Execute Workflow button (runs the workflow), output viewer (shows results). Circulate to help students who are stuck on login or import.

;;;

### Exercise 1: GET Request

**Retrieve data from an API**

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**Configure HTTP Request node:**
- Method: `GET`
- URL: `https://6970369178fec16a63fd1e8d.mockapi.io/api/v1/users`

**Execute workflow → Observe JSON output**

</div>

Note:
EXERCISE 1 (8 min). Walk through configuring the first HTTP Request node together. Method: GET. URL: MockAPI users endpoint (paste URL on screen). Click "Execute Workflow" button. Observe the output - it's an array of user objects in JSON format. Point out the structure: square brackets = array, curly braces = objects, key-value pairs (id, name, email, major). This is JSON - the universal language for APIs. Every API you call (OpenAI, Anthropic, Google) returns JSON in some form. Take your time here - this is their first exposure to JSON structure.

;;;

### Exercise 2: POST Request

**Create new data**

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**Add new HTTP Request node:**
- Method: `POST`
- URL: `https://6970369178fec16a63fd1e8d.mockapi.io/api/v1/users`
- Body: Add `name` field in N8N

**Execute → Observe: New user created with auto-generated ID**

<div style="background: #fef3c7; padding: 18px; border-radius: 10px; margin: 20px 0; font-size: 18px;">
You never sent an <code>id</code> — the server assigned it. <strong>Write it down; PUT and DELETE both need it.</strong>
</div>

</div>

Note:
EXERCISE 2 (7 min). Add a new HTTP Request node (drag from sidebar or duplicate existing). Configure: Method = POST. URL = same MockAPI endpoint. Now here's the key difference from GET: POST sends data in the request BODY. In N8N, we'll configure the body by adding just a name field - keep it simple. Click Execute. Observe: MockAPI created the new user and assigned it an auto-generated ID. Point out: POST sends data TO the server (creating a new resource). The server responds with the created resource including the new ID.

;;;

### Exercise 3: PUT Request

**Update existing data**

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**Add new HTTP Request node:**
- Method: `PUT`
- URL: `.../api/v1/users/{the id POST just returned}`
- Body: Update a field

**Execute → Observe: User data updated**

</div>

<div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 18px;">
<strong>Key difference:</strong> PUT targets a specific resource by ID. Use the id POST returned — don't hardcode <code>/users/1</code>.
</div>

Note:
EXERCISE 3 (7 min). Add another HTTP Request node. Method = PUT. URL = MockAPI endpoint plus the id POST handed back - not a hardcoded /1, which breaks if that record was ever deleted. Body = we'll update just one field. Click Execute. Observe: The user's data changed. Point out: PUT targets a SPECIFIC resource using its ID in the URL path. You only send the fields you want to change (not the whole object). This is how you update data via APIs.

;;;

### Exercise 4: DELETE Request

**Remove data**

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**Add new HTTP Request node:**
- Method: `DELETE`
- URL: `.../api/v1/users/{that same id}`

**Execute → Run GET again to verify user is gone**

</div>

<div style="background: #fee2e2; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 18px;">
<strong>Caution:</strong> DELETE is permanent! Always double-check the ID before executing.
</div>

Note:
EXERCISE 4 (6 min). Final HTTP verb - DELETE. Add another HTTP Request node. Method = DELETE. URL = same pattern as PUT, using the id POST returned. No body needed - we're just removing the resource. Click Execute. Observe: User deleted. Now run the GET request again to prove it - that record is gone from the list. Point out: DELETE is permanent. In production systems, you'd want confirmation dialogs or soft-deletes (marking as deleted rather than actually removing). But for APIs, DELETE means DELETE.

---

## Why This Matters for AI Workflows

**Connecting the dots**

<div style="font-size: 20px; line-height: 1.8; margin: 40px 0;">

**Every AI system you build uses APIs:**

- **OpenAI API** - Generate text, create embeddings
- **Anthropic API** - Claude conversations
- **Google APIs** - Search, translate, analyze
- **Vector DB APIs** - Store and retrieve embeddings
- **LibreChat API** - Custom integrations

</div>

<div style="background: #fef3c7; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 18px;">
<strong>N8N orchestrates all these API calls into automated workflows</strong>
</div>

Note:
Connect this to the bigger picture. Everything they'll build this semester uses APIs. When you call OpenAI to generate text - that's a POST request with JSON. When you create embeddings - that's an API call. When you store vectors in Qdrant - that's an API. When you retrieve similar documents - that's an API call. N8N is the orchestration layer - it strings these API calls together into automated workflows. That's why we're learning this today. You need to understand HTTP verbs and JSON to build AI automation systems.

---

## Your Turn: AI Club Member Registration

**One task, two halves — we build it, then you drive it**

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin: 30px 0; font-size: 17px;">

<div style="background: #dbeafe; padding: 22px; border-radius: 10px;">
<h3 style="color: #1e40af;">Part 1 — together</h3>
<p style="margin-top: 12px; line-height: 1.6;">
Sign in at <a href="https://mockapi.io" target="_blank" style="color: #1e40af; text-decoration: underline;"><strong>mockapi.io</strong></a> with your MSU Google account, create a project, and add one resource: <code>members</code>.
</p>
<p style="margin-top: 12px; line-height: 1.6;">
Then we design the schema on screen. <strong>What does an AI club registration actually need to store?</strong>
</p>
</div>

<div style="background: #dcfce7; padding: 22px; border-radius: 10px;">
<h3 style="color: #14532d;">Part 2 — your turn</h3>
<p style="margin-top: 12px; line-height: 1.6;">In N8N, against <em>your own</em> endpoint:</p>
<ul style="margin: 10px 0 0 18px; line-height: 1.8;">
<li><strong>POST</strong> a few members</li>
<li><strong>GET</strong> the roster</li>
<li><strong>PUT</strong> one — use the id POST returned</li>
<li><strong>DELETE</strong> a member who dropped</li>
</ul>
</div>

</div>

<div style="background: #fef3c7; padding: 16px; border-radius: 10px; margin: 20px 0; font-size: 17px;">
📄 Step-by-step walkthrough is in the <strong>follow-along doc</strong> — posted in Discord.
</div>

Note:
PART 1 - walk it on screen. Registration is MSU Google SSO, about 30 seconds. Free tier is 1 project / 2 resources, which is exactly enough.
Build the schema WITH them - ask the room what an AI club registration needs before you type anything. Somewhere around name, email, major, grad year, status. Don't turn it into a data-types lecture; pick fields, move on.
Everyone ends Part 1 with the same resource shape, so Part 2 is the same exercise for everybody and you can help across the room.
PART 2 - they drive. Two common mistakes: hardcoding /members/1 instead of the id POST returned, and forgetting the body on POST.
They finish this for homework and submit the workflow JSON.

---

## Key Takeaways

<div style="text-align: left; font-size: 20px; line-height: 2; margin: 40px 0;">

1. **HTTP verbs (CRUD)** - GET, POST, PUT, DELETE
2. **The server assigns the ID** - you POST, it tells you what it called the record
3. **N8N** - Visual workflow builder for API orchestration
4. **Real projects starting Thursday** - Business partners incoming

</div>

Note:
Recap the key learnings. HTTP verbs (GET, POST, PUT, DELETE) are how systems interact. The server assigns identity - you POST and it tells you the id. N8N makes API calls visual and manageable. And all of this matters because you meet your business partners on Thursday.

---


## Homework

**Finish the AI club member registration**

<div style="background: #fef3c7; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
Run all four verbs against your own <code>members</code> endpoint in N8N.
</div>

<div style="background: #dcfce7; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 19px;">
<strong>Submit:</strong> export the JSON from your N8N workflow and upload it to <strong>D2L</strong><br>
<strong>Due:</strong> Monday, September 28
</div>

Note:
They export the workflow JSON straight out of n8n (workflow menu -> Download) and upload it to D2L. That lets you open it and see which verbs they actually wired up, rather than taking a screenshot on faith.
Due Monday Sep 28.

---

## Questions?

**Ask now or reach out:**

- Email: jesse@superwebpros.com
- Office hours: By appointment
- LibreChat: msu-ai.superwebpros.com

<div style="margin-top: 40px; font-size: 24px; color: #7c3aed;">
Thursday: Meet Your Business Partner
</div>

Note:
Open floor for questions. Check for confusion on HTTP verbs, JSON, or N8N interface. Remind them: Come to Tuesday's class ready to meet business partners. Professional dress not required but professional attitude expected. This is client work. Treat it seriously. If they have questions about the homework, office hours are available. See you Tuesday!
