## How to create a Twitch Client ID

In order to use `!drop me` feature, first you need to authorize the application to call Twitch Users API.
The authorization process requires a Client ID, here is how you can get one.

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console/apps) and login with your credentials.
<br/>
2. Click on the `Register Your Application` button.
<br/>
![alt text](twitch-console1.jpg "Twitch Developer Console")
<br/>

3. Fill in the fields and for ***OAuth Redirect URLs*** make sure that you enter exactly the same port as you specify in your `package.json`, then click on `Create` button.
<br/>
![alt text](twitch-console2.jpg "Register Application")
<br/>

4. Click on `Manage` button.
<br/>
![alt text](twitch-console3.jpg "Twitch Developer Console")
<br/>

1. Get your Client ID.
![alt text](twitch-console4.jpg "Application Details")

