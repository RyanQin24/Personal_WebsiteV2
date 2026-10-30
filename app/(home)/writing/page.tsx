import BookPreview from "@/components/books/BookPreview";
import H1 from "@/components/ui/typography";
import { getAllBooks } from "@/lib/books/api";
import { BASE_URL, PATH_WRITING } from "@/lib/constants";
import { cn, getOGData } from "@/lib/utils";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "My published writing, which currently includes technical and creative pieces.",
  openGraph: getOGData({
    title: "Writing",
    description:
      "My published writing, which currently includes technical and creative pieces.",
    url: `${BASE_URL}${PATH_WRITING}`,
  }),
};

export default async function Writing() {
  const books = getAllBooks();

  let currentYear = new Date().getFullYear() + 1;

  return (
    <section className="flex flex-col gap-4">
      <H1>Stories</H1>
      {books.map((book) => {
        const bookYear = new Date(book.date).getFullYear();
        const showYear = bookYear !== currentYear;
        currentYear = bookYear;

        return (
          <div
            key={book.slug}
            className={cn("flex justify-center", showYear && "border-t pt-4")}
          >
            <div className="w-[16%] min-w-12">
              {showYear && (
                <h2 className="font-semibold text-muted-foreground">
                  {bookYear}
                </h2>
              )}
            </div>
            <div className={cn("w-[84%]", !showYear && "border-t pt-4")}>
              <BookPreview book={book} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
