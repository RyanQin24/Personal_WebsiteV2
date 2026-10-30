import { Book } from "@/lib/books/types";
import Image from "next/image";
import Link from "next/link";

// Fixed-height slots let logos fill the row padding without making the row taller.
export default function BookPreview({ book }: { book: Book }) {
  const date = new Date(book.date).toLocaleDateString("en-CA", {
    month: "short",
    day: "2-digit",
  });

  return (
    <Link href={`/${book.slug}`} passHref role="navigation">
      <div className="flex items-center justify-between group hover:underline hover:cursor-pointer py-4 -my-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h1 className="min-w-0 truncate font-semibold dark:font-bold tracking-tight">
            {book.title}
          </h1>
          {book.listLogo && (
            <span className="relative ml-auto h-5 w-[72px] shrink-0 sm:w-[120px]">
            </span>
          )}
        </div>
        <p className="w-[7ch] shrink-0 whitespace-nowrap font-semibold dark:font-bold text-muted-foreground text-right group-hover:underline decoration-muted-foreground sm:w-[9ch]">
          {date}
        </p>
      </div>
    </Link>
  );
}
