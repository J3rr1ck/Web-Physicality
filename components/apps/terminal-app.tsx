import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { WebContainer } from '@webcontainer/api';

interface TerminalAppProps {}

const TerminalApp: React.FC<TerminalAppProps> = ({}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const webContainerInstanceRef = useRef<WebContainer | null>(null);

  useEffect(() => {
    const initTerminal = async () => {
      if (terminalRef.current && !xtermRef.current) {
        const term = new Terminal({ cursorBlink: true });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();
        xtermRef.current = term;

        term.write('Booting WebContainer...\r\n');

        try {
          const webContainerInstance = await WebContainer.boot();
          webContainerInstanceRef.current = webContainerInstance;
          term.write('WebContainer booted successfully!\r\n');

          // This example uses a simple 'jsh' process.
          // For a minimal Ubuntu image, you would need to mount appropriate files.
          // This is a placeholder for where you would set up the Ubuntu environment.
          // For now, we'll run a simple shell.
          await webContainerInstance.mount({
            'index.js': {
              file: {
                contents: 'console.log("Hello from WebContainer!");',
              },
            },
            'package.json': {
              file: {
                contents: `
                  {
                    "name": "example-app",
                    "type": "module",
                    "dependencies": {
                      "jsh-is-awesome": "1.0.0"
                    },
                    "scripts": {
                      "start": "node index.js"
                    }
                  }
                `,
              },
            },
          });


          const shellProcess = await webContainerInstance.spawn('jsh');
          term.write('Shell process started.\r\n');


          // Pipe terminal input to the shell process
          term.onData(data => {
            shellProcess.input.write(data);
          });

          // Pipe shell output to the terminal
          shellProcess.output.pipeTo(new WritableStream({
            write(data) {
              term.write(data);
            }
          }));

          // Optional: Handle shell process exit
          shellProcess.exit.then((exitCode) => {
            term.write(`Shell process exited with code ${exitCode}\r\n`);
          });

        } catch (error) {
          term.write(`Error booting WebContainer: ${error}\r\n`);
          console.error('WebContainer boot error:', error);
        }
      }
    };

    initTerminal();

    const handleResize = () => {
      if (xtermRef.current) {
        // @ts-expect-error FitAddon is dynamically loaded
        xtermRef.current.addons.fit?.fit();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Optional: Dispose of the terminal and WebContainer instances
      // xtermRef.current?.dispose();
      // xtermRef.current = null;
      // webContainerInstanceRef.current?.teardown();
      // webContainerInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-full bg-black p-1">
      <div ref={terminalRef} className="w-full h-full" />
    </div>
  );
};

export default TerminalApp;
