import React from 'react';

export const useViewModel = <T>(VmConstructor: new () => T): T => {
  const ref = React.useRef(null);
  if (!ref.current) {
    ref.current = new VmConstructor();
  }

  return ref.current;
};
