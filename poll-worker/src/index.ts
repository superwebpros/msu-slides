import { DurableObject } from "cloudflare:workers";

export interface Env {
  POLL_ROOM: DurableObjectNamespace<PollRoom>;
}

interface QuestionRow extends Record<string, SqlStorageValue> {
  id: number;
  question_text: string;
  sort_order: number;
}

interface ResponseRow extends Record<string, SqlStorageValue> {
  id: number;
  question_id: number;
  response_text: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Durable Object: PollRoom
// Each session (e.g. "s05", "workshop-1") is a single isolated Durable Object
// ---------------------------------------------------------------------------
export class PollRoom extends DurableObject<Env> {
  private sessionId: string = "";

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS meta (
          key TEXT PRIMARY KEY,
          value TEXT
        );
        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          question_text TEXT NOT NULL,
          sort_order INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          question_id INTEGER NOT NULL,
          response_text TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);
    });
  }

  private getMeta(key: string, defaultValue: string = ""): string {
    const row = this.ctx.storage.sql
      .exec<{ value: string }>("SELECT value FROM meta WHERE key = ?", key)
      .toArray();
    return row.length > 0 ? row[0].value : defaultValue;
  }

  private setMeta(key: string, value: string) {
    this.ctx.storage.sql.exec(
      "INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      key,
      value
    );
  }

  private getQuestions(): QuestionRow[] {
    let questions = this.ctx.storage.sql
      .exec<QuestionRow>("SELECT id, question_text, sort_order FROM questions ORDER BY sort_order ASC, id ASC")
      .toArray();

    // If s05 is fresh and unconfigured, auto-seed tomorrow's questions!
    if (questions.length === 0 && (this.sessionId.toLowerCase() === "s05" || this.sessionId.toLowerCase() === "session-05")) {
      this.setMeta("title", "Session 05: Business Partner Discovery");
      this.setMeta("active_index", "0");
      this.ctx.storage.sql.exec(
        "INSERT INTO questions (question_text, sort_order) VALUES (?, ?), (?, ?)",
        "What was your biggest takeaway from last week's assignment?",
        0,
        "What are all the distinct tasks involved in finding a job and getting hired?",
        1
      );
      questions = this.ctx.storage.sql
        .exec<QuestionRow>("SELECT id, question_text, sort_order FROM questions ORDER BY sort_order ASC, id ASC")
        .toArray();
    }

    return questions;
  }

  private getActiveQuestionIndex(): number {
    const raw = this.getMeta("active_index", "0");
    const idx = parseInt(raw, 10);
    return isNaN(idx) ? 0 : idx;
  }

  private getResponsesForQuestion(questionId: number): ResponseRow[] {
    return this.ctx.storage.sql
      .exec<ResponseRow>(
        "SELECT id, question_id, response_text, created_at FROM responses WHERE question_id = ? ORDER BY id DESC",
        questionId
      )
      .toArray();
  }

  private getState() {
    const title = this.getMeta("title", "Class Poll");
    const questions = this.getQuestions();
    let activeIndex = this.getActiveQuestionIndex();
    if (questions.length > 0 && activeIndex >= questions.length) {
      activeIndex = questions.length - 1;
      this.setMeta("active_index", activeIndex.toString());
    }
    const currentQuestion = questions[activeIndex] || null;
    const responses = currentQuestion ? this.getResponsesForQuestion(currentQuestion.id) : [];

    return {
      type: "state",
      sessionId: this.sessionId,
      title,
      activeIndex,
      totalQuestions: questions.length,
      currentQuestion,
      responses,
    };
  }

  private broadcast(data: unknown) {
    const msg = JSON.stringify(data);
    for (const ws of this.ctx.getWebSockets()) {
      try {
        ws.send(msg);
      } catch {
        // Socket closed or errored
      }
    }
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    this.sessionId = url.searchParams.get("sessionId") || "default";

    // Handle WebSocket upgrade
    if (request.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      this.ctx.acceptWebSocket(server);

      // Send initial state immediately
      server.send(JSON.stringify(this.getState()));
      return new Response(null, { status: 101, webSocket: client });
    }

    const action = url.searchParams.get("action") || "";

    if (request.method === "POST" && action === "setup") {
      const body = (await request.json()) as { title?: string; questions: string[] };
      const title = body.title || `Session ${this.sessionId}`;
      this.setMeta("title", title);
      this.setMeta("active_index", "0");

      this.ctx.storage.sql.exec("DELETE FROM responses");
      this.ctx.storage.sql.exec("DELETE FROM questions");

      if (Array.isArray(body.questions)) {
        for (let i = 0; i < body.questions.length; i++) {
          const qText = (body.questions[i] || "").trim();
          if (qText) {
            this.ctx.storage.sql.exec(
              "INSERT INTO questions (question_text, sort_order) VALUES (?, ?)",
              qText,
              i
            );
          }
        }
      }

      const state = this.getState();
      this.broadcast(state);
      return Response.json({ ok: true, state }, {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    if (request.method === "POST" && action === "next") {
      const questions = this.getQuestions();
      let current = this.getActiveQuestionIndex();
      if (current < questions.length - 1) {
        current += 1;
        this.setMeta("active_index", current.toString());
      }
      const state = this.getState();
      this.broadcast(state);
      return Response.json({ ok: true, state }, {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    if (request.method === "POST" && action === "prev") {
      let current = this.getActiveQuestionIndex();
      if (current > 0) {
        current -= 1;
        this.setMeta("active_index", current.toString());
      }
      const state = this.getState();
      this.broadcast(state);
      return Response.json({ ok: true, state }, {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    if (request.method === "POST" && action === "set_index") {
      const body = (await request.json()) as { index: number };
      const questions = this.getQuestions();
      const idx = Math.max(0, Math.min(body.index, Math.max(0, questions.length - 1)));
      this.setMeta("active_index", idx.toString());
      const state = this.getState();
      this.broadcast(state);
      return Response.json({ ok: true, state });
    }

    if (request.method === "POST" && action === "submit") {
      const body = (await request.json()) as { text: string };
      const text = (body.text || "").trim();
      if (!text) {
        return Response.json({ error: "Empty response" }, { status: 400 });
      }

      const questions = this.getQuestions();
      const activeIndex = this.getActiveQuestionIndex();
      const currentQuestion = questions[activeIndex];
      if (!currentQuestion) {
        return Response.json({ error: "No active question" }, { status: 400 });
      }

      const now = new Date().toISOString();
      const res = this.ctx.storage.sql.exec<{ id: number }>(
        "INSERT INTO responses (question_id, response_text, created_at) VALUES (?, ?, ?) RETURNING id",
        currentQuestion.id,
        text,
        now
      );
      const inserted = res.one();

      const newResponse: ResponseRow = {
        id: inserted.id,
        question_id: currentQuestion.id,
        response_text: text,
        created_at: now,
      };

      this.broadcast({
        type: "new_response",
        questionId: currentQuestion.id,
        response: newResponse,
      });

      return Response.json({ ok: true, response: newResponse });
    }

    if (action === "export_csv") {
      const rows = this.ctx.storage.sql
        .exec<{
          sort_order: number;
          question_text: string;
          response_text: string;
          created_at: string;
        }>(`
          SELECT q.sort_order, q.question_text, r.response_text, r.created_at
          FROM responses r
          JOIN questions q ON q.id = r.question_id
          ORDER BY q.sort_order ASC, r.id ASC
        `)
        .toArray();

      const csvEscape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;
      const header = ["Timestamp", "Question #", "Question", "Response"].map(csvEscape).join(",");
      const lines = rows.map((r) =>
        [r.created_at, r.sort_order + 1, r.question_text, r.response_text].map(csvEscape).join(",")
      );
      const csv = [header, ...lines].join("\r\n");

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${this.sessionId}-responses.csv"`,
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    if (action === "export_json") {
      const questions = this.getQuestions();
      const exportData = questions.map((q) => ({
        index: q.sort_order,
        question: q.question_text,
        responses: this.getResponsesForQuestion(q.id).map((r) => ({
          id: r.id,
          text: r.response_text,
          createdAt: r.created_at,
        })),
      }));

      return Response.json(
        {
          sessionId: this.sessionId,
          title: this.getMeta("title"),
          exportedAt: new Date().toISOString(),
          questions: exportData,
        },
        {
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    if (action === "state") {
      return Response.json(this.getState(), {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    return Response.json({ error: "Unknown action" }, { status: 404 });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    if (typeof message !== "string") return;
    try {
      const data = JSON.parse(message);
      if (data.type === "submit") {
        const text = (data.text || "").trim();
        if (!text) return;
        const questions = this.getQuestions();
        const activeIndex = this.getActiveQuestionIndex();
        const currentQuestion = questions[activeIndex];
        if (!currentQuestion) return;

        const now = new Date().toISOString();
        const res = this.ctx.storage.sql.exec<{ id: number }>(
          "INSERT INTO responses (question_id, response_text, created_at) VALUES (?, ?, ?) RETURNING id",
          currentQuestion.id,
          text,
          now
        );
        const inserted = res.one();

        this.broadcast({
          type: "new_response",
          questionId: currentQuestion.id,
          response: {
            id: inserted.id,
            question_id: currentQuestion.id,
            response_text: text,
            created_at: now,
          },
        });
      } else if (data.type === "get_state") {
        ws.send(JSON.stringify(this.getState()));
      } else if (data.type === "next") {
        const questions = this.getQuestions();
        let current = this.getActiveQuestionIndex();
        if (current < questions.length - 1) {
          current += 1;
          this.setMeta("active_index", current.toString());
          this.broadcast(this.getState());
        }
      } else if (data.type === "prev") {
        let current = this.getActiveQuestionIndex();
        if (current > 0) {
          current -= 1;
          this.setMeta("active_index", current.toString());
          this.broadcast(this.getState());
        }
      }
    } catch {
      // Ignore malformed JSON
    }
  }
}

// ---------------------------------------------------------------------------
// Worker: Router and View Templates
// ---------------------------------------------------------------------------
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Forward API or WebSocket to Durable Object
    // Format:
    //   /ws/:sessionId
    //   /api/session/:sessionId/:action
    const wsMatch = path.match(/^\/ws\/([a-zA-Z0-9_-]+)/);
    if (wsMatch) {
      const sessionId = wsMatch[1];
      const id = env.POLL_ROOM.idFromName(sessionId);
      const stub = env.POLL_ROOM.get(id);
      return stub.fetch(new Request(`${url.origin}/?sessionId=${encodeURIComponent(sessionId)}`, request));
    }

    const apiMatch = path.match(/^\/api\/session\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/);
    if (apiMatch) {
      const sessionId = apiMatch[1];
      const action = apiMatch[2];
      const id = env.POLL_ROOM.idFromName(sessionId);
      const stub = env.POLL_ROOM.get(id);
      const doUrl = `${url.origin}/?sessionId=${encodeURIComponent(sessionId)}&action=${encodeURIComponent(action)}`;
      return stub.fetch(new Request(doUrl, request));
    }

    // Presenter View: /present/:sessionId
    const presentMatch = path.match(/^\/present\/([a-zA-Z0-9_-]+)/);
    if (presentMatch) {
      const sessionId = presentMatch[1];
      return new Response(renderPresenterView(sessionId), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Student View: /:sessionId (e.g. /s05)
    const studentMatch = path.match(/^\/([a-zA-Z0-9_-]+)$/);
    if (studentMatch && studentMatch[1] !== "favicon.ico") {
      const sessionId = studentMatch[1];
      return new Response(renderStudentView(sessionId), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Default Landing / Help View: /
    return new Response(renderHomeView(), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};

// ---------------------------------------------------------------------------
// HTML Views
// ---------------------------------------------------------------------------

function renderStudentView(sessionId: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>Join Poll - ${sessionId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 16px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid #1e293b;
      margin-bottom: 16px;
    }
    .badge {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 4px 10px;
      background: #3b82f6;
      border-radius: 999px;
    }
    .status {
      font-size: 13px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
    }
    .question-card {
      background: #1e293b;
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 16px;
      border: 1px solid #334155;
    }
    .question-meta {
      font-size: 12px;
      text-transform: uppercase;
      color: #94a3b8;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .question-text {
      font-size: 20px;
      font-weight: 700;
      line-height: 1.35;
      color: #ffffff;
    }
    .input-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }
    textarea {
      width: 100%;
      height: 90px;
      background: #1e293b;
      border: 2px solid #334155;
      border-radius: 10px;
      padding: 12px;
      font-size: 16px;
      color: #ffffff;
      outline: none;
      resize: vertical;
      font-family: inherit;
    }
    textarea:focus {
      border-color: #3b82f6;
    }
    button {
      background: #3b82f6;
      color: #ffffff;
      border: none;
      padding: 14px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.15s;
    }
    button:active {
      background: #2563eb;
    }
    .responses-header {
      font-size: 13px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .stream {
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      flex: 1;
    }
    .card {
      background: #1e293b;
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 15px;
      border-left: 4px solid #3b82f6;
      animation: fadeIn 0.2s ease-out;
      line-height: 1.4;
    }
    .card.mine {
      border-left-color: #10b981;
      background: #1e2e38;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .empty-state {
      text-align: center;
      color: #64748b;
      font-size: 14px;
      padding: 24px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge" id="sessionTag">${sessionId}</span>
    <div class="status">
      <div class="status-dot" id="statusDot"></div>
      <span id="statusText">Connected</span>
    </div>
  </div>

  <div class="question-card">
    <div class="question-meta" id="questionMeta">Loading...</div>
    <div class="question-text" id="questionText">Connecting to session...</div>
  </div>

  <form class="input-form" id="submitForm">
    <textarea id="answerInput" placeholder="Share your thoughts / brainstorm..." required></textarea>
    <button type="submit" id="submitBtn">
      <span>Submit Response</span>
    </button>
  </form>

  <div class="responses-header">
    <span>Live Class Responses</span>
    <span id="responseCount">0</span>
  </div>
  <div class="stream" id="responseStream">
    <div class="empty-state">No responses yet. Be the first!</div>
  </div>

  <script>
    const sessionId = "${sessionId}";
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    let ws = null;
    let currentQuestionId = null;
    let mySubmissions = new Set();

    function fetchState() {
      fetch(\`/api/session/\${sessionId}/state\`)
        .then(r => r.json())
        .then(data => handleState(data))
        .catch(err => console.error("Initial fetch error:", err));
    }

    function connect() {
      ws = new WebSocket(\`\${protocol}//\${location.host}/ws/\${sessionId}\`);

      ws.onopen = () => {
        document.getElementById("statusDot").style.background = "#10b981";
        document.getElementById("statusText").innerText = "Connected";
        ws.send(JSON.stringify({ type: "get_state" }));
      };

      ws.onclose = () => {
        document.getElementById("statusDot").style.background = "#ef4444";
        document.getElementById("statusText").innerText = "Disconnected, reconnecting...";
        setTimeout(connect, 2000);
      };

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === "state") {
          handleState(msg);
        } else if (msg.type === "new_response") {
          handleNewResponse(msg);
        }
      };
    }

    function handleState(state) {
      if (!state.currentQuestion) {
        document.getElementById("questionMeta").innerText = "Waiting";
        document.getElementById("questionText").innerText = "Instructor has not published a question yet.";
        document.getElementById("submitForm").style.display = "none";
        document.getElementById("responseStream").innerHTML = '<div class="empty-state">Waiting for question...</div>';
        return;
      }

      document.getElementById("submitForm").style.display = "flex";
      currentQuestionId = state.currentQuestion.id;
      document.getElementById("questionMeta").innerText = \`Question \${state.activeIndex + 1} of \${state.totalQuestions}\`;
      document.getElementById("questionText").innerText = state.currentQuestion.question_text;
      
      renderResponses(state.responses);
    }

    function renderResponses(responses) {
      const container = document.getElementById("responseStream");
      document.getElementById("responseCount").innerText = responses.length;

      if (!responses || responses.length === 0) {
        container.innerHTML = '<div class="empty-state">No responses yet. Be the first!</div>';
        return;
      }

      container.innerHTML = "";
      responses.forEach(r => {
        const el = document.createElement("div");
        el.className = "card" + (mySubmissions.has(r.id) ? " mine" : "");
        el.innerText = r.response_text;
        container.appendChild(el);
      });
    }

    function handleNewResponse(msg) {
      if (msg.questionId !== currentQuestionId) return;
      const container = document.getElementById("responseStream");
      const empty = container.querySelector(".empty-state");
      if (empty) empty.remove();

      const el = document.createElement("div");
      el.className = "card" + (mySubmissions.has(msg.response.id) ? " mine" : "");
      el.innerText = msg.response.response_text;
      container.insertBefore(el, container.firstChild);

      const countSpan = document.getElementById("responseCount");
      countSpan.innerText = parseInt(countSpan.innerText || "0", 10) + 1;
    }

    document.getElementById("submitForm").onsubmit = (e) => {
      e.preventDefault();
      const input = document.getElementById("answerInput");
      const text = input.value.trim();
      if (!text || !ws || ws.readyState !== WebSocket.OPEN) return;

      ws.send(JSON.stringify({ type: "submit", text }));
      input.value = "";
      input.focus();
    };

    // Reconnect when mobile wakes up
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && (!ws || ws.readyState === WebSocket.CLOSED)) {
        connect();
        fetchState();
      }
    });

    connect();
    fetchState();
  </script>
</body>
</html>`;
}

function renderPresenterView(sessionId: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Presenter - ${sessionId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #090d16;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 32px 48px;
    }
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .join-info {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 20px;
      background: #1e293b;
      padding: 10px 20px;
      border-radius: 999px;
      border: 1px solid #334155;
    }
    .join-info strong {
      color: #38bdf8;
      font-family: monospace;
      font-size: 22px;
    }
    .live-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
      color: #10b981;
      background: rgba(16, 185, 129, 0.12);
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .live-dot {
      width: 10px;
      height: 10px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.6; }
    }
    .question-banner {
      background: #131c2e;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 24px 32px;
      margin-bottom: 28px;
    }
    .question-meta {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #38bdf8;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .question-title {
      font-size: 34px;
      font-weight: 800;
      line-height: 1.3;
      color: #ffffff;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
      flex: 1;
      align-content: start;
    }
    .card {
      background: #172033;
      border: 1px solid #222f49;
      border-left: 5px solid #38bdf8;
      border-radius: 12px;
      padding: 16px 20px;
      font-size: 18px;
      line-height: 1.45;
      color: #f1f5f9;
      animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.94) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .controls-bar {
      position: fixed;
      bottom: 24px;
      right: 32px;
      display: flex;
      gap: 12px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(10px);
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid #334155;
    }
    .modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    .modal {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 24px;
      width: 90%;
      max-width: 550px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .modal h3 { font-size: 20px; color: #38bdf8; }
    .modal p { font-size: 13px; color: #94a3b8; }
    .modal textarea {
      width: 100%;
      height: 140px;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      color: #fff;
      padding: 12px;
      font-size: 14px;
      font-family: inherit;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn {
      background: #1e293b;
      color: #f8fafc;
      border: 1px solid #475569;
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn:hover {
      background: #334155;
      border-color: #64748b;
    }
    .btn-primary {
      background: #2563eb;
      border-color: #3b82f6;
    }
    .btn-primary:hover {
      background: #1d4ed8;
    }
    .empty-prompt {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 0;
      color: #64748b;
      font-size: 22px;
    }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="join-info">
      <span>Join at: <strong id="joinUrl">...</strong></span>
    </div>
    <div class="live-badge">
      <div class="live-dot"></div>
      <span id="responseCountText">0 responses</span>
    </div>
  </div>

  <div class="question-banner">
    <div class="question-meta" id="qMeta">Loading...</div>
    <div class="question-title" id="qTitle">Connecting to session...</div>
  </div>

  <div class="cards-grid" id="cardsGrid">
    <div class="empty-prompt">Waiting for incoming responses...</div>
  </div>

  <div class="controls-bar">
    <button class="btn" id="prevBtn" title="Previous question (Left arrow)">← Prev</button>
    <button class="btn" id="nextBtn" title="Next question (Right arrow)">Next →</button>
    <button class="btn" id="editBtn" title="Edit questions for this session">⚙ Questions</button>
    <a class="btn btn-primary" id="csvExportBtn" target="_blank" title="Export raw CSV">⬇ CSV Export</a>
  </div>

  <div class="modal-overlay" id="editModal">
    <div class="modal">
      <h3>Edit Questions for Session</h3>
      <p>Enter each question on a new line. Saving will reset active responses for this session.</p>
      <textarea id="questionsInput" placeholder="Question 1&#10;Question 2&#10;Question 3"></textarea>
      <div class="modal-actions">
        <button class="btn" id="cancelModalBtn">Cancel</button>
        <button class="btn btn-primary" id="saveModalBtn">Save Questions</button>
      </div>
    </div>
  </div>

  <script>
    const sessionId = "${sessionId}";
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    let ws = null;
    let currentQuestionId = null;

    document.getElementById("joinUrl").innerText = location.host + "/" + sessionId;
    document.getElementById("csvExportBtn").href = \`/api/session/\${sessionId}/export_csv\`;

    function fetchState() {
      fetch(\`/api/session/\${sessionId}/state\`)
        .then(r => r.json())
        .then(data => handleState(data))
        .catch(err => console.error("Initial fetch error:", err));
    }

    function connect() {
      ws = new WebSocket(\`\${protocol}//\${location.host}/ws/\${sessionId}\`);

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "get_state" }));
      };
      
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === "state") {
          handleState(msg);
        } else if (msg.type === "new_response") {
          handleNewResponse(msg);
        }
      };

      ws.onclose = () => {
        setTimeout(connect, 2000);
      };
    }

    function handleState(state) {
      if (!state.currentQuestion) {
        document.getElementById("qMeta").innerText = "No Active Question";
        document.getElementById("qTitle").innerText = "Configure questions via API or setup endpoint.";
        document.getElementById("cardsGrid").innerHTML = '<div class="empty-prompt">No questions active</div>';
        return;
      }

      currentQuestionId = state.currentQuestion.id;
      document.getElementById("qMeta").innerText = \`Question \${state.activeIndex + 1} of \${state.totalQuestions}\`;
      document.getElementById("qTitle").innerText = state.currentQuestion.question_text;
      document.getElementById("responseCountText").innerText = \`\${state.responses.length} responses\`;

      const grid = document.getElementById("cardsGrid");
      if (state.responses.length === 0) {
        grid.innerHTML = '<div class="empty-prompt">Waiting for incoming responses...</div>';
        return;
      }

      grid.innerHTML = "";
      state.responses.forEach(r => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerText = r.response_text;
        grid.appendChild(card);
      });
    }

    function handleNewResponse(msg) {
      if (msg.questionId !== currentQuestionId) return;
      const grid = document.getElementById("cardsGrid");
      const empty = grid.querySelector(".empty-prompt");
      if (empty) empty.remove();

      const card = document.createElement("div");
      card.className = "card";
      card.innerText = msg.response.response_text;
      grid.insertBefore(card, grid.firstChild);

      const countText = document.getElementById("responseCountText");
      const current = parseInt(countText.innerText || "0", 10);
      countText.innerText = \`\${current + 1} responses\`;
    }

    document.getElementById("nextBtn").onclick = () => {
      if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "next" }));
    };

    document.getElementById("prevBtn").onclick = () => {
      if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "prev" }));
    };

    window.addEventListener("keydown", (e) => {
      if (document.getElementById("editModal").style.display === "flex") return;
      if (e.key === "ArrowRight") {
        document.getElementById("nextBtn").click();
      } else if (e.key === "ArrowLeft") {
        document.getElementById("prevBtn").click();
      }
    });

    // Modal handlers
    document.getElementById("editBtn").onclick = () => {
      fetch(\`/api/session/\${sessionId}/export_json\`)
        .then(r => r.json())
        .then(data => {
          const qs = (data.questions || []).map(q => q.question).join("\\n");
          document.getElementById("questionsInput").value = qs;
          document.getElementById("editModal").style.display = "flex";
        })
        .catch(() => {
          document.getElementById("editModal").style.display = "flex";
        });
    };

    document.getElementById("cancelModalBtn").onclick = () => {
      document.getElementById("editModal").style.display = "none";
    };

    document.getElementById("saveModalBtn").onclick = () => {
      const raw = document.getElementById("questionsInput").value;
      const questions = raw.split("\\n").map(s => s.trim()).filter(Boolean);
      if (questions.length === 0) return;

      fetch(\`/api/session/\${sessionId}/setup\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions })
      }).then(() => {
        document.getElementById("editModal").style.display = "none";
        fetchState();
      });
    };

    connect();
    fetchState();
  </script>
</body>
</html>`;
}

function renderHomeView(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Polling Engine</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      padding: 48px;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 { font-size: 32px; margin-bottom: 8px; color: #38bdf8; }
    p { color: #94a3b8; margin-bottom: 24px; }
    pre {
      background: #1e293b;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 14px;
      color: #e2e8f0;
      border: 1px solid #334155;
    }
    code { font-family: monospace; }
    .card {
      background: #1e293b;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 24px;
      border: 1px solid #334155;
    }
  </style>
</head>
<body>
  <h1>Live Polling Engine</h1>
  <p>Self-hosted, zero-latency audience response system powered by Cloudflare Durable Objects + SQLite.</p>

  <div class="card">
    <h3>Quick CLI Setup for a Session</h3>
    <pre><code>curl -X POST https://YOUR_WORKER/api/session/s05/setup \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Session 05: Business Partner Discovery",
    "questions": [
      "Warm-up: What AI tool have you used most this week?",
      "Brainstorm: What tasks are part of this job process?",
      "Brainstorm: What data and records need to be tracked?"
    ]
  }'</code></pre>
  </div>

  <div class="card">
    <h3>Endpoints</h3>
    <ul>
      <li><strong>Student Join:</strong> <code>/:sessionId</code> (e.g. <code>/s05</code>)</li>
      <li><strong>Presenter Screen:</strong> <code>/present/:sessionId</code> (e.g. <code>/present/s05</code>)</li>
      <li><strong>Export CSV:</strong> <code>/api/session/:sessionId/export_csv</code></li>
      <li><strong>Export JSON:</strong> <code>/api/session/:sessionId/export_json</code></li>
    </ul>
  </div>
</body>
</html>`;
}
