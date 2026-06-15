"use client";

import { useDisclosure } from "@mantine/hooks";
import {
  Typography,
  Button,
  Tabs,
  Paper,
  Modal,
} from "../components/components";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "../store/states/userSlice";
import { selectIdStore } from "../store/states/idStore";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { IconEdit } from "@tabler/icons";

export interface FormInterface {
  title: string;
  goTo: string;
  description?: string;
}

enum FormType {
  "IAF" = "IAF",
  "JAF" = "JAF",
}

export interface IafForm {
  _id: string;
  internshipDescription: {
    profile: string;
  };
  iaf_id: string;
  updatedAt: string;
  type: FormType.IAF;
}

export interface JafForm {
  _id: string;
  jobDescription: {
    profile: string;
  };
  jaf_id: string;
  updatedAt: string;
  type: FormType.JAF;
}

export interface IafForms {
  data: Array<IafForm>;
  type: string;
}
export interface JafForms {
  data: Array<JafForm>;
  type: string;
}

const formTypes: Array<FormInterface> = [
  {
    title: "Internship Announcement Form (IAF)",
    description:
      "Fill this form to hire interns from IIT BHU for 2026 graduating students",
    goTo: "/company/iaf",
  },
  {
    title: "Job Announcement Form (JAF)",
    description:
      "Fill this form to hire full time candidates from IIT BHU for 2025 graduating students",
    goTo: "/company/jaf",
  },
];

