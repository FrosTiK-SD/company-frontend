"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Types
import {
  FormBuilder,
  KeyStore,
  RepeatableSection,
  Section,
} from "../../types/Form";

// Components
import { Typography, Button, useMantineTheme } from "../components";
// const Renderer = dynamic(import("./Renderer"));
import Renderer from "./Renderer";

// Icons
import { IconCheck } from "@tabler/icons";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  initializeFormState,
  postForm,
  selectForm,
  trySubmit,
} from "../../store/states/formSlice";
import { FormElement } from "../../types/FormType";
import useExportableFormData from "../../hooks/useExportableFormData";
import { StepperComponent } from "./Stepper";
import Viewer from "./Viewer";
import axios from "axios";
import { useRouter } from "next/navigation";
import Spinner from "../spinner/Spinner";

export interface GoToPath {
  name: string;
  path: string;
}

function Form({
  schema,
  children,
  successText,
  successDescription,
  postUrl,
  postFunction,
  bodyTemplate,
  goToPath,
  edit,
  variables,
  headers,
}: {
  schema: FormBuilder;
  children?: React.ReactNode;
  successText?: string;
  successDescription?: string;
  postUrl: string;
  postFunction?: () => Promise<boolean>;
  postError?: string;
  bodyTemplate?: object;
  goToPath?: GoToPath;
  edit?: {
    keyStore: KeyStore;
  };
  variables?: object;
  headers?: { [key: string]: string };
}) {
  const formState = useSelector(selectForm);
  const router = useRouter();
  const { exportableFormState, checkValidated, fileUploader } =
    useExportableFormData({
      formKey: schema.key as string,
    });
  const theme = useMantineTheme();
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    let keyStore: KeyStore = edit ? edit.keyStore : {};
    if (variables) keyStore = { ...keyStore, ...variables };

    dispatch(
      initializeFormState({
        keyStore,
        formKey: schema.key as string,
        formBuilderSchema: schema,
      })
    );
  }, []);

  const handleSubmit = async () => {
    if (step === 1) {
      dispatch(trySubmit({ formKey: schema.key as string }));
      if (checkValidated()) setStep(step + 1);
    }

    if (step == 2) {
      setLoading(true);
      const { exportData, keyStore } = await fileUploader();
      await new Promise((resolve) => setTimeout(resolve, 5000));
      if (edit && edit.keyStore) {
        await axios.put(
          postUrl,
          bodyTemplate
            ? { ...bodyTemplate, ...exportData, keyStore }
            : { ...exportData, keyStore },
          { headers: headers }
        );
      } else {
        await axios.post(
          postUrl,
          bodyTemplate
            ? { ...bodyTemplate, ...exportData, keyStore }
            : { ...exportData, keyStore },
          { headers: headers }
        );
      }

      setLoading(false);
      setStep(step + 1);
      if (postFunction && (await postFunction())) {
      }
      dispatch(postForm({ formKey: schema.key as string }));
    }
  };

  return (
    <div className="m-7">
      <div className="mb-5">
        <StepperComponent step={step} />
      </div>

      {/* Step 1  */}
      <div style={{ display: `${step == 1 ? "block" : "none"}` }}>
        <Typography order={1}>{schema.title}</Typography>
        <Typography order={4} className="font-light mb-5">
          {schema.description}
        </Typography>
        {formState[schema.key as string] &&
          formState[schema.key as string].formBuilderSchema.sections.map(
            (
              section: FormElement | Section | RepeatableSection,
              sectionIndex: number
            ): React.ReactNode => {
              return (
                <React.Fragment key={section.key as React.Key}>
                  <Renderer
                    renderElement={section}
                    basePath={"" as string}
                    formKey={schema.key as string}
                    formBuilderSchema={formState[schema.key as string]}
                    keyIndex={[sectionIndex]}
                    initialSchema={schema}
                  />
                </React.Fragment>
              );
            }
          )}
      </div>

      <div>
        {step === 2 && (
          <>
            <div style={{ display: `${loading ? "none" : "block"}` }}>
              <Typography order={1}>{schema.title}</Typography>
              {/* {formState[schema.key as string] &&
                formState[schema.key as string].formBuilderSchema.sections.map(
                  (
                    section: FormElement | Section | RepeatableSection,
                    sectionIndex: number
                  ): React.ReactNode => {
                    return (
                      <React.Fragment key={section.key as React.Key}>
                        <Renderer
                          renderElement={section}
                          basePath={"" as string}
                          formKey={schema.key as string}
                          formBuilderSchema={formState[schema.key as string]}
                          keyIndex={[sectionIndex]}
                          initialSchema={schema}
                          viewOnly={true}
                        />
                      </React.Fragment>
                    );
                  }
                )} */}
              <Viewer schema={schema} />
            </div>
            <div
              style={{
                display: `${loading ? "block" : "none"}`,
                minHeight: "60vh",
              }}
            >
              <Spinner />
            </div>
          </>
        )}
      </div>

      {!loading && step < 3 && (
        <div className="flex justify-between">
          <div>
            {step > 1 && (
              <Button
                className="mt-4"
                ripple={true}
                aria-hidden={true}
                color="purple"
                onClick={() => setStep(step - 1)}
                variant="outlined"
              >
                BACK
              </Button>
            )}
          </div>
          <Button
            className="mt-4"
            ripple={true}
            aria-hidden={true}
            onClick={handleSubmit}
            color="purple"
            variant="gradient"
          >
            {step < 2 ? "NEXT" : "SUBMIT"}
          </Button>
        </div>
      )}

      <div>
        {!loading &&
          step == 3 &&
          (children ? (
            <div>{children}</div>
          ) : (
            <div>
              <IconCheck
                stroke={1.5}
                size={200}
                className="m-auto"
                color={
                  theme.colors[theme.primaryColor][
                    theme.colorScheme === "dark" ? 4 : 6
                  ]
                }
              />
              <Typography className="text-center">
                {successText || "Success"}
              </Typography>
              <Typography order={5} className="text-center">
                {successDescription ||
                  "You can fill another JAF or edit and preview in the dashboard !"}
              </Typography>
              <div className="w-full flex justify-center mt-5">
                <Button
                  className="mt-4 m-auto"
                  ripple={true}
                  aria-hidden={true}
                  color="purple"
                  onClick={() => {
                    if (goToPath) {
                      router.replace(goToPath.path, {
                        forceOptimisticNavigation: true,
                      });
                    } else
                      router.replace("/", {
                        forceOptimisticNavigation: true,
                      });
                  }}
                  variant="gradient"
                >
                  {goToPath ? goToPath.name : "Go to Dashboard"}
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Form;
