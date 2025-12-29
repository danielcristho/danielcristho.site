import type { APIRoute } from 'astro';
import { makeUmamiRequest } from '../../utils/umami-auth';

export const GET: APIRoute = async ({ request }) => {
    try {
    const websiteId = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;
    
    if (!websiteId) {
        return new Response(JSON.stringify({ error: 'Missing website ID' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Fetch real-time visitors from Umami API
    const response = await makeUmamiRequest(`/api/websites/${websiteId}/active`);

    if (!response || !response.ok) {
    return new Response(JSON.stringify({ 
            visitors: 0,
            error: 'Could not fetch visitor data'
            }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
            });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({ 
        visitors: data.x || 0,
        timestamp: new Date().toISOString()
            }), {
                status: 200,
                headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, max-age=30'
        }
    });

    } catch (error) {
    console.error('Error fetching visitors:', error);
    
    return new Response(JSON.stringify({ 
        visitors: 0,
        error: 'Could not fetch visitor data'
    }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};