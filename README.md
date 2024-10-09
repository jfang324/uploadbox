## About The Project

A full stack web application that lets you manage and share files on your home network. Ideally this applications should be run on a Raspberry Pi or similar device but it can also be run on your PC. Here is a useful guide to expose localhost to the network: https://www.youtube.com/watch?v=uRYHX4EwYYA.

## Getting Started

### Prerequisites

To use this application, you will need accounts for the following services:

-   MongoDB Atlas (can also be hosted locally)
-   Amazon S3
-   Auth0

## Installation

To install the application locally, run the following commands:

1. Clone the repository:

```
git clone https://github.com/jfang324/uploadbox.git
```

2. Navigate to the project directory:

```
cd uploadbox
```

3. Install the dependencies:

```
npm install
```

4. Create a `.env` file in the project directory and add the following environment variables:

```
//use values provided to you after creating an app in auth0
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL=https://dev-41uie5dhg3arv8y4.us.auth0.com
AUTH0_CLIENT_ID='TJva7LgAH4ggEzhjyBqozQGrl3npKLiz'
AUTH0_CLIENT_SECRET='nW7WhW-UzwjRQzJZtICUu96EdQpBQlWdzK1rMIV2YxVauUqE77McVOdz6WwHxByO'

//use values provided after creating a bucket in s3
BUCKET_NAME =<bucket name>
BUCKET_REGION=<bucket region>
ACCESS_KEY=<bucket access key>
SECRET_ACCESS_KEY=<bucket secret access key>

//use values provided after creating a database in mongodb atlas
DB_USERNAME = <database username>
DB_PASSWORD = <database password>
DATABASE_URL= <url provided after creating and choosing to programatiically connect>
```

5. Start the application:

```
npm run dev
```

## Gallery & Demonstrations

## Contact

Jeffery Fang - [jefferyfang324@gmail.com](mailto:jefferyfang324@gmail.com)

## Tools & Techonologies

-   Next.js
-   React
-   Tailwind CSS
-   Auth0
-   MongoDB Atlas
-   Amazon S3
