import {
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from "react";
import { z } from "zod";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextField } from "@/components/ui/formfields";
import { Button } from "@/components/ui/button";
import PasswordValidity from "@/components/ui/password-validity";
import { passwordRegex, passwordRules, isAxiosError } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/server/mutations/auth";
import { ResetPasswordContext } from "@/pages/password-reset/[token]";
import { useToast } from "@/hooks/use-toast";

const Schema = z
  .object({
    currentpassword: z.string().min(1),
    password: z.string().refine((value) => {
      return passwordRegex.test(value);
    }),
    confirm: z.string().min(1),
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: "Hmm, those passwords don't match",
    path: ["confirm"],
  });

type ResponseType = {
  error: string;
};

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ChangePasswordView = ({ setOpen }: Props) => {
  const { setSuccess } = useContext(ResetPasswordContext);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordFieldTouched, setIsPasswordFieldTouched] = useState(false);
  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationKey: [changePassword.key],
    mutationFn: (data: { currentpassword: string; password: string }) =>
      changePassword.mutation(data.currentpassword, data.password),
  });

  return (
    <Formik
      initialValues={{
        currentpassword: "",
        password: "",
        confirm: "",
      }}
      validationSchema={toFormikValidationSchema(Schema)}
      validateOnMount
      onSubmit={(
        values: z.infer<typeof Schema>,
        { setSubmitting, setFieldError, resetForm },
      ) => {
        setSubmitting(true);
        mutate(
          {
            currentpassword: values.currentpassword,
            password: values.password,
          },
          {
            onSuccess(data) {
              setSuccess(true);
              setIsPasswordFieldTouched(false);
              resetForm();
              setOpen(false);
              toast({
                description: (
                  <div className="flex items-center">
                    <Icons.successCheck className="mr-2 inline-block" />
                    <p className="mb-0 inline-block">{data.message}</p>
                  </div>
                ),
                variant: "success",
              });
            },
            onError(error) {
              if (isAxiosError<ResponseType>(error)) {
                setFieldError("currentpassword", error.response?.data.error);
              }
            },
            onSettled() {
              setSubmitting(false);
            },
          },
        );
      }}
    >
      {({ values, isSubmitting, isValid, touched }) => (
        <Form className="pt-4">
          <TextField
            label="Current password"
            name="currentpassword"
            type="password"
          />
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
          <div>
            <Button
              type="submit"
              className="mb-3"
              disabled={isSubmitting || !isValid || !touched}
            >
              {isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Change password
            </Button>
            <Button
              type="button"
              onClick={() => {
                setOpen(false);
              }}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePasswordView;
