# ShopKart Application

This is a developer handoff package for a fictional e-commerce application.

IMPORTANT:
- This repository intentionally contains NO Dockerfile, Jenkinsfile, Terraform, Kubernetes manifests, Helm charts, or AWS configuration.
- Your job is to take this source code and perform the DevOps work.
- Start by running it locally, then push it to Git, then deploy it to an AWS EC2 instance.

## Architecture

Browser -> Frontend -> Backend API -> PostgreSQL

## Local prerequisites

- Node.js 20+
- npm
- PostgreSQL 14+ (or compatible)

## Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env for your PostgreSQL connection
npm run db:init
npm run dev
```

Backend runs on http://localhost:5000

Health endpoint:
http://localhost:5000/health

Products endpoint:
http://localhost:5000/api/products

## Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## Database

Create a PostgreSQL database called `shopkart`.

The backend initialization command creates the table and sample data.

## DevOps assignment

Treat this repository as a handoff from the development team.

Your first assignment:
1. Understand the application.
2. Run it locally.
3. Create a Git repository.
4. Push the source code to GitHub.
5. Create an Ubuntu EC2 instance.
6. SSH into EC2.
7. Pull the source code from GitHub.
8. Install the runtime and PostgreSQL.
9. Configure environment variables.
10. Run the application.
11. Configure Nginx as a reverse proxy.
12. Make the application accessible from the internet.
13. Document the deployment and troubleshooting steps.

Do NOT add Docker/Jenkins/Terraform/Kubernetes yet. Those will be later phases.

Suscessfully Complete!..
