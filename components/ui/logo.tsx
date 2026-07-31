"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
  imageClassName?: string;
  showText?: boolean;
  textClassName?: string;
  height?: number;
  width?: number;
  href?: string;
}

export function AppLogo({
  className,
  imageClassName,
  showText = false,
  textClassName,
  height = 120,
  width = 180,
  href,
}: AppLogoProps) {
  const content = (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <Image
        src="/ai-outreachlogo.png"
        alt="AI Outreach"
        width={width}
        height={height}
        className={cn(
          "h-20 sm:h-24 md:h-28 lg:h-32 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]",
          imageClassName
        )}
        priority
      />
      {showText && (
        <span className={cn("truncate font-bold tracking-tight text-foreground", textClassName)}>
          AI Outreach
        </span>
      )}
    </div>
  );

  if (href !== undefined) {
    return (
      <Link href={href} className="group flex items-center min-w-0">
        {content}
      </Link>
    );
  }

  return content;
}
