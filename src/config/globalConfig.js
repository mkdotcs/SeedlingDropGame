// Global configuration

export default {
  // channelName: 'your-channelname-here',
  testMode: true,
  channel: {
    // channel name
    name: 'mrbencoder',
    // channel moderators (twitch user name who can send config commands)
    mods: ['mrbencoder'],
    commandPrefix: '!',
    // Time in milliseconds to allow user to drop again
    dropDelay: 90000,
  },
  drop: {
    // Time in milliseconds to hide the drop
    hideTimeout: 10000,
    // 0.5: half size, 1: actual size, 2: double size, etc
    scale: 0.8,
    // 0: none, 1: random, 2: drop image, 3: multi colors, 4: red, 5: blue, 6: green, 7: yellow
    trail: 0,
  },
  // Laser collision effect => 0: bounce, 1: destroy
  laserCollision: 0,
  target: {
    // 0: show, 1: auto (show if there is a new drop), 2: hide,
    status: 0,
    // milliseconds
    autoTimeout: 5000,
    // true => target will change location randomly
    move: false,
    float: true,
  },
  seedling: {
    // Hiding user name in milliseconds
    timout: 1000,
  },
  leaderBoard: {
    // 0: show, 1: auto (show if there is a new score), 2: hide
    status: 1,
    // milliseconds
    autoTimeout: 40000,
  },
};
