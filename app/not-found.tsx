import BackButton from "@/components/common/links/BackButton";
import Container from "@/components/layouts/Container";
import { Button } from "@/components/ui/button";
import { PATH_HOME } from "@/lib/constants";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container>
      <div className="items-center justify-center text-center">
        <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem]/none font-extrabold text-transparent">
          404
        </span>
        <p className="mt-4 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex justify-center gap-2">
          <BackButton variant="ghost" />
          <Button variant="ghost" asChild>
            <Link href={PATH_HOME}>Back to Home</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
