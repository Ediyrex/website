/**
 * Strips HTML tags and non-printable control characters (preserving newlines/tabs)
 * to mitigate stored XSS and control-byte injection in user-submitted strings.
 */
export function sanitizePlainText(input: string): string {
  return input
    .replace(/<[^>]*>?/gm, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

/**
 * Sanitizes and neutralizes potential Prompt Injection vectors in user text
 * prior to consumption by internal AI agents, LLM pipelines, or summarizers.
 *
 * Mitigates:
 * - Direct instruction overrides ("Ignore previous instructions", "Disregard system prompt")
 * - Delimiter hijacking (`[INST]`, `[/INST]`, `<|im_start|>`, `SYSTEM:`, `ASSISTANT:`)
 * - Role spoofing and context boundary escapes
 */
export function sanitizePromptInput(input: string, maxLength: number = 3000): string {
  const cleaned = input
    .replace(/<\|im_start\|>\s*(?:system|assistant|user|developer)?/gi, "")
    .replace(/<\|im_end\|>|<\|system\|>|<\|user\|>|<\|assistant\|>/gi, "")
    .replace(/\[\/?(INST|SYSTEM|SYS|PROMPT)\]/gi, "")
    .replace(/\b(system|assistant|developer)\b\s*:?/gi, "")
    .replace(/(?:ignore|disregard|forget|override)\s+(?:all\s+)?(?:previous|prior|system)\s+(?:instructions|prompts|rules)/gi, "[redacted-override-attempt]");

  return sanitizePlainText(cleaned).slice(0, maxLength).trim();
}

/**
 * Wraps user-supplied content within rigid XML boundary tags for LLM prompts,
 * ensuring the model treats the payload strictly as untrusted data rather than instructions.
 */
export function formatSafePromptBlock(tagName: string, content: string): string {
  const sanitizedTag = tagName.replace(/[^a-zA-Z0-9_-]/g, "");
  const sanitizedContent = sanitizePromptInput(content);
  return `<${sanitizedTag}>\n${sanitizedContent}\n</${sanitizedTag}>`;
}
