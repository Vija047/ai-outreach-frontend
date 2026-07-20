export interface TemplatePreviewContext {
  name?: string;
  company?: string;
  hook?: string;
  role?: string;
  valueProposition?: string;
  services?: string;
  senderName?: string;
  industry?: string;
}

export function applyTemplatePreview(
  body: string,
  context: TemplatePreviewContext,
): string {
  return body.replace(/\{\{(\w+)\}\}/g, (token, key: string) => {
    const value = context[key as keyof TemplatePreviewContext];
    return value?.trim() ? value : token;
  });
}

export function previewContextLabel(context: TemplatePreviewContext): {
  senderName: string;
  company: string;
} {
  return {
    senderName: context.senderName?.trim() || "Your name",
    company: context.company?.trim() || "Recent company",
  };
}
