"use client";
import React from "react";
import { Card } from "../components";
import { Typography } from "@material-tailwind/react";
import {
  IconBrandGithubFilled,
  IconBrandLinkedin,
  IconBrandGmail,
} from "../components";
import Link from "next/link";
import { useRouter } from "next/navigation";
export interface CreditsDataType {
  [key: string]: string;
}

export default function Team(props: CreditsDataType) {
  const router = useRouter();
  return (
    <div className="flex justify-center h-[480px]">
      <Card
        className="flex flex-col justify-center cursor-pointer w-80 p-4 gap-4 h-[480px]"
        shadow="sm"
        radius="lg"
        withBorder
      >
        <div className="flex justify-center p-4">
          <img
            src={props.imgURL}
            alt="Your Image"
            className="w-48 h-48 rounded-full object-cover"
          />
        </div>
        <div>
          <Typography className="flex justify-center" variant="h3">
            {props.name}
          </Typography>
          <Typography className="flex justify-center">{props.title}</Typography>
          <div className="flex flex-row justify-center">
            <Link href={props.githubURL}>
              <IconBrandGithubFilled className="pr-3" size={40} />
            </Link>
            <Link href={props.linkedinURL}>
              <IconBrandLinkedin className="pr-3" size={40} />
            </Link>
            <Link href={`mailto:${props.mailID}`}>
              <IconBrandGmail className="pr-3" size={40} />
            </Link>
          </div>
          <Typography className="flex justify-center p-4 text-center">
            {props.description}
          </Typography>
        </div>
      </Card>
    </div>
  );
}
