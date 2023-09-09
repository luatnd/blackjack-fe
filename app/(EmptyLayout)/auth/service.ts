// biz layer: biz logic and hooks

import * as React from "react";
import {useCallback, useState} from "react";
// import {useRouter} from "next/router";
import {useRouter} from 'next/navigation';
import {Auth} from "./model";
import {authStore} from "./store";
import {AuthDAO, AuthDataSource} from "./dao";
import {SimpleTaskManager} from "@/services/SimpleTaskManager";
import {isClientDevMode} from "@/utils/env";

export function useLoginInfo(): {
  email: string,
  setEmail: (_: string) => void,
  pw: string,
  setPw: (_: string) => void,
} {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  return {
    email, setEmail,
    pw, setPw,
  }
}

export function useLoginHandler() {
  const router = useRouter();

  const login = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')?.toString() || "";
    const password = data.get('password')?.toString() || "";

    console.debug('{logging in} email, password: ', email, password);
    const auth = await loginByUsernamePw(email, password)
    if (auth) {
      authStore.setState('currentAuth', auth);
      router.push('/')
    } else {
      console.log('{error} cannot login');
    }
  }, [router]);

  const logMeOut = useCallback(() => {
    logout().then(() => {
      authStore.setState('currentAuth', undefined);
    })
  }, [])

  const skipLogin = useCallback(() => {
    logMeOut()
    router.push('/')
  }, [router, logMeOut])


  return {
    login,
    skipLogin,
  }
}
export function useLogout() {
  const logMeOut = useCallback(() => {
    logout().then(() => {
      authStore.setState('currentAuth', undefined);
    })
  }, [])

  return {
    logout: logMeOut,
  }
}

// fake login function
async function loginByUsernamePw(un: string, pw: string): Promise<Auth | undefined> {
  /*
  Demo logic:
    if user is not exist in our system
      => register and log them in
    else: login with username (without password)
   */
  let auth = await fetchUser(un, pw);
  AuthCache.set(auth)
  if (auth) return auth

  auth =  await register(un, pw)
  AuthCache.set(auth)
  return auth
}

export const logOutTaskManager = new SimpleTaskManager();
async function logout() {
  AuthCache.clean()
  await logOutTaskManager.flush();
}
if (isClientDevMode) {
  //@ts-ignore
  window.tmp__logOutTaskManager = logOutTaskManager
}


// Register with backend
async function register(un: string, pw: string): Promise<Auth | undefined> {
  const dao = new AuthDAO(AuthDataSource.Local)
  const u = await dao.createUser(un, pw)

  if (!u) return undefined
  return {
    token: "",
    refresh_token: "",
    user: u,
  }
}

// fetch from backend
async function fetchUser(un: string, pw: string): Promise<Auth | undefined> {
  const dao = new AuthDAO(AuthDataSource.Local)
  const u = await dao.getUser(un, pw)

  if (!u) return undefined
  return {
    token: "",
    refresh_token: "",
    user: u,
  }
}

export function restoreAuthFromCache() {
  authStore.setState('currentAuth', AuthCache.get());
}


/*
Cache the authed user in localstorage,
To restore after user refresh the page
for avoiding redundant re-login requests
 */
class AuthCache {
  private static KEY: string = 'AuthCache';
  static set(auth: Auth | undefined) {
    if (!localStorageSupported()) return;

    // TODO: encrypt data
    localStorage.setItem(AuthCache.KEY, JSON.stringify(auth));
  }

  static get(): Auth | undefined {
    if (!localStorageSupported()) return;

    let d = localStorage.getItem(AuthCache.KEY);
    try {
      return JSON.parse(d ?? "")
    } catch (e) {
      return undefined
    }
  }

  static clean() {
    AuthCache.set(undefined)
  }
}

function localStorageSupported(): boolean {
  if (typeof localStorage === 'undefined') return false
  if (localStorage.getItem("t")) return false

  // console.log('{set} localStorage: ', window.localStorage);
  // console.log('{set} localStorage.setItem: ', window.localStorage.setItem);

  return true
}
