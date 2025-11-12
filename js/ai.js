
export async function getAiSummary(data) {
    try {
        const response = await fetch('/api/summary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                error: errorData.error || `HTTP error! status: ${response.status}`,
            };
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Error fetching AI summary:", error);
        return {
            error: "Could not connect to the summary service. Is the server running?",
        };
    }
}
