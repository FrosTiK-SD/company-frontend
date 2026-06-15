"use client";
import React from "react";
import { ASSETS } from "../../constants/assets";
import { Avatar } from "@mantine/core";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { IconBrandLinkedin } from "../components";
export default function Footer() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const handleCredits = () => {
    router.replace("/credits");
  };
  const handleLinkedin = () => {
    router.replace("https://www.linkedin.com/company/tpoiitbhu/");
  };
  return (
    <div className="flex justify-center items-center flex-col mt-8">
      <div className="flex mb-7 md:flex-row flex-col w-full justify-evenly items-center border-t border-t-[#3F3E45] p-4">
        <Avatar
          src={ASSETS.iitbhu_logo}
          size="xl"
          alt="IIT BHU"
          className="mt-4 mb-2"
        />
        <div>
        <Typography className="mt-10 md:mt-0 text-center md:text-left mr-3 m-auto">
          <strong className="font-bold">TRAINING AND PLACEMENT CELL</strong>
          <br />
          Training and Placement Cell, Near Administrative Office
          <br />
          Indian Institute of Technology (BHU), Varanasi - 221005
          <br />
          tpo@itbhu.ac.in | +91-542-7165958 | +91-542-2369162
          <br />
        </Typography>
        </div>
      </div>
      <div style={{letterSpacing:"3px",fontWeight:"500"}}>DEVELOPED BY</div>
      <div  style={{letterSpacing:"5px",fontWeight:"300",cursor:"pointer"}} onClick={handleCredits}>
        TEAM FROSTIK
      </div>
      <div className="border-t w-full mt-2 flex justify-between items-center md:flex-row flex-col pt-2 border-t-[#3F3E45] p-3">
        <p className="font-poppins font-normal  text-[10px] leading-[27px] text text-center ">
          Copyright Ⓒ{currentYear} Training and Placement Cell IIT (BHU)
          Varanasi. All Rights Reserved.
        </p>
        <IconBrandLinkedin className="cursor-pointer" onClick={handleLinkedin}/>
      </div>
    </div>
  );
}
