## RAG Debrief: Resume Upload

**Homework check-in from Session 3**

<div style="background: #dbeafe; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Slido Question:</strong><br>
"How did uploading your resume affect Randy's output? Did it file search?"
</div>

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">
Share your observations:
<ul style="margin-top: 15px;">
<li>What changed when you uploaded your resume?</li>
<li>Did the responses become more specific?</li>
<li>Did Randy cite your actual experience?</li>
</ul>
</div>

Note:
ACTIVITY TIME (15 min): Quick check-in on the homework. Use Slido to gather observations about how uploading their resume changed Randy's (Career Coach) output. Did it file search? Did responses become more personalized? This reinforces the RAG concept from Session 3. Key point: WITH resume uploaded → specific, personalized advice citing actual experience. WITHOUT resume → generic career guidance. Spend time discussing their observations. If students didn't upload, troubleshoot access issues now.

---

## Semester Project Overview

**What you're building this semester**

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 40px 0; font-size: 18px;">

<div style="background: #dbeafe; padding: 25px; border-radius: 10px;">
<h3 style="color: #1e40af;">Real Business Partners</h3>
<p style="margin-top: 15px; line-height: 1.6;">You'll meet them Tuesday (Session 5)<br>Discovery interview<br>Real content needs</p>
</div>

<div style="background: #dcfce7; padding: 25px; border-radius: 10px;">
<h3 style="color: #14532d;">Real Deliverables</h3>
<p style="margin-top: 15px; line-height: 1.6;">Q3 content calendar<br>3+ weeks of content<br>Working automation system<br>Documentation</p>
</div>

</div>

Note:
OVERVIEW TIME (10 min). Set the stage for what's coming. Next Tuesday, January 27th, business partners join class. You'll be assigned to teams. You'll conduct discovery interviews. You'll learn about their business, audience, and content needs. Then you'll build AI automation systems for them - real systems they can actually use. This isn't a hypothetical project. They're counting on you.

;;;

### Technology Stack Preview

**Tools you'll use this semester**

<div style="font-size: 20px; line-height: 1.8; margin: 40px 0;">

✅ **LibreChat** - Already using (chat interface, RAG)<br>
🎯 **N8N** - Learning today! (workflow automation)<br>
📊 **Qdrant** - Coming soon (vector database)<br>
🔌 **APIs** - Learning today! (system integration)

</div>

<div style="background: #fef3c7; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 18px;">
<strong>All these tools talk to each other through APIs</strong><br>
That's why we're learning HTTP, JSON, and N8N today
</div>

Note:
Show them the full technology stack. They've already used LibreChat. Today they're learning N8N (workflow automation platform). Soon they'll learn Qdrant (vector database for RAG). And APIs connect everything. This is the architecture they'll build. Professional-grade AI automation systems.

---

## Today's Learning Objectives

**What we're covering in this session**

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

1. **Explain** how the internet works using HTTP requests and responses
2. **Identify** the four core HTTP verbs (GET, POST, PUT, DELETE)
3. **Read** JSON data structures
4. **Execute** HTTP requests using N8N workflow automation
5. **Demonstrate** CRUD operations via API calls

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

**RAG retrieved your resume. APIs enable that retrieval.**

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

✅ You know WHAT RAG does (retrieve relevant context)<br>
✅ You've USED RAG (Custom GPTs, LibreChat)<br><br>
❓ But HOW do systems talk to each other?<br>
❓ How does data move between applications?

</div>

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Today:</strong> Learn the plumbing (APIs, HTTP, JSON)<br>
<strong>Next week:</strong> Meet business partners<br>
<strong>Throughout semester:</strong> Build AI workflows step by step
</div>

Note:
Make the connection explicit. Everything you'll build this semester - RAG systems, content automation, AI workflows - uses APIs to move data between systems. N8N (which you're learning today) orchestrates these API calls. This is foundational knowledge. Without understanding APIs, you can't build production systems. We're taking this one step at a time throughout the semester.

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

## How the Internet Works

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

Think of the internet as a massive filing cabinet:
<ul style="margin-top: 15px;">
<li>Each server is a filing cabinet</li>
<li>Each URL is a drawer and folder path</li>
<li>HTTP verbs are the actions (open, add, update, remove)</li>
<li>JSON is the format of the files inside</li>
</ul>

</div>

