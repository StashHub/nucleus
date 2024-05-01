import ForgotPasswordContainer from "@/views/auth/forgot-password";

import { createContext, useState } from "react";
import Layout from "@/components/layout";
import { type SuccessContextProps } from "@/lib/types";
import Head from "@/components/ui/head";

type Props = SuccessContextProps & {
  email: string | null;
  setEmail: (email: string) => void;
};

export const ForgotPasswordContext = createContext<Props>({
  success: false,
  email: null,
  setSuccess: () => undefined,
  setEmail: () => null,
});

const ForgotPassword = (): JSX.Element => {
  const [success, setSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  const contextValue: Props = { success, setSuccess, email, setEmail };

  return (
    <>
      <Head title="Forgot password | GetRefunds" />
      <Layout>
        <ForgotPasswordContext.Provider value={contextValue}>
          <ForgotPasswordContainer />
        </ForgotPasswordContext.Provider>
      </Layout>
    </>
  );
};

export default ForgotPassword;
