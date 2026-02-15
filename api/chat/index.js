const https = require('https');

module.exports = async function (context, req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
        return;
    }

    // Get configuration from environment variables
    const API_KEY = process.env.AZURE_AI_API_KEY;
    const ENDPOINT = process.env.AZURE_AI_ENDPOINT;
    const DEPLOYMENT_NAME = process.env.AZURE_AI_DEPLOYMENT;

    if (!API_KEY || !ENDPOINT || !DEPLOYMENT_NAME) {
        context.res = {
            status: 500,
            body: { error: 'Server configuration error' }
        };
        return;
    }

    try {
        // Accept both formats: { message: "text" } or { messages: [...] }
        const userMessage = req.body.message;
        const messages = req.body.messages;

        let conversationMessages;
        if (messages && Array.isArray(messages)) {
            conversationMessages = messages;
        } else if (userMessage) {
            conversationMessages = [
                {
                    role: "system",
                    content: "You are a helpful assistant for Machina Christi. Be friendly, concise, and helpful."
                },
                {
                    role: "user",
                    content: userMessage
                }
            ];
        } else {
            context.res = {
                status: 400,
                body: { error: 'Message is required' }
            };
            return;
        }

        // Prepare the request to Azure AI Foundry
        // AI Foundry uses /chat/completions (not /openai/deployments/...)
        const aiEndpoint = `${ENDPOINT}/chat/completions?api-version=2024-02-15-preview`;

        const requestBody = JSON.stringify({
            messages: conversationMessages,
            model: DEPLOYMENT_NAME,  // Model name goes in the request body for AI Foundry
            max_tokens: 800,
            temperature: 0.7
        });

        const response = await makeRequest(aiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_KEY
            },
            body: requestBody
        });

        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: response
        };

    } catch (error) {
        context.log.error('Error calling Azure AI:', error);
        context.res = {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: { error: 'Failed to get response from AI' }
        };
    }
};

function makeRequest(url, options) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);

        const reqOptions = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: options.method,
            headers: options.headers
        };

        const req = https.request(reqOptions, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error('Failed to parse response'));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (options.body) {
            req.write(options.body);
        }

        req.end();
    });
}
