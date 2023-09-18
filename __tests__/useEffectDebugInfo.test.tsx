import { type ReactElement, useCallback, useState } from 'react';

// import { act, renderHook } from '@testing-library/react-hooks';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useEffectDebugInfo from '../src/useEffectDebugInfo';

const renderTime = 40;
const depKey = 'dep-#'

function renderWithSetup(component: ReactElement) {
  const consoleLogSpy = vi.spyOn(console, 'log');

  let consoleLogSpyNthCall = 1;

  return {
    user: userEvent.setup(),
    checkConsoleLog: (hookName: string, ...args: unknown[]) => {
      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        consoleLogSpyNthCall,
        ...(args.length > 0 ? [
          `%c[effect-debug-info] %c${hookName}`,
          "color: orange",
          expect.any(String),
          ...args,
        ] : [ hookName ])
      );
      consoleLogSpyNthCall++;
    },
    checkNoConsoleLog: (nthCallsInLatestEvent: number) => {
      expect(consoleLogSpy).not.toHaveBeenCalledTimes(
        nthCallsInLatestEvent + (consoleLogSpyNthCall - 1),
      );
    },
    ...render(component),
  };
}

function TestComponent() {
  const [ string, setString ] = useState('0');
  const [ number, setNumber ] = useState(0);

  useEffectDebugInfo('TestComponent-effect-debug', () => {
    console.log('TestComponent useEffect ran');
  }, [ string, number ]);

  function incrementString() {
    setString((prev) => String(Number(prev) + 1));
  }

  function incrementNumber() {
    setNumber((prev) => prev + 1);
  }

  function incrementAll() {
    incrementString();
    incrementNumber();
  }

  return (
    <>
      <p>String: {string}</p>
      <p>Number: {number}</p>
      <button onClick={incrementAll}>Increment All</button>
    </>
  );
}

function TestPrimitivesComponent({ initialSymbol, updatedSymbol }: {
  initialSymbol: Symbol;
  updatedSymbol: Symbol;
}) {
  const [ string, setString ] = useState('0');
  const [ number, setNumber ] = useState(0);
  const [ bigint, setBigint ] = useState(BigInt(0));
  const [ boolean, setBoolean ] = useState(false);
  const [ symbol, setSymbol ] = useState(initialSymbol);

  const [ nullVal, setNullVal ] = useState(null);
  const [ undefinedVal, setUndefinedVal ] = useState(undefined);

  useEffectDebugInfo('TestPrimitivesComponent-effect-debug', () => {
    console.log('TestPrimitivesComponent useEffect ran');
  }, [ string, number, bigint, boolean, symbol, nullVal, undefinedVal ]);

  function incrementString() {
    setString((prev) => String(Number(prev) + 1));
  }

  function incrementNumber() {
    setNumber((prev) => prev + 1);
  }

  function incrementBigint() {
    setBigint((prev) => BigInt(Number(prev) + 1));
  }

  function toggleBoolean() {
    setBoolean((prev) => !prev);
  }

  function updateSymbol() {
    setSymbol(updatedSymbol);
  }

  function updateNullVal() {
    setNullVal(null);
  }

  function updateUndefinedVal() {
    setUndefinedVal(undefined);
  }

  return (
    <>
      <p>String: {string}</p>
      <p>Number: {number}</p>
      <p>Bigint: {String(bigint)}</p>
      <p>Boolean: {String(boolean)}</p>
      <p>Symbol: {String(symbol)}</p>
      <p>NullVal: {String(nullVal)}</p>
      <p>UndefinedVal: {String(undefinedVal)}</p>
      <button onClick={incrementString}>Increment String</button>
      <button onClick={incrementNumber}>Increment Number</button>
      <button onClick={incrementBigint}>Increment Bigint</button>
      <button onClick={toggleBoolean}>Toggle Boolean</button>
      <button onClick={updateSymbol}>Update Symbol</button>
      <button onClick={updateNullVal}>Update NullVal</button>
      <button onClick={updateUndefinedVal}>Update UndefinedVal</button>
    </>
  );
}

