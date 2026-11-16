import ResetPasswordClient from "./ResetPasswordClient";

export const dynamic = "force-dynamic";
export default async function ResetPasswordPage(props: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await props.params;
  return <ResetPasswordClient token={token} />;
}

