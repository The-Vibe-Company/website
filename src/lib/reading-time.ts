/**
 * Estimate reading time from body content (supports plain strings and Lexical JSON)
 */
export function estimateReadingTime(body: unknown): number {
  let text = '';
  if (typeof body === 'string') {
    text = body;
  } else {
    text = extractText(body);
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
}

function extractText(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const n = node as Record<string, unknown>;

  if (typeof n.text === 'string') return n.text;

  if (n.root && typeof n.root === 'object') {
    return extractText(n.root);
  }

  if (Array.isArray(n.children)) {
    return n.children.map(extractText).join(' ');
  }

  return '';
}
