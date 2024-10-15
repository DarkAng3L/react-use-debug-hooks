import { useEffect, type EffectCallback, type DependencyList, useRef } from 'react';
import useDebugDepsChanges, { type ChangedDeps } from './useDebugDepsChanges';
import { isEmpty } from 'lodash';

interface DebugInfo {
  changedDeps: ChangedDeps;
  timeSinceLastRender: number;
  lastRenderTimestamp: number;
}

const useEffectDebugInfo = (
  effectConsoleName: string,
  effect: EffectCallback,
  deps?: DependencyList,
): void => {
  const changedDeps = useDebugDepsChanges(deps);
  const lastRenderTimestamp = useRef<number>(Date.now());

  const info: DebugInfo = {
    changedDeps,
    timeSinceLastRender: Date.now() - lastRenderTimestamp.current,
    lastRenderTimestamp: lastRenderTimestamp.current,
  };

  useEffect(() => {
    lastRenderTimestamp.current = Date.now();
    const propsHaveChanged = !isEmpty(info.changedDeps);

    console.log(`%c[effect-debug-info] %c${effectConsoleName}`, 'color: orange', `color: ${propsHaveChanged ? 'orange' : 'initial'}`, info);
  });

  // Invoke the standard `useEffect` hook with the `effect` callback and `deps` passed
  useEffect(effect, deps);
};

export default useEffectDebugInfo;
