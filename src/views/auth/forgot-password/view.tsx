import { z } from "zod";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextField } from "@/components/ui/formfields";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { ForgotPasswordContext } from "@/pages/password-reset";
import { Icons } from "@/components/ui/icons";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordEmail } from "@/server/mutations/auth";

const Schema = z.object({
  email: z.coerce.string().email("Enter an email address"),
});

const ForgotPasswordView = () => {
  const { setSuccess, setEmail } = useContext(ForgotPasswordContext);

  const { mutate } = useMutation({
    mutationKey: [resetPasswordEmail.key],
    mutationFn: (email: string) => resetPasswordEmail.mutation(email),
  });

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={toFormikValidationSchema(Schema.required())}
      validateOnMount
      onSubmit={(values: z.infer<typeof Schema>, { setSubmitting }) => {
        setSubmitting(true);
        mutate(values.email, {
          onSuccess(data) {
            setEmail(values.email);
            setSuccess(true);
            console.log(data);
          },
          onError(error) {
            console.error(error);
          },
          onSettled() {
            setSubmitting(false);
          },
        });
      }}
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          <TextField label="Email" name="email" type="email" />
          <Button type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Reset password
          </Button>
          <Link
            href="signin"
            className="mt-3 block text-center text-sm font-medium text-purple-400"
          >
            Back to sign-in
          </Link>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPasswordView;
