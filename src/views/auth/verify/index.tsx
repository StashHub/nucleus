import { useAlertContext } from "@/context/alert";
import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/ui/icons";
import VerifyView from "./view";
import Link from "next/link";

const VerifyContainer = () => {
  const { error, credentials, info, clearAlert } = useAlertContext();

  return (
    <section className="flex-grow-1 flex flex-1 flex-col items-center px-4">
      <div className="mx-auto w-full max-w-[420px] pt-3 sm:pt-20">
        {error && (
          <Alert variant="destructive">
            <Icons.exclamation error={!!error} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {info && (
          <Alert variant="info">
            <Icons.info />
            <AlertDescription>{info}</AlertDescription>
            <AlertAction
              onClick={() => {
                clearAlert();
              }}
            >
              <Icons.close className="h-5 w-5" />
            </AlertAction>
          </Alert>
        )}
        <div className={"box-shadow-sm w-full rounded-2xl bg-white p-6"}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[10px] border-info-50 bg-info-100 stroke-info-600 px-1.5 py-[.125rem]">
            <Icons.mail className="h-12 w-12" />
          </div>
          <h3 className="mt-3.5 text-center text-lg font-semibold text-gray-900">
            We've sent you an email
          </h3>
          <p className="mt-2 text-center text-sm font-normal text-gray-600">
            To sign in, enter the code sent to{" "}
            <span className="font-medium">{credentials.email}</span>. If you
            can't find the email, check your spam folder.
          </p>
          <VerifyView />
          <p className="mb-0 mt-6 text-sm font-normal text-gray-900 sm:text-center">
            Having trouble?
          </p>
          <p className="mb-0 text-sm text-gray-900 sm:text-center">
            Contact{" "}
            <Link href="mailto:support@getrefunds.com" className="text-purple">
              support@getrefunds.com
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default VerifyContainer;
