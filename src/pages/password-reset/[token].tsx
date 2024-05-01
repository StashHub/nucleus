import Layout from "@/components/layout";
import { createContext, useState } from "react";
import { type SuccessContextProps } from "@/lib/types";
import ResetPasswordContainer from "@/views/auth/reset-password";
import Head from "@/components/ui/head";

export const ResetPasswordContext = createContext<SuccessContextProps>({
  success: false,
  setSuccess: () => undefined,
});

const ResetPassword = (): JSX.Element => {
  const [success, setSuccess] = useState<boolean>(false);
  const contextValue: SuccessContextProps = { success, setSuccess };

  return (
    <>
      <Head title="Reset password" />
      <Layout>
        <ResetPasswordContext.Provider value={contextValue}>
          <ResetPasswordContainer />
        </ResetPasswordContext.Provider>
      </Layout>
    </>
  );
};

export default ResetPassword;
