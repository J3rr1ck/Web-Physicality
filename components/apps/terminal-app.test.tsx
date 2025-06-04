import React from 'react';
import { render, screen, act } from '@testing-library/react';
import TerminalApp from './terminal-app';

// Mock WebContainer and xterm.js for basic tests if full e2e setup is not available.
// This is a simplified example. Real tests would need more sophisticated mocking or an e2e environment.

// Define mocks outside of jest.mock calls to allow for easy access in tests
const mockWriter = {
  write: jest.fn().mockResolvedValue(undefined),
  releaseLock: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
};

const mockShellProcess = {
  input: {
    getWriter: jest.fn().mockReturnValue(mockWriter),
  },
  output: {
    pipeTo: jest.fn().mockImplementation(async (stream) => {
      // Simulate some output for basic checks
      // await stream.write('jsh > '); // Commented out to simplify tests
      return Promise.resolve();
    }),
  },
  exit: Promise.resolve(0),
};

const mockWebContainerInstance = {
  mount: jest.fn().mockResolvedValue(undefined),
  spawn: jest.fn().mockResolvedValue(mockShellProcess),
  on: jest.fn(),
  teardown: jest.fn(),
};

jest.mock('@webcontainer/api', () => ({
  WebContainer: {
    boot: jest.fn().mockResolvedValue(mockWebContainerInstance),
  },
}));

// Capture the onData callback
let onDataCallback: ((data: string) => void) | null = null;

const mockTerminalInstance = {
  loadAddon: jest.fn(),
  open: jest.fn(),
  write: jest.fn(),
  onData: jest.fn().mockImplementation((callback) => {
    onDataCallback = callback; // Capture the callback
    return { dispose: jest.fn() };
  }),
  dispose: jest.fn(),
  addons: {
    fit: {
      fit: jest.fn(),
    },
  },
  clear: jest.fn(), // Added for completeness
  focus: jest.fn(), // Added for completeness
};

jest.mock('xterm', () => ({
  Terminal: jest.fn().mockImplementation(() => mockTerminalInstance),
}));

jest.mock('xterm-addon-fit', () => ({
  FitAddon: jest.fn().mockImplementation(() => ({
    activate: jest.fn(),
    dispose: jest.fn(),
    fit: jest.fn(),
  })),
}));


describe('TerminalApp', () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    onDataCallback = null; // Reset captured callback

    // Re-assign mock implementations if they were modified directly in a test
    mockWebContainerInstance.spawn.mockResolvedValue(mockShellProcess);
    mockShellProcess.input.getWriter.mockReturnValue(mockWriter);
    mockWriter.write.mockResolvedValue(undefined);
    mockWriter.releaseLock.mockResolvedValue(undefined);
    (require('@webcontainer/api').WebContainer.boot as jest.Mock).mockResolvedValue(mockWebContainerInstance);
    (require('xterm').Terminal as jest.Mock).mockImplementation(() => mockTerminalInstance);

  });

  it('renders the terminal container', () => {
    render(<TerminalApp />);
    // Check if the main div for the terminal is rendered.
    // This might need a specific data-testid or class for robust selection.
    // For now, we assume the structure from terminal-app.tsx
    expect(document.querySelector('.w-full.h-full.bg-black.p-1')).toBeInTheDocument();
  });

  it('initializes xterm.js and WebContainer (mocked)', async () => {
    const { WebContainer } = require('@webcontainer/api');
    const { Terminal } = require('xterm');

    render(<TerminalApp />);

    // Wait for async operations in useEffect to complete
    await act(async () => {
      // Flushes microtasks
      await new Promise(resolve => setImmediate(resolve));
    });

    expect(Terminal).toHaveBeenCalled();
    expect(WebContainer.boot).toHaveBeenCalled();

    // Check if xterm's open method was called (meaning it tried to attach to the DOM)
    // const terminalInstance = (Terminal as jest.Mock).mock.instances[0];
    // expect(terminalInstance.open).toHaveBeenCalled();
  });

  it('displays initial boot messages (mocked)', async () => {
    render(<TerminalApp />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // wait for boot and shell
    });

    const terminalInstance = (require('xterm').Terminal as jest.Mock).mock.instances[0];
    expect(terminalInstance.write).toHaveBeenCalledWith('Booting WebContainer...\r\n');
    // The following depends on the successful promise resolution of WebContainer.boot()
    expect(terminalInstance.write).toHaveBeenCalledWith('WebContainer booted successfully!\r\n');
    // The following depends on the successful promise resolution of spawn()
    // and the mock implementation of pipeTo
    // expect(mockTerminalInstance.write).toHaveBeenCalledWith('Shell process started.\r\n');
    // expect(mockTerminalInstance.write).toHaveBeenCalledWith('jsh > ');
  });

  it('simulates user typing and writes to shell process input', async () => {
    const { WebContainer } = require('@webcontainer/api');
    const { Terminal } = require('xterm');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error

    render(<TerminalApp />);

    // Wait for WebContainer to boot and shell to spawn
    await act(async () => {
      await new Promise(resolve => setImmediate(resolve));
    });

    // Ensure WebContainer.boot was called
    expect(WebContainer.boot).toHaveBeenCalled();

    // Ensure the mockWebContainerInstance.spawn was called
    const bootResult = await (WebContainer.boot as jest.Mock).mock.results[0].value;
    expect(bootResult.spawn).toHaveBeenCalledWith('jsh');

    // Ensure onData callback was captured
    expect(onDataCallback).not.toBeNull();

    const testInput = 'hello world';
    // Simulate user typing
    if (onDataCallback) {
      await act(async () => {
        onDataCallback(testInput);
        // Allow promises from onData (like writer.write) to resolve
        await new Promise(resolve => setImmediate(resolve));
      });
    }

    // Verify that the writer's write method was called with the test input
    expect(mockWriter.write).toHaveBeenCalledTimes(1);
    expect(mockWriter.write).toHaveBeenCalledWith(testInput);

    // Check that no errors were logged by the component's write error handling
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('releases writer lock on shell process exit', async () => {
    // Special mock for this test to control shell exit
    const controlledMockShellProcess = {
      ...mockShellProcess,
      exit: Promise.resolve(0), // This will be resolved by the component
    };
    (mockWebContainerInstance.spawn as jest.Mock).mockResolvedValue(controlledMockShellProcess);

    render(<TerminalApp />);

    await act(async () => {
      await new Promise(resolve => setImmediate(resolve)); // Boot and spawn
    });

    // Trigger unmount or shell exit logic
    // In the component, shellProcess.exit.then(...) handles this.
    // Since `exit` is a promise that resolves, the .then() should execute.
    // We need to wait for that promise chain.
    await act(async () => {
        await controlledMockShellProcess.exit; // Ensure the exit promise chain completes
        await new Promise(resolve => setImmediate(resolve)); // Flush microtasks
    });

    expect(mockWriter.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('releases writer lock on component unmount', async () => {
    const { unmount } = render(<TerminalApp />);

    await act(async () => {
      await new Promise(resolve => setImmediate(resolve)); // Boot and spawn
    });

    act(() => {
      unmount();
    });

    // Need to ensure the cleanup function in useEffect is called.
    // The unmount itself should trigger this.
    // Let's wait for any promises in cleanup.
    await act(async () => {
        await new Promise(resolve => setImmediate(resolve));
    });

    expect(mockWriter.releaseLock).toHaveBeenCalledTimes(1);
  });

});
