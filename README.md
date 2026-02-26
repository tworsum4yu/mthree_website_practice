# Static Quiz App

A lightweight, fully client‑side quiz application built with HTML, CSS, and JavaScript.  
The project is designed for simple, fast deployment using AWS services — currently hosted via **Amazon S3** and containerized for **Amazon ECR**, with planned hosting on **Amazon ECS** in the future.

---

## 📌 Features

- Simple static quiz UI
- Instant scoring and feedback
- Zero backend dependencies
- Fully portable — runs anywhere that can serve static files
- Deployable via:
  - **Amazon S3** (static hosting)
  - **Amazon ECR** (container image for future ECS hosting)

---

## 📁 Project Structure

/root
├── index.html
├── styles.css
├── script.js
├── Dockerfile
└── README.md

---

## 🚀 Running Locally

You can run the quiz locally without any special setup:

```bash
# Clone the repository
git clone <your-repo-url>

# Open the project
cd <repo>

# Run locally
open index.html

# Deployment
1. Deploying to Amazon S3 (Static Website Hosting)
Build or update your static files

Upload them to your S3 bucket

Enable Static Website Hosting

Set the correct bucket policy for public access (if required)

Access the site via the S3 website endpoint

2. Deploying to Amazon ECR
The project includes a Dockerfile so the quiz can be containerized.

Build and push the image:
aws ecr get-login-password --region <region> \
  | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com

docker build -t quiz-app .

docker tag quiz-app:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/quiz-app:latest

docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/quiz-app:latest
```