export default function Home() {
  const [iafFormList, setIafFormList] = useState<Array<IafForm>>([]);
  const [jafFormList, setJafFormList] = useState<Array<JafForm>>([]);
  const [formsLoading, setFormsLoading] = useState<boolean>(true);

  const [opened, { open, close }] = useDisclosure(false);

  const router = useRouter();
  const User = useSelector(selectUser);
  const IdStore = useSelector(selectIdStore);

  const convertStringToDate = (str: string) => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: tz,
    }).format(new Date(str));
  };

  const fetchData = async () => {
    try {
      const iafResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_IAF_JAF_BACKEND}/iaf/recruiter_id`,
        {
          headers: {
            id: IdStore.recruiterId,
            mini: "1",
          },
        }
      );
      const jafResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_IAF_JAF_BACKEND}/jaf/recruiter_id`,
        {
          headers: {
            id: IdStore.recruiterId,
            mini: "1",
          },
        }
      );
      setFormsLoading(false);

      const jafList: Array<JafForm> = [];
      const iafList: Array<IafForm> = [];

      if (
        jafResponse.data &&
        jafResponse.data.data &&
        Array.isArray(jafResponse.data.data)
      ) {
        jafResponse.data.data.forEach((data: any) => {
          jafList.push({ ...data, type: FormType.JAF });
        });
      }

      if (
        iafResponse.data &&
        iafResponse.data.data &&
        Array.isArray(iafResponse.data.data)
      ) {
        iafResponse.data.data.forEach((data: any) => {
          iafList.push({ ...data, type: FormType.IAF });
        });
      }

      setIafFormList(iafList);
      setJafFormList(jafList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main>
      <div className="max-w-[800px] m-auto">
        <div className="m-5">
          <Typography order={1}>Recruiter Dashboard</Typography>
          <Typography order={5} className="font-light">
            Find all the <b>Internship Announcement Form (IAF)</b> and{" "}
            <b>Job Announcement Form</b> you have filled in one place.
          </Typography>
          <Modal
            className="rounded-md"
            opened={opened}
            onClose={close}
            styles={{ modal: { borderRadius: 10 } }}
            centered
            size="xl"
          >
            <Typography className="ml-10" order={3}>
              Choose the form you want to fill
            </Typography>
            {formTypes.map((form, formIndex) => (
              <Link
                key={`Form_${formIndex}`}
                href={form.goTo}
                target="_blank"
                rel="noreferrer"
              >
                <Paper className="shadow-lg p-5 m-10 cursor-pointer rounded-md">
                  <Typography order={4}>{form.title}</Typography>
                  <Typography order={5} className="font-light">
                    {form.description}
                  </Typography>
                </Paper>
              </Link>
            ))}
          </Modal>

          <div className="flex justify-between mt-10 items-center">
            {!formsLoading ? (
              iafFormList && iafFormList ? (
                <Typography order={4} className="font-light">
                  Total {iafFormList.length + jafFormList.length} form(s) filled
                </Typography>
              ) : (
                <Typography order={4} className="font-light">
                  You have not filled any forms. Fill a new one.
                </Typography>
              )
            ) : (
              <Typography order={4}>...</Typography>
            )}

            <Button
              color="purple"
              ripple={true}
              aria-hidden={true}
              onClick={open}
            >
              + Fill Form
            </Button>
          </div>

          <Tabs color="purple" defaultValue="all">
            <Tabs.List>
              <Tabs.Tab value="all">ALL</Tabs.Tab>
              <Tabs.Tab value="iaf">IAF</Tabs.Tab>
              <Tabs.Tab value="jaf">JAF</Tabs.Tab>
            </Tabs.List>

            {/* ALL  */}
            <Tabs.Panel value="all" pt="xs">
              <Tabs
                color="purple"
                defaultValue="2022-23"
                orientation="vertical"
              >
                <Tabs.List>
                  <Tabs.Tab value="2022-23">2022-23</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="2022-23" pl="xs">
                  <div className="max-h-[70vh] overflow-scroll">
                    {!formsLoading ? (
                      [...iafFormList, ...jafFormList].length ? (
                        [...iafFormList, ...jafFormList]
                          .sort(function (a, b) {
                            var x = a.updatedAt;
                            var y = b.updatedAt;
                            return x < y ? 1 : x > y ? -1 : 0;
                          })
                          .map((form, formIndex) => {
                            return (
                              <Link
                                key={`Form_${formIndex}`}
                                target="_blank"
                                href={`/company/${form.type == FormType.IAF ? "iaf" : "jaf"
                                  // @ts-ignore
                                  }/${form.type == FormType.IAF
                                    ? form.iaf_id
                                    : form.jaf_id
                                  }`}
                              >
                                <Paper className="m-2 p-5 rounded-md shadow-md cursor-pointer flex justify-between">
                                  <div>
                                    <Typography order={5}>
                                      {form.type === FormType.IAF
                                        ? form.internshipDescription.profile
                                        : form.jobDescription.profile}
                                    </Typography>
                                    <Typography
                                      order={6}
                                      className="font-normal"
                                    >
                                      {form.type == FormType.IAF
                                        ? "Internship"
                                        : "Full Time"}
                                    </Typography>
                                    <Typography
                                      order={6}
                                      className="font-light"
                                    >
                                      {convertStringToDate(form.updatedAt)}
                                    </Typography>
                                  </div>
                                  <div>
                                    <Link
                                      target="_blank"
                                      href={`/company/${form.type == FormType.IAF
                                          ? "iaf"
                                          : "jaf"
                                        // @ts-ignore
                                        }/edit/${form.type == FormType.IAF
                                          ? form.iaf_id
                                          : form.jaf_id
                                        }`}
                                    >
                                      <IconEdit />
                                    </Link>
                                  </div>
                                </Paper>
                              </Link>
                            );
                          })
                      ) : (
                        <Paper className="m-2 p-5 rounded-md">
                          <Typography
                            order={5}
                            className="font-light"
                            ta="center"
                          >
                            No forms filled yet.
                          </Typography>
                        </Paper>
                      )
                    ) : (
                      <Paper className="m-2 p-5 rounded-md">
                        <Typography
                          order={5}
                          className="font-light"
                          ta="center"
                        >
                          Loading forms ...{" "}
                        </Typography>
                      </Paper>
                    )}
                  </div>
                </Tabs.Panel>
              </Tabs>
            </Tabs.Panel>

            {/* IAF */}
            <Tabs.Panel value="iaf" pt="xs">
              <Tabs
                color="purple"
                defaultValue="2022-23"
                orientation="vertical"
              >
                <Tabs.List>
                  <Tabs.Tab value="2022-23">2022-23</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="2022-23" pl="xs">
                  <div className="max-h-[70vh] overflow-scroll">
                    {!formsLoading ? (
                      iafFormList && iafFormList.length ? (
                        iafFormList.map((form, formIndex) => {
                          return (
                            <Link
                              key={`Form_${formIndex}`}
                              target="_blank"
                              href={`/company/iaf/${form.iaf_id}`}
                            >
                              <Paper
                                key={`Form_${formIndex}`}
                                className="m-2 p-5 rounded-md shadow-md flex justify-between"
                                onClick={() => {
                                  router.replace(`/company/iaf/${form._id}`);
                                }}
                              >
                                <div>
                                  <Typography order={5}>
                                    {form.internshipDescription.profile}
                                  </Typography>
                                  <Typography order={6} className="font-light">
                                    {convertStringToDate(form.updatedAt)}
                                  </Typography>
                                </div>
                                <div>
                                  <Link
                                    target="_blank"
                                    href={`/company/iaf/edit/${form.iaf_id}`}
                                  >
                                    <IconEdit />
                                  </Link>
                                </div>
                              </Paper>
                            </Link>
                          );
                        })
                      ) : (
                        <Paper className="m-2 p-5 rounded-md">
                          <Typography
                            order={5}
                            className="font-light"
                            ta="center"
                          >
                            No forms filled yet.
                          </Typography>
                        </Paper>
                      )
                    ) : (
                      <Paper className="m-2 p-5 rounded-md">
                        <Typography
                          order={5}
                          className="font-light"
                          ta="center"
                        >
                          Loading forms ...{" "}
                        </Typography>
                      </Paper>
                    )}
                  </div>
                </Tabs.Panel>
              </Tabs>
            </Tabs.Panel>

            {/* JAF  */}
            <Tabs.Panel value="jaf" pt="xs">
              <Tabs
                color="purple"
                defaultValue="2022-23"
                orientation="vertical"
              >
                <Tabs.List>
                  <Tabs.Tab value="2022-23">2022-23</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="2022-23" pl="xs">
                  <div className="max-h-[70vh] overflow-scroll">
                    {!formsLoading ? (
                      jafFormList && jafFormList.length ? (
                        jafFormList.map((form, formIndex) => {
                          return (
                            <Link
                              key={`Form_${formIndex}`}
                              target="_blank"
                              href={`/company/jaf/${form.jaf_id}`}
                            >
                              <Paper className="m-2 p-5 rounded-md shadow-md flex justify-between">
                                <div>
                                  <Typography order={5}>
                                    {form.jobDescription.profile}
                                  </Typography>
                                  <Typography order={6} className="font-light">
                                    {convertStringToDate(form.updatedAt)}
                                  </Typography>
                                </div>
                                <div>
                                  <Link
                                    target="_blank"
                                    href={`/company/jaf/edit/${form.jaf_id}`}
                                  >
                                    <IconEdit />
                                  </Link>
                                </div>
                              </Paper>
                            </Link>
                          );
                        })
                      ) : (
                        <Paper className="m-2 p-5 rounded-md">
                          <Typography
                            order={5}
                            className="font-light"
                            ta="center"
                          >
                            No forms filled yet.
                          </Typography>
                        </Paper>
                      )
                    ) : (
                      <Paper className="m-2 p-5 rounded-md">
                        <Typography
                          order={5}
                          className="font-light"
                          ta="center"
                        >
                          Loading forms ...{" "}
                        </Typography>
                      </Paper>
                    )}
                  </div>
                </Tabs.Panel>
              </Tabs>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
