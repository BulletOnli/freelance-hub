"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { loginAction } from "../action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginForm = () => {
  const { isPending, execute } = useServerAction(loginAction);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const [data, err] = await execute(values);
    form.setError("email", {
      message: "",
    });
    form.setError("password", {
      message: err?.message,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="my-2 text-sm flex items-center justify-end">
          <Link
            href="/reset-password"
            className="text-customDark hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button disabled={isPending} type="submit">
          Log In
        </Button>

        <div className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-customDark hover:underline"
          >
            Register here
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
