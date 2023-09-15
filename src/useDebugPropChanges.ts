import { useRef } from 'react';

export type ChangedProps = Record<string, {
  prev: unknown;
  new: unknown;
}>;

const useDebugPropChanges = (props: Readonly<Record<string, unknown>>): ChangedProps => {
  const previousProps = useRef<Record<string, unknown>>(props);
  const changedProps = useRef<ChangedProps>({});

  if (previousProps.current) {
    // const allKeys = new Set(Object.keys({ ...props, ...previousProps.current }));
    const propKeys = Object.keys({ ...props, ...previousProps.current });

    changedProps.current = propKeys.reduce((changedPropsObj, key) => {
      if (props[key] !== previousProps.current[key]) {
        return {
          ...changedPropsObj,
          [key]: {
            prev: previousProps.current[key],
            new: props[key],
          },
        };
      }

      return changedPropsObj;
    }, {} as ChangedProps);
  }

  previousProps.current = props;

  return changedProps.current;
};

export default useDebugPropChanges;
