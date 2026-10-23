"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FilmIcon, ImageIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api.client";
import { mediaUrl } from "@/lib/config";
import type { Exercise } from "@/lib/types";

export type PendingMedia = { cover?: File; video?: File };

function usePreview(file: File | undefined, fallback: string | null) {
  const [url, setUrl] = useState<string | null>(fallback);
  useEffect(() => {
    if (!file) {
      setUrl(fallback);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, fallback]);
  return url;
}

export function ExerciseMediaCard({
  exercise,
  pending,
  onChange
}: {
  exercise?: Exercise;
  pending: PendingMedia;
  onChange: (next: PendingMedia) => void;
}) {
  const router = useRouter();
  const coverInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const coverUrl = useMemo(() => mediaUrl(exercise?.coverUrl), [exercise?.coverUrl]);
  const videoUrl = useMemo(() => mediaUrl(exercise?.videoUrl), [exercise?.videoUrl]);
  const coverPreview = usePreview(pending.cover, coverUrl);
  const videoPreview = usePreview(pending.video, videoUrl);

  const remove = async (kind: "cover" | "video") => {
    if (pending[kind]) {
      onChange({ ...pending, [kind]: undefined });
      return;
    }
    if (!exercise) return;
    try {
      await apiFetch(`/admin/exercises/${exercise.id}/media/${kind}`, { method: "DELETE" });
      toast.success(`${kind === "cover" ? "Cover" : "Video"} removed`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove file");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media</CardTitle>
        <CardDescription>
          Cover is shown in lists, the video loops during the workout. Files are uploaded when you
          save.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="text-sm font-medium">Cover image</div>
          <div className="bg-muted flex aspect-video items-center justify-center overflow-hidden rounded-md border">
            {coverPreview ? (
              <img src={coverPreview} alt="Cover preview" className="size-full object-cover" />
            ) : (
              <ImageIcon className="text-muted-foreground size-8" />
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => coverInput.current?.click()}
            >
              <UploadIcon /> {coverPreview ? "Replace" : "Upload"}
            </Button>
            {coverPreview && (
              <Button type="button" variant="ghost" size="sm" onClick={() => remove("cover")}>
                <Trash2Icon /> Remove
              </Button>
            )}
            <input
              ref={coverInput}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => onChange({ ...pending, cover: event.target.files?.[0] })}
            />
          </div>
          {pending.cover && (
            <p className="text-muted-foreground text-xs">Selected: {pending.cover.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Video</div>
          <div className="bg-muted flex aspect-video items-center justify-center overflow-hidden rounded-md border">
            {videoPreview ? (
              <video
                key={videoPreview}
                src={videoPreview}
                className="size-full object-cover"
                muted
                loop
                autoPlay
                playsInline
                controls
              />
            ) : (
              <FilmIcon className="text-muted-foreground size-8" />
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => videoInput.current?.click()}
            >
              <UploadIcon /> {videoPreview ? "Replace" : "Upload"}
            </Button>
            {videoPreview && (
              <Button type="button" variant="ghost" size="sm" onClick={() => remove("video")}>
                <Trash2Icon /> Remove
              </Button>
            )}
            <input
              ref={videoInput}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="sr-only"
              onChange={(event) => onChange({ ...pending, video: event.target.files?.[0] })}
            />
          </div>
          {pending.video && (
            <p className="text-muted-foreground text-xs">Selected: {pending.video.name}</p>
          )}
          <p className="text-muted-foreground text-xs">
            MP4, MOV or WebM, up to 200 MB. Short loops of 6 to 10 seconds work best.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
