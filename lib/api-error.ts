export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

export async function toApiError(response: Response): Promise<ApiError> {
  let message = response.statusText || "Request failed";
  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) message = body.message[0];
    else if (typeof body.message === "string") message = body.message;
  } catch {
    /* body was not json */
  }
  return new ApiError(message, response.status);
}
