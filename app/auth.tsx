"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // ✅ removed useRouter

import firebase from "firebase/compat/app";
import { getAuth, User } from "firebase/auth";
import { FIREBASE_CONFIG } from "../constants/firebase";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../store/states/userSlice";
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
  }, []);

  useEffect(() => {
    if (!loginChecked) return;

    if (!loggedIn && !isPublicRoute(pathName)) {
      window.location.replace("/recruiter/register/recruiter");
    } else if (loggedIn && isPublicRoute(pathName)) {
      window.location.replace("/recruiter");
    } else {
      setLoading(false);
    }
  }, [loginChecked, loggedIn]);

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