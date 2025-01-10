export const dropdownPopperOptions = {
  placement: 'bottom' as const,
  modifiers: [
    {
      name: 'offset',
      options: {offset: [0, 10]},
    },
    {name: 'arrow'},
  ],
};
