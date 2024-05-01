import Layout from "@/components/layout";
import Head from "@/components/ui/head";
import { AlertProvider } from "@/context/alert";
import SignInContainer from "@/views/auth/signin";

const SignIn = (): JSX.Element => {
  return (
    <>
      <Head title="Login | GetRefunds" />
      <Layout>
        <AlertProvider>
          <SignInContainer />
        </AlertProvider>
      </Layout>
    </>
  );
};

export default SignIn;
