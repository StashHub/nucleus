import { useAlertContext } from "@/context/alert";
import SignUpView from "./view";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/ui/icons";
import { Description, Title, Tout } from "@/components/ui/tout";
import { Badge } from "@/components/ui/badge";
import ConsentContainer from "../consent";

const SignUpContainer = () => {
  const { success, error } = useAlertContext();

  if (success) return <ConsentContainer />;

  return (
    <section className="mx-auto flex h-full w-full max-w-[75.25rem] flex-col items-center justify-center px-4 md:flex-row md:px-8">
      <div className="order-2 my-12 w-full max-w-[36.875rem] md:order-1 md:my-0">
        <h1 className="mb-4 text-[28px] font-semibold leading-9 tracking-[-0.72px] tbl:text-4xl tbl:leading-[2.75rem]">
          The fast and easy way to access{" "}
          <span className="blurple-500 bg-clip-text text-transparent">
            the resources you need
          </span>
        </h1>
        <p className="mb-10 text-sm tbl:text-base">
          We're bringing small businesses access to government funding and
          financing solutions in a single place. You can now access a suite of
          products that help you manage and grow effectively. Our mission is to
          help you get ahead!
        </p>
        <Tout>
          <Icons.finance />
          <Title>Tax monitoring</Title>
          <Description>
            Track the progress of your application(s), access documents, and get
            status updates - all in one secure and reliable location.
          </Description>
        </Tout>
        <Tout>
          <Icons.documents />
          <Title>Download your documents</Title>
          <Description>
            Access your documents - available for download at your convenience,
            anywhere, and from any device.
          </Description>
        </Tout>
        <Tout>
          <Icons.income />
          <div className="flex flex-col items-start mbl:flex-row mbl:items-center">
            <Title className="mb-0">
              Personalized found money recommendations
            </Title>
            <Badge className="ml-0 mt-2 !overflow-visible truncate mbl:ml-2.5 mbl:mt-0">
              Coming soon
            </Badge>
          </div>
          <Description className="mt-3">
            In the future, see curated opportunities -pinpointing tax credits
            and class action settlement funds relevant to your business.
          </Description>
        </Tout>
      </div>
      <div className="order-1 mx-auto mt-4 flex w-full max-w-[27.875rem] flex-col md:order-2 md:ml-auto md:mr-0 md:mt-0 md:max-w-[30.875rem] md:pl-12">
        {error && (
          <Alert variant="destructive">
            <Icons.exclamation error={!!error} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="box-shadow-sm ml-auto rounded-2xl bg-white p-6">
          <h2 className="mb-6 text-2xl font-bold leading-10 tracking-tight text-gray-900 sm:text-left tbl:text-[28px]">
            Create your account
          </h2>
          <SignUpView />
        </div>
      </div>
    </section>
  );
};

export default SignUpContainer;
