"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import firebase from "firebase/compat/app";
import { getAuth, Auth, User } from "firebase/auth";
import { FIREBASE_CONFIG } from "../constants/firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setCurrentUser } from "../store/states/userSlice";
import { PUBLIC_ROUTES } from "../routes";
import axios from "axios";
import { updateCompanyRecruiterId } from "../store/states/idStore";
import Spinner from "../components/spinner/Spinner";
import { stripBasePath } from "../constants/basePath";

if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}
const firebaseAuth = getAuth(firebase.app());

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loginChecked, setLoginChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const rawPathName: string = usePathname() || "";
  const pathName = stripBasePath(rawPathName);

  const isPublicRoute = (path: string): boolean => path in PUBLIC_ROUTES;

  const getIDToken = async (user: User) => {
    try {
      const idToken = await user.getIdToken(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_AUTH_BACKEND}/api/token/verify`,
        { headers: { token: idToken } }
      );

      if (!response.data.error && response.data?.data) {
        dispatch(
          updateCompanyRecruiterId({
            companyId: response.data.data["company"],
            recruiterId: response.data.data["_id"],
          })
        );
        dispatch(setCurrentUser({ user }));
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      setLoggedIn(false);
    } finally {
      setLoginChecked(true);
    }
  };

  useEffect(() => {
    if (isPublicRoute(pathName)) {
      setLoading(false);
      return;
    }

    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        await getIDToken(user);
      } else {
        dispatch(setCurrentUser({ user: null }));
        setLoggedIn(false);
        setLoginChecked(true);
      }
    });

    return () => unsubscribe();
  }, []); // runs once on mount

  // Redirect after login check completes
  useEffect(() => {
    if (!loginChecked) return;

    if (!loggedIn && !isPublicRoute(pathName)) {
      router.replace("/register/recruiter");
    } else if (loggedIn && isPublicRoute(pathName)) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [loginChecked, loggedIn]);

  // If path changes to a public route, stop the spinner
  useEffect(() => {
    if (isPublicRoute(pathName)) {
      setLoading(false);
    }
  }, [pathName]);

  return (
    <>
      {loading ? (
        <div className="h-[100vh] w-full">
          <Spinner />
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}