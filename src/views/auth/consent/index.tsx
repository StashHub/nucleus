import { useAlertContext } from "@/context/alert";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/ui/icons";
import ConsentView from "./view";

const ConsentContainer = () => {
  const { error } = useAlertContext();

  return (
    <section className="flex-grow-1 flex flex-1 flex-col items-center px-4">
      <div className="w-full py-3 sm:mx-auto sm:max-w-[40.25rem] sm:py-20">
        <>
          <h2 className="mb-6 text-3xl font-bold leading-10 tracking-tight text-gray-900 sm:text-center sm:text-4xl">
            Get your information from Innovation Refunds
          </h2>
          <p className="sm:text-center">
            We need your consent to show you information about your ERC
            application and the current status of your refund.
          </p>
          {error && (
            <Alert variant="warning">
              <Icons.warning />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div
            className={"box-shadow-sm mx-auto w-full rounded-2xl bg-white p-6"}
          >
            <ConsentView />
          </div>
        </>
      </div>
    </section>
  );
};

export default ConsentContainer;
