## How to get Twitch Client ID

In order to use `!drop me` feature, first you need to authorize the application to call Twitch Users API.
The authorization process requires a Client ID, here is how you can get one.

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console/apps) and login with your credentials.
<br/>

2. Click on the `Register Your Application` button.

![Twitch Developer Console](twitch-console1.jpg)

1. Fill in the fields and for ***OAuth Redirect URLs*** make sure that you enter exactly the same port as you specify in your `package.json`, then click on `Create` button.

![Register Application](twitch-console2.jpg)

4. Click on `Manage` button.

![Twitch Developer Console](twitch-console3.jpg)

5. Get your Client ID.
![Application Details](twitch-console4.jpg)

