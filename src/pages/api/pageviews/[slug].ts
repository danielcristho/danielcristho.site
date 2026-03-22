import type { APIRoute } from "astro";
import { makeUmamiRequest } from "../../../utils/umami-auth";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return new Response(JSON.stringify({ pageviews: 0 }), { status: 400 });
  }

  try {
    const websiteId = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;
    if (!websiteId) {
      return new Response(JSON.stringify({ pageviews: 0 }), { status: 200 });
    }

    const url = `/api/websites/${websiteId}/stats?startAt=0&endAt=${Date.now()}&url=/blog/${slug}`;
    const response = await makeUmamiRequest(url);

    if (!response || !response.ok) {
      return new Response(JSON.stringify({ pageviews: 0 }), { status: 200 });
    }

    const data = await response.json();
    const pageviews = data?.pageviews?.value ?? 0;

    return new Response(JSON.stringify({ pageviews }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching pageviews:", error);
    return new Response(JSON.stringify({ pageviews: 0 }), { status: 200 });
  }
};
