import { test, expect, APIRequestContext } from "@playwright/test";

import * as dotenv from "dotenv";

dotenv.config();

let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
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
});

test("should create and delete a github repository via api", async () => {
  //create repo
  const postCreateResponse = await apiContext.post(`/user/repos`, {
    data: {
      name: process.env.GITHUB_TEST_REPO_NAME,
      description: "hello this is a test",
      homepage: "https://github.com",
      private: true,
    },
  });

  await expect(postCreateResponse).toBeOK();

  //validate creation
  const getCreateResponse = await apiContext.get(
    `/repos/${process.env.GITHUB_TEST_USERNAME}/${process.env.GITHUB_TEST_REPO_NAME}`
  );

  const getCreateResponseStatus = getCreateResponse.status();
  await expect(getCreateResponseStatus).toEqual(200);

  //delete repo
  const postDeleteResponse = await apiContext.delete(
    `/repos/${process.env.GITHUB_TEST_USERNAME}/${process.env.GITHUB_TEST_REPO_NAME}`
  );

  await expect(postDeleteResponse).toBeOK();

  //validate deletion
  const getDeleteResponse = await apiContext.get(
    `/repos/${process.env.GITHUB_TEST_USERNAME}/${process.env.GITHUB_TEST_REPO_NAME}`
  );

  const getDeleteResponseStatus = getDeleteResponse.status();
  await expect(getDeleteResponseStatus).toEqual(404);
});

test.afterAll(async ({}) => {
  // Dispose all responses.
  await apiContext.dispose();
});
