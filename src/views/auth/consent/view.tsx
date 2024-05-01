import { z } from "zod";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextField } from "@/components/ui/formfields";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { isAxiosError } from "@/lib/utils";
import { useAlertContext } from "@/context/alert";
import { useMutation } from "@tanstack/react-query";
import { userConsent } from "@/server/mutations/auth";
import { type ResponseError } from "@/lib/types";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Schema = z.object({
  signature: z.string(),
});

const ConsentView = () => {
  const { setError, credentials } = useAlertContext();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const clearError = () => setError("");

  const { mutate } = useMutation({
    mutationKey: ["user-consent"],
    mutationFn: (variables: { email: string; signature: string }) =>
      userConsent.mutation(variables.email, variables.signature),
  });

  const redirectToSignIn = () => {
    router.push("/signin?success");
  };

  return (
    <Formik
      initialValues={{
        signature: "",
      }}
      validationSchema={toFormikValidationSchema(Schema)}
      enableReinitialize
      validateOnMount
      onSubmit={(values: z.infer<typeof Schema>, { setSubmitting }) => {
        setSubmitting(true);
        mutate(
          {
            email: credentials.email,
            signature: values.signature,
          },
          {
            onSuccess() {
              redirectToSignIn();
            },
            onError(error) {
              if (isAxiosError<ResponseError>(error)) {
                const msg = error.response?.data.error;
                if (msg) setError(msg);
              }
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
          <p className="text-xl font-bold leading-7 text-gray-900">
            CONSENT TO DISCLOSURE OF TAX RETURN INFORMATION
          </p>

          <p>
            Federal law requires this consent form be provided to you. Unless
            authorized by law, Innovation Refunds LLC and IR Advance LLC
            (collectively, “Innovation Refunds”) cannot disclose your tax return
            information to third parties, like GetRefunds Enterprises, LLC
            (“GetRefunds”), for purposes other than the preparation and filing
            of your tax return without your consent. If you consent to the
            disclosure of your tax return information, Federal law may not
            protect your tax return information from further use or
            distribution.
          </p>

          <p>
            You are not required to complete this form to receive tax return
            preparation services. If your signature on this form is obtained by
            conditioning tax return preparation services on your consent, your
            consent will not be valid. If you agree to the disclosure of your
            tax return information to GetRefunds by signing your name below for
            one-year from your signature, InnovationRefunds will, on an ongoing
            basis, provide any and all information regarding your tax filing to
            GetRefunds.
          </p>

          <p>
            If you believe your tax return information has been disclosed or
            used improperly in a manner unauthorized by law or without your
            permission, you may contact the Treasury Inspector General for Tax
            Administration (TIGTA) by telephone at 1-800-366-4484, or by email{" "}
            <a href="mailto:atcomplaints@tigta.treas.gov">
              atcomplaints@tigta.treas.gov
            </a>
            .
          </p>

          <p>
            If you authorize Innovation Refunds to disclose your tax return
            information to GetRefunds, please enter your name and click
            “Submit.”
          </p>
          <div className="h-28 sm:hidden"></div>
          <div className="fixed bottom-0 left-0 w-full border-t bg-white p-4 drop-shadow-md sm:relative sm:border-0 sm:p-0 sm:drop-shadow-none">
            <TextField
              label="Signature"
              name="signature"
              type="text"
              onChange={clearError}
              showIcon={false}
            />
            <p className="-mt-4 text-sm text-gray-500">Enter your full name</p>
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
            <p className="mb-0 mt-5 text-center text-sm font-normal text-purple-700">
              <Modal
                title=""
                triggerText="Continue without consent"
                open={open}
                setOpen={setOpen}
                showCloseIcon={false}
              >
                <Icons.warning
                  className="stroke-warning-600 mx-auto h-14 w-14 rounded-full border-8 border-notice-50 bg-notice-100 p-1"
                  fill="#FFE7CC"
                  stroke2="#FFE7CC"
                />
                <p className="text-center text-lg font-bold sm:text-xl">
                  Continue without giving consent?
                </p>
                <p className="text-center text-sm">
                  Your account will be created, but you won't be able to access
                  your ERC data or monitor your refund status.
                </p>
                <div className="!mt-6 grid gap-4 sm:flex sm:flex-row-reverse sm:justify-center">
                  <Button variant={"default"} onClick={redirectToSignIn}>
                    Continue
                  </Button>
                  <Button variant={"secondary"} onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </Modal>
            </p>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ConsentView;
