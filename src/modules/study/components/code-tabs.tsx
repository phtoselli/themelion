import { languages as allLanguages } from "virtual:content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@client/shared/components/ui/tabs";
import { COPY_FEEDBACK_DURATION } from "@client/shared/constants/timing";
import type { TopicExample } from "@client/shared/types";
import "@client/styles/modules/code-tabs.css";
import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

const LANGUAGE_ORDER = ["python", "typescript", "csharp", "go", "rust"];

interface CodeTabsProps {
	examples: TopicExample[];
}

export const CodeTabs = ({ examples }: CodeTabsProps) => {
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const sorted = [...examples].sort((a, b) => {
		const aIdx = LANGUAGE_ORDER.indexOf(a.languageId);
		const bIdx = LANGUAGE_ORDER.indexOf(b.languageId);
		return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
	});

	const handleCopy = useCallback((code: string, langId: string) => {
		navigator.clipboard.writeText(code);
		setCopiedId(langId);
		setTimeout(() => setCopiedId(null), COPY_FEEDBACK_DURATION);
	}, []);

	if (sorted.length === 0) return null;

	return (
		<Tabs defaultValue={sorted[0].languageId} style={{ width: "100%" }}>
			<TabsList className="code-tabs-list">
				{sorted.map((example) => {
					const lang = allLanguages.find((l: { id: string }) => l.id === example.languageId);
					return (
						<TabsTrigger
							key={example.languageId}
							value={example.languageId}
							className="code-tabs-trigger"
						>
							{lang?.name ?? example.languageId}
						</TabsTrigger>
					);
				})}
			</TabsList>

			{sorted.map((example) => (
				<TabsContent key={example.languageId} value={example.languageId}>
					<div className="code-block">
						<button
							type="button"
							onClick={() => handleCopy(example.code, example.languageId)}
							className="code-block-copy"
						>
							{copiedId === example.languageId ? (
								<>
									<Check size={12} />
									<span>Copiado</span>
								</>
							) : (
								<>
									<Copy size={12} />
									<span>Copiar</span>
								</>
							)}
						</button>
						<pre className="code-block-pre">
							<code className="code-block-code">{example.code}</code>
						</pre>
					</div>
				</TabsContent>
			))}
		</Tabs>
	);
};
