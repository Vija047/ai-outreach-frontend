"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  IconCheck,
  IconCoin,
  IconHistory,
  IconHome,
  IconLoader2,
  IconLogout,
  IconMail,
  IconMoon,
  IconPlayerPause,
  IconPlayerPlay,
  IconSparkles,
  IconTemplate,
  IconUser,
} from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { FadeIn } from "@/components/landing/motion-primitives";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DemoScene = "input" | "analyze" | "hooks" | "outreach";

const DEMO_URL = "https://acmerobotics.com";
const SCENE_ORDER: DemoScene[] = ["input", "analyze", "hooks", "outreach"];
const SCENE_LABELS: Record<DemoScene, string> = {
  input: "Paste URL",
  analyze: "AI research",
  hooks: "Pick a hook",
  outreach: "Copy outreach",
};

const SCENE_DURATIONS_MS: Record<DemoScene, number> = {
  input: 3200,
  analyze: 4200,
  hooks: 3400,
  outreach: 4800,
};

const DEMO_NAV = [
  { label: "Home", icon: IconHome, activeOn: ["input", "analyze"] as DemoScene[] },
  { label: "History", icon: IconHistory, activeOn: ["outreach"] as DemoScene[] },
  { label: "Templates", icon: IconTemplate, activeOn: [] as DemoScene[] },
  { label: "Profile", icon: IconUser, activeOn: [] as DemoScene[] },
] as const;

const PAGE_COPY: Record<
  DemoScene,
  { title: string; description: string }
> = {
  input: {
    title: "Home",
    description: "Paste a prospect URL to research the company and find outreach hooks.",
  },
  analyze: {
    title: "Home",
    description: "Analyzing Acme Robotics — scraping the site and pulling recent news.",
  },
  hooks: {
    title: "Acme Robotics",
    description: "Review hooks, pick the strongest opener, then generate outreach.",
  },
  outreach: {
    title: "Outreach ready",
    description: "Email, LinkedIn DM, connection note, and follow-ups generated from your hook.",
  },
};

const ANALYSIS_STEPS = [
  "Reading site",
  "Finding hooks",
  "Preparing profile",
  "Finding contacts",
];

const HOOKS = [
  {
    title: "Series B funding round",
    description: "Acme Robotics raised $48M to expand industrial automation.",
    confidence: 92,
  },
  {
    title: "New Austin manufacturing plant",
    description: "Company opened a 120,000 sq ft facility last quarter.",
    confidence: 87,
  },
  {
    title: "12 open engineering roles",
    description: "Active hiring across robotics and ML teams on careers page.",
    confidence: 81,
  },
];

const OUTREACH_PREVIEW = {
  subject: "Congrats on the Austin expansion",
  email: `Hi Sarah,

Congrats on Acme's Series B and the new Austin plant. Scaling a robotics team that fast is no small feat.

We help industrial automation companies ship AI-powered outreach faster. Given your open engineering roles, a 15-minute chat could be useful.

Open to connecting this week?

Best,
Alex`,
};

function sceneIndex(scene: DemoScene) {
  return SCENE_ORDER.indexOf(scene);
}

