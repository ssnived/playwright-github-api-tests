import { test, expect, APIRequestContext } from "@playwright/test";
import {
  githubAPIContext,
  githubAPIContextBad,
  setupGithubAPIContext,
  setupGithubAPIContextBad,
} from "../utils/api-context";

import * as dotenv from "dotenv";

dotenv.config();

test.beforeAll(async ({ playwright }) => {
  await setupGithubAPIContext(playwright);
  await setupGithubAPIContextBad(playwright);
});

test("should create and delete a github repository via api", async () => {
  //create repo
  const postCreateResponse = await githubAPIContext.post(`/user/repos`, {
    data: {
      name: process.env.GITHUB_TEST_REPO_NAME,
      description: "hello this is a test",
      homepage: "https://github.com",
      private: true,
    },
  });

  await expect(postCreateResponse).toBeOK();

  //validate creation
  const getCreateResponse = await githubAPIContext.get(
    `/repos/${process.env.GITHUB_TEST_USERNAME}/${process.env.GITHUB_TEST_REPO_NAME}`
  );

  const getCreateResponseStatus = getCreateResponse.status();
  await expect(getCreateResponseStatus).toEqual(200);

  //delete repo
  const postDeleteResponse = await githubAPIContext.delete(
    `/repos/${process.env.GITHUB_TEST_USERNAME}/${process.env.GITHUB_TEST_REPO_NAME}`
  );

  await expect(postDeleteResponse).toBeOK();

  //validate deletion
  const getDeleteResponse = await githubAPIContext.get(
    `/repos/${process.env.GITHUB_TEST_USERNAME}/${process.env.GITHUB_TEST_REPO_NAME}`
  );

  const getDeleteResponseStatus = getDeleteResponse.status();
  await expect(getDeleteResponseStatus).toEqual(404);
});

test.afterAll(async ({}) => {
  // Dispose all responses.
  await githubAPIContext.dispose();
});
