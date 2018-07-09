import fetch from "isomorphic-fetch"
import { notification } from "antd"

// const apiURL = process.env.REACT_APP_API_URL

export function callApi(endpoint, method = "get", body) {
  let headers = { "content-type": "application/json", Authorization: "" }
  if (localStorage.getItem("access_token")) {
    headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`
  }

  return fetch(endpoint, {
    headers: headers,
    method,
    body: JSON.stringify(body)
  }).then(response => {
    if (!response.ok) {
      //todo: add error logging. sentry?
      notification["error"]({
        message: "Error ",
        description:
          "Error status: " + response.status + " " + method + " " + endpoint
      })

      return Promise.reject(response)
    }
    if (response.status === 204) {
      return
    }
    return response.json()
  })
}
