import { NextResponse } from "next/server";

export const config = {
  matcher: "/numia/:path*",
};

export async function middleware(request) {
  try {
    const url = new URL(request.url);

    const parts = url.pathname.replace("/numia/", "").split("/");
    const [network, ...path] = parts;
    console.log(network);
    const networkKey = network.toUpperCase();
    const apiKey = process.env[`NUMIA_API_KEY`];
    const nextUrl = new URL(`https://${network}.numia.xyz/${path.join("/")}`);
    console.log(`https://${network}.numia.xyz/${path.join("/")}`);
    console.log(nextUrl);
    nextUrl.search = url.search;

    const result = await fetch(nextUrl, {
      headers: {
        authorization: `Bearer ${apiKey}`,
      },
    });

    if (!result.ok) {
      console.error(`Error: Failed to fetch data from ${nextUrl}`);
      console.error(`Response Status: ${result.status}`);
      console.error(`Response Text: ${await result.text()}`);
    }

    return new NextResponse(result.body);
  } catch (error) {
    return new NextResponse(
      "The middleware was not able to load the data and got an error response from the server."
    );
  }
}
