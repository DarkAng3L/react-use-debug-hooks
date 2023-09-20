import { useRef, useEffect } from 'react';
import useDebugPropChanges, { type ChangedProps } from './useDebugPropChanges';
import useRenderCount from './useRenderCount';
import isEmpty from 'lodash/isEmpty';

interface DebugInfo {
  renderCount: number;
  changedProps: ChangedProps;
  timeSinceLastRender: number;
  lastRenderTimestamp: number;
}

const useDebugInfo = (
  componentName: string,
  props: Readonly<Record<string, unknown>>,
  logOnlyWhenPropsChange?: boolean,
) => {
  const componentDisplayName = `<${componentName} />`;
  const renderCount = useRenderCount();
  const changedProps = useDebugPropChanges(props);
  const lastRenderTimestamp = useRef<number>(Date.now());
  const initialPropsRef = useRef(props);

  const info: DebugInfo = {
    renderCount,
    changedProps,
    timeSinceLastRender: Date.now() - lastRenderTimestamp.current,
    lastRenderTimestamp: lastRenderTimestamp.current,
  };

  useEffect(() => {
    lastRenderTimestamp.current = Date.now();
    const propsHaveChanged = !isEmpty(info.changedProps);

    if ((!logOnlyWhenPropsChange || propsHaveChanged)) {
      console.log(`%c[debug-info] %c${componentDisplayName} Re-rendered`, 'color: orange', `color: ${propsHaveChanged ? 'orange' : 'initial'}`, info);
    }
  });

  useEffect(() => {
    console.log(`%c[debug-info] %c${componentDisplayName} Mounted`, 'color: orange', 'color: green', initialPropsRef.current);

    return () => {
      console.log(`%c[debug-info] %c${componentDisplayName} Unmounted`, 'color: orange', 'color: pink');
    };
  }, [ componentName ]);
};

export default useDebugInfo;
