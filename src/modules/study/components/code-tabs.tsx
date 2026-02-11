import { languages as allLanguages } from "virtual:content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@client/shared/components/ui/tabs";
import { COPY_FEEDBACK_DURATION } from "@client/shared/constants/timing";
import type { TopicExample } from "@client/shared/types";
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
		<Tabs defaultValue={sorted[0].languageId} className="w-full">
			<TabsList className="bg-surface-raised/80 border border-border rounded-lg p-1 h-auto flex-wrap gap-0.5">
				{sorted.map((example) => {
					const lang = allLanguages.find((l: { id: string }) => l.id === example.languageId);
					return (
						<TabsTrigger
							key={example.languageId}
							value={example.languageId}
							className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-primary/12 data-[state=active]:text-primary data-[state=inactive]:text-text-muted hover:text-text transition-colors duration-200"
						>
							{lang?.name ?? example.languageId}
						</TabsTrigger>
					);
				})}
			</TabsList>

			{sorted.map((example) => (
				<TabsContent key={example.languageId} value={example.languageId}>
					<div className="relative group rounded-lg border border-border bg-surface-raised/60 overflow-hidden">
						<button
							type="button"
							onClick={() => handleCopy(example.code, example.languageId)}
							className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-text-faint bg-surface-hover/80 opacity-0 group-hover:opacity-100 hover:text-text hover:bg-surface-active transition-all duration-200"
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
						<pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
							<code className="font-mono text-text-muted">{example.code}</code>
						</pre>
					</div>
				</TabsContent>
			))}
		</Tabs>
	);
};
