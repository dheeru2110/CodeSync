import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);
    useEffect(() => {  // useEffect hook is used to initialize the editor and listen for code changes from other users. 

        async function init() {  // async function init() is used to initialize the editor
            editorRef.current = Codemirror.fromTextArea(  
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,   // autoCloseTags is used to automatically close tags
                    autoCloseBrackets: true,  // autoCloseBrackets is used to automatically close brackets
                    lineNumbers: true,   
                }
            );

            editorRef.current.on('change', (instance, changes) => {  // editorRef.current.on('change', (instance, changes) => {}) is used to listen for code changes from other users
                const { origin } = changes;    // origin is a property of changes object
                const code = instance.getValue();       // instance.getValue() returns the code in the editor
                onCodeChange(code);   // onCodeChange is a function which is passed as a prop to Editor component from EditorPage component
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }
        init();
    }, []);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
