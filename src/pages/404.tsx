import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";

const Four04Container = () => {
  const router = useRouter();

  return (
    <section className="flex-grow-1 flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full px-3 py-3 text-center sm:mx-auto sm:max-w-[40.25rem] sm:px-20 sm:py-20 ">
        <div className="flex justify-center">
          <Icons.four0four className="h-16 w-16 text-purple-500" />
        </div>
        <h1 className="my-2 text-xl font-bold sm:text-3xl">
          This page doesn't exist
        </h1>
        <p className="my-4">
          At least not in this timeline. Try using the menu to get to where you
          want to go.
        </p>
        <Button
          className="m-auto max-w-[264px] text-sm"
          onClick={() => router.back()}
        >
          <Icons.arrow className="mr-1 h-6 w-6 stroke-white" /> Go back to
          previous page
        </Button>
      </div>
    </section>
  );
};

export default function Custom404() {
  return (
    <Layout>
      <Four04Container />
    </Layout>
  );
}
