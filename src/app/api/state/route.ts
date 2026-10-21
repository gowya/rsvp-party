import { getPublicState, isToken, json } from "@/server/state";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  return json(await getPublicState(isToken(token) ? token : null));
}
