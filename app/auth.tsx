"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const router   = useRouter();
  const dispatch = useDispatch();

  const [loggedIn,     setLoggedIn]     = useState<boolean>(false);
  const [loginChecked, setLoginChecked] = useState<boolean>(false);
  const [loading,      setLoading]      = useState<boolean>(true);

  // usePathname() already strips basePath — stripBasePath() is a safe no-op
  const rawPathName = usePathname() || "";
  const pathName    = stripBasePath(rawPathName);

  const isPublicRoute = (path: string): boolean => Boolean(PUBLIC_ROUTES[path]);

  const getIDToken = async (user: User) => {
    try {
      const idToken  = await user.getIdToken(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_AUTH_BACKEND}/api/token/verify`,
        { headers: { token: idToken } }
      );
      if (!response.data.error && response.data?.data) {
        dispatch(updateCompanyRecruiterId({
          companyId:   response.data.data["company"],
          recruiterId: response.data.data["_id"],
        }));
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
    // Public routes skip Firebase entirely — no auth needed
    if (isPublicRoute(pathName)) {
      setLoading(false);
      setLoginChecked(true);  // ← prevent redirect logic from firing
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
  }, [pathName]);  // ← re-run when path changes, not just on mount

  // Redirect logic — only runs after Firebase has responded
  useEffect(() => {
    if (!loginChecked) return;  // wait for Firebase

    if (!loggedIn && !isPublicRoute(pathName)) {
      // Not logged in, on protected route → go to register
      router.replace("/register/recruiter");
    } else if (loggedIn && isPublicRoute(pathName)) {
      // Logged in, on public route → go to dashboard
      router.replace("/");
    } else {
      // All good — show the page
      setLoading(false);
    }
  }, [loginChecked, loggedIn, pathName]);

  console.log("[AuthWrapper]", {
    rawPathName,
    pathName,
    isPublic: isPublicRoute(pathName),
    loginChecked,
    loggedIn,
    loading,
  });

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