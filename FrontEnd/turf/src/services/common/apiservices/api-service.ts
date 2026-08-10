import config from "../../../api/base-url";

export class ApiService {

  async sendDirectRequest(apipath: string, payload = {}) {
    if (!apipath) throw new Error(`Invalid API path: ${apipath}`);

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/${apipath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return { ...data, errorMsg: data.data.errorMsg || "Request failed" };
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
    }
  }

  async sendAuthRequest(apipath: string, payload = {}, method: string) {
    if (!apipath) throw new Error(`Invalid API path: ${apipath}`);
    if (!method) throw new Error("HTTP method is required");

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token is missing. Please login.");
      window.location.href = "/login";
      throw new Error("Authentication token is missing");
    }

    try {
      const options: RequestInit = {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        } as HeadersInit,
      };

      if (method !== "GET" && payload) {
        const headers = options.headers as Record<string, string>;
        if (payload instanceof FormData) {
          options.body = payload;
        } else {
          headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(payload);
        }
      }

      const response = await fetch(`${config.apiBaseUrl}/api/${apipath}`, options);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          alert(data.message || "Unauthorized. Please login again.");
          window.location.href = "/login";
          throw new Error("Unauthorized. Please login again.");
        } else if (response.status === 403) {
          localStorage.removeItem("token");
          alert(data.message || "Access denied. Insufficient permissions.");
          window.location.href = "/login";
          throw new Error("Access denied. Insufficient permissions.");
        } else {
          alert(data.message || "Request failed");
          return { ...data, errorMsg: data.data.errorMsg || "Request failed" };
        }
      }

      return data;
    } catch (error: any) {
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
    }
  }

}