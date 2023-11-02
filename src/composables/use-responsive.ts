import { ref } from 'vue';

const breakpoints = new Map<ScreenSize, number>([
  ['2xl', 1400],
  ['xl', 1200],
  ['l', 992],
  ['m', 768],
  ['s', 576],
  ['xs', 0],
]);

const screenSize = ref<ScreenSize>('xl');

const defineCurrentScreenSize = () => {
  const screenWidth = window.screen.width;

  for (const [alias, breakpoint] of breakpoints.entries()) {
    if (screenWidth >= breakpoint) {
      screenSize.value = alias;
      break;
    }
  }
};

(function () {
  window.addEventListener('resize', defineCurrentScreenSize);
})();

const useResponsive = () => {
  /**
   * @implements Template Literal
   * @example calc`1rem s:1.5rem m:2rem l:4rem`
   *
   * @returns {string} suitable styles depending on screen width
   */
  const calc = ([styles]: TemplateStringsArray): string => {
    const [defaultStyle, ...breakpointStyles] = styles.split(' ');

    if (screenSize.value === 'xs') {
      return defaultStyle;
    }

    for (const style of breakpointStyles) {
      const [alias, value] = style.split(':');

      if (screenSize.value === alias) {
        return value;
      }
    }

    return defaultStyle;
  };

  const checkMobileScreen = () => {
    if (!screenSize.value) return false;
    return ['xs', 's'].includes(screenSize.value);
  };

  const checkSmallScreen = () => {
    if (!screenSize.value) return false;
    return screenSize.value === 'xs';
  };

  const checkTabletScreen = () => {
    if (!screenSize.value) return false;
    return screenSize.value === 'm';
  };

  return {
    breakpoints,
    screenSize,
    calc,
    checkMobileScreen,
    checkSmallScreen,
    checkTabletScreen,
    defineCurrentScreenSize,
  };
};

export { useResponsive };
