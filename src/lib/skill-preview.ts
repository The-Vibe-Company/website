function cleanPreviewLine(line: string): string {
  return line
    .replace(/^[-*]\s+/, '')
    .replace(/^\d+\.\s+/, '')
    .replace(/^#+\s+/, '')
    .replace(/\*\*/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function uniqueLines(lines: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const line of lines) {
    const normalized = line.toLowerCase();
    if (!line || seen.has(normalized)) continue;
    seen.add(normalized);
    output.push(line);
  }

  return output;
}

export function getSkillPreviewLines(body: string | null | undefined, limit = 4): string[] {
  if (!body) return [];

  const lines = body.split('\n').map((line) => line.trim());
  const useThisWhenIndex = lines.findIndex((line) => /^##\s+use this when/i.test(line));

  if (useThisWhenIndex >= 0) {
    const sectionLines: string[] = [];

    for (const line of lines.slice(useThisWhenIndex + 1)) {
      if (/^##\s+/.test(line)) break;
      if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
        sectionLines.push(cleanPreviewLine(line));
      }
    }

    const preview = uniqueLines(sectionLines).slice(0, limit);
    if (preview.length > 0) return preview;
  }

  const fallback = lines
    .filter((line) => /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line))
    .map(cleanPreviewLine);

  return uniqueLines(fallback).slice(0, limit);
}
