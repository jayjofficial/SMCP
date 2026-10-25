# Convex Backend for SMCP MUN

This directory contains the Convex cloud functions that power the interactive inquiry portal on `contact.html`.

## Deployment Details
- **Cloud URL**: `https://decisive-parrot-0.convex.cloud`
- **HTTP Actions URL**: `https://decisive-parrot-0.convex.site`

## How it Works
1. **Schema (`schema.ts`)**: Defines the `inquiries` table storing name, email, organization, category, subject, message, and timestamp.
2. **Mutations (`inquiries.ts`)**: Inserts new inquiries into the Convex database.
3. **HTTP Action (`http.ts`)**: Listens at `POST /contact` with CORS support for incoming web browser form submissions from `contact.html`.

## Syncing to Cloud
When Node.js is installed on your machine, deploy updates to your Convex development deployment by running:
```bash
npx convex dev
```
or to deploy directly:
```bash
npx convex deploy
```
