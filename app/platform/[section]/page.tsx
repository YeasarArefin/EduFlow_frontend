import { Layers } from "lucide-react";

export default async function PlatformSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const sectionTitle = section.replace("-", " ");

  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center px-4">
      <div className="flex size-12 items-center justify-center rounded-full bg-surface-soft border border-hairline text-muted-foreground">
        <Layers className="size-6" />
      </div>
      <h1 className="text-2xl font-semibold capitalize tracking-tight text-foreground sm:text-3xl">
        {sectionTitle}
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        This Platform Owner section is ready for future module implementation.
      </p>
    </section>
  );
}

