"use client";

// import { title } from "process";
import { Failure, FormBuilder, Success } from "../types/Form";
import { FormInputType, FormType } from "../types/FormType";
import { Validation } from "../types/Validation";

const IAFSchema: FormBuilder = {
  title: "Internship Announcement Form",
  description:
    "Fill this form to show your interest in hiring intern candidates from our Institute",
  key: "iaf",
  sections: [
    {
      title: "Alternate HR Contact Information",
      key: "alternateHR",
      type: FormType.REPEATABLE_SECTION,
      formElements: [
        [
          {
            label: "Name",
            key: "name",
            type: FormInputType.SHORT_TEXT,
          },
          {
            label: "Contact",
            key: "contact",
            type: FormInputType.SHORT_TEXT,
          },
          {
            label: "Email",
            key: "email",
            type: FormInputType.SHORT_TEXT,
          },
          {
            label: "Alternative Contact",
            key: "alternativeContact",
            type: FormInputType.SHORT_TEXT,
          },
        ],
      ],
    },
    {
      title: "Internship Description",
      key: "internshipDescription",
      type: FormType.SECTION,
      formElements: [
        {
          label: "Profile",
          key: "profile",
          type: FormInputType.SHORT_TEXT,
          required: true,
        },
        {
          label: "Internship Description",
          key: "jd",
          type: FormInputType.LONG_TEXT,
          required: true,
        },
        {
          label: "No of Minimum Hires",
          key: "minimumHires",
          type: FormInputType.NUMBER,
          required: true,
        },
        {
          label: "No of Expected Hires",
          key: "expectedHires",
          type: FormInputType.NUMBER,
          required: true,
        },
        {
          label: "Internship Duration",
          key: "internshipDuration",
          description:
            "Please enter the number of weeks the Internship will span for",
          type: FormInputType.NUMBER,
          required: true,
        },
        {
          label: "Tentative Location(s)",
          key: "locations",
          type: FormInputType.SHORT_TEXT,
          required: true,
        },
        {
          label: "JD Attachments (if any)",
          key: "jdAttachments",
          type: FormInputType.FILE,
          storagePath: {
            prop: "companyId",
            path: (companyId: string) => {
              return `jd/${companyId}`;
            },
          },
        },
        {
          label: "Is there a CGPA criteria?",
          key: "isCGPACriteria",
          type: FormInputType.SWITCH_INPUT,
          required: false,
        },
        {
          label: "Eligible Courses",
          key: "courses",
          type: FormInputType.CHECKBOX,
          required: true,
          options: [
            {
              label: "B.Tech / B.Arch",
              description:
                "4 Yr Bachelors in Technology/ 5 Yr Bachelors in Architecture",
              key: "btech",
            },
            {
              label: "IDD",
              description: "5 Yr Integrated B.Tech + M.Tech",
              key: "idd",
            },
            {
              label: "M.Tech",
              description: "2 Yr Masters in Technology",
              key: "mtech",
            },
            {
              label: "M.Sc",
              description: "2 Yr Masters in Science",
              key: "msc",
            },
            {
              label: "PhD",
              key: "phd",
            },
          ],
        },

        {
          title: "",
          key: "btech",
          type: FormType.SECTION,
          visible: {
            props: ["[internshipDescription]-[courses]"],
            validator: (eligibilityArray: Array<string>) => {
              const eligibility = eligibilityArray[0];
              if (!eligibility) return false;
              return eligibility.includes("btech") ? true : false;
            },
          },
          formElements: [
            {
              title: "B.Tech Eligibility Criteria",
              key: "eligibility",
              type: FormType.SECTION,
              formElements: [
                {
                  label: "CGPA",
                  key: "cgpa",
                  type: FormInputType.NUMBER,
                  required: true,
                  description: "CGPA must be a number between 0 - 10",
                  max: 10,
                  min: 0,
                  visible: {
                    props: ["[internshipDescription]-[isCGPACriteria]"],
                    validator(arg0) {
                      if (arg0[0] == true) {
                        return true;
                      }
                      return false;
                    },
                  }
                },
                {
                  label: "Eligible Branches",
                  key: "branches",
                  required: true,
                  type: FormInputType.CHECKBOX,
                  options: [
                    {
                      label: "All",
                      key: "all",
                      value: [
                        "cer",
                        "che",
                        "civ",
                        "cse",
                        "ece",
                        "eee",
                        "mec",
                        "met",
                        "min",
                        "phe",
                        "arch",
                      ],
                    },
                    {
                      label: "Ceramic Engineering",
                      key: "cer",
                    },
                    {
                      label: "Chemical Engineering",
                      key: "che",
                    },
                    {
                      label: "Civil Engineering",
                      key: "civ",
                    },
                    {
                      label: "Computer Science and Engineering",
                      key: "cse",
                    },
                    {
                      label: "Electronics Engineering",
                      key: "ece",
                    },
                    {
                      label: "Electrical Engineering",
                      key: "eee",
                    },
                    {
                      label: "Mechanical Engineering",
                      key: "mec",
                    },
                    {
                      label: "Metallurgical Engineering",
                      key: "met",
                    },
                    {
                      label: "Mining Engineering",
                      key: "min",
                    },
                    {
                      label: "Pharmaceutical Engineering",
                      key: "phe",
                    },
                    {
                      label: "Architecture Planning and Design",
                      key: "arch",
                    },
                  ],
                },
                {
                  label: "Age Limit",
                  key: "ageLimit",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
              ],
            },
            {
              title: "B.Tech Stipend Details",
              key: "compensationDetails",
              type: FormType.SECTION,
              formElements: [
                {
                  label: "Stipend Per Month",
                  key: "stipendPerMonth",
                  type: FormInputType.CURRENCY,
                  required: true,
                },
                {
                  label: "Accommodation",
                  key: "accommodation",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Relocation Bonus",
                  key: "relocationBonus",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Incentives/Perks/Bonus",
                  key: "incentives",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Will PPO be provided after internship based on performance?",
                  key: "provisionForPPO",
                  type: FormInputType.SWITCH_INPUT,
                  required: false,
                },
                {
                  label: "Tentative CTC for the PPO",
                  key: "tentativeCTC",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                  visible: {
                    props: ["[internshipDescription]-[btech]-[compensationDetails]-[provisionForPPO]"],
                    validator(arg0) {
                      if (arg0[0] == true) {
                        return true;
                      }
                      return false;
                    },
                  }
                },
              ],
            },
          ],
        },
        {
          title: "",
          key: "idd",
          type: FormType.SECTION,
          visible: {
            props: ["[internshipDescription]-[courses]"],
            validator: (eligibilityArray: Array<string>) => {
              const eligibility = eligibilityArray[0];
              if (!eligibility) return false;
              return eligibility.includes("idd") ? true : false;
            },
          },
          formElements: [
            {
              title: "IDD Eligibility Criteria",
              key: "eligibility",
              type: FormType.SECTION,
              formElements: [
                {
                  label: "CGPA",
                  key: "cgpa",
                  type: FormInputType.NUMBER,
                  required: true,
                  description: "CGPA must be a number between 0 - 10",
                  max: 10,
                  min: 0,
                  visible: {
                    props: ["[internshipDescription]-[isCGPACriteria]"],
                    validator(arg0) {
                      if (arg0[0] == true) {
                        return true;
                      }
                      return false;
                    },
                  }
                },
                {
                  label: "Eligible Branches",
                  key: "branches",
                  required: true,
                  type: FormInputType.CHECKBOX,
                  options: [
                    {
                      label: "All",
                      key: "all",
                      value: [
                        "bce",
                        "bme",
                        "cer",
                        "civ",
                        "cse",
                        "eee",
                        "phy",
                        "chy",
                        "mst",
                        "mat",
                        "mec",
                        "met",
                        "min",
                        "phe",
                      ],
                    },
                    {
                      label: "Biochemical Engineering",
                      key: "bce",
                    },
                    {
                      label: "Biomedical Engineering",
                      key: "bme",
                    },
                    {
                      label: "Ceramic Engineering",
                      key: "cer",
                    },
                    {
                      label: "Civil Engineering",
                      key: "civ",
                    },
                    {
                      label: "Computer Science and Engineering",
                      key: "cse",
                    },
                    {
                      label: "Electrical Engineering",
                      key: "eee",
                    },
                    {
                      label: "Department of Physics",
                      key: "phy",
                    },
                    {
                      label: "Department of Chemistry",
                      key: "chy",
                    },
                    {
                      label: "Material Science and Technology",
                      key: "mst",
                    },
                    {
                      label: "Department of Mathematical Sciences",
                      key: "mat",
                    },
                    {
                      label: "Mechanical Engineering",
                      key: "mec",
                    },
                    {
                      label: "Metallurgical Engineering",
                      key: "met",
                    },
                    {
                      label: "Mining Engineering",
                      key: "min",
                    },
                    {
                      label: "Pharmaceutical Engineering",
                      key: "phe",
                    },
                  ],
                },
                {
                  label: "Age Limit",
                  key: "ageLimit",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
              ],
            },
            {
              title: "IDD Stipend Details",
              key: "compensationDetails",
              type: FormType.SECTION,
              formElements: [
                {
                  label: "Stipend Per Month",
                  key: "stipendPerMonth",
                  type: FormInputType.CURRENCY,
                  required: true,
                },
                {
                  label: "Accommodation",
                  key: "accommodation",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Relocation Bonus",
                  key: "relocationBonus",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Incentives/Perks/Bonus",
                  key: "incentives",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Will PPO be provided after internship based on performance?",
                  key: "provisionForPPO",
                  type: FormInputType.SWITCH_INPUT,
                  required: false,
                },
                {
                  label: "Tentative CTC for the PPO",
                  key: "tentativeCTC",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                  visible: {
                    props: ["[internshipDescription]-[idd]-[compensationDetails]-[provisionForPPO]"],
                    validator(arg0) {
                      if (arg0[0] == true) {
                        return true;
                      }
                      return false;
                    },
                  }
                },
              ],
            },
          ],
        },
        {
          title: "",
          key: "mtech",
          type: FormType.SECTION,
          visible: {
            props: ["[internshipDescription]-[courses]"],
            validator: (eligibilityArray: Array<string>) => {
              const eligibility = eligibilityArray[0];
              if (!eligibility) return false;
              return eligibility.includes("mtech") ? true : false;
            },
          },
          formElements: [
            {
              title: "M.Tech Eligibility Criteria",
              key: "eligibility",
              type: FormType.SECTION,
              formElements: [
                {
                  label: "CGPA",
                  key: "cgpa",
                  type: FormInputType.NUMBER,
                  required: true,
                  description: "CGPA must be a number between 0 - 10",
                  max: 10,
                  min: 0,
                  visible: {
                    props: ["[internshipDescription]-[isCGPACriteria]"],
                    validator(arg0) {
                      if (arg0[0] == true) {
                        return true;
                      }
                      return false;
                    },
                  }
                },
                {
                  label: "Eligible Branches",
                  key: "branches",
                  required: true,
                  type: FormInputType.CHECKBOX,
                  options: [
                    {
                      label: "All",
                      key: "all",
                      value: [
                        "bce",
                        "bme",
                        "cer",
                        "che",
                        "civ",
                        "cse",
                        "ece",
                        "eee",
                        "phy",
                        "chy",
                        "mst",
                        "mat",
                        "mec",
                        "met",
                        "min",
                        "phe",
                      ],
                    },
                    {
                      label: "Biochemical Engineering",
                      key: "bce",
                    },
                    {
                      label: "Biomedical Engineering",
                      key: "bme",
                    },
                    {
                      label: "Ceramic Engineering",
                      key: "cer",
                    },
                    {
                      label: "Chemical Engineering",
                      key: "che",
                    },
                    {
                      label: "Civil Engineering",
                      key: "civ",
                    },
                    {
                      label: "Computer Science and Engineering",
                      key: "cse",
                    },
                    {
                      label: "Electronics Engineering",
                      key: "ece",
                    },
                    {
                      label: "Electrical Engineering",
                      key: "eee",
                    },
                    {
                      label: "Department of Physics",
                      key: "phy",
                    },
                    {
                      label: "Department of Chemistry",
                      key: "chy",
                    },
                    {
                      label: "Material Science and Technology",
                      key: "mst",
                    },
                    {
                      label: "Department of Mathematical Sciences",
                      key: "mat",
                    },
                    {
                      label: "Mechanical Engineering",
                      key: "mec",
                    },
                    {
                      label: "Metallurgical Engineering",
                      key: "met",
                    },
                    {
                      label: "Mining Engineering",
                      key: "min",
                    },
                    {
                      label: "Pharmaceutical Engineering",
                      key: "phe",
                    },
                    {
                      label: "Decision Science Engineering",
                      key: "dse",
                    },
                  ],
                },
                {
                  label: "Age Limit",
                  key: "ageLimit",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
              ],
            },
            {
              title: "M.Tech Stipend Details",
              key: "compensationDetails",
              type: FormType.SECTION,
              formElements: [
                {
                  label: "Stipend Per Month",
                  key: "stipendPerMonth",
                  type: FormInputType.CURRENCY,
                  required: true,
                },
                {
                  label: "Accommodation",
                  key: "accommodation",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Relocation Bonus",
                  key: "relocationBonus",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Incentives/Perks/Bonus",
                  key: "incentives",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Will PPO be provided after internship based on performance?",
                  key: "provisionForPPO",
                  type: FormInputType.SWITCH_INPUT,
                  required: false,
                },
                {
                  label: "Tentative CTC for the PPO",
                  key: "tentativeCTC",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                  visible: {
                    props: ["[internshipDescription]-[mtech]-[compensationDetails]-[provisionForPPO]"],
                    validator(arg0) {
                      if (arg0[0] == true) {
                        return true;
                      }
                      return false;
                    },
                  }
                },
              ],
            },
          ],
        },
        {
          title: "",
          key: "msc",
          type: FormType.SECTION,
          visible: {
            props: ["[internshipDescription]-[courses]"],
            validator: (eligibilityArray: Array<string>) => {
              const eligibility = eligibilityArray[0];
              if (!eligibility) return false;
              return eligibility.includes("msc") ? true : false;
            },
          },
          formElements: [
            {
              title: "M.Sc Eligibility Criteria",
              key: "eligibility",
              type: FormType.SECTION,
              formElements: [
                {
                  label: "CGPA",
                  key: "cgpa",
                  type: FormInputType.NUMBER,
                  required: true,
                  description: "CGPA must be a number between 0 - 10",
                  max: 10,
                  min: 0,
                  visible: {
                    props: ["[internshipDescription]-[isCGPACriteria]"],
                    validator(arg0) {
                      if (arg0[0] == true) {
                        return true;
                      }
                      return false;
                    },
                  }
                },
                {
                  label: "Eligible Branches",
                  key: "branches",
                  required: true,
                  type: FormInputType.CHECKBOX,
                  options: [
                    {
                      label: "All",
                      key: "all",
                      value: ["phy", "chy"],
                    },
                    {
                      label: "Department of Physics",
                      key: "phy",
                    },
                    {
                      label: "Department of Chemistry",
                      key: "chy",
                    },
                  ],
                },
                {
                  label: "Age Limit",
                  key: "ageLimit",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
              ],
            },
            {
              title: "M.Sc Stipend Details",
              key: "compensationDetails",
              type: FormType.SECTION,
              formElements: [
                {
                  label: "Stipend Per Month",
                  key: "stipendPerMonth",
                  type: FormInputType.CURRENCY,
                  required: true,
                },
                {
                  label: "Accommodation",
                  key: "accommodation",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Relocation Bonus",
                  key: "relocationBonus",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Incentives/Perks/Bonus",
                  key: "incentives",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Will PPO be provided after internship based on performance?",
                  key: "provisionForPPO",
                  type: FormInputType.SWITCH_INPUT,
                  required: false,
                },
                {
                  label: "Tentative CTC for the PPO",
                  key: "tentativeCTC",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                  visible: {
                    props: ["[internshipDescription]-[msc]-[compensationDetails]-[provisionForPPO]"],
                    validator(arg0) {
                      if (arg0[0] == true) {
                        return true;
                      }
                      return false;
                    },
                  }
                },
              ],
            },
          ],
        },
        {
          title: "",
          key: "phd",
          type: FormType.SECTION,
          visible: {
            props: ["[internshipDescription]-[courses]"],
            validator: (eligibilityArray: Array<string>) => {
              const eligibility = eligibilityArray[0];
              if (!eligibility) return false;
              return eligibility.includes("phd") ? true : false;
            },
          },
          formElements: [
            {
              title: "PhD Eligibility Criteria",
              key: "eligibility",
              type: FormType.SECTION,
              formElements: [
                {
                  label: "CGPA",
                  key: "cgpa",
                  type: FormInputType.NUMBER,
                  required: true,
                  description: "CGPA must be a number between 0 - 10",
                  max: 10,
                  min: 0,
                  visible: {
                    props: ["[internshipDescription]-[isCGPACriteria]"],
                    validator(arg0) {
                      if (arg0[0] == true) {
                        return true;
                      }
                      return false;
                    },
                  }
                },
                {
                  label: "Eligible Branches",
                  key: "branches",
                  required: true,
                  type: FormInputType.CHECKBOX,
                  options: [
                    {
                      label: "All",
                      key: "all",
                      value: [
                        "bce",
                        "bme",
                        "cer",
                        "che",
                        "civ",
                        "cse",
                        "ece",
                        "eee",
                        "phy",
                        "chy",
                        "mst",
                        "mat",
                        "mec",
                        "met",
                        "min",
                        "phe",
                      ],
                    },
                    {
                      label: "Biochemical Engineering",
                      key: "bce",
                    },
                    {
                      label: "Biomedical Engineering",
                      key: "bme",
                    },
                    {
                      label: "Ceramic Engineering",
                      key: "cer",
                    },
                    {
                      label: "Chemical Engineering",
                      key: "che",
                    },
                    {
                      label: "Civil Engineering",
                      key: "civ",
                    },
                    {
                      label: "Computer Science and Engineering",
                      key: "cse",
                    },
                    {
                      label: "Electronics Engineering",
                      key: "ece",
                    },
                    {
                      label: "Electrical Engineering",
                      key: "eee",
                    },
                    {
                      label: "Department of Physics",
                      key: "phy",
                    },
                    {
                      label: "Department of Chemistry",
                      key: "chy",
                    },
                    {
                      label: "Material Science and Technology",
                      key: "mst",
                    },
                    {
                      label: "Department of Mathematical Sciences",
                      key: "mat",
                    },
                    {
                      label: "Mechanical Engineering",
                      key: "mec",
                    },
                    {
                      label: "Metallurgical Engineering",
                      key: "met",
                    },
                    {
                      label: "Mining Engineering",
                      key: "min",
                    },
                    {
                      label: "Pharmaceutical Engineering",
                      key: "phe",
                    },
                  ],
                },
                {
                  label: "Age Limit",
                  key: "ageLimit",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
              ],
            },
            {
              title: "PhD Stipend details",
              key: "compensationDetails",
              type: FormType.SECTION,
              formElements: [
                {
                  label: "Stipend Per Month",
                  key: "stipendPerMonth",
                  type: FormInputType.CURRENCY,
                  required: true,
                },
                {
                  label: "Accommodation",
                  key: "accommodation",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Relocation Bonus",
                  key: "relocationBonus",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Incentives/Perks/Bonus",
                  key: "incentives",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Will PPO be provided after internship based on performance?",
                  key: "provisionForPPO",
                  type: FormInputType.SWITCH_INPUT,
                  required: false,
                },
                {
                  label: "Tentative CTC for the PPO",
                  key: "tentativeCTC",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                  visible: {
                    props: ["[internshipDescription]-[phd]-[compensationDetails]-[provisionForPPO]"],
                    validator(arg0) {
                      if (arg0[0] == true) {
                        return true;
                      }
                      return false;
                    },
                  }
                },
              ],
            },
          ],
        },
        {
          title: "",
          key: "barch",
          type: FormType.SECTION,
          visible: {
            props: ["[internshipDescription]-[courses]"],
            validator: (eligibilityArray: Array<string>) => {
              const eligibility = eligibilityArray[0];
              if (!eligibility) return false;
              return eligibility.includes("barch") ? true : false;
            },
          },
          formElements: [
            {
              title: "B.Arch Eligibility Criteria",
              key: "eligibility",
              type: FormType.SECTION,
              formElements: [
                {
                  label: "CGPA",
                  key: "cgpa",
                  type: FormInputType.NUMBER,
                  required: true,
                  description: "CGPA must be a number between 0 - 10",
                  max: 10,
                  min: 0,
                  visible: {
                    props: ["[internshipDescription]-[isCGPACriteria]"],
                    validator(arg0) {
                      if (arg0[0] == true) {
                        return true;
                      }
                      return false;
                    },
                  }
                },
                {
                  label: "Age Limit",
                  key: "ageLimit",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
              ],
            },
            {
              title: "B.Arch Stipend Details",
              key: "compensationDetails",
              type: FormType.SECTION,
              formElements: [
                {
                  label: "Stipend Per Month",
                  key: "stipendPerMonth",
                  type: FormInputType.CURRENCY,
                  required: true,
                },
                {
                  label: "Accommodation",
                  key: "accommodation",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Relocation Bonus",
                  key: "relocationBonus",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Incentives/Perks/Bonus",
                  key: "incentives",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                },
                {
                  label: "Will PPO be provided after internship based on performance?",
                  key: "provisionForPPO",
                  type: FormInputType.SWITCH_INPUT,
                  required: false,
                },
                {
                  label: "Tentative CTC for the PPO",
                  key: "tentativeCTC",
                  type: FormInputType.SHORT_TEXT,
                  required: false,
                  visible: {
                    props: ["[internshipDescription]-[barch]-[compensationDetails]-[provisionForPPO]"],
                    validator(arg0) {
                      if (arg0[0] == true) {
                        return true;
                      }
                      return false;
                    },
                  }
                },
              ],
            },
          ],
        },
      ],
    },

    {
      title: "Medical Requirements(if any)",
      key: "medical",
      type: FormType.SECTION,
      formElements: [
        {
          label: "Color Blindness",
          key: "colorBlindness",
          type: FormInputType.SHORT_TEXT,
        },
        {
          label: "Visibility",
          key: "visibility",
          type: FormInputType.SHORT_TEXT,
        },
        {
          label: "Height",
          key: "height",
          type: FormInputType.SHORT_TEXT,
        },
        {
          label: "Weight",
          key: "weight",
          type: FormInputType.SHORT_TEXT,
        },
        {
          label: "BMI",
          key: "bmi",
          type: FormInputType.SHORT_TEXT,
        },
        {
          label: "Others",
          key: "others",
          type: FormInputType.SHORT_TEXT,
        },
      ],
    },

    {
      label: "Selection Process",
      key: "selectionProcess",
      required: true,
      type: FormInputType.CHECKBOX,
      options: [
        {
          label: "Shortlist from resumes",
          key: "shortlistFromResume",
        },
        {
          label: "Written Test",
          key: "writtenTest",
        },
        {
          label: "Online Test",
          key: "onlineTest",
        },
        {
          label: "Group Discussion",
          key: "gd",
        },
        {
          label: "Personal Interview",
          key: "personalInterview",
        },
      ],
    },
    {
      label: "Campus process mode",
      required: true,
      key: "processMode",
      type: FormInputType.RADIO,
      options: [
        {
          label: "Virtual",
          description: "All Processes are conducted online",
          key: "virtual",
        },
        {
          label: "Offline",
          description: "All processes are conducted in campus",
          key: "offline",
        },
        {
          label: "Hybrid",
          description:
            "Some processes is conducted in online mode and some in campus",
          key: "hybrid",
        },
        {
          label: "Undecided",
          key: "undecided",
        },
      ],
    },
  ],
};

export default IAFSchema;
