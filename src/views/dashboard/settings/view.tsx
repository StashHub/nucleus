import { getUserProfile } from "@/server/queries/auth";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@/components/ui/skeleton";
import Modal from "@/components/ui/modal";
import ChangePasswordView from "@/views/auth/change-password/view";
import { useState } from "react";
import { Mask } from "@/components/ui/mask";
import { formatPhone } from "@/lib/utils";

const SettingsView = () => {
  const { data: userData } = useQuery({
    queryKey: [getUserProfile.key],
    queryFn: getUserProfile.query,
  });
  const [open, setOpen] = useState(false);

  return (
    <div className="px-4 md:px-8">
      <div className="flex flex-col rounded-lg border border-neutral-200 p-6">
        <div className="border-b border-neutral-100 pb-6">
          <p className="mb-3 text-sm font-semibold">Name</p>
          {userData ? (
            <p className="mb-0 text-sm font-normal">{userData.name}</p>
          ) : (
            <Skeleton className="h-5 w-32" />
          )}
        </div>
        <div className="border-b border-neutral-100 pb-6 pt-4">
          <p className="mb-3 text-sm font-semibold">Email</p>
          {userData ? (
            <p className="mb-0 break-words text-sm font-normal">
              {userData.email}
            </p>
          ) : (
            <Skeleton className="h-5 w-40" />
          )}
        </div>
        <div className="flex flex-col border-b border-neutral-100 pb-6 pt-4 md:flex-row md:items-center md:justify-between">
          <div className="mb-4 grow md:mb-0">
            <p className="mb-3 text-sm font-semibold">Password</p>
            {userData ? <Mask /> : <Skeleton className="h-5 w-28" />}
          </div>
          <div>
            <Modal
              title="Change your password"
              triggerText="Change password"
              isButton
              open={open}
              setOpen={setOpen}
              showCloseIcon={false}
            >
              <ChangePasswordView setOpen={setOpen} />
            </Modal>
          </div>
        </div>
        <div className="pt-4">
          <p className="mb-3 text-sm font-semibold">Phone number</p>
          {userData ? (
            userData?.phones[0]?.number ? (
              <p className="mb-0 text-sm font-normal">
                {formatPhone(userData.phones[0].number)}
              </p>
            ) : (
              <>-</>
            )
          ) : (
            <Skeleton className="h-5 w-36" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
