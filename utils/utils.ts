import { APIRequestContext, expect } from "@playwright/test";

export const validateRepoStatusCode = async (
  apiContext: APIRequestContext,
  username: string,
  repoName: string,
  expectedCode: number
) => {
  const response = await apiContext.get(`/repos/${username}/${repoName}`);

  const responseStatusCode = response.status();
  await expect(responseStatusCode).toEqual(expectedCode);
};
