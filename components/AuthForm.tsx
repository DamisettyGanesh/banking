"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "./ui/form";

import { Button } from "@/components/ui/button";

import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setisLoading(true);

    try {
      // Sign up with appwrite & create plaid token

      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        console.log(response);

        if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* Plaid Link */}</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      name="firstName"
                      label="First Name"
                      placeholder="John"
                      control={form.control}
                    />

                    <CustomInput
                      name="lastName"
                      label="Last Name"
                      placeholder="ex: Doe"
                      control={form.control}
                    />
                  </div>

                  <CustomInput
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                    control={form.control}
                  />

                  <CustomInput
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                    control={form.control}
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      name="state"
                      label="State"
                      placeholder="ex: NY"
                      control={form.control}
                    />

                    <CustomInput
                      name="postalCode"
                      label="Postal Code"
                      placeholder="ex: 11101"
                      control={form.control}
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      name="dob"
                      label="Date of birth"
                      placeholder="ex: yyyy-mm-dd"
                      control={form.control}
                    />

                    <CustomInput
                      name="ssn"
                      label="SSN"
                      placeholder="ex: 1234"
                      control={form.control}
                    />
                  </div>
                </>
              )}

              <CustomInput
                name="email"
                control={form.control}
                label="Email"
                placeholder="Enter your email"
              />

              <CustomInput
                name="password"
                control={form.control}
                label="Password"
                placeholder="Enter your password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign up" : "Sign in"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
