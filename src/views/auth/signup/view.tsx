import { z } from "zod";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Checkbox, TextField } from "@/components/ui/formfields";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import PasswordValidity from "@/components/ui/password-validity";
import { isAxiosError, passwordRegex, passwordRules } from "@/lib/utils";
import { useAlertContext } from "@/context/alert";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/server/mutations/auth";
import { useRouter } from "next/router";
import { type ResponseError } from "@/lib/types";
import { qrpbqr } from "@/lib/utils";
import useTracker from "@/hooks/use-tracker";

const Schema = z.object({
  email: z.string().email(),
  password: z
    .object({
      initial: z.string().refine((value) => {
        return passwordRegex.test(value);
      }),
      confirm: z.string(),
    })
    .refine(({ initial, confirm }) => initial === confirm, {
      message: "Hmm, those passwords don't match",
      path: ["confirm"],
    }),
  terms: z.boolean().refine((terms) => terms == true),
});

const SignUpView = () => {
  const { identifyUser, trackEvent } = useTracker();
  const router = useRouter();
  const { setSuccess, setError, setCredentials } = useAlertContext();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordFieldTouched, setIsPasswordFieldTouched] = useState(false);
  const clearError = () => setError("");

  const { t } = router.query;

  const email = useMemo(() => {
    if (typeof t === "string") {
      return qrpbqr(t);
    }
    return "";
  }, [t]);

  const { mutate } = useMutation({
    mutationKey: [register.key],
    mutationFn: (variables: { email: string; password: string }) =>
      register.mutation(variables.email, variables.password),
  });

  return (
    <Formik
      initialValues={{
        email,
        password: {
          initial: "",
          confirm: "",
        },
        terms: false,
      }}
      validationSchema={toFormikValidationSchema(Schema)}
      enableReinitialize
      validateOnMount
      onSubmit={(values: z.infer<typeof Schema>, { setSubmitting }) => {
        setSubmitting(true);
        mutate(
          {
            email: values.email,
            password: values.password.initial,
          },
          {
            onSuccess() {
              void identifyUser({ identifier: values.email });
              void trackEvent({ label: "Sign Up" });

              // move to consent page
              setSuccess(true);
              setCredentials({
                email: values.email,
                password: values.password.initial,
                remember: false,
              });
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
      {({ values, isSubmitting, isValid }) => (
        <Form>
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="username"
            onChange={clearError}
            disabled={true}
          />
          <TextField
            label="Password"
            name="password.initial"
            type="password"
            autoComplete="new-password"
            showError={false}
            onFocus={() => {
              setIsPasswordFieldTouched(true);
            }}
            onChange={clearError}
          />
          <PasswordValidity
            show={isPasswordFieldTouched && !isPasswordValid}
            newPassword={values.password.initial}
            confirmPassword={values.password.confirm}
            validationRules={passwordRules}
            onPasswordValidateChange={(valid) => setIsPasswordValid(valid)}
          />
          <TextField
            label="Confirm password"
            name="password.confirm"
            type="password"
            autoComplete="new-password"
          />
          <div className="mt-7 flex flex-col justify-between mbl:flex-row">
            <Checkbox
              label={
                <>
                  {`I agree to the `}
                  <Link
                    href="https://getrefunds.com/terms"
                    target="_blank"
                    className="focus-visible-anchor leading-[21px] text-purple-400 underline underline-offset-4"
                  >
                    Terms and Conditions
                  </Link>
                  {`, `}
                  <Link
                    href="https://getrefunds.com/privacy"
                    target="_blank"
                    className="focus-visible-anchor leading-[21px] text-purple-400 underline underline-offset-4"
                  >
                    Privacy Policy
                  </Link>
                  {` and `}
                  <Link
                    href="https://getrefunds.com/notice-at-collection"
                    target="_blank"
                    className="focus-visible-anchor leading-[21px] text-purple-400 underline underline-offset-4"
                  >
                    Notice at Collection
                  </Link>
                  {`.`}
                </>
              }
              hideError
              name="terms"
              className="[&>div>input]:relative [&>div>input]:top-[3px] [&>div]:items-start"
            />
          </div>

          <Button
            className="h-12"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? (
              <>
                Processing...
                <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>Continue</>
            )}
          </Button>
          <p className="mb-0 mt-6 text-center text-sm font-normal text-neutral-600">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="focus-visible-anchor font-semibold leading-6 text-purple-400"
            >
              Sign in
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpView;
