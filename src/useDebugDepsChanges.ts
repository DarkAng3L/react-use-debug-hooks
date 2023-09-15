import { DependencyList, useRef } from 'react';

export type ChangedDeps = Record<string, {
  prev: unknown;
  new: unknown;
}>;

const useDebugDepsChanges = (deps: DependencyList = []): ChangedDeps => {
  const previousDeps = useRef<DependencyList>(deps);
  const changedDeps = useRef<ChangedDeps>({});

  if (previousDeps.current) {
    changedDeps.current = deps.reduce<ChangedDeps>((changedDepsObj, dep, index) => {
      if (dep !== previousDeps.current[index]) {
        return {
          ...changedDepsObj,
          [`dep-#${index}`]: {
            prev: previousDeps.current[index],
            new: dep,
          },
        };
      }

      return changedDepsObj;
    }, {} as ChangedDeps);
  }

  previousDeps.current = deps;

  return changedDeps.current;
};

export default useDebugDepsChanges;
