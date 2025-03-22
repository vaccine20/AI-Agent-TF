
export const getServerUrl = () => {
  return process.env.GATSBY_API_URL || "/api";
};

const refreshToken = async () => {
  const body = {
    'token': getLocalStorage('kai-token', false)
  };

  const response = await fetch(`${getServerUrl()}/token`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  
  return data.data;
}

let isAlertShown = false;

export const baseFetch = async (endpoint: string, method: string = 'GET', body?: any): Promise<any> => {
  const url = `${getServerUrl()}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getLocalStorage('kai-token', false)}`
  };

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) })
  };

  const response = await fetch(url, options);

  const data = await response.json();

  if (data.detail?.message === 'Invalid token') {
    if (!isAlertShown) {
      isAlertShown = true;
      alert('사용자 정보가 올바르지 않습니다. 다시 로그인해주세요.');
      window.location.replace('/');
    }
    return [];
  }

  if (data.detail?.message === 'Token has expired') {
    if (!isAlertShown) {
      isAlertShown = true;
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      window.location.replace('/');
    }
    return [];
  }

  if (data.detail?.message === 'Token is about to expire') {
    const new_token = await refreshToken();
    console.log('new ====> ', new_token);
    localStorage.setItem('kai-token', new_token);
    return baseFetch(endpoint, method, body);
  }

  return data.data;

}

export function setCookie(name: string, value: any, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
export function setLocalStorage(
  name: string,
  value: any,
  stringify: boolean = true
) {
  if (stringify) {
    localStorage.setItem(name, JSON.stringify(value));
  } else {
    localStorage.setItem(name, value);
  }
}

export function getLocalStorage(name: string, stringify: boolean = true): any {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(name);
    try {
      if (stringify) {
        return JSON.parse(value!);
      } else {
        return value;
      }
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
}

export function fetchJSON(
  url: string | URL,
  payload: any = {},
  onSuccess: (data: any) => void,
  onError: (error: IStatus) => void,
  onFinal: () => void = () => {}
) {
  return fetch(url, payload)
    .then(function (response) {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status,
          response
        );
        response.json().then(function (data) {
          console.log("Error data", data);
        });
        onError({
          status: false,
          message:
            "Connection error " + response.status + " " + response.statusText,
        });
        return;
      }
      return response.json().then(function (data) {
        onSuccess(data);
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
      onError({
        status: false,
        message: `There was an error connecting to server. (${err}) `,
      });
    })
    .finally(() => {
      onFinal();
    });
}

export function eraseCookie(name: string) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export function truncateText(text: string, length = 50) {
  if (text.length > length) {
    return text.substring(0, length) + " ...";
  }
  return text;
}

export const fetchVersion = () => {
  const versionUrl = getServerUrl() + "/version";
  return fetch(versionUrl)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
};
