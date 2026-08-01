import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar — Fluxo CRM",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">Fluxo CRM</CardTitle>
        <CardDescription>Entre com sua conta para continuar.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm redirectTo={redirect && redirect.startsWith("/") ? redirect : "/"} />
      </CardContent>
    </Card>
  );
}
