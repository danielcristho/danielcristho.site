import type { APIRoute } from 'astro';
import { makeUmamiRequest } from '../../../utils/umami-auth';

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;
  
  try {
    const websiteId = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;
    
    if (!websiteId || !slug) {
      return new Response(JSON.stringify({ error: 'Missing configuration' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calculate date range for last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const startAt = startDate.getTime();
    const endAt = endDate.getTime();

    // Fetch read completion events from Umami API
    // This would track custom events for "read_completed" 
    const response = await makeUmamiRequest(
      `/api/websites/${websiteId}/events?startAt=${startAt}&endAt=${endAt}&url=/blog/${slug}/&event=read_completed`
    );

    if (!response || !response.ok) {
      return new Response(JSON.stringify({ 
        reads: 0,
        slug: slug,
        error: 'Could not fetch read completion data'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({ 
      reads: data.events?.length || 0,
      slug: slug,
      period: '30 days'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
    console.error('Error fetching read completion data:', error);
    
    return new Response(JSON.stringify({ 
      reads: 0,
      slug: slug,
      error: 'Could not fetch read completion data'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  const { slug } = params;
  
  try {
    const websiteId = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;
    
    if (!websiteId || !slug) {
      return new Response(JSON.stringify({ error: 'Missing configuration' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Track read completion event
    const response = await makeUmamiRequest(
      `/api/websites/${websiteId}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: `/blog/${slug}/`,
          event: 'read_completed',
          timestamp: Date.now()
        })
      }
    );

    if (!response || !response.ok) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Could not track read completion'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Read completion tracked'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error tracking read completion:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Could not track read completion'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export function getStaticPaths() {
  return [];
}