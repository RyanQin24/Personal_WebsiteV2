import Container from "@/components/layouts/Container";

export default async function StoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Container fullWidth>{children}</Container>;
}
