"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Typography } from "../../../components/components";
import Form from "../../../components/form/Form";
import RecruiterAndCompanyRegisterSchema from "../../../configs/CompanyRegisterSchema";
import { handleSignUpWithEmailPassword } from "../../../firebase/auth";
import useExportableFormData from "../../../hooks/useExportableFormData";
import { selectForm } from "../../../store/states/formSlice";
// export const runtime = "edge";

function Page() {
  const {} = useExportableFormData({
    formKey: "recruiterAndCompanyRegistration",
  });

  const router = useRouter();

  const FormState = useSelector(selectForm);

  const handleSignIn = async () => {
    const user = await handleSignUpWithEmailPassword(
      FormState["recruiterAndCompanyRegistration"].keyStore[
        "[recruiter]-[email]"
      ],
      FormState["recruiterAndCompanyRegistration"].keyStore[
        "[passwordCreation]-[password]"
      ]
    );
    if (user.error) {
      return false;
    } else return true;
  };

  useEffect(() => {
    if (
      FormState["recruiterAndCompanyRegistration"] &&
      FormState["recruiterAndCompanyRegistration"].posted
    ) {
      handleSignIn();
    }
  }, [FormState["recruiterAndCompanyRegistration"]]);

  useEffect(() => {}, []);
  return (
    <div>
      <div className="max-w-[800px] m-auto">
        <div className="border-1 border-purple-500 flex justify-between m-5 items-center">
          <Typography order={5}>Already registered ?</Typography>
          <Button
            ripple={true}
            aria-hidden={true}
            color="purple"
            onClick={() => {
              router.replace("/login/recruiter");
            }}
            variant="gradient"
          >
            Login
          </Button>
        </div>
        <Form
          schema={RecruiterAndCompanyRegisterSchema}
          postFunction={handleSignIn}
          postUrl={`${process.env.NEXT_PUBLIC_AUTH_BACKEND}/api/register/recruiterAndCompany`}
        />
      </div>
    </div>
  );
}

export default Page;
