import { useContext, useState } from "react";
import { z } from "zod";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextField } from "@/components/ui/formfields";
import { Button } from "@/components/ui/button";
import PasswordValidity from "@/components/ui/password-validity";
import { passwordRegex, passwordRules } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/server/mutations/auth";
import { useRouter } from "next/router";
import { ResetPasswordContext } from "@/pages/password-reset/[token]";

const Schema = z
  .object({
    password: z.string().refine((value) => {
      return passwordRegex.test(value);
    }),
    confirm: z.string().min(1),
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: "Hmm, those passwords don't match",
    path: ["confirm"],
  });

const ResetPasswordView = () => {
  const router = useRouter();
  const { setSuccess } = useContext(ResetPasswordContext);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordFieldTouched, setIsPasswordFieldTouched] = useState(false);
  const { token } = router.query;

  const { mutate } = useMutation({
    mutationKey: [resetPassword.key],
    mutationFn: (password: string) =>
      resetPassword.mutation(password, token as string),
  });

  return (
    <Formik
      initialValues={{
        password: "",
        confirm: "",
      }}
      validationSchema={toFormikValidationSchema(Schema)}
      validateOnMount
      onSubmit={(values: z.infer<typeof Schema>, { setSubmitting }) => {
        setSubmitting(true);
        mutate(values.password, {
          onSuccess(data) {
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
      {({ values, isSubmitting, isValid }) => (
        <Form>
          <TextField
            label="New password"
            name="password"
            type="password"
            onFocus={() => {
              setIsPasswordFieldTouched(true);
            }}
            showError={false}
          />
          <PasswordValidity
            show={isPasswordFieldTouched && !isPasswordValid}
            newPassword={values.password}
            confirmPassword={values.confirm}
            validationRules={passwordRules}
            onPasswordValidateChange={(valid) => setIsPasswordValid(valid)}
          />
          <TextField
            label="Confirm new password"
            name="confirm"
            type="password"
          />
          <Button type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Set new password
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPasswordView;
