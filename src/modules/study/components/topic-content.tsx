import type { TopicExample } from "@client/shared/types";
import { sanitizeUrl } from "@client/shared/utils/security";
import type { ReactNode } from "react";
import "@client/styles/modules/topic-content.css";
import { CodeTabs } from "./code-tabs";

interface TopicContentProps {
	content: string;
	examples: TopicExample[];
}

interface ContentSection {
	heading: string;
	body: string;
}

const parseSections = (content: string): ContentSection[] => {
	const sections: ContentSection[] = [];
	const lines = content.split("\n");
	let currentHeading = "";
	let currentBody: string[] = [];

	for (const line of lines) {
		if (line.startsWith("## ")) {
			if (currentHeading || currentBody.length > 0) {
				sections.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
			}
			currentHeading = line.slice(3).trim();
			currentBody = [];
		} else {
			currentBody.push(line);
		}
	}

	if (currentHeading || currentBody.length > 0) {
		sections.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
	}

	return sections;
};

const renderInline = (text: string): ReactNode[] => {
	const result: ReactNode[] = [];
	let remaining = text;
	let key = 0;

	while (remaining.length > 0) {
		// Busca por inline code (`code`)
		const codeMatch = remaining.match(/^(.*?)`([^`]+)`/);
		// Busca por bold (**text**)
		const boldMatch = remaining.match(/^(.*?)\*\*([^*]+)\*\*/);
		// Busca por links [text](url)
		const linkMatch = remaining.match(/^(.*?)\[([^\]]+)\]\(([^)]+)\)/);

		// Encontra o mais próximo
		const matches = [
			codeMatch ? { type: "code" as const, index: codeMatch[1].length, match: codeMatch } : null,
			boldMatch ? { type: "bold" as const, index: boldMatch[1].length, match: boldMatch } : null,
			linkMatch ? { type: "link" as const, index: linkMatch[1].length, match: linkMatch } : null,
		].filter((m): m is NonNullable<typeof m> => m !== null);

		if (matches.length === 0) {
			result.push(remaining);
			break;
		}

		matches.sort((a, b) => a.index - b.index);
		const closest = matches[0];

		if (closest.type === "code") {
			const m = closest.match as RegExpMatchArray;
			if (m[1]) result.push(m[1]);
			result.push(
				<code key={key++} className="topic-inline-code">
					{m[2]}
				</code>,
			);
			remaining = remaining.slice(m[0].length);
		} else if (closest.type === "bold") {
			const m = closest.match as RegExpMatchArray;
			if (m[1]) result.push(m[1]);
			result.push(
				<strong key={key++} className="topic-bold">
					{m[2]}
				</strong>,
			);
			remaining = remaining.slice(m[0].length);
		} else if (closest.type === "link") {
			const m = closest.match as RegExpMatchArray;
			if (m[1]) result.push(m[1]);

			// Validar URL para prevenir XSS via javascript:, data:, etc.
			const validUrl = sanitizeUrl(m[3]);

			if (validUrl) {
				result.push(
					<a
						key={key++}
						href={validUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="topic-link"
					>
						{m[2]}
					</a>,
				);
			} else {
				// URL inválida: renderizar como texto tachado para alertar o autor do conteúdo
				result.push(
					<span key={key++} className="topic-invalid-link">
						[{m[2]}]
					</span>,
				);
			}
			remaining = remaining.slice(m[0].length);
		}
	}

	return result;
};

const renderBlock = (body: string): ReactNode[] => {
	const elements: ReactNode[] = [];
	const lines = body.split("\n");
	let i = 0;
	let key = 0;

	while (i < lines.length) {
		const line = lines[i];

		// Linhas vazias
		if (line.trim() === "") {
			i++;
			continue;
		}

		// Bloco de código (```)
		if (line.startsWith("```")) {
			const codeLines: string[] = [];
			i++;
			while (i < lines.length && !lines[i].startsWith("```")) {
				codeLines.push(lines[i]);
				i++;
			}
			i++; // pula o ``` de fechamento
			elements.push(
				<div key={key++} className="topic-code-block">
					<pre className="topic-code-pre">
						<code className="topic-code-text">{codeLines.join("\n")}</code>
					</pre>
				</div>,
			);
			continue;
		}

		// Listas (- item)
		if (line.startsWith("- ")) {
			const listItems: ReactNode[] = [];
			while (i < lines.length && lines[i].startsWith("- ")) {
				listItems.push(
					<li key={key++} className="topic-list-item">
						{renderInline(lines[i].slice(2))}
					</li>,
				);
				i++;
			}
			elements.push(
				<ul key={key++} className="topic-list">
					{listItems}
				</ul>,
			);
			continue;
		}

		// Parágrafo (acumula linhas não-vazias consecutivas)
		const paragraphLines: string[] = [];
		while (
			i < lines.length &&
			lines[i].trim() !== "" &&
			!lines[i].startsWith("- ") &&
			!lines[i].startsWith("```") &&
			!lines[i].startsWith("## ")
		) {
			paragraphLines.push(lines[i]);
			i++;
		}

		if (paragraphLines.length > 0) {
			elements.push(
				<p key={key++} className="topic-paragraph">
					{renderInline(paragraphLines.join(" "))}
				</p>,
			);
		}
	}

	return elements;
};

export const TopicContent = ({ content, examples }: TopicContentProps) => {
	const sections = parseSections(content);

	return (
		<div className="topic-sections">
			{sections.map((section, idx) => {
				const isCodeTabs = section.body.includes("<CodeTabs");

				return (
					<section
						key={section.heading || idx}
						className="animate-fade-in-up"
						style={{ animationDelay: `${Math.min(idx + 1, 10) * 0.05}s` }}
					>
						{section.heading && <h2 className="topic-section-heading">{section.heading}</h2>}
						{isCodeTabs ? <CodeTabs examples={examples} /> : renderBlock(section.body)}
					</section>
				);
			})}
		</div>
	);
};
