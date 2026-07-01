import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col paper-pattern bg-background text-foreground transition-colors duration-300">
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="border border-card-border bg-card-bg rounded-[32px] p-10 max-w-md text-center shadow-lg space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-4xl font-serif font-black text-accent">404</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-xs text-muted leading-relaxed">
            The page you are looking for does not exist or has been moved to another location.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-accent text-background px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-accent/90 shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}