function TestFunctionComponent({
   initialFunction,
   rerenderedFunction,
   depsChangedFunction,
   initialMemoizedFunction,
   depsChangedMemoizedFunction,
 }: {
  initialFunction: () => void;
  rerenderedFunction: () => void;
  depsChangedFunction: () => void;
  initialMemoizedFunction: () => void;
  depsChangedMemoizedFunction: () => void;
}) {
  const [ hasRerendered, setHasRerendered ] = useState(false);
  const [
    memoizedFunctionDepsChange,
    setMemoizedFunctionDepsChange,
  ] = useState(false);

  // This simulates a function changing on each rerender (of the state)
  const Function = memoizedFunctionDepsChange
    ? depsChangedFunction
    : hasRerendered
      ? rerenderedFunction
      : initialFunction;

  const MemoizedFunction = useCallback(
    // This simulates a function changing when the `useCallback` deps change
    memoizedFunctionDepsChange
      ? depsChangedMemoizedFunction
      : initialMemoizedFunction,
    [ memoizedFunctionDepsChange ],
  );

  useEffectDebugInfo('TestFunctionComponent-effect-debug', () => {
    console.log('TestFunctionComponent useEffect ran');
  }, [ Function, MemoizedFunction ]);

  function triggerRerender() {
    setHasRerendered(true);
  }

  function triggerMemoizedFunctionDepsChange() {
    setMemoizedFunctionDepsChange(true);
  }

  return (
    <>
      <button onClick={triggerRerender}>Trigger Rerender</button>
      <button onClick={triggerMemoizedFunctionDepsChange}>
        Trigger Memoized Function Deps Change
      </button>
    </>
  );
}

function TestObjectComponent({ initialObject, updatedObject }: {
  initialObject: Record<string, unknown>;
  updatedObject: Record<string, unknown>;
}) {
  const [ object, setObject ] = useState(initialObject);
  const [ otherDep, setOtherDep ] = useState(0);

  useEffectDebugInfo('TestObjectComponent-effect-debug', () => {
    console.log('TestObjectComponent useEffect ran');
  }, [ object, otherDep ]);

  function updateObject() {
    setObject(updatedObject);
  }

  function updateOtherDep() {
    setOtherDep((prev) => prev + 1);
  }

  return (
    <>
      <p>{`Object: ${object}`}</p>
      <p>OtherDep: {otherDep}</p>
      <button onClick={updateObject}>Update Object</button>
      <button onClick={updateOtherDep}>Update OtherDep</button>
    </>
  );
}

function TestDateComponent({ initialDate, updatedDate }: {
  initialDate: Date;
  updatedDate: Date;
}) {
  const [ date, setDate ] = useState(initialDate);
  const [ otherDep, setOtherDep ] = useState(0);

  useEffectDebugInfo('TestDateComponent-effect-debug', () => {
    console.log('TestDateComponent useEffect ran');
  }, [ date, otherDep ]);

  function updateDate() {
    setDate(updatedDate);
  }

  function updateOtherDep() {
    setOtherDep((prev) => prev + 1);
  }

  return (
    <>
      <p>Date: {String(date)}</p>
      <p>OtherDep: {otherDep}</p>
      <button onClick={updateDate}>Update Date</button>
      <button onClick={updateOtherDep}>Update OtherDep</button>
    </>
  );
}

const date = new Date(2000, 1, 1, 13);

