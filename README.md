# Seedling Drop Game
![License](https://img.shields.io/badge/license-MIT-green)

A drop game built with [Phaser 3](https://phaser.io/) that can be used as a twitch overlay, type commands in the chat to play.<br>
*This game was inspired by [Coding Garden](https://www.twitch.tv/codinggarden) drop game, see the original code [here](https://github.com/CodingGarden/SeedlingDrop)*

## Build Setup

```bash
# install dependencies
npm install

# serve with live reloading at localhost:1234
npm start

# build for production with transpilation / minification
npm run build
```
## Configuration
Customize the game by editing the configuration file `config/appConfig.js`
| Section       | Key            | Descritpion                                                                                                                                                                                                                                                                                | Values                                                                                                                                 |
| :------------ | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| *general*     | testMode       | Enable Test or Live mode                                                                                                                                                                                                                                                                   | `true` Test mode<br>`false` Live mode                                                                                                  |
|               | laserCollision | Laser collision effect                                                                                                                                                                                                                                                                     | `0` Bounce<br>`1` Destroy                                                                                                              |
| *channel*     | name           | Your Twitch channel name                                                                                                                                                                                                                                                                   | e.g. `'mrbencoder'`                                                                                                                    |
|               | mods           | Your channel moderators<br>(Twitch user name who can send mod commands)                                                                                                                                                                                                                    | e.g. `['user1', 'user2'...]`                                                                                                           |
|               | commandPrefix  | A (one character) prefix to identify game commands                                                                                                                                                                                                                                         | e.g. `'!'`                                                                                                                             |
|               | twitchClientID | Used to authorize this app to use Twitch API.<br>Set this key only if you want to enable the command (!drop me), if not keep it empty,<br>please see the [documentation](https://github.com/MrBenCoder/SeedlingDropGame/blob/master/TWITCH-CLIENTID.md) on how to obtain Twitch Client ID. |                                                                                                                                        |
| *drop*        | scale          | Scaling drop image size<br>(0.5: half size, 1: actual size, 2: double size, etc)                                                                                                                                                                                                           | e.g. `0.8`                                                                                                                             |
|               | trail          | Drop trail                                                                                                                                                                                                                                                                                 | `0` None<br>`1` Random<br>`2` Drop image<br>`3` Multi colors<br>`4` Red color<br>`5` Blue color<br>`6` Green color<br>`7` Yellow color |
|               | hideTimeout    | Time in milliseconds to hide the drop                                                                                                                                                                                                                                                      | e.g. `10000`                                                                                                                           |
|               | delay          | Delay time in milliseconds for user's next drop                                                                                                                                                                                                                                            | e.g. `90000`                                                                                                                           |
| *target*      | status         | Show, auto hide, or hide the target                                                                                                                                                                                                                                                        | `0` Show<br>`1` Auto hide (only show if there is a new drop)<br>`2` Hide                                                               |
|               | autoTimeout    | Auto hide time in milliseconds                                                                                                                                                                                                                                                             | e.g. `5000`                                                                                                                            |
|               | move           | If enabled, target will change location randomly                                                                                                                                                                                                                                           | `true` Enable movement<br>`false` Disable movement                                                                                     |
|               | float          | Enable or disable target floating                                                                                                                                                                                                                                                          | `true` Enable floating<br>`false` Disable floating                                                                                     |
| *seedling*    | timout         | Time in milliseconds to hide user name in case of successful drop                                                                                                                                                                                                                          | e.g. `1000`                                                                                                                            |
| *leaderBoard* | status         | Show, auto hide, or hide the leader board                                                                                                                                                                                                                                                  | `0` Show<br>`1` Auto hide (only show if there is a new drop)<br>`2` Hide                                                               |
|               | autoTimeout    | Auto hide time in milliseconds                                                                                                                                                                                                                                                             | e.g. `40000`                                                                                                                           |


## Commands

#### For everyone including channel moderators 
*Assuming that command prefix is the exclamation mark* <kbd>!</kbd>
> !drop [Twitch emote](https://www.twitch.tv/creatorcamp/en/learn-the-basics/emotes)<br>
> !drop [BTTV emote](https://betterttv.com/emotes)<br>
> !drop [FFZ emote](https://www.frankerfacez.com/emoticons)<br>
> !drop [Emoji](https://en.wikipedia.org/wiki/Emoji)<br>
> !drop me

#### For channel moderators
| Command           | Description              | Parameters                                                                                                                             | Example                       |
| :---------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------- |
| trail or tr       | Change drop trail        | `0` None<br>`1` Random<br>`2` Drop image<br>`3` Multi colors<br>`4` Red color<br>`5` Blue color<br>`6` Green color<br>`7` Yellow color | !tr 1<br>!trail 6             |
| laser or ls       | Fire a laser             | Total count (5 max.), if discarded laser will be fired once                                                                            | !ls<br>!laser 3               |
| target or tg      | Control the traget       | `show`<br>`auto`<br>`hide`<br>`move` (toggle between enable and disable)<br>`float` (toggle between enable and disable)                | !tg auto<br>!target move      |
| leaderboard or lb | Control the leader board | `show`<br>`auto`<br>`hide`                                                                                                             | !lb hide<br>!leaderboard auto |


## TODO
* [ ] Implement a wind force to change drops velocity randomly
* [ ] Create a winter theme (christmas theme)

## Credits
>Original SeedlingDrop game by [Coding Garden](https://www.twitch.tv/codinggarden). See the original code [here](https://github.com/CodingGarden/SeedlingDrop).

  

*  Platform images from [GameArt2D](https://www.gameart2d.com/free-platformer-game-tileset.html)

*  Flower images created by [BSGStudio](https://all-free-download.com/free-vector/download/spring-flowers_268656.html)
* Background image from [unsplash](https://unsplash.com/photos/TRhGEGdw-YY)
