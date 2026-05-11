import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export const runtime = "nodejs";

const LINKEDIN_PDF_PATH = path.join(process.cwd(), "Linkedin.pdf");
let linkedInPdfContextPromise: Promise<string> | null = null;

const SYSTEM_PROMPT = `
You are the digital twin of Ziyad Alhdriti on his professional portfolio website.

Response rules:
- Sound natural and human, like a thoughtful professional speaking in first person.
- Keep answers clear, conversational, and concise.
- Default to short paragraphs; only use bullet points when the user explicitly asks for a list.
- Do not use markdown headings, tables, code blocks, or decorative symbols.
- Stay factual and grounded in the provided career profile.
- If a detail is unknown, clearly say you do not have that detail yet.
- If a question is unrelated to Ziyad's career, politely redirect back to his professional profile.
- Prefer warm and confident wording over robotic tone.
`;

const CAREER_KNOWLEDGE = `
Identity:
- Name: Ziyad Jaber Alhdriti
- Role: Software Engineering student, Mobile Application Engineer
- Location: Makkah, Saudi Arabia
- LinkedIn: www.linkedin.com/in/ziyad-alhdriti
- GitHub: github.com/ziyadalhd

Education:
- Umm Al-Qura University, B.S. in Software Engineering (2023-2027 expected)
- GPA: 3.73/4.00
- Academic foundation: OOP, data structures, software requirements, UML, testing, databases, SDLC

Projects:
- WASL (2025-present): Integrated student transportation and accommodation platform
  - Stack: Flutter, Dart, Spring Boot, Java, REST APIs, PostgreSQL, Git, Agile Scrum
  - Work: mobile screens implementation, backend API integration, booking/service workflows
- Personal iOS app (2026): Built independently in Swift with AI-assisted rapid prototyping and local data storage

Certifications:
- Python 101 (Satr, 2023)
- Flutter Application Development Bootcamp (Hash Plus, 2025, 30 hours)

Volunteering:
- Community Volunteer (2024-present)
- 262+ verified volunteering hours via National Volunteering Platform in Saudi Arabia

Skills:
- Languages: Java, Dart, Swift
- Frameworks/Tools: Flutter, Spring Boot, Git, GitHub, Firebase
- Databases: PostgreSQL, SQL
- Concepts: OOP, REST APIs, SDLC, Agile, system design

Communication style:
- Professional, clear, and concise
- Focus on concrete details and measurable outcomes
- If uncertain, say so instead of inventing facts
`;

function normalizeAssistantReply(content: string) {
  return content
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function compactPdfText(rawText: string) {
  const normalized = rawText
    .replace(/\0/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^--\s*\d+\s*of\s*\d+\s*--$/i.test(line))
    .filter((line) => /[A-Za-z]/.test(line));

  const uniqueLines = Array.from(new Set(lines));

  const prioritized = uniqueLines.filter((line) =>
    /(SUMMARY|EDUCATION|PROJECTS|SKILLS|VOLUNTEERING|Umm Al-Qura|WASL|Flutter|Spring Boot|Software Engineering|GPA|Volunteer|Swift|LinkedIn|GitHub)/i.test(
      line,
    ),
  );

  const fallbackPool = uniqueLines.filter((line) => !prioritized.includes(line));
  const selected = [...prioritized, ...fallbackPool].join("\n");
  return selected.slice(0, 12000);
}

async function loadLinkedInPdfContext() {
  let parser: PDFParse | null = null;
  try {
    const buffer = await fs.readFile(LINKEDIN_PDF_PATH);
    parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    const text = compactPdfText(parsed.text ?? "");
    return text || "LinkedIn PDF context is empty.";
  } catch {
    return "LinkedIn PDF context could not be loaded at runtime.";
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}

async function getLinkedInPdfContext() {
  if (!linkedInPdfContextPromise) {
    linkedInPdfContextPromise = loadLinkedInPdfContext();
  }
  return linkedInPdfContextPromise;
}

export async function POST(req: Request) {
  const apiKey =
    process.env.OPENROUTER_API_KEY ?? process.env.openrouter_api_key;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OpenRouter API key not found. Add OPENROUTER_API_KEY to your .env file.",
      },
      { status: 500 },
    );
  }

  let body: { messages?: ChatMessage[] } | null = null;

  try {
    body = (await req.json()) as { messages?: ChatMessage[] };
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const messages = (body?.messages ?? [])
    .filter((msg) => msg?.role && msg?.content)
    .slice(-12);

  if (messages.length === 0) {
    return NextResponse.json(
      { error: "Please include at least one user message." },
      { status: 400 },
    );
  }

  try {
    const linkedInPdfContext = await getLinkedInPdfContext();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Ziyad Portfolio Digital Twin",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:free",
        messages: [
          {
            role: "system",
            content:
              SYSTEM_PROMPT +
              "\n\nCareer profile you must use as the source of truth:\n" +
              CAREER_KNOWLEDGE +
              "\n\nAdditional context extracted from Linkedin.pdf:\n" +
              linkedInPdfContext,
          },
          ...messages,
        ],
        temperature: 0.5,
        max_tokens: 450,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "OpenRouter request failed.",
          details: errorText,
        },
        { status: 502 },
      );
    }

    const data = (await response.json()) as OpenRouterResponse;
    const rawReply = data.choices?.[0]?.message?.content?.trim();
    const reply = rawReply ? normalizeAssistantReply(rawReply) : "";

    if (!reply) {
      return NextResponse.json(
        { error: "OpenRouter returned an empty response." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
