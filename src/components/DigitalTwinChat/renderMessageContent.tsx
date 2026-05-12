import { memo, useMemo } from "react";

function RenderedMessageContent({ content }: { content: string }) {
  const blocks = useMemo(() => {
    const cleaned = content
      .replace(/\r\n/g, "\n")
      .replace(/\u00a0/g, " ")
      .replace(/```/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return cleaned
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean);
  }, [content]);

  return (
    <div className="twin-content">
      {blocks.map((block, index) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.length > 0 && lines.every((line) => /^[-*•]\s+/.test(line))) {
          return (
            <ul key={`ul-${index}`}>
              {lines.map((line, lineIndex) => (
                <li key={`ul-line-${lineIndex}`}>
                  {line.replace(/^[-*•]\s+/, "")}
                </li>
              ))}
            </ul>
          );
        }

        if (
          lines.length > 0 &&
          lines.every((line) => /^\d+[.)]\s+/.test(line))
        ) {
          return (
            <ol key={`ol-${index}`}>
              {lines.map((line, lineIndex) => (
                <li key={`ol-line-${lineIndex}`}>
                  {line.replace(/^\d+[.)]\s+/, "")}
                </li>
              ))}
            </ol>
          );
        }

        return <p key={`p-${index}`}>{lines.join(" ")}</p>;
      })}
    </div>
  );
}

export const MessageContent = memo(RenderedMessageContent);
