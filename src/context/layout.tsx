import { type CompanyDeal } from "@/lib/types";
import { getUserProfile } from "@/server/queries/auth";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type LayoutContextProps = {
  expanded: boolean;
  setExpanded: (state: boolean) => void;
  companies: CompanyDeal[];
  setCompanies: (companies: CompanyDeal[]) => void;
  company: CompanyDeal | undefined;
  setCompany: (company: CompanyDeal) => void;
};

const LayoutContext = createContext<LayoutContextProps>({
  expanded: false,
  setExpanded: () => undefined,
  companies: [],
  setCompanies: () => undefined,
  company: undefined,
  setCompany: () => undefined,
});

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [company, setCompany] = useState<CompanyDeal | undefined>(undefined);
  const [companies, setCompanies] = useState<CompanyDeal[]>([]);

  const session = useSession();

  const { data: userData } = useQuery({
    queryKey: [getUserProfile.key],
    queryFn: getUserProfile.query,
    enabled: !!session?.data,
  });

  useEffect(() => {
    if (userData) setCompanies(userData.companies);
    if (!company && companies?.[0]) setCompany(userData?.companies[0]);
  }, [userData, companies, company]);

  return (
    <LayoutContext.Provider
      value={{
        expanded,
        setExpanded,
        companies,
        setCompanies,
        company,
        setCompany,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  }
  return context;
};
