export const copy = {
  BACK: 'Back',
  NEXT: 'Next',
  RETAKE: 'Retake',
  TAKE_PICTURE: 'Take Picture',
  TAKE_ANOTHER: 'Take Another!',
};

export const status = {
  DATA_FORM_SCREEN: 'data-form-screen',
  VIDEO_SCREEN: 'video-screen',
  INSTRUCTION_SCREEN: 'instruction-screen',
  CLICK_DRAG_SCREEN: 'click-drag-screen',
};

export const dimensions = {
  SCREEN_HEIGHT: 600,
  SCREEN_WIDTH: 600,
};

export const defaultConfig = {
  isGreenScreenEnabled: false,
  isDigitalPropsEnabled: false,
  gColorValue: 100,
  rColorValue: 100,
  shouldDisplayRGControls: false,
  availableNetworks: ['cardano'],
  isKeyboardEnabled: false,
};

export const lowerCaseKeys = [
  ['1', '2', '3', '4', '5', '6', '7', '8','9', '0'],
  ['q', 'w', 'e', 'r', 't','y', 'u', 'i','o', 'p'],
  ['a', 's', 'd', 'f', 'g','h', 'j', 'k','l'],
  ['^', 'z', 'x', 'c', 'v', 'b','n', 'm', '.', '^'],
  ['space']
];

export const upperCaseKeys = [
  ['1', '2', '3', '4', '5', '6', '7', '8','9', '0'],
  ['Q', 'W', 'E', 'R', 'T','Y', 'U', 'I','O', 'P'],
  ['A', 'S', 'D', 'F', 'G','H', 'J', 'K','L'],
  ['^', 'Z', 'X', 'C', 'V', 'B','N', 'M', '.', '^'],
  ['space']
];