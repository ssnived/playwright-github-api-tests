import { APIRequestContext } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

export let githubAPIContext: APIRequestContext;
export let githubAPIContextBad: APIRequestContext;

export const setupGithubAPIContext = async (playwright: any) => {
  githubAPIContext = await playwright.request.newContext({
    // All requests we send go to this API endpoint.
    baseURL: process.env.GITHUB_BASE_URL,
    extraHTTPHeaders: {
      // We set this header per GitHub guidelines.
      Accept: "application/vnd.github.v3+json",
      // Add authorization token to all requests.
      // Assuming personal access token available in the environment.
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
    },
  });
  return githubAPIContext;
};

export const setupGithubAPIContextBad = async (playwright: any) => {
  githubAPIContextBad = await playwright.request.newContext({
    // All requests we send go to this API endpoint.
    baseURL: "https://badurl.com",
    extraHTTPHeaders: {
      // We set this header per GitHub guidelines.
      Accept: "application/vnd.github.v3+json",
      // Add authorization token to all requests.
      // Assuming personal access token available in the environment.
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
    },
  });

  return githubAPIContextBad;
};