function DemoAppShell({
  scene,
  credits,
  children,
}: {
  scene: DemoScene;
  credits: number;
  children: React.ReactNode;
}) {
  const page = PAGE_COPY[scene];

  return (
    <div className="flex min-h-[28rem] overflow-hidden bg-background sm:min-h-[32rem]">
      <aside className="hidden w-44 shrink-0 flex-col border-r border-border bg-card/50 sm:flex lg:w-52">
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            AO
          </span>
          <span className="truncate text-sm font-semibold">AI Outreach</span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {DEMO_NAV.map((item) => {
            const active = item.activeOn.includes(scene);
            return (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground",
                )}
              >
                <item.icon className="size-3.5 shrink-0" stroke={1.5} />
                {item.label}
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-border p-3">
          <p className="truncate text-xs font-medium">Alex Seller</p>
          <p className="truncate text-[10px] text-muted-foreground">
            alex@example.com
          </p>
          <div className="mt-2 flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-[10px] text-muted-foreground">
            <IconLogout className="size-3" stroke={1.5} />
            Log out
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-border bg-background/95 px-3 backdrop-blur sm:h-12 sm:px-4">
          <div className="flex min-w-0 items-center gap-2 sm:hidden">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
              AO
            </span>
            <span className="truncate text-xs font-semibold">AI Outreach</span>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="relative inline-flex items-center gap-1 overflow-hidden rounded-full border border-border bg-muted/80 px-2 py-0.5 text-[10px] font-medium tabular-nums sm:px-2.5 sm:py-1 sm:text-xs">
              <BorderBeam size={80} duration={18} colorFrom="#2563eb" colorTo="#38bdf8" />
              <IconCoin className="relative size-3 shrink-0" stroke={1.5} />
              <span className="relative">
                {credits} {credits === 1 ? "credit" : "credits"}
              </span>
            </span>
            <span className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground">
              <IconMoon className="size-3.5" stroke={1.5} />
            </span>
            <span className="hidden rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground sm:inline">
              Free plan
            </span>
          </div>
        </header>

        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4">
          <div className="mb-3 shrink-0 space-y-1">
            <h3 className="text-base font-bold tracking-tight sm:text-lg">
              {page.title}
            </h3>
            <p className="max-w-[52ch] text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
              {page.description}
            </p>
          </div>

          <div className="relative min-h-0 flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}

function DemoInputScene({ typedUrl }: { typedUrl: string }) {
  return (
    <motion.div
      key="input"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col justify-center"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <BorderBeam size={160} duration={14} />
        <div className="min-h-[4.5rem] px-3 pt-3 pb-2 text-xs leading-relaxed text-foreground sm:min-h-[5rem] sm:px-4 sm:pt-4 sm:text-sm">
          {typedUrl}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 bg-primary sm:h-4"
          />
        </div>
        <div className="flex items-center justify-between px-3 pb-3 sm:px-4">
          <Badge variant="secondary" className="text-[10px]">
            1 credit per new domain
          </Badge>
          <motion.span
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md sm:size-8"
          >
            <IconSparkles className="size-3.5" stroke={1.5} />
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

function DemoAnalyzeScene({ activeStep }: { activeStep: number }) {
  return (
    <motion.div
      key="analyze"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col justify-center gap-3"
    >
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="truncate text-xs font-medium sm:text-sm">Acme Robotics</p>
          <Badge variant="outline" className="shrink-0 text-[10px]">
            Analyzing…
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground sm:text-xs">
          Scraping acmerobotics.com and pulling recent news…
        </p>
      </div>
      <ol className="space-y-2">
        {ANALYSIS_STEPS.map((label, index) => {
          const step = index + 1;
          const isComplete = step < activeStep;
          const isActive = step === activeStep;

          return (
            <motion.li
              key={label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-2.5 text-[11px] sm:text-xs",
                isComplete && "text-muted-foreground",
                isActive && "font-medium text-foreground",
                !isComplete && !isActive && "text-muted-foreground/60",
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border sm:size-6",
                  isComplete && "border-primary/30 bg-primary/10 text-primary",
                  isActive && "border-primary bg-primary/10 text-primary",
                )}
              >
                {isComplete ? (
                  <IconCheck className="size-3" />
                ) : isActive ? (
                  <IconLoader2 className="size-3 animate-spin" />
                ) : (
                  <span className="text-[10px]">{step}</span>
                )}
              </span>
              {label}
              {isActive ? "…" : null}
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );
}

function DemoHooksScene({ selectedIndex }: { selectedIndex: number }) {
  return (
    <motion.div
      key="hooks"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col justify-start overflow-y-auto"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold sm:text-sm">Personalization hooks</p>
        <Badge className="text-[10px]">3 found</Badge>
      </div>
      <div className="space-y-1.5">
        {HOOKS.map((hook, index) => {
          const selected = index === selectedIndex;
          return (
            <motion.div
              key={hook.title}
              animate={selected ? { scale: 1.01 } : { scale: 1 }}
              className={cn(
                "rounded-lg border p-2.5 sm:p-3",
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-card/50",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-medium sm:text-xs">
                  {hook.title}
                </span>
                <Badge variant="outline" className="shrink-0 text-[9px] sm:text-[10px]">
                  {hook.confidence}% match
                </Badge>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground sm:text-[11px]">
                {hook.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function DemoOutreachScene({ visibleLines }: { visibleLines: number }) {
  const lines = OUTREACH_PREVIEW.email.split("\n");

  return (
    <motion.div
      key="outreach"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col justify-start gap-2 overflow-y-auto"
    >
      <div className="flex flex-wrap gap-1.5">
        <Badge className="gap-1 text-[10px]">
          <IconMail className="size-2.5" stroke={1.5} />
          Email ready
        </Badge>
        <Badge variant="secondary" className="text-[10px]">
          LinkedIn DM
        </Badge>
        <Badge variant="secondary" className="text-[10px]">
          2 follow-ups
        </Badge>
      </div>

      <div className="rounded-lg border border-primary/20 bg-card p-2.5 sm:p-3">
        <p className="text-[10px] font-medium text-muted-foreground">Subject</p>
        <p className="mt-0.5 text-[11px] font-medium sm:text-xs">
          {OUTREACH_PREVIEW.subject}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-2.5 sm:p-3">
        <pre className="whitespace-pre-wrap font-sans text-[10px] leading-relaxed text-foreground sm:text-[11px]">
          {lines.slice(0, visibleLines).join("\n")}
          {visibleLines < lines.length ? (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="ml-0.5 inline-block h-3 w-0.5 translate-y-0.5 bg-primary"
            />
          ) : null}
        </pre>
      </div>
    </motion.div>
  );
}

function ProductDemoPlayer() {
  const reduce = useReducedMotion();
  const [scene, setScene] = useState<DemoScene>("input");
  const [playing, setPlaying] = useState(!reduce);
  const [typedLength, setTypedLength] = useState(reduce ? DEMO_URL.length : 0);
  const [analysisStep, setAnalysisStep] = useState(reduce ? 4 : 1);
  const [selectedHook, setSelectedHook] = useState(reduce ? 0 : -1);
  const [visibleLines, setVisibleLines] = useState(
    reduce ? OUTREACH_PREVIEW.email.split("\n").length : 0,
  );
  const [progress, setProgress] = useState(0);
  const timersRef = useRef<number[]>([]);
  const intervalsRef = useRef<number[]>([]);

  const typedUrl = DEMO_URL.slice(0, typedLength);
  const emailLineCount = OUTREACH_PREVIEW.email.split("\n").length;
  const demoCredits =
    scene === "input" ? 20 : scene === "analyze" ? 19 : 18;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    intervalsRef.current.forEach((id) => window.clearInterval(id));
    intervalsRef.current = [];
  }, []);

  const resetSceneState = useCallback(
    (nextScene: DemoScene) => {
      if (nextScene === "input") {
        setTypedLength(reduce ? DEMO_URL.length : 0);
      }
      if (nextScene === "analyze") {
        setAnalysisStep(reduce ? 4 : 1);
      }
      if (nextScene === "hooks") {
        setSelectedHook(reduce ? 0 : -1);
      }
      if (nextScene === "outreach") {
        setVisibleLines(reduce ? emailLineCount : 0);
      }
    },
    [emailLineCount, reduce],
  );

  const goToScene = useCallback(
    (nextScene: DemoScene) => {
      setScene(nextScene);
      resetSceneState(nextScene);
      setProgress(((sceneIndex(nextScene) + 1) / SCENE_ORDER.length) * 100);
    },
    [resetSceneState],
  );

  const advanceScene = useCallback(() => {
    const currentIndex = sceneIndex(scene);
    const next = SCENE_ORDER[(currentIndex + 1) % SCENE_ORDER.length];
    goToScene(next);
  }, [goToScene, scene]);

  useEffect(() => {
    if (!playing || reduce) return;

    clearTimers();

    if (scene === "input") {
      const typeInterval = window.setInterval(() => {
        setTypedLength((prev) => {
          if (prev >= DEMO_URL.length) {
            window.clearInterval(typeInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 45);
      intervalsRef.current.push(typeInterval);

      const next = window.setTimeout(
        () => advanceScene(),
        SCENE_DURATIONS_MS.input,
      );
      timersRef.current.push(next);
    }

    if (scene === "analyze") {
      const steps = [1, 2, 3, 4];
      steps.forEach((step, index) => {
        const id = window.setTimeout(() => setAnalysisStep(step), index * 900);
        timersRef.current.push(id);
      });
      const next = window.setTimeout(
        () => advanceScene(),
        SCENE_DURATIONS_MS.analyze,
      );
      timersRef.current.push(next);
    }

    if (scene === "hooks") {
      HOOKS.forEach((_, index) => {
        const id = window.setTimeout(
          () => setSelectedHook(index),
          500 + index * 700,
        );
        timersRef.current.push(id);
      });
      const next = window.setTimeout(
        () => advanceScene(),
        SCENE_DURATIONS_MS.hooks,
      );
      timersRef.current.push(next);
    }

    if (scene === "outreach") {
      for (let line = 1; line <= emailLineCount; line += 1) {
        const id = window.setTimeout(
          () => setVisibleLines(line),
          350 + line * 280,
        );
        timersRef.current.push(id);
      }
      const next = window.setTimeout(
        () => advanceScene(),
        SCENE_DURATIONS_MS.outreach,
      );
      timersRef.current.push(next);
    }

    return clearTimers;
  }, [advanceScene, clearTimers, emailLineCount, playing, reduce, scene]);

  useEffect(() => {
    if (reduce) {
      setPlaying(false);
      goToScene("outreach");
    }
  }, [goToScene, reduce]);

  const elapsedProgress = useMemo(() => {
    const base = (sceneIndex(scene) / SCENE_ORDER.length) * 100;
    return Math.min(base + 8, 100);
  }, [scene]);

  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_24px_80px_-24px_rgba(37,99,235,0.25)]">
        <DemoAppShell scene={scene} credits={demoCredits}>
          <AnimatePresence mode="wait">
            {scene === "input" ? (
              <DemoInputScene typedUrl={typedUrl} />
            ) : null}
            {scene === "analyze" ? (
              <DemoAnalyzeScene activeStep={analysisStep} />
            ) : null}
            {scene === "hooks" ? (
              <DemoHooksScene selectedIndex={selectedHook} />
            ) : null}
            {scene === "outreach" ? (
              <DemoOutreachScene visibleLines={visibleLines} />
            ) : null}
          </AnimatePresence>

          {!reduce ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0">
              <div className="h-1 overflow-hidden rounded-full bg-muted/80">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{
                    width: `${playing ? elapsedProgress : progress}%`,
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ) : null}
        </DemoAppShell>

        <div className="flex flex-col gap-3 border-t border-border/70 bg-muted/20 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex flex-wrap gap-1.5">
            {SCENE_ORDER.map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => {
                  setPlaying(false);
                  goToScene(step);
                }}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] transition-colors sm:text-xs",
                  scene === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/80 text-muted-foreground hover:text-foreground",
                )}
              >
                {SCENE_LABELS[step]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 px-3 text-xs"
              onClick={() => {
                if (playing) {
                  setPlaying(false);
                  clearTimers();
                  return;
                }
                setPlaying(true);
              }}
            >
              {playing ? (
                <>
                  <IconPlayerPause className="size-3.5" stroke={1.5} />
                  Pause
                </>
              ) : (
                <>
                  <IconPlayerPlay className="size-3.5" stroke={1.5} />
                  Play demo
                </>
              )}
            </Button>
            <Link href="/signup" className="hidden sm:block">
              <ShimmerButton className="h-8 px-4 text-xs">
                Try it free
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductDemoSection() {
  return (
    <section
      id="demo"
      className="border-b border-border bg-muted/10 py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeIn className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            See AI Outreach in action
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Watch the full app workflow with sidebar navigation: paste a URL,
            research the company, pick a hook, and copy outreach ready to send.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <ProductDemoPlayer />
        </FadeIn>

        <FadeIn delay={0.2} className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Interactive product demo with the real app layout. No signup required.
          </p>
          <Link
            href="/signup"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline sm:hidden"
          >
            Try it free →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
