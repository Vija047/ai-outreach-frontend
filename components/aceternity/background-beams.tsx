"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

export function BackgroundBeams({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
    "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
  ];

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center",
        className,
      )}
      style={{
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 20%, transparent 80%)",
        maskImage:
          "radial-gradient(ellipse at center, black 20%, transparent 80%)",
      }}
    >
      <svg
        className="pointer-events-none absolute z-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {paths.map((_, index) => (
            <linearGradient
              key={index}
              id={`beam-gradient-${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop stopColor="#2563eb" stopOpacity="0" />
              <stop stopColor="#2563eb" />
              <stop offset="32.5%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {paths.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            stroke={`url(#beam-gradient-${index})`}
            strokeOpacity="0.4"
            strokeWidth="0.5"
            initial={reduce ? undefined : { pathLength: 0 }}
            animate={reduce ? undefined : { pathLength: 1 }}
            transition={
              reduce
                ? undefined
                : {
                    duration: 10,
                    delay: index * 0.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                  }
            }
          />
        ))}
      </svg>
    </div>
  );
}
