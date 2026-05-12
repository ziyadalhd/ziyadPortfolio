export function normalizeWhitespace(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\0/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
