import MonacoEditor, { Monaco } from '@monaco-editor/react'
import React, { useEffect, useMemo, useRef, useContext, useCallback } from 'react'

import './jsx-highlight.less'
import './userWoker.ts'
import { MonacoEditorConfig } from './config'
import { useEditor } from './useEditor'
import { PlaygroundContext } from '../../PlaygroundContext'
import { Theme } from '../../types.ts'

interface Props {
  file: any
  theme: Theme
  onChange?: () => void
  options?: any
}

export const Editor: React.FC<Props> = ({ file, theme, onChange, options }) => {
  const editorRef = useRef<any>(null)
  const { doOpenEditor, loadJsxSyntaxHighlight, initExtraLibs } = useEditor()
  const { files, setSelectedFileName } = useContext(PlaygroundContext)
  const jsxSyntaxHighlight = useRef<any>({ highlighter: null })

  const handleEditorDidMount = useCallback((editor: any, monaco: Monaco) => {
    editorRef.current = editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // ignore save event
    })

    // setTimeout(() => {
    //   editor.getAction('editor.action.formatDocument').run()
    // }, 300)

    // 初始化文件model
    Object.entries(files).forEach(([key, item]) => {
      if (!monaco?.editor?.getModel(monaco.Uri.parse(`file:///${key}`))) {
        monaco?.editor?.createModel(
          files[key].value,
          item.language,
          monaco.Uri.parse(`file:///${key}`)
        )
      }
    })

    // 覆盖原点击变量跳转方法
    editor._codeEditorService.doOpenEditor = function (editor: any, input: any) {
      const path = input.resource.path
      setSelectedFileName(path.replace('/', ''))
      if (!path.startsWith('/node_modules/')) {
        doOpenEditor(editor, input)
      }
    }

    // 加载 类型定义文件
    initExtraLibs(monaco)

    // 初始化jsx高亮线程
    jsxSyntaxHighlight.current = loadJsxSyntaxHighlight(editor, monaco)
    jsxSyntaxHighlight.current?.highlighter()
    return jsxSyntaxHighlight.current?.dispose
  }, [])

  const handleEditorValidation = (markers: { message: string }[]) => {
    markers.forEach(marker => {
      console.log('onValidate:', marker.message)
    })
  }

  useEffect(() => {
    editorRef.current?.focus()
    jsxSyntaxHighlight?.current?.highlighter?.()
  }, [file.name])

  return useMemo(
    () => (
      <MonacoEditor
        className='editor'
        height='100%'
        theme={`vs-${theme}`}
        path={file.name}
        language={file.language}
        value={file.value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        onValidate={handleEditorValidation}
        options={{
          ...MonacoEditorConfig,
          ...options
        }}
      />
    ),
    [file, theme]
  )
}
