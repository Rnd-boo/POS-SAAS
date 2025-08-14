"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginForm, loginSchemaForm } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  INITIAL_LOGIN_FORM,
  INITIAL_STATE_LOGIN_FORM,
} from "@/constants/auth.constant";
import FormInput from "@/components/common/form-input";
import { startTransition, useActionState, useEffect } from "react";
import { login } from "../actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function Login() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const [loginState, loginAction, isPendingLogin] = useActionState(
    login,
    INITIAL_STATE_LOGIN_FORM
  );

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    startTransition(() => {
      loginAction(formData);
    });
  });

  useEffect(() => {
    if (loginState?.status === "error") {
      toast.error("Login Failed", {
        description: loginState.errors?._form?.[0],
      });
      startTransition(() => {
        loginAction(null);
      });
    }
  }, [loginState]);

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="bg-muted relative hidden md:block">
            <Image
              src="https://ui.shadcn.com/placeholder.svg"
              alt="Image"
              width={400}
              height={400}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={onSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your Acme Inc account
                  </p>
                </div>
                <FormInput
                  form={form}
                  name="username"
                  label="Username"
                  placeholder="Insert Username here.."
                />
                <FormInput
                  form={form}
                  name="password"
                  label="Password"
                  placeholder="**"
                  type="password"
                />
                <Button type="submit">
                  {isPendingLogin ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
