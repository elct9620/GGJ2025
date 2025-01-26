# Bubble Mail: Atlantis Rescue

This is a [Global Game Jam 2025 game](https://globalgamejam.org/games/2025/call-depth-1). Which is play with Email and hosted on the Cloudflare Workers.

## How to play

Go to the [game page](https://globalgamejam.org/games/2025/call-depth-1) to download the executable and get the initial email address. Then, send an email to the address to start the game.

## Deployment

To run your own instance of the game, you need following resources:

- A Cloudflare account
- A Domain enabled Cloudflare Email Routing
- A Cloudflare KV namespace
- An AWS SES access key allowed to send emails with the domain
- A OpenAI API key

Then, you can deploy the game with the following steps:

1. Clone the repository
2. Install the dependencies with `npm install`

Configure following as secrets in the Cloudflare Workers:

- `SENTRY_DSN` (Optional)
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `OPENAI_API_KEY`
- `OPENAI_GATEWAY` (Cloudflare AI Gateway)
- `DOMAIN`

Then update `wrangler.json` with your own domain and KV namespace.

Finally, run `wrangler deploy` to deploy the game.
