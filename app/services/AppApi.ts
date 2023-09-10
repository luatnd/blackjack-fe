import {authStore} from "@/(EmptyLayout)/auth/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const defaultOption = {
  "headers": {
    "accept": "*/*",
    "cache-control": "no-cache",
    "content-type": "application/json",
  },
}

type AppResponse = {
  ok: boolean,
  errors?: any, // key: error_code
  body: any,
}

export async function get(uri: string, option: RequestInit = {}, skipAuth = false) {
  const url = API_BASE_URL + uri
  const extraOption = {"method": "GET"}
  const shallowMergedOption = {...defaultOption, ...extraOption, ...option}
  if (!skipAuth) {
    applyBearerAuthOpt(shallowMergedOption)
  }
  const r = await fetch(url, shallowMergedOption);

  // handle status codes
  return handleResponse(r)
}

export async function post(uri: string, option: RequestInit = {}, skipAuth = false) {
  const url = API_BASE_URL + uri
  const extraOption = {"method": "POST"}
  const shallowMergedOption = {...defaultOption, ...extraOption, ...option}
  if (!skipAuth) {
    applyBearerAuthOpt(shallowMergedOption)
  }
  const r = await fetch(url, shallowMergedOption);

  // handle status codes
  return handleResponse(r)
}

export async function patch(uri: string, option: RequestInit = {}, skipAuth = false) {
  const url = API_BASE_URL + uri
  const extraOption = {"method": "PATCH"}
  const shallowMergedOption = {...defaultOption, ...extraOption, ...option}
  if (!skipAuth) {
    applyBearerAuthOpt(shallowMergedOption)
  }
  const r = await fetch(url, shallowMergedOption);

  // handle status codes
  return handleResponse(r)
}

async function handleResponse(r: Response, type = 'json'): Promise<AppResponse> {
  const body = await r.json()
  console.log('{handleResponse} body: ', body);

  if (r.status >= 400) {
    return {
      ok: false,
      errors: body.errors,
      body: body,
    }
  }

  if (body.errorCode) {
    return {
      ok: false,
      errors: [{[body.errorCode]: body.message}],
      body: body,
    }
  }

  return {
    ok: true,
    body,
  }
}

function applyBearerAuthOpt(req: any) {
  if (req.headers) {
    req.headers['Authorization'] = 'Bearer ' + authStore.currentAuth?.token
  }
}
