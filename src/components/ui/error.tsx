import { Icons } from "./icons";
import { Button } from "./button";
import Modal from "./modal";
import Link from "next/link";

const ErrorContainer: React.FC = () => (
  <section className="flex-grow-1 flex flex-1 flex-col items-center justify-center px-4 py-4">
    <div className="w-full px-3 py-3 text-center sm:mx-auto sm:max-w-[40.25rem] sm:px-20 sm:py-20 ">
      <div className="flex justify-center">
        <Icons.warning
          className="stroke-warning-600 mx-auto h-14 w-14 rounded-full border-8 border-notice-50 bg-notice-100 p-1"
          fill="#FFE7CC"
          stroke2="#FFE7CC"
        />
      </div>
      <h1 className="my-2 text-xl font-bold sm:text-3xl">
        Something went wrong...
      </h1>
      <p className="my-4 text-neutral-600">
        We had some trouble loading this page. Please refresh the page to try
        again or get in touch if the problem sticks around!
      </p>
      <div className="gap-3 sm:flex sm:flex-row-reverse sm:justify-center [&>*]:my-1">
        <Button className=" " onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
        <Modal title="Contact Support" triggerText="Contact Support" isButton>
          <p className="!mb-4 text-sm text-neutral-600">
            If you have questions or need help, please email our support team.
          </p>
          <div className="mb-1 flex items-center gap-2.5">
            <div className="rounded-full border-none bg-purple-50 stroke-purple-400 p-2">
              <Icons.mail className="h-6 w-6" />
            </div>
            <div className="flex flex-col justify-center text-purple">
              <h3 className="text-sm font-semibold leading-[21px] text-primaryText">
                Email
              </h3>
              <Link
                className="text-xs font-normal leading-[18px]"
                href="mailto:support@getrefunds.com"
              >
                support@getrefunds.com
              </Link>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  </section>
);

export default ErrorContainer;
