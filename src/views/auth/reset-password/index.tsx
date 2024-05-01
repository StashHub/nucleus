import { useContext } from "react";
import ResetPasswordView from "./view";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { ResetPasswordContext } from "@/pages/password-reset/[token]";

const ResetPassword = () => {
  const { success } = useContext(ResetPasswordContext);

  return (
    <section className="flex-grow-1 flex flex-1 flex-col items-center px-4">
      <div className="mx-auto w-full max-w-[420px] pt-3 sm:pt-20">
        {!success && (
          <>
            <h2 className="mb-3 text-4xl font-bold leading-10 tracking-tight text-gray-900 sm:text-center">
              Set your new password
            </h2>
            <p className="mb-0 text-sm text-gray-500 sm:px-10 sm:text-center">
              Nearly there. Just choose a new password and you're all set.
            </p>
          </>
        )}
        <div className="box-shadow-sm mt-6 w-full rounded-2xl bg-white p-6 sm:mt-8">
          {!success ? (
            <ResetPasswordView />
          ) : (
            <>
              <Icons.checked
                className="mx-auto h-12 w-12 stroke-success-600"
                fill="#CFF7D3"
                stroke2="#EAFBEB"
              />
              <h3 className="mt-3.5 text-center text-lg font-medium tracking-tight text-gray-900">
                Your password has been updated!
              </h3>
              <p className="mt-2 text-center text-sm text-gray-600">
                This one's a good one, we can tell. Let's try signing in with
                it.
              </p>
              <Link href="/signin">
                <Button className="font-normal">Return to sign-in</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
