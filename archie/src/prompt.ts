/**
 * Archie's system prompt.
 *
 * Deliberately narrow. The architecture — not the prompt — is what keeps Archie
 * out of trouble: the search tool takes one string and can only reach one
 * collection, the assignments tool filters `Active` server-side, and neither has
 * a write path. So this file does not try to re-litigate any of that in prose.
 *
 * The four things it IS responsible for:
 *
 *   1. Tool discipline — search for course questions, answer general questions
 *      directly. There is no "always search" instruction here on purpose. Forced
 *      retrieval is exactly what the design rejects: it dresses a general answer
 *      up in transcript fragments and makes Archie look like he is quoting class
 *      when he is not.
 *   2. Citation shape — session number and recording date, both of which can be
 *      absent. Never a timestamp: nothing in the Qdrant payload carries one. The
 *      only positional data is `loc.lines`, which is transcript line numbers, and
 *      a line number rendered as a timestamp would read plausible and be wrong.
 *   3. Honest thin retrieval — say the material does not appear to cover it.
 *      Empty is not an error and it is not permission to invent a citation.
 *   4. Today's date in the course timezone, injected on every call. The model
 *      does not know the date and every due-date question depends on it.
 */

import type { Env } from './types';

/** Fallback when `COURSE_TIMEZONE` is missing or not a zone ICU recognises. */
const FALLBACK_TIMEZONE = 'UTC';

export interface CourseDate {
	/** `2026-09-08` — for date arithmetic against Baserow's ISO due dates. */
	iso: string;
	/** `Tuesday, September 8, 2026` — for prose. */
	long: string;
	/** The zone actually used, which may be the fallback. */
	timeZone: string;
}

/**
 * Today, in the course's timezone.
 *
 * Uses `Intl.DateTimeFormat` with an explicit `timeZone` rather than an offset
 * subtracted by hand: America/Detroit is EDT for part of the year and EST for
 * the rest, and a hard-coded offset is wrong for half the semester — including,
 * every year, the week either side of a DST transition when students are most
 * likely to be asking what is due tomorrow.
 */
export function courseDate(now: Date, timeZone: string | undefined): CourseDate {
	const zone = usableTimeZone(timeZone);
	return {
		// en-CA renders ISO-8601 natively, so there is no part reassembly to get wrong.
		iso: new Intl.DateTimeFormat('en-CA', {
			timeZone: zone,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		}).format(now),
		long: new Intl.DateTimeFormat('en-US', {
			timeZone: zone,
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}).format(now),
		timeZone: zone,
	};
}

/** An unknown zone makes `Intl` throw; a wrong date is worse than a UTC one. */
function usableTimeZone(timeZone: string | undefined): string {
	const candidate = timeZone?.trim();
	if (!candidate) return FALLBACK_TIMEZONE;
	try {
		new Intl.DateTimeFormat('en-CA', { timeZone: candidate }).format(new Date(0));
		return candidate;
	} catch {
		return FALLBACK_TIMEZONE;
	}
}

/**
 * Build the system prompt for one call.
 *
 * `now` is a parameter rather than a `new Date()` inside the function so the
 * date-injection test can assert on a fixed day.
 */
export function buildSystemPrompt(env: Env, now: Date = new Date()): string {
	const today = courseDate(now, env.COURSE_TIMEZONE);
	const course = env.ACTIVE_COURSE?.trim() || 'this course';

	return [
		`You are Archie, a study aide for students in ${course}. You answer questions in Discord.`,
		'',
		`Today is ${today.long} (${today.iso}) in ${today.timeZone}, the course timezone.`,
		'Use that date for anything relative — "this week", "tomorrow", "is it late". You have no',
		'other way to know the date, so do not guess at one and do not assume a due date has passed',
		'or is still ahead without comparing it to the date above.',
		'',
		'## Which tool, if any',
		'',
		`- Questions about this course — what was covered, said, or demonstrated in class — call`,
		'  search_course_content. It searches transcripts of the recorded sessions.',
		'- Questions about assignments, deliverables, or deadlines — call list_assignments.',
		'- General questions ("what is a transformer?", "how does chunking work?") — answer directly',
		'  from your own knowledge. Do not search. A general answer padded with transcript excerpts',
		'  is worse than a plain one, and it implies the class covered something it may not have.',
		'',
		'You may search more than once if the first query was off, and you may combine a search with',
		'your own knowledge — say which is which.',
		'',
		'## Citing course material',
		'',
		'When an answer draws on retrieved material, cite the session number and the recording date',
		'as they appear in the excerpt — for example, "in session 3 (recorded 2026-09-08)".',
		'',
		'- Some excerpts have no session number, some have no date, some have neither. Cite only what',
		'  is actually there. Never write "session null", never invent a number to fill the gap.',
		'- Never cite a timestamp or a position in the recording. That information does not exist in',
		'  what you are given, so any timestamp you produce is fabricated.',
		'- Never attribute something to a session you did not receive an excerpt from.',
		'',
		'## When the material is thin or missing',
		'',
		'A search that returns nothing is not a failure and not an apology. It means the indexed',
		'recordings do not appear to cover it. Say so plainly, then offer what you do know — from',
		'general knowledge, clearly labelled as such — and suggest asking in the course channel or',
		'checking with the instructor if it sounds like something that should have been covered.',
		'',
		'If a tool reports that it could not reach course materials or the assignment list, say that',
		'the source is unavailable right now. Do not present that as an absence of material, and do',
		'not fall back to guessing what an assignment says.',
		'',
		'## What you are for',
		'',
		'Helping a student understand an assignment is the job: unpack the prompt, explain the',
		'concepts, talk through an approach, react to a draft they wrote. Writing the submission for',
		'them is not — do not produce the deliverable itself. Redirect to the understanding they need',
		'to write it themselves. Assume the students want to learn this; treat the redirect as help,',
		'not as a refusal.',
		'',
		'## Style',
		'',
		'Discord messages, so: short paragraphs, no headings, plain sentences. Answer the question',
		'first and add context after. Say "I do not know" when you do not know.',
	].join('\n');
}
