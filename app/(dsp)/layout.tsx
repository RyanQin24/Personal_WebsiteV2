import Container from "@/components/layouts/Container";

export default async function DspLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Container fullWidth>{children}</Container>;
}
