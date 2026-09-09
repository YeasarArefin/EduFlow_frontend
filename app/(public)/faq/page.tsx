import { PublicContainer } from '@/components/public/public-container';

export default function FAQPage() {
  return (
    <PublicContainer className="flex flex-1 items-center justify-center py-24 text-center">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-muted-foreground">
          Answers to common questions will be available here soon.
        </p>
      </div>
    </PublicContainer>
  );
}
