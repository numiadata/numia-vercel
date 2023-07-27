import { NextResponse } from "next/server";

export const config = {
  matcher: "/numia/:path*",
};
/**
 * /numia/osmosis/rpc/block -> https://osmosis-rpc.numia.xyz/block
 * /numia/osmosis/lcd/cosmos/base/tendermint/v1beta1/blocks/10704303 -> https://osmosis-lcd.numia.xyz/cosmos/base/tendermint/v1beta1/blocks/10704303
 * /numia/osmosis/height -> https://osmosis.numia.xyz/height
 */
export async function middleware(request) {
  try {
    const apiKey = process.env[`NUMIA_API_KEY`];
    if (!apiKey) {
      return new NextResponse(
        JSON.stringify({
          error: "Environment is missing the NUMIA_API_KEY variable.",
        }),
        { status: 401 }
      );
    }
    const url = new URL(request.url);

    const parts = url.pathname.replace("/numia/", "").split("/");
    const [subdomain, ...restPath] = parts;

    const nextUrl = new URL(
      `https://${subdomain}.numia.xyz/${restPath.join("/")}`
    );
    nextUrl.search = url.search;
    // console.log("->", nextUrl.toString());

    const result = await fetch(nextUrl, {
      method: request.method,
      body: request.body,
      headers: {
        authorization: `Bearer ${apiKey}`,
        ...request.headers,
      },
    });

    return new NextResponse(result.body, { headers: result.headers });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error:
          "The middleware was not able to load the data and got an error response from the server.",
      }),
      { status: 500 }
    );
  }
}
