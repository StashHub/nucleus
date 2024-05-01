import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Checkbox, TextField } from "@/components/ui/formfields";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useAlertContext } from "@/context/alert";

export const Schema = z.object({
  email: z.coerce.string().email("Enter an email address"),
  password: z.string({
    required_error: "Enter a password",
  }),
  remember: z.boolean(),
});

const SignInView = () => {
  const router = useRouter();
  const { setError, credentials, setCredentials, setVerify, clearAlert } =
    useAlertContext();

  return (
    <Formik
      initialValues={credentials}
      validationSchema={toFormikValidationSchema(Schema.required())}
      enableReinitialize
      validateOnMount
      onSubmit={async (values: z.infer<typeof Schema>, { setSubmitting }) => {
        setSubmitting(true);
        setError("");

        const response = await signIn("credentials", {
          ...values,
          redirect: false,
          callbackUrl: "/dashboard",
        });

        if (response?.url) router.push(response.url);

        if (response?.status === 403) {
          setVerify(true);
          setCredentials(values);
        }
        if (response?.status && ![200, 403].includes(response.status))
          setError("Sorry, that password or email isn't right.");
      }}
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="username"
            onChange={clearAlert}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={clearAlert}
          />
          <div className="mb-6 flex flex-col justify-between mbl:flex-row">
            <Checkbox
              label="Keep me signed in"
              name="remember"
              className="!mb-0"
              hideError
            />
            <div className="leading-[0]">
              <Link
                href="/password-reset"
                className="focus-visible-anchor mb-5 text-sm font-semibold leading-[20px] text-purple-400"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign in
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SignInView;
