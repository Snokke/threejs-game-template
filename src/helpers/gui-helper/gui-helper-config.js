const GUIFolders = {
  'Helpers': 'Helpers',
  'Lights': 'Lights',
};

const GUIFoldersVisibility = {
  [GUIFolders.Helpers]: true,
  [GUIFolders.Lights]: true,
};

const GUIHelpersStartState = {
  'Enable all helpers': false,
  'Physics debugger': false,
  'Directional light': false,
  'Shadow camera': false,
  'Axes': false,
};

const GUIConfig = {
  openAtStart: false,
}

export { GUIFolders, GUIFoldersVisibility, GUIHelpersStartState, GUIConfig };
