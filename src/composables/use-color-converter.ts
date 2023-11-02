const useColorConverter = () => {
  const parseRgbFromRule = (rule: string): number[] => {
    return rule
      .replace('rgb(', '')
      .replace(')', '')
      .replaceAll(' ', '')
      .split(',')
      .map(Number);
  };

  const parseRgbFromHex = (hex: string): number[] => {
    const values = [
      hex.slice(0, 2),
      hex.slice(2, 4),
      hex.slice(4, 6),
    ];

    return values.map(value => parseInt(value, 16));
  };

  const toRgba = (value: string, alpha: number) => {
    const color = value.startsWith('#')
      ? parseRgbFromHex(value.slice(1))
      : parseRgbFromRule(value);

    return `rgba(${color.join(',')}, ${alpha})`;
  };

  return { toRgba };
};

export { useColorConverter };