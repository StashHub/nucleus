import Head from "@/components/ui/head";
import Layout from "@/components/layout";
import { AlertProvider } from "@/context/alert";
import SignUpContainer from "@/views/auth/signup";

const SignUp = (): JSX.Element => {
  return (
    <>
      <Head title="Register | GetRefunds" />
      <Layout>
        <AlertProvider>
          <SignUpContainer />
        </AlertProvider>
      </Layout>
    </>
  );
};

export default SignUp;
