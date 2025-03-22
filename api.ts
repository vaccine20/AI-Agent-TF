import { getServerUrl } from "../../utils";

// added by sun
export class LoginAPI {
  private getBaseUrl(): string {
    return getServerUrl();
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json"
    };
  }

  login = async ( user: { email : string, password: string } ) => {

    const account = {
      email: user.email,
      password: user.password
    }
    
    const response = await fetch(`${this.getBaseUrl()}/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(account)
    });
    const data = await response.json();

    return data;
  }
}

export const loginAPI = new LoginAPI();
