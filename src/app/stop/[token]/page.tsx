import StopClient from "./StopClient";

export const dynamic = "force-dynamic";

export default async function StopPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <StopClient token={token} />;
}
