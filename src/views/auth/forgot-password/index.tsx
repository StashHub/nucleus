import { useContext } from "react";
import ForgotPasswordView from "./view";
import { ForgotPasswordContext } from "@/pages/password-reset";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

const ForgotPasswordContainer = () => {
  const { success, email } = useContext(ForgotPasswordContext);

  return (
    <section className="flex-grow-1 flex flex-1 flex-col items-center px-4">
      <div className="mx-auto w-full max-w-[420px] pt-3 sm:pt-20">
        {!success && (
          <>
            <h2 className="mb-3 text-4xl font-bold leading-10 tracking-tight text-gray-900 sm:text-center">
              Reset your password
            </h2>
            <p className="mb-0 text-sm text-secondary sm:text-center">
              Enter the email address you registered with, and we'll send you a
              link to reset your password.
            </p>
          </>
        )}
        <div className="box-shadow-sm mt-6 w-full rounded-2xl bg-white p-6 sm:mt-8">
          {!success ? (
            <ForgotPasswordView />
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[10px] border-info-50 bg-info-100 stroke-info-600 px-1.5 py-[.125rem]">
                <Icons.mail className="h-12 w-12" />
              </div>

              <h3 className="mt-3.5 text-center text-lg font-semibold text-gray-900">
                Check your email
              </h3>
              <p className="mt-2 text-center text-sm font-light text-secondary">
                If there's an account connected to{" "}
                <span className="font-medium">{email}</span>, you'll receive an
                email from us soon.
              </p>
              <Link href="signin">
                <Button className="bg-secondary font-normal">
                  Back to sign-in
                </Button>
              </Link>
              <p className="mb-0 mt-6 text-sm font-normal text-gray-900 sm:text-center">
                Can't find the email?
              </p>
              <p className="mb-0 text-sm text-gray-900 sm:text-center">
                Contact{" "}
                <Link
                  href="mailto:support@getrefunds.com"
                  className="text-purple-400"
                >
                  support@getrefunds.com
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordContainer;
