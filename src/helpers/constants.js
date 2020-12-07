const keyboardShortcuts = {
  D: { description: 'Random drop' },
  L: { description: 'Fire laser beam' },
  C: { description: 'Clear leaderboard' },
  R: { description: 'Remove all seedlings' },
  A: { description: 'Drop trail', options: ['None', 'Trail1', 'Trail2', 'Trail3', 'Trail4', 'Trail5', 'Trail6'], current: 'None' },
  S: { description: 'Laser collision', options: ['Bounce', 'Kill'], current: 'Bounce' },
  T: { description: 'Show Target', options: ['YES', 'NO', 'AUTO'], current: 'YES' },
  M: { description: 'Move target', options: ['YES', 'NO'], current: 'NO' },
  F: { description: 'Float target', options: ['YES', 'NO'], current: 'YES' },
  B: { description: 'Show Leaderboard', options: ['YES', 'NO'], current: 'YES' },
};

const globalCommands = {
  drop: [],
};

const modCommands = {
  drop: [],
  trail: ['0', '1', '2', '3', '4', '5', '6'],
  laser: ['bounce', 'destroy'],
  target: ['show', 'hide', 'auto', 'move', 'float'],
  'leader-board, lb': ['show', 'hide'],
  getParams(searchKey) {
    if (searchKey in this) {
      return this[searchKey];
    }
    const result = Object.entries(this).find(([key]) => new RegExp(`\\W${searchKey},`).test(`,${key},`));
    return result ? result[1] : undefined;
  },
};

const targetShowStatus = {
  hide: 0,
  show: 1,
  auto: 2,
};

export {
  keyboardShortcuts,
  globalCommands,
  modCommands,
  targetShowStatus,
};
