<div align="center">
  <h1>
    <br />
    <code>react-use-debug-hooks</code>
    <br />
    <br />
  </h1>
  <p>
    <br />
    Type-safe React hooks for debugging React component's changed props (and states), or a useEffect hook wrapper, which returns the dependencies that changed on each iteration of the effect within the console.
    <br />
  </p>
  <br />
  <pre>npm i -D <a href="https://www.npmjs.com/package/react-use-debug-hooks">react-use-debug-hooks</a></pre>
  <br />
</div>

## <span style="color: #dd2322">Important!</span>

### Do **<span style="color: #dd2322">NOT</span>** use in **production** environment! <br>

This package is intended to be a debugging tool only! <br>
Therefore, it should be installed within the `devDependancies` and all usage removed from the codebase before pushing to a production environment.

## `useDebugInfo` Reference

### Parameter Explanation

- `componentName`: This changes the debug label outputted with the changed deps in the console.
- `props`: The props you want to observe for changes.
- `logOnlyWhenPropsChange`: If you want to display in console only when any prop changes.

### Parameter Types

- `effectConsoleName`: `string`
- `props`: `object`
- `logOnlyWhenPropsChange`: `boolean`

## `useEffectDebugInfo` Reference

### Parameter Explanation

- `effectConsoleName`: This changes the debug label outputted with the changed deps in the console.
- `effect`: A callback function that contains imperative, possibly effectful code.
- `deps`: The effect will only activate if the values in the list change.

### Parameter Types

- `effectConsoleName`: `string`
- `effect`: `React.EffectCallback`
- `deps`: `React.DependencyList`

## Extra Details

- `useDebugInfo` just requires a `componentName` to be displayed in console and an object with all the props needed to be observed for changes.
- `useDebugInfo` has a final (optional) parameter `logOnlyWhenPropsChange` if you want displayed in the console only when anything changes and not every render.
- For `useDebugInfo`, besides which props have changed, the `renderCount` and `renderTime` is also displayed.
- `useEffectDebugInfo` also requires a `effectConsoleName` to be displayed in the console.
- `useEffectDebugInfo`'s `effect` callback an `deps` list is no different from `useEffect` ones.

## Example Usage

```tsx
// ExampleComponent.tsx
import { useDebugInfo, useEffectDebugInfo } from 'react-use-debug-hooks';

const ExampleComponent = ({ title: string, initialCount = 0 }: ExampleComponentProps) => {
  const [ string, setString ] = useState('0');
  const count = useCount(initialCount);

  const debugInfo = useDebugInfo('ExampleComponent', { // provide all props that we want to observe for changes
    title,
    initialCount,
    string,
    count,
  }, true); // optional param 'logOnlyWhenPropsChange' to not be spammed in the console
            // when component renders too much without any of the observed props changing

  useEffectDebugInfo('reset_string_effect', () => {
    setString('0');
  }, [ initialCount ]); // only fires when useEffect hook's dependencies changes

  return (
    <>
      <h5>Title: {title}</h5>
      <p>String: {string}</p>
      <p>Render count: {count}</p>
      <button onClick={() => setString((prevS) => String(Number(prevS) + 1))}>Increment String</button>
    </>
  );
}
```
