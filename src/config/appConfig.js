// Application configuration

export default {
  // Toggle between Test and Live mode
  testMode: true,
  // Laser collision effect => 0: bounce, 1: destroy
  laserCollision: 0,
  channel: {
    // Your Twitch channel name
    name: 'mrbencoder',
    // channel moderators (twitch user name who can send config commands)
    mods: ['mrbencoder'],
    // A (one character) prefix to identify game commands
    commandPrefix: '!',
    /* Used to authorize this app to use Twitch API
       Valid only if you want to enable the command (!drop me), if not keep it empty
       Please see the documentation on how to obtain Twitch Client ID */
    twitchClientID: '',
  },
  drop: {
    // 0.5: half size, 1: actual size, 2: double size, etc
    scale: 0.8,
    // 0: none, 1: random, 2: drop image, 3: multi colors, 4: red, 5: blue, 6: green, 7: yellow
    trail: 0,
    // Time in milliseconds to hide the drop
    hideTimeout: 10000,
    // Delay time in milliseconds for user's next drop
    delay: 10000,
  },
  target: {
    // 0: show, 1: auto hide (show if there is a new drop), 2: hide,
    status: 0,
    // milliseconds
    autoTimeout: 5000,
    // If true, target will change location randomly
    move: false,
    // Enable or disable target floating
    float: true,
  },
  seedling: {
    // Hiding user name in milliseconds
    timout: 1000,
  },
  leaderBoard: {
    // 0: show, 1: auto hide (show if there is a new score), 2: hide
    status: 0,
    // milliseconds
    autoTimeout: 40000,
  },
};
