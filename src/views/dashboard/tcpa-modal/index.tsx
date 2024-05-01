import { z } from "zod";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Checkbox, PhoneNumber } from "@/components/ui/formfields";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/modal";
import { getUserProfile } from "@/server/queries/auth";
import { formatPhone } from "@/lib/utils";
import { updateTCPA } from "@/server/mutations/company";
import { hasCookie, setCookie } from "cookies-next";

const Schema = z.object({
  phone: z
    .string({
      required_error: "Enter a phone number",
    })
    .regex(/\(\d{3}\) \d{3}-\d{4}/, "Please enter a valid number"),
  tcpa: z.boolean(),
});

const TCPAModalView = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const cookie = "tcpa";

  const { data: user, isLoading } = useQuery({
    queryKey: [getUserProfile.key],
    queryFn: getUserProfile.query,
  });

  useEffect(() => {
    if (user?.phones[0]?.number) {
      setPhone(formatPhone(user?.phones[0]?.number));
    }
  }, [setPhone, user]);

  const { mutate } = useMutation({
    mutationKey: [updateTCPA.key],
    mutationFn: (data: { phone: string; tcpa: boolean }) =>
      updateTCPA.mutation(data.phone, data.tcpa),
  });

  const handleDismiss = () => {
    setOpen(false);
    setCookie(cookie, "", { maxAge: 7 * 24 * 60 * 60 }); // 7 days
  };

  const determineHideTCPA = useMemo(() => {
    if (!user || isLoading) return false;
    return user.tcpaVerified === null && !hasCookie(cookie) && setOpen(true);
  }, [user, isLoading]);

  if (determineHideTCPA) {
    return null;
  }

  return (
    <Modal title="Confirm your phone number" showCloseIcon={false} open={open}>
      <Formik
        initialValues={{ phone: phone, tcpa: true }}
        validationSchema={toFormikValidationSchema(Schema.required())}
        validateOnMount
        enableReinitialize
        onSubmit={(values: z.infer<typeof Schema>, { setSubmitting }) => {
          setSubmitting(true);
          mutate(
            { phone: values.phone, tcpa: values.tcpa },
            {
              onSuccess() {
                setOpen(false);
                if (!values.tcpa) {
                  setCookie(cookie, ""); // indefinite
                }
              },
              onError(error) {
                console.error(error);
              },
              onSettled() {
                setSubmitting(false);
              },
            },
          );
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <PhoneNumber name="phone" label="Mobile number" />
            <Checkbox
              label="I consent to receive calls and text messages, directly and indirectly, about products, services, offers and promotions, as well as your relationship with us, by or on behalf of GetRefunds, including via the use of automated technology, at the telephone number provided. Standard messaging rates may apply."
              name="tcpa"
              className="[&>div>input]:relative [&>div>input]:top-[2px] [&>div]:items-start"
              hideError
            />
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm
            </Button>
            <div className="text-center">
              <Button
                type="button"
                className="mt-3 w-auto text-sm font-medium text-purple-400 focus-within:underline"
                onClick={handleDismiss}
                variant="link"
                aria-label="Maybe later"
              >
                Maybe later
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default TCPAModalView;
