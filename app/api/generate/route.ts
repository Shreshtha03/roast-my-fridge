export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Forward request to Python backend
        const response = await fetch('http://127.0.0.1:8000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Python backend error:', errorText);
            return Response.json(
                { error: 'Backend API error', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return Response.json(data);

    } catch (error: any) {
        console.error('API Route Error:', error);
        return Response.json(
            { error: 'Failed to connect to backend', details: error.message },
            { status: 500 }
        );
    }
}