<div style="background: #fef3c7; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Everything on the internet is just requests and responses</strong>
</div>

Note:
Use the filing cabinet analogy to make this concrete. The internet isn't magic - it's organized data storage and retrieval. Servers are filing cabinets. URLs tell you exactly where to find a file (which cabinet, which drawer, which folder). HTTP verbs are the actions you take (GET = read a file, POST = add a new file, PUT = update a file, DELETE = remove a file). JSON is the standardized format of the files inside.

;;;

### Live Demo: Chrome DevTools

<div style="text-align: center; font-size: 32px; color: #7c3aed; margin: 60px 0;">
<strong>Live Demo</strong>
</div>

**Watch HTTP requests in action**

Note:
DEMO TIME (5 min). This is a live demonstration using Chrome DevTools. Keep it simple and visual. Open Chrome, navigate to any website (CNN, ESPN, whatever), open DevTools (F12 or Cmd+Option+I), go to Network tab, refresh the page. Point out the hundreds of GET requests - HTML, CSS, JS, images. Click on one, show the response data. Emphasize: "This is the internet. Requests. Responses. That's it." Connect back to filing cabinet analogy - each request is opening a specific drawer/folder and reading a file.

;;;

### HTTP Verbs (CRUD Operations)

**The four core verbs for interacting with APIs**

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px 0; font-size: 18px;">

<div style="background: #dbeafe; padding: 25px; border-radius: 10px;">
<h3 style="color: #1e40af;">GET (Read)</h3>
<p style="margin-top: 15px;">Retrieve data from a server<br>~95% of web traffic<br>Example: Loading a webpage</p>
</div>

<div style="background: #dcfce7; padding: 25px; border-radius: 10px;">
<h3 style="color: #14532d;">POST (Create)</h3>
<p style="margin-top: 15px;">Send new data to a server<br>Example: Submitting a form</p>
</div>

<div style="background: #fef3c7; padding: 25px; border-radius: 10px;">
<h3 style="color: #92400e;">PUT (Update)</h3>
<p style="margin-top: 15px;">Modify existing data<br>Example: Editing a profile</p>
</div>

<div style="background: #fee2e2; padding: 25px; border-radius: 10px;">
<h3 style="color: #991b1b;">DELETE (Delete)</h3>
<p style="margin-top: 15px;">Remove data from a server<br>Example: Deleting a post</p>
</div>

</div>

Note:
These are the four fundamental operations - GET, POST, PUT, DELETE. They map to CRUD (Create, Read, Update, Delete). GET is by far the most common (~95% of web traffic) - every time you load a webpage, that's a GET request. POST sends new data (form submissions, creating records). PUT updates existing data (editing a profile). DELETE removes data. Every API you'll ever use relies on these four verbs.

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
<strong>2.</strong> Import starter workflow: <a href="https://bit.ly/49M2meV" target="_blank" style="color: #1e40af; text-decoration: underline;"><strong>https://bit.ly/49M2meV</strong></a>
</div>

Note:
SETUP TIME (5 min). Make sure every student can access N8N. Provide the instance URL: https://msu-n8n.superwebpros.com. Share the starter workflow link: https://bit.ly/49M2meV. Students import the workflow. You'll give a quick tour of the N8N interface in real-time: nodes (individual operations), connections (data flow), Execute Workflow button (runs the workflow), output viewer (shows results). Circulate to help students who are stuck on login or import.

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

</div>

Note:
EXERCISE 2 (7 min). Add a new HTTP Request node (drag from sidebar or duplicate existing). Configure: Method = POST. URL = same MockAPI endpoint. Now here's the key difference from GET: POST sends data in the request BODY. In N8N, we'll configure the body by adding just a name field - keep it simple. Click Execute. Observe: MockAPI created the new user and assigned it an auto-generated ID. Point out: POST sends data TO the server (creating a new resource). The server responds with the created resource including the new ID.

;;;

### Exercise 3: PUT Request

**Update existing data**

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**Add new HTTP Request node:**
- Method: `PUT`
- URL: `https://6970369178fec16a63fd1e8d.mockapi.io/api/v1/users/1`
- Body: Update a field

**Execute → Observe: User data updated**

</div>

<div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 18px;">
<strong>Key difference:</strong> PUT targets specific resource by ID (notice `/users/1` in URL)
</div>

