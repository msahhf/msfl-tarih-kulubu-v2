import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Server-side HTML sanitizer for user-generated blog content.
 * Legacy posts may contain arbitrary HTML, so every render path
 * must pass content through here before dangerouslySetInnerHTML.
 */
export function sanitizeBlogContent(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "h1",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "hr",
      "pre",
      "code",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    // Force safe link behavior
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },
  });
}

/** Plain-text excerpt for cards/SEO (strips all tags). */
export function toPlainTextExcerpt(html: string, maxLength = 160): string {
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
