import { test, expect } from "@playwright/test";
import {
  githubAPIContext,
  githubAPIContextBad,
  setupGithubAPIContext,
  setupGithubAPIContextBad,
} from "../utils/api-context";
import { validateRepoStatusCode } from "../utils/utils";
import * as dotenv from "dotenv";

//define env vars
dotenv.config();
const repoName = process.env.GITHUB_TEST_REPO_NAME || "";
const username = process.env.GITHUB_TEST_USERNAME || "";

test.beforeAll(async ({ playwright }) => {
  await setupGithubAPIContext(playwright);
  await setupGithubAPIContextBad(playwright);
});

test("should create and delete a github repository via api", async () => {
  //create repo
  const postCreateResponse = await githubAPIContext.post(`/user/repos`, {
    data: {
      name: repoName,
      description: "hello this is a test",
      homepage: "https://github.com",
      private: true,
    },
  });

  await expect(postCreateResponse).toBeOK();

  //validate creation
  await validateRepoStatusCode(githubAPIContext, username, repoName, 200);

  //delete repo
  const postDeleteResponse = await githubAPIContext.delete(
    `/repos/${username}/${repoName}`
  );

  await expect(postDeleteResponse).toBeOK();

  //validate deletion
  await validateRepoStatusCode(githubAPIContext, username, repoName, 404);
});

test.afterAll(async ({}) => {
  // Dispose all responses.
  await githubAPIContext.dispose();
  await githubAPIContextBad.dispose();
});
