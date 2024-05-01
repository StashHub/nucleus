import { type SuccessContextProps } from "@/lib/types";
import React, {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

type CredentialsProps = {
  email: string;
  password: string;
  remember: boolean;
};

type ContextProps = SuccessContextProps & {
  error?: string;
  setError: (errorMessage?: string) => void;
  info?: string;
  setInfo: (infoMessage?: string) => void;
  verify: boolean;
  setVerify: (state: boolean) => void;
  credentials: CredentialsProps;
  setCredentials: ({ email, password, remember }: CredentialsProps) => void;
  clearAlert: () => void;
};

const Context = createContext<ContextProps>({
  error: undefined,
  setError: () => undefined,
  success: false,
  setSuccess: () => undefined,
  info: undefined,
  setInfo: () => undefined,
  verify: false,
  setVerify: () => undefined,
  credentials: {
    email: "",
    password: "",
    remember: false,
  },
  setCredentials: () => undefined,
  clearAlert: () => undefined,
});

export const AlertProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [info, setInfo] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<boolean>(false);
  const [verify, setVerify] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<CredentialsProps>({
    email: "",
    password: "",
    remember: false,
  });
  const clearAlert = () => {
    setError(undefined);
    setInfo(undefined);
    setSuccess(false);
  };

  return (
    <Context.Provider
      value={{
        success,
        error,
        info,
        credentials,
        verify,
        setVerify,
        setSuccess,
        setError,
        setInfo,
        setCredentials,
        clearAlert,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAlertContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useAlert must be used within a AlertProvider");
  }
  return context;
};
