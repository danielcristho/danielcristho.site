import type { APIRoute } from 'astro';
import { makeUmamiRequest } from '../../../utils/umami-auth';

export const GET: APIRoute = async ({ params, request }) => {
    const { slug } = params;

    try {
    const websiteId = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;
    
    if (!websiteId || !slug) {
        return new Response(JSON.stringify({ error: 'Missing configuration' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const startAt = startDate.getTime();
    const endAt = endDate.getTime();

    // Fetch page views for specific URL from Umami API
    const response = await makeUmamiRequest(
        `/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}&url=/blog/${slug}/`
    );

    if (!response || !response.ok) {
        return new Response(JSON.stringify({ 
            views: 0,
            slug: slug,
            error: 'Could not fetch page view data'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({ 
        views: data.pageviews?.value || 0,
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
        console.error('Error fetching page views:', error);
        
        return new Response(JSON.stringify({ 
        views: 0,
        slug: slug,
        error: 'Could not fetch page view data'
        }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
    }
};

export function getStaticPaths() {
    return [];
}