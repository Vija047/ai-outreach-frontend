export type TemplateChannel = "EMAIL" | "LINKEDIN";

export type TemplateGoal = "Interview" | "Follow-up" | "Introduction";

export const TEMPLATE_GOALS: TemplateGoal[] = [
  "Interview",
  "Follow-up",
  "Introduction",
];

export const CHANNEL_META: Record<
  TemplateChannel,
  {
    label: string;
    badgeClass: string;
    iconClass: string;
    ringHover: string;
    description: string;
  }
> = {
  EMAIL: {
    label: "Email",
    badgeClass: "border-primary/30 bg-primary/10 text-primary",
    iconClass: "text-primary",
    ringHover: "hover:border-primary/40",
    description: "Cold emails built to land interviews and replies",
  },
  LINKEDIN: {
    label: "LinkedIn",
    badgeClass: "border-primary/30 bg-primary/10 text-primary",
    iconClass: "text-primary",
    ringHover: "hover:border-primary/40",
    description: "DMs and connection notes that start conversations",
  },
};

const CATEGORY_SEPARATOR = " · ";

export function formatTemplateCategory(
  channel: TemplateChannel,
  goal: TemplateGoal,
): string {
  return `${CHANNEL_META[channel].label}${CATEGORY_SEPARATOR}${goal}`;
}

export function parseTemplateCategory(category: string): {
  channel: TemplateChannel;
  goal: string;
} {
  const parts = category.split(CATEGORY_SEPARATOR).map((part) => part.trim());
  if (parts.length >= 2) {
    const channelLabel = parts[0].toLowerCase();
    return {
      channel: channelLabel.includes("linkedin") ? "LINKEDIN" : "EMAIL",
      goal: parts.slice(1).join(CATEGORY_SEPARATOR),
    };
  }

  const lower = category.toLowerCase();
  if (lower.includes("linkedin")) {
    return { channel: "LINKEDIN", goal: category };
  }

  return { channel: "EMAIL", goal: category || "General" };
}

export function previewBody(body: string, maxLength = 120): string {
  const firstLine = body
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) return "";
  if (firstLine.length <= maxLength) return firstLine;
  return `${firstLine.slice(0, maxLength).trim()}…`;
}

export function channelPlaceholder(channel: TemplateChannel): string {
  if (channel === "LINKEDIN") {
    return `Hi {{name}}, I've been following {{company}}'s work.

{{hook}}

Would you be open to a quick chat about opportunities on your team?`;
  }

  return `Subject: Quick question about {{company}}

Hi {{name}},

I noticed {{company}} is {{hook}}. I'm a {{role}} who helps teams {{valueProposition}}.

Would you be open to a 15-minute call this week?

Best,
{{senderName}}`;
}
