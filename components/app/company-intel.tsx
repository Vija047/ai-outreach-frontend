"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Company } from "@/lib/types";

interface CompanyIntelProps {
  company: Company;
}

export function CompanyIntel({ company }: CompanyIntelProps) {
  const hasIntel =
    company.industry ||
    company.summary ||
    company.mission ||
    (company.techStack?.length ?? 0) > 0;

  if (!hasIntel) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Company intel</CardTitle>
        <CardDescription>Background context from the analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {company.industry && (
          <p>
            <span className="font-medium">Industry:</span> {company.industry}
          </p>
        )}
        {company.summary && <p>{company.summary}</p>}
        {company.mission && (
          <p>
            <span className="font-medium">Mission:</span> {company.mission}
          </p>
        )}
        {company.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {company.techStack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
