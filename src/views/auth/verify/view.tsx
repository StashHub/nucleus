import { z } from "zod";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Button } from "@/components/ui/button";
import { useAlertContext } from "@/context/alert";
import { Icons } from "@/components/ui/icons";
import EnterCode from "@/components/ui/otp-input";
import { verifyOtp, resendOtp } from "@/server/mutations/auth";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "@/lib/utils";
import { type ResponseError } from "@/lib/types";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import useTracker from "@/hooks/use-tracker";

const Schema = z.object({ otp: z.string().length(6) });

const VerifyView = () => {
  const { identifyUser, trackEvent } = useTracker();
  const { setError, clearAlert, setInfo, credentials } = useAlertContext();
  const router = useRouter();
  const { mutate: verify } = useMutation({
    mutationKey: [verifyOtp.key],
    mutationFn: (otp: string) => verifyOtp.mutation(otp),
  });

  const { mutate: resend } = useMutation({
    mutationKey: [resendOtp.key],
    mutationFn: (email: string) => resendOtp.mutation(email),
  });

  const handleResend = () => {
    clearAlert();
    resend(credentials.email, {
      onSuccess() {
        setInfo("New code sent");
      },
    });
  };

  return (
    <Formik
      initialValues={{ otp: "" }}
      validationSchema={toFormikValidationSchema(Schema.required())}
      enableReinitialize
      validateOnMount
      onSubmit={(values: z.infer<typeof Schema>, { setSubmitting }) => {
        clearAlert();

        setSubmitting(true);
        verify(values.otp, {
          onSuccess() {
            (async () => {
              const response = await signIn("credentials", {
                ...credentials,
                redirect: false,
                callbackUrl: "/dashboard",
              });
              void identifyUser({ identifier: credentials.email });
              void trackEvent({ label: "Sign In" });

              if (response?.url) router.push(`${response.url}?loggedin`);
            })().catch((error) => {
              console.error(error);
            });
          },
          onError(error) {
            if (isAxiosError<ResponseError>(error)) {
              setError(error.response?.data.error);
            }
            setSubmitting(false);
          },
        });
      }}
    >
      {({ values, isSubmitting, isValid, setFieldValue }) => (
        <Form>
          <EnterCode
            isLoading={isSubmitting}
            value={values.otp}
            callback={(code) => setFieldValue("otp", code)}
          />
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            size="lg"
            className="mb-3"
          >
            {isSubmitting ? (
              <>
                Authenticating...
                <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>Continue</>
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleResend}
            disabled={isSubmitting}
            className="text-sm"
          >
            Get another code
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default VerifyView;