Note:
EXERCISE 3 (7 min). Add another HTTP Request node. Method = PUT. URL = MockAPI endpoint BUT notice we're adding `/1` to target user ID 1 specifically. Body = we'll update just one field. Click Execute. Observe: The user's data changed. Point out: PUT targets a SPECIFIC resource using its ID in the URL path. You only send the fields you want to change (not the whole object). This is how you update data via APIs.

;;;

### Exercise 4: DELETE Request

**Remove data**

<div style="font-size: 20px; line-height: 1.8; margin: 30px 0;">

**Add new HTTP Request node:**
- Method: `DELETE`
- URL: `https://6970369178fec16a63fd1e8d.mockapi.io/api/v1/users/1`

**Execute → Run GET again to verify user is gone**

</div>

<div style="background: #fee2e2; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 18px;">
<strong>Caution:</strong> DELETE is permanent! Always double-check the ID before executing.
</div>

Note:
EXERCISE 4 (6 min). Final HTTP verb - DELETE. Add another HTTP Request node. Method = DELETE. URL = same pattern as PUT (target specific user by ID: `/users/1`). No body needed - we're just removing the resource. Click Execute. Observe: User deleted. Now run the GET request again to prove it - user ID 1 is gone from the list. Point out: DELETE is permanent. In production systems, you'd want confirmation dialogs or soft-deletes (marking as deleted rather than actually removing). But for APIs, DELETE means DELETE.

---

## JSON Data Structures

**Understanding the response format**

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; font-size: 16px;">

<div style="background: #fef3c7; padding: 20px; border-radius: 10px;">
<h4>Strings " "</h4>
<p style="font-family: monospace; margin-top: 10px;">"Jane Doe"</p>
<p style="margin-top: 10px;">Text data - wrapped in quotes</p>
</div>

<div style="background: #fee2e2; padding: 20px; border-radius: 10px;">
<h4>Numbers</h4>
<p style="font-family: monospace; margin-top: 10px;">123, 3.14</p>
<p style="margin-top: 10px;">Numerical values - no quotes</p>
</div>

<div style="background: #f3e8ff; padding: 20px; border-radius: 10px;">
<h4>Booleans</h4>
<p style="font-family: monospace; margin-top: 10px;">true, false</p>
<p style="margin-top: 10px;">True/false flags - no quotes</p>
</div>

<div style="background: #dbeafe; padding: 20px; border-radius: 10px;">
<h4>Arrays [ ]</h4>
<p style="font-family: monospace; margin-top: 10px;">["item1", "item2"]</p>
<p style="margin-top: 10px;">Lists of items - ordered collection</p>
</div>

<div style="background: #dcfce7; padding: 20px; border-radius: 10px;">
<h4>Objects { }</h4>
<p style="font-family: monospace; margin-top: 10px;">{"key": "value"}</p>
<p style="margin-top: 10px;">Key-value pairs - named properties</p>
</div>

<div style="background: #e0f2fe; padding: 20px; border-radius: 10px;">
<h4>Nested Objects</h4>
<p style="font-family: monospace; margin-top: 10px;">{"user": {"name": "Jane"}}</p>
<p style="margin-top: 10px;">Objects inside objects</p>
</div>

</div>

Note:
Now that you've executed all four HTTP verbs, let's understand JSON data structures. This is crucial for reading API responses. We organize these from simplest to most complex. Strings are text (wrapped in quotes). Numbers are numerical values (no quotes). Booleans are true/false (no quotes). Arrays are lists (square brackets). Objects are key-value pairs (curly braces). Nested objects are objects inside objects. Show examples from the GET response you executed earlier.

---

## Data Structure Practice

**Iterating through data types**

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

We'll practice adding different data structures:

<ol style="margin-top: 20px;">
<li><strong>Strings</strong> - Text values like names and emails</li>
<li><strong>Numbers</strong> - IDs, ages, counts</li>
<li><strong>Booleans</strong> - True/false flags</li>
<li><strong>Arrays</strong> - Lists (if time permits)</li>
<li><strong>Objects</strong> - Nested data (if time permits)</li>
</ol>

</div>

Note:
ITERATION TIME (remaining time in 40-min workshop). Building out a full student user profile with different data structures. Here are the examples to add to MockAPI iteratively:

1. STRINGS - Text values:
   - name: "Sarah Martinez"
   - email: "sarah.martinez@msu.edu"
   - major: "Computer Science"
   - classification: "Junior"

