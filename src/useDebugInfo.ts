import { useRef, useEffect } from 'react';
import useDebugPropChanges, { type ChangedProps } from './useDebugPropChanges';
import useRenderCount from './useRenderCount';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';

interface DebugInfo {
  count: number;
  changedProps: ChangedProps;
  timeSinceLastRender: number;
  lastRenderTimestamp: number;
}

const useDebugInfo = (
  componentName: string,
  props: Readonly<Record<string, unknown>>,
  logOnlyWhenPropsChange?: boolean,
): DebugInfo => {
  const count = useRenderCount();
  const changedProps = useDebugPropChanges(props);
  const lastRenderTimestamp = useRef<number>(Date.now());

  const info: DebugInfo = {
    count,
    changedProps,
    timeSinceLastRender: Date.now() - lastRenderTimestamp.current,
    lastRenderTimestamp: lastRenderTimestamp.current,
  };

  useEffect(() => {
    lastRenderTimestamp.current = Date.now();
    const propsChanged = !isEmpty(info.changedProps);

    if ((!logOnlyWhenPropsChange || propsChanged)) {
      console.log(`%c[debug-info] %c${componentName}`, 'color: orange', `color: ${propsChanged ? 'orange' : 'initial'}`, info);
    }
  });

  useEffect(() => {
    console.log(`%c[debug-info] %c${componentName} Mounted`, 'color: orange', 'color: green', cloneDeep(props));

    return () => {
      console.log(`%c[debug-info] %c${componentName} Unmounted`, 'color: orange', 'color: pink');
    };
  }, [ componentName, props ]);

  return info;
};

export default useDebugInfo;
