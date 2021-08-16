# Filmsquad

## First things to do

### 1. Installing dependencies
In the backend folder / in the frontend folder / in the root folder - needed for concurrently
```node
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
8. Authorized redirect URIs:
```console
http://localhost/register
http://localhost/login
```
6. Copy Client ID and Client Secret

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

## Using the application

### 1. Registration
First you need to register by clicking on the user icon with the plus sign. After that, you need to select your google account and a confirmation email will be sent to your address. Click on the confirm button.

### 2. Login
1. After you confirmed your email, you can log in by clicking on the padlock icon. You can only log in with the email you added to your test users at the Google Dev Console OAuth Screen, becasue of the calendar access!
2. Google hasn’t verified this app: select continue
3. Click on the checkbox, to give access to your Google calendar
