# Filmsquad
In this application, film squad leaders can create teams for their crew. They can also manage their budget for cast members, rentings, traveling and food expenses. They can create new events which is automatically shared between all the crew members and will be added to their google calendar. Other squad members can see an overview of these information, if the team leader makes the team public.

- [First things to do](#first-things-to-do)
  - [Installing dependencies](#1-installing-dependencies)
  - [Google API Client ID and Secret](#2-getting-google-api-client-id-and-secret)
  - [Setting up Google Calendar Api](#3-setting-up-google-calendar-api)
  - [Backend .env file content](#4-create-a-env-file-in-the-backend-folder-with-the-following-content)
  - [Frontend .env file content](#5-create-a-env-file-in-the-frontend-folder-with-the-following-content)
  - [Starting frontend and backend server](#6-starting-frontend-and-backend-server)
- [Using the application](#using-the-application)
  - [Registration](#1-registration)
  - [Login](#2-login)
- [Testing](#testing)
  - [Backend testing](#backend-testing)
- [API Documentation](#api-documentation)

## First things to do

### 1. Installing dependencies
In the backend folder & in the frontend folder & in the root folder - needed for concurrently
```console
npm install
```

### 2. Getting Google Api client id and secret
1. Set up your account on google developer console
2. Select project -> New Project -> APIs & Services -> Oauth consent screen -> External -> Application name
3. Scopes: Select the first three scopes and save 
4. Test users: add your email address here (Calendar Api requires it)
5. Credentials -> Create credentials -> OAuth client ID -> Web application -> Set name
6. Authorized JavaScript origins:
```console
http://localhost
```
7. Authorized redirect URIs:
```console
http://localhost/register
http://localhost/login
```
8. Copy Client ID and Client Secret

### 3. Setting up Google Calendar Api
1. APIs & Services -> Dashboard -> Enable APIs and Services -> Search for Calendar -> Select Google Calendar Api -> Enable
2. Go back to APIs & Services -> OAuth consent screen -> Edit App -> Scopes -> Add or Remove Scopes -> Select Google Calendar Api with the scope ".../auth/calendar" to get all calendar access -> Update and Save 

### 4. Create a .env file in the backend folder with the following content:
```env
MONGO_CONNECTION="YOUR MONGO CONNECTION STRING"
TOKEN_SECRET="YOUR TOKEN SECRET"
CLIENT_ID="YOUR GOOGLE API CLIENT ID"
CLIENT_SECRET="YOUR GOOGLE API CLIENT SECRET"
SENDGRID_EMAIL="SENDGRID EMAIL ADDRESS"
SENDGRID_API="SENDGRID API KEY"
PEXEL_API_KEY="PEXELS API KEY"
FRONTEND_HOST=http://localhost:3000 #For testing docker compose use "http://localhost"
```

### 5. Create a .env file in the frontend folder with the following content:
```env
REACT_APP_BACKEND_HOST=http://localhost:8080
REACT_APP_FRONTEND_HOST=http%3A//localhost:3000 #For testing docker compose use "http%3A//localhost"
REACT_APP_CLIENT_ID="YOUR GOOGLE API CLIENT ID"
```

### 6. Starting frontend and backend server
Go to the root folder and run:
```console
npm start
```
This will start both the frontend and the backend with nodemon

## Using the application

### 1. Registration
First you need to register by clicking on the user icon with the plus sign. After that, you need to select your google account and a confirmation email will be sent to your address. Click on the confirm button.

### 2. Login
1. After you confirmed your email, you can log in by clicking on the padlock icon. You can only log in with the email you added to your test users at the Google Dev Console OAuth Screen, becasue of the calendar access!
2. Google hasn’t verified this app: select continue
3. Click on the checkbox, to give access to your Google calendar

## Testing

### Backend testing
Go to the backend folder and create a .env.testing file with this content:
```env
MONGO_CONNECTION="YOUR MONGO CONNECTION STRING"
TOKEN_SECRET="YOUR TOKEN SECRET"
CLIENT_ID="YOUR GOOGLE API CLIENT ID"
CLIENT_SECRET="YOUR GOOGLE API CLIENT SECRET"
SENDGRID_EMAIL="SENDGRID API KEY"
SENDGRID_API=SG.BADAPIKEY  #This is imortant!
FRONTEND_HOST=http://localhost:3000
```
Now you can start testing with the following command:
```console
npm run test
```

## API Documentation
After starting the server locally, go to this endpoint to get the swagger documentation of this api:
```console
http://localhost:8080/docs
```
