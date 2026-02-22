import { knowledgeBase } from "@/data/knowledge";

export function retrieveKnowledge(question: string) {
  const lower = question.toLowerCase();

  return knowledgeBase
    .filter(doc =>
      doc.content.toLowerCase().includes(lower) ||
      lower.includes("тариф") && doc.id === "tariffs" ||
      lower.includes("статистик") && doc.id === "statistics"
    )
    .map(doc => doc.content)
    .join("\n\n");
}
