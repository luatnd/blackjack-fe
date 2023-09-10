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

export async function get() {

}

export async function post(uri: string, option: RequestInit) {
  const url = API_BASE_URL + uri
  const extraOption = {
    "method": "POST",
    // "mode": "cors",
    // "credentials": "include"
  }
  const shallowMergedOption = {...defaultOption, ...extraOption, ...option}
  const r = await fetch(url, shallowMergedOption);

  // handle status codes
  return handleResponse(r)
}

export async function patch() {

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

  return {
    ok: true,
    body,
  }
}