describe('useEffectDebugInfo', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // tell vitest we use mocked time
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(date);
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  test('outputs the logs as expected', async () => {
    const { user, checkConsoleLog } = renderWithSetup(<TestComponent />);

    checkConsoleLog('TestComponent-effect-debug', {
      changedDeps: {
        // [`${depKey}0`]: { prev: undefined, new: '0' },
        // [`${depKey}1`]: { prev: undefined, new: 0 },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: 0,
    });
    checkConsoleLog('TestComponent useEffect ran');

    expect(screen.getByText('String: 0'));
    expect(screen.getByText('Number: 0'));

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }));
    });

    checkConsoleLog('TestComponent-effect-debug', {
      changedDeps: {
        [`${depKey}0`]: { prev: '0', new: '1' },
        [`${depKey}1`]: { prev: 0, new: 1 },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestComponent useEffect ran');

    expect(screen.getByText('String: 1'));
    expect(screen.getByText('Number: 1'));

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }));
    });

    checkConsoleLog('TestComponent-effect-debug', {
      changedDeps: {
        [`${depKey}0`]: { prev: '1', new: '2' },
        [`${depKey}1`]: { prev: 1, new: 2 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 2,
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestComponent useEffect ran');

    expect(screen.getByText('String: 2'));
    expect(screen.getByText('Number: 2'));

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }));
    });

    checkConsoleLog('TestComponent-effect-debug', {
      changedDeps: {
        [`${depKey}0`]: { prev: '2', new: '3' },
        [`${depKey}1`]: { prev: 2, new: 3 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 4,
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestComponent useEffect ran');

    expect(screen.getByText('String: 3'));
    expect(screen.getByText('Number: 3'));

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }));
    });

    checkConsoleLog('TestComponent-effect-debug', {
      changedDeps: {
        [`${depKey}0`]: { prev: '3', new: '4' },
        [`${depKey}1`]: { prev: 3, new: 4 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 6,
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestComponent useEffect ran');

    expect(screen.getByText('String: 4'));
    expect(screen.getByText('Number: 4'));
  });

  // Primitives: string, number, bigint, boolean, symbol, null and undefined
  test('handles primitives as expected', async () => {
    const initialSymbol = Symbol(0);
    const updatedSymbol = Symbol(1);

    const { user, checkConsoleLog, checkNoConsoleLog } = renderWithSetup(
      <TestPrimitivesComponent
        initialSymbol={initialSymbol}
        updatedSymbol={updatedSymbol}
      />,
    );

    // Check the handling of the mounted initial values
    checkConsoleLog('TestPrimitivesComponent-effect-debug', {
      changedDeps: {
        // [`${depKey}0`]: { prev: undefined, new: '0' },
        // [`${depKey}1`]: { prev: undefined, new: 0 },
        // [`${depKey}2`]: { prev: undefined, new: BigInt(0) },
        // [`${depKey}3`]: { prev: undefined, new: false },
        // [`${depKey}4`]: { prev: undefined, new: initialSymbol },
        // [`${depKey}5`]: { prev: undefined, new: null },
        // // `[`${depKey}6`]` should not appear as a result of initial value being `undefined`
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: 0,
    });
    checkConsoleLog('TestPrimitivesComponent useEffect ran');

    expect(screen.getByText('String: 0'));
    expect(screen.getByText('Number: 0'));
    expect(screen.getByText(`Bigint: ${BigInt(0)}`));
    expect(screen.getByText('Boolean: false'));
    expect(screen.getByText(`Symbol: ${String(initialSymbol)}`));
    expect(screen.getByText('NullVal: null'));
    expect(screen.getByText('UndefinedVal: undefined'));

    // NOTE: Checking each data type seperately shows that each does not appear when it has not been changed

    // String
    await act(async () => {
      await user.click(
        screen.getByRole('button', { name: 'Increment String' }),
      );
    });

    checkConsoleLog('TestPrimitivesComponent-effect-debug', {
      changedDeps: {
        [`${depKey}0`]: { prev: '0', new: '1' },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestPrimitivesComponent useEffect ran');

    expect(screen.getByText('String: 1'));

    // Number
    await act(async () => {
      await user.click(
        screen.getByRole('button', { name: 'Increment Number' }),
      );
    });

    checkConsoleLog('TestPrimitivesComponent-effect-debug', {
      changedDeps: {
        [`${depKey}1`]: { prev: 0, new: 1 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 2,
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestPrimitivesComponent useEffect ran');

    expect(screen.getByText('Number: 1'));

    // Bigint
    await act(async () => {
      await user.click(
        screen.getByRole('button', { name: 'Increment Bigint' }),
      );
    });

    checkConsoleLog('TestPrimitivesComponent-effect-debug', {
      changedDeps: {
        [`${depKey}2`]: { prev: BigInt(0), new: BigInt(1) },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 4,
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestPrimitivesComponent useEffect ran');

    expect(screen.getByText(`Bigint: ${BigInt(1)}`));

    // Boolean
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Toggle Boolean' }));
    });

    checkConsoleLog('TestPrimitivesComponent-effect-debug', {
      changedDeps: {
        [`${depKey}3`]: { prev: false, new: true },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 6,
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestPrimitivesComponent useEffect ran');

    expect(screen.getByText('Boolean: true'));

    // Symbol
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update Symbol' }));
    });

    checkConsoleLog('TestPrimitivesComponent-effect-debug', {
      changedDeps: {
        [`${depKey}4`]: { prev: initialSymbol, new: updatedSymbol },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 8,
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestPrimitivesComponent useEffect ran');

    expect(screen.getByText(`Symbol: ${String(updatedSymbol)}`));

    // Null
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update NullVal' }));
    });

    checkNoConsoleLog(2);

    expect(screen.getByText('NullVal: null'));

    // Undefined
    await act(async () => {
      await user.click(
        screen.getByRole('button', { name: 'Update UndefinedVal' }),
      );
    });

    checkNoConsoleLog(2);

    expect(screen.getByText('UndefinedVal: undefined'));
  });

  // TODO: Find a better way to test standard and memoized functions without simulating behaviour
  test('handles functions as expected', async () => {
    const initialFunction = () => console.log('initialFunction ran');
    const rerenderedFunction = () => console.log('rerenderedFunction ran');
    const depsChangedFunction = () => console.log('depsChangedFunction ran');
    const initialMemoizedFunction = () => console.log('initialMemoizedFunction ran');
    const depsChangedMemoizedFunction = () => console.log('depsChangedMemoizedFunction ran');

    const { user, checkConsoleLog } = renderWithSetup(
      <TestFunctionComponent
        initialFunction={initialFunction}
        rerenderedFunction={rerenderedFunction}
        depsChangedFunction={depsChangedFunction}
        initialMemoizedFunction={initialMemoizedFunction}
        depsChangedMemoizedFunction={depsChangedMemoizedFunction}
      />,
    );

    checkConsoleLog('TestFunctionComponent-effect-debug', {
      changedDeps: {
        // [`${depKey}0`]: { prev: undefined, new: initialFunction },
        // [`${depKey}1`]: { prev: undefined, new: initialMemoizedFunction },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: 0,
    });
    checkConsoleLog('TestFunctionComponent useEffect ran');

    await act(async () => {
      await user.click(
        screen.getByRole('button', { name: 'Trigger Rerender' }),
      );
    });

    checkConsoleLog('TestFunctionComponent-effect-debug', {
      changedDeps: {
        [`${depKey}0`]: { prev: initialFunction, new: rerenderedFunction },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestFunctionComponent useEffect ran');

    await act(async () => {
      await user.click(
        screen.getByRole('button', {
          name: 'Trigger Memoized Function Deps Change',
        }),
      );
    });

    checkConsoleLog('TestFunctionComponent-effect-debug', {
      changedDeps: {
        [`${depKey}0`]: { prev: rerenderedFunction, new: depsChangedFunction },
        [`${depKey}1`]: {
          prev: initialMemoizedFunction,
          new: depsChangedMemoizedFunction,
        },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 2,
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestFunctionComponent useEffect ran');
  });

  test('handles an object as expected', async () => {
    // NOTE: Objects have the exact same structure, but memory references are different
    const initialObject = { test: 'test' };
    const updatedObject = { test: 'test' };

    const { user, checkConsoleLog } = renderWithSetup(
      <TestObjectComponent
        initialObject={initialObject}
        updatedObject={updatedObject}
      />,
    );

    checkConsoleLog('TestObjectComponent-effect-debug', {
      changedDeps: {
        // [`${depKey}0`]: { prev: undefined, new: initialObject },
        // [`${depKey}1`]: { prev: undefined, new: 0 },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: 0,
    });
    checkConsoleLog('TestObjectComponent useEffect ran');

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update Object' }));
    });

    checkConsoleLog('TestObjectComponent-effect-debug', {
      changedDeps: {
        [`${depKey}0`]: { prev: initialObject, new: updatedObject },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestObjectComponent useEffect ran');

    expect(screen.getByText(`Object: ${updatedObject}`));
    expect(screen.getByText('OtherDep: 0'));

    // NOTE: This test shows that a date does not appear when it has not been changed

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update OtherDep' }));
    });

    checkConsoleLog('TestObjectComponent-effect-debug', {
      changedDeps: {
        [`${depKey}1`]: { prev: 0, new: 1 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 2,
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestObjectComponent useEffect ran');

    expect(screen.getByText('OtherDep: 1'));
  });

  test('handles a date as expected', async () => {
    const initialDate = new Date('2001-02-02T12:00:00');
    const updatedDate = new Date('2001-02-02T13:00:00');

    const { user, checkConsoleLog, rerender } = renderWithSetup(
      <TestDateComponent
        initialDate={initialDate}
        updatedDate={updatedDate}
      />,
    );

    checkConsoleLog('TestDateComponent-effect-debug', {
      changedDeps: {
        // [`${depKey}0`]: { prev: undefined, new: initialDate },
        // [`${depKey}1`]: { prev: undefined, new: 0 },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: 0,
    });
    checkConsoleLog('TestDateComponent useEffect ran');

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update Date' }));
    });

    checkConsoleLog('TestDateComponent-effect-debug', {
      changedDeps: {
        [`${depKey}0`]: { prev: initialDate, new: updatedDate },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: renderTime * 2,
    });
    checkConsoleLog('TestDateComponent useEffect ran');

    screen.getByText(`Date: ${updatedDate}`);
    expect(screen.getByText('OtherDep: 0'));

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update OtherDep' }));
    });

    checkConsoleLog('TestDateComponent-effect-debug', {
      changedDeps: {
        [`${depKey}1`]: { prev: 0, new: 1 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 2,
      timeSinceLastRender: expect.any(Number),
    });
    checkConsoleLog('TestDateComponent useEffect ran');

    screen.getByText('OtherDep: 1');
  });
});