import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NavButton({
  children,
  href,
  active = false,
  external = false,
  className,
  onClick,
}: Readonly<{
  children: React.ReactNode;
  href: string;
  active?: boolean;
  external?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}>) {
  return (
    <Button
      asChild
      className={cn(
        "px-2 text-foreground font-semibold",
        !active && "text-muted-foreground",
        className
      )}
      variant="link"
    >
      <Link
        href={href}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
      >
        {children}
      </Link>
    </Button>
  );
}
