"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IconChevronDown, IconPhone, IconSearch } from "@tabler/icons-react";

import { Input } from "@/components/ui/input";
import {
  countryFlag,
  findPhoneCountry,
  guessDefaultPhoneCountry,
  searchPhoneCountries,
  type PhoneCountry,
} from "@/lib/phone-countries";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryChange: (code: string) => void;
  onPhoneChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function PhoneInput({
  countryCode,
  phoneNumber,
  onCountryChange,
  onPhoneChange,
  disabled,
  className,
}: PhoneInputProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = findPhoneCountry(countryCode);
  const filtered = searchPhoneCountries(search);

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function pickCountry(country: PhoneCountry) {
    onCountryChange(country.code);
    setOpen(false);
    setSearch("");
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div className="flex rounded-lg border border-input bg-background/80 shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          className="flex shrink-0 items-center gap-2 border-r border-input px-3 py-2 text-sm disabled:opacity-50"
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden>{countryFlag(selected.code)}</span>
          <span className="font-medium tabular-nums">{selected.dialCode}</span>
          <IconChevronDown
            className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
            stroke={1.5}
          />
        </button>
        <div className="relative min-w-0 flex-1">
          <IconPhone
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            stroke={1.5}
          />
          <Input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="Phone number"
            value={phoneNumber}
            disabled={disabled}
            onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, ""))}
            className="h-10 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      {open ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
          <div className="border-b border-border p-2">
            <div className="relative">
              <IconSearch
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                stroke={1.5}
              />
              <Input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code"
                className="h-9 bg-background/80 pl-9"
              />
            </div>
          </div>
          <ul
            id={listId}
            role="listbox"
            className="max-h-56 overflow-y-auto p-1"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                No countries found
              </li>
            ) : (
              filtered.map((country) => (
                <li key={country.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={country.code === selected.code}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                      country.code === selected.code && "bg-primary/10 text-primary",
                    )}
                    onClick={() => pickCountry(country)}
                  >
                    <span>{countryFlag(country.code)}</span>
                    <span className="min-w-0 flex-1 truncate">{country.name}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {country.dialCode}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export { guessDefaultPhoneCountry };
