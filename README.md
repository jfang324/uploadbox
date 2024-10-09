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
<img src='https://github.com/user-attachments/assets/6978769b-731f-436b-9a7b-fbf183f32ecf'> </img>
_Initial login page_

<img src='https://github.com/user-attachments/assets/5d5936e5-7236-40e2-95b7-34fe2d64728b'> </img>
_Auth0 login page_

<img src='https://github.com/user-attachments/assets/4beb37e0-4534-4016-9aab-9381763767f2'> </img>
_Homepage_

<img src='https://github.com/user-attachments/assets/fd2178dc-2316-4c96-997f-17fabf3a7188' width="auto" height="500"> </img>

_Mobile homepage_

<img src='https://github.com/user-attachments/assets/d5090cd0-f952-48b5-8a79-c7dea8a08c75'> </img>
_File upload pop-up_

<img src='https://github.com/user-attachments/assets/88bcbd61-2f02-40da-91f9-61b3036b1466'> </img>
_Options_

<img src='https://github.com/user-attachments/assets/c032a7dc-e8b0-494b-85c8-0c162d2bd34d'> </img>
_File sharing_

<img src='https://github.com/user-attachments/assets/7b4d3d2f-ed28-4843-8df8-18c88741f472' width="auto" height="500"> </img>

_Mobile sharing_

![Screenshot 2024-10-09 033150](https://github.com/user-attachments/assets/19718b49-06e1-4c09-a7c3-610003179026)
_Account settings pop-up_

## Contact

Jeffery Fang - [jefferyfang324@gmail.com](mailto:jefferyfang324@gmail.com)

## Tools & Techonologies

-   Next.js
-   React
-   Tailwind CSS
-   Auth0
-   MongoDB Atlas
-   Amazon S3
