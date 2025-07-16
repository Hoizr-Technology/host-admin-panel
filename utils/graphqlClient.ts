import { getSdk } from "@/generated/graphql";
import { gql, GraphQLClient } from "graphql-request";

if (!process.env.NEXT_PUBLIC_SERVER_BASE_URL) {
  throw new Error("Endpoint URL is not defined.");
}

const TOKEN_REFRESH_QUERY = gql`
  mutation TokenRefresh {
    tokensRefresh
  }
`;

const endpoint = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/graphql`;

const graphQLClient = new GraphQLClient(endpoint, {
  credentials: "include",
  fetch: async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    let response = await fetch(input, init);

    if (response.status === 401) {
      try {
        // Get new refresh tokens
        const client = new GraphQLClient(endpoint, { credentials: "include" });
        const resp = await client.rawRequest(
          TOKEN_REFRESH_QUERY,
          {},
          init?.headers
        );

        // Clone the response and set new headers
        const responseClone = new Response(response.body, response);
        resp.headers.forEach((value, key) => {
          responseClone.headers.set(key, value);
        });

        response = responseClone;
      } catch (error) {
        console.error("Error refreshing tokens:", error);
        // Redirect to login page if the user is not already there
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }
      }
    }

    return response;
  },
});

export const sdk = getSdk(graphQLClient);