2. NUMBERS - Numerical values:
   - studentId: 12345678
   - age: 21
   - creditsEarned: 87
   - gpa: 3.75

3. BOOLEANS - True/false flags:
   - isEnrolled: true
   - isInternational: false
   - hasScholarship: true
   - isFullTime: true

4. ARRAYS - Lists (if time permits):
   - courses: ["SSC 493", "CSE 331", "MTH 235"]
   - skills: ["Python", "JavaScript", "SQL", "Git"]
   - clubs: ["MSU AI Club", "Women in Computing"]

5. OBJECTS - Nested data (if time permits):
   - address: { "street": "123 Grand River Ave", "city": "East Lansing", "state": "MI", "zip": "48823" }
   - emergencyContact: { "name": "Maria Martinez", "relationship": "Mother", "phone": "517-555-1234" }

6. NESTED OBJECTS - Complex structures (if time permits):
   - profile: { "bio": "CS student passionate about AI", "interests": ["machine learning", "web development"], "socialMedia": { "linkedin": "linkedin.com/in/sarahmartinez", "github": "github.com/smartinez" } }

Show how the URL stays the same but the data structure becomes more complex. Start simple (strings only), then add numbers, then booleans, etc. This helps students recognize these patterns in API responses they'll encounter throughout the semester.

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

## Preview: Next Session

**Tuesday, January 27th: Business Partner Discovery**

<div style="font-size: 22px; line-height: 1.8; margin: 40px 0;">

✅ Meet your business partner<br>
✅ Team assignments announced<br>
✅ Conduct discovery interview<br>
✅ Learn about their business, audience, content needs<br>
✅ Start planning your semester project

</div>

<div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Come ready to listen, ask questions, and take good notes</strong>
</div>

Note:
PREVIEW TIME (5 min). Set expectations for next session. Tuesday the 27th is when business partners join. You'll be assigned to teams (we've analyzed your PrinciplesYou results to form complementary teams). You'll meet your business partner. You'll conduct a discovery interview - learning about their business, target audience, current content processes, pain points, and goals. This is client work - treat it professionally. Come prepared with questions. Take detailed notes. Listen actively. This is the foundation for everything you'll build.

;;;

### Key Takeaways

<div style="text-align: left; font-size: 20px; line-height: 2; margin: 40px 0;">

1. **HTTP verbs (CRUD)** - GET, POST, PUT, DELETE
2. **JSON** - Universal language for APIs
3. **N8N** - Visual workflow builder for API orchestration
4. **APIs connect everything** - AI models, databases, services
5. **Real projects starting Tuesday** - Business partners incoming

</div>

Note:
Recap the key learnings. HTTP verbs (GET, POST, PUT, DELETE) are how systems interact. JSON is the data format all APIs use. N8N makes API calls visual and manageable. APIs are the glue connecting AI models, databases, and services. And all of this matters because you're about to build real systems for real businesses starting Tuesday.

---

## Homework

**Practice with APIs and N8N**

<div style="background: #fef3c7; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 20px;">
<strong>Assignment details: TBD</strong><br><br>
You'll practice making API calls and working with different data structures.<br><br>
Submission will include a screenshot showing successful execution.
</div>

<div style="background: #dcfce7; padding: 25px; border-radius: 10px; margin: 30px 0; font-size: 18px;">
<strong>Due:</strong> Before next session (Tue Jan 27)<br>
<strong>Details:</strong> Will be shared after class based on how far we get today
</div>

Note:
Homework details are TBD based on how far we get in class today. The assignment will involve practicing API calls with different data structures - likely using a separate MockAPI instance with varied data types. Students will submit a screenshot showing successful execution. Specific details will be posted to D2L after class once I know exactly what to assign based on our progress.

---

## Questions?

**Ask now or reach out:**

- Email: jesse@superwebpros.com
- Office hours: By appointment
- LibreChat: msu-ai.superwebpros.com

<div style="margin-top: 40px; font-size: 24px; color: #7c3aed;">
Tuesday: Meet Your Business Partner
</div>

Note:
Open floor for questions. Check for confusion on HTTP verbs, JSON, or N8N interface. Remind them: Come to Tuesday's class ready to meet business partners. Professional dress not required but professional attitude expected. This is client work. Treat it seriously. If they have questions about the homework, office hours are available. See you Tuesday!
