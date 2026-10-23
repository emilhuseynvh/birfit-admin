"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckIcon, CopyIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { coverPrompt, videoPrompt } from "@/lib/exercise-prompts";
import type { Exercise } from "@/lib/types";

type Source = Pick<
  Exercise,
  "name" | "muscleGroup" | "secondaryMuscles" | "equipment" | "measure" | "instructions"
>;

function PromptBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} prompt copied`);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Clipboard is not available");
    }
  };

  return (
    <div className="space-y-2">
      <pre className="bg-muted max-h-64 overflow-auto rounded-md border p-3 font-sans text-xs leading-relaxed whitespace-pre-wrap">
        {text}
      </pre>
      <Button type="button" variant="outline" size="sm" onClick={copy}>
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied ? "Copied" : `Copy ${label.toLowerCase()} prompt`}
      </Button>
    </div>
  );
}

export function ExercisePromptsCard({ source }: { source: Source }) {
  const ready = source.name.trim().length >= 2;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="size-4" /> Generation prompts
        </CardTitle>
        <CardDescription>
          Paste into Gemini to create the media, then upload the result above. Prompts follow
          the form as you edit it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {ready ? (
          <Tabs defaultValue="cover">
            <TabsList className="mb-3 w-full">
              <TabsTrigger value="cover" className="flex-1">
                Cover image
              </TabsTrigger>
              <TabsTrigger value="video" className="flex-1">
                Video
              </TabsTrigger>
            </TabsList>
            <TabsContent value="cover">
              <PromptBlock label="Cover" text={coverPrompt(source)} />
            </TabsContent>
            <TabsContent value="video">
              <PromptBlock label="Video" text={videoPrompt(source)} />
            </TabsContent>
          </Tabs>
        ) : (
          <p className="text-muted-foreground text-sm">Enter a name to see the prompts.</p>
        )}
      </CardContent>
    </Card>
  );
}
