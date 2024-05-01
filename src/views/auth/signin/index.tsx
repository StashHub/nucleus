import SignInView from "./view";
import { useAlertContext } from "@/context/alert";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/ui/icons";
import VerifyContainer from "../verify";
import { useSearchParams } from "next/navigation";

const SignInContainer = () => {
  const { error, verify } = useAlertContext();
  const params = useSearchParams();

  return verify ? (
    <VerifyContainer />
  ) : (
    <section className="flex-grow-1 flex flex-1 flex-col items-center px-4">
      <div className="mx-auto w-full max-w-[420px] pt-3 sm:pt-20">
        {params.has("success") && (
          <Alert variant="success">
            <Icons.successCheck />
            <AlertDescription>
              Your account was created. Sign in to get started.
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <Icons.exclamation error={!!error} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className={"box-shadow-sm w-full rounded-2xl bg-white p-6"}>
          <h2 className="mb-6 text-3xl font-bold leading-10 tracking-tight text-gray-900">
            Sign in
          </h2>
          <SignInView />
        </div>
      </div>
    </section>
  );
};

export default SignInContainer;
