"use client";
import { Navbar, ScrollArea, createStyles, Paper } from "../components";
import { TablerIcon } from "@tabler/icons";

import { UserButton } from "./UserButton";
import DemoNavSchema from "../../demo/DemoNavSchema";
import React from "react";
import { useSearchParams, usePathname } from "next/navigation";
import ThemeToggle from "../theme/ThemeToggle";
import SidebarRenderer from "./SidebarRenderer";
import { Sidebar } from "../../types/Sidebar.types";

//Search Bar
import { SearchBarDesktop } from "./SearchBar";

//Image
import Image from "next/image";
import { Typography } from "../components";

// Logo
import { ASSETS } from "../../constants/assets";
import { useRouter } from "next/navigation";

export interface mockdata {
  label: String;
  icon: TablerIcon;
  initiallyopened: boolean;
  links: Array<{} | {} | {}>;
}
const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[9]
        : theme.colors.grape[0],
    paddingBotton: 0,
  },
  topNav: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.white,
  },
  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },
  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `3px solid grey`,
  },
}));

export function NavbarNested({
  schema,
  children,
  ref,
}: {
  schema: Sidebar;
  children: React.ReactNode;
  ref: React.MutableRefObject<HTMLDivElement>;
}) {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <div>
      <Paper shadow={"md"} className={classes.topNav}>
        <div className="p-3 flex flex-row justify-between align-middle">
          <div
            className="flex gap-4 cursor-pointer"
            style={{ alignItems: "center" }}
            onClick={() => {
              router.replace("/", {
                forceOptimisticNavigation: true,
              });
            }}
          >
            <Image
              src={ASSETS.iitbhu_logo}
              alt="IIT-BHU logo"
              width={40}
              height={40}
            />
            <Typography order={3}>
              Training and Placement Cell IIT BHU
            </Typography>
          </div>
          <div className="flex align-middle">
            {/* <SearchBarDesktop /> */}
            <ThemeToggle />
          </div>
        </div>
      </Paper>
      <div className="flex h-full">
        {/* <Navbar
          className={`h-[91vh] ${classes.navbar}`}
          p="xs"
          width={{ base: 300 }}
        >
          <Navbar.Section grow className={classes.links} component={ScrollArea}>
            <div className={classes.linksInner}>
              {DemoNavSchema.elements.map((sidebarElement, index) => (
                <div key={`Sidebar_${index}`}>
                  <SidebarRenderer basePath="/" element={sidebarElement} />
                </div>
              ))}
            </div>
          </Navbar.Section>
          <Navbar.Section
            className={`${classes.footer}`}
            style={{ width: "111%" }}
          >
            <UserButton
              image="https://img.collegepravesh.com/2015/09/IIT-BHU-Logo.png"
              name="TPC IIT-BHU"
              email="tpo@iitbhu.ac.in"
            />
          </Navbar.Section>
        </Navbar> */}
        <div className="flex-col w-full h-[calc(100vh-70px)] overflow-scroll overflow-x-hidden p-5 m-5">
          <div id="top" ref={ref}></div>
          {children}
        </div>
      </div>
    </div>
  );
}
