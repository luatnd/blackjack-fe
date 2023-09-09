// for "sharing" "reactive" "state" with other components
// for "non-sharing" "reactive" "state" => use React state instead
// we don't need to put non-reactive data into store
import {makeAutoObservable} from "mobx"
import {Auth} from "./model";
import {isClientDevMode} from "@/utils/env";


class AuthStore {
  currentAuth: Auth | undefined = undefined

  constructor() {
    makeAutoObservable(this)
  }

  get isLoggedIn() {
    return this.currentAuth !== undefined
  }

  get userId() {
    return this.currentAuth?.user.id
  }

  setState(k: any, v: any) {
    // @ts-ignore
    this[k] = v
  }
}

export const authStore = new AuthStore();


// debug
if (isClientDevMode) {
  //@ts-ignore
  window.tmp__authStore = authStore
}
