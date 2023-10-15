import React, { createContext, useState, useEffect } from 'react'
import { initFiles } from './files'
import { utoa } from './utils'
import { Files } from './types.ts'

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

interface PlaygroundProps {
  files: Files
  filesHash: string
  theme: Theme
  selectedFileName: string
  setSelectedFileName: (fileName: string) => void
  setTheme: (theme: Theme) => void
  setFiles: (files: Files) => void
  addFile: (fileName: string) => void
  removeFile: (fileName: string) => void
  updateFileName: (oldFieldName: string, newFieldName: string) => void
  changeTheme: (theme: Theme) => void
}

const initialContext = {
  files: initFiles,
  theme: Theme.DARK,
  selectedFileName: 'main.jsx'
}

const STORAGE_DARK_THEME = 'react-playground-prefer-dark'

export const PlaygroundContext = createContext<PlaygroundProps>(initialContext as PlaygroundProps)

export const PlaygroundProvider = (props: { children: React.ReactElement }) => {
  const { children } = props

  const [files, setFiles] = useState(initialContext.files)
  const [theme, setTheme] = useState(initialContext.theme)
  const [selectedFileName, setSelectedFileName] = useState(initialContext.selectedFileName)
  const [filesHash, setFilesHash] = useState('')

  const addFile = (name: string) => {
    files[name] = {
      name,
      language: 'javascript',
      value: ''
    }
    setFiles({ ...files })
  }

  const removeFile = (name: string) => {
    delete files[name]
    setFiles({ ...files })
  }

  // TODO 根据文件名后缀匹配文件类型
  const updateFileName = (oldFieldName: string, newFieldName: string) => {
    if (!files[oldFieldName] || newFieldName === undefined || newFieldName === null) return
    const { [oldFieldName]: value, ...rest } = files
    const newFile = {
      [newFieldName]: {
        ...value,
        name: newFieldName
      }
    }
    setFiles({
      ...rest,
      ...newFile
    })
  }

  useEffect(() => {
    window.location.hash = utoa(JSON.stringify(files))
    setFilesHash(window.location.hash)
  }, [files])

  const changeTheme = (theme: Theme) => {
    sessionStorage.setItem(STORAGE_DARK_THEME, String(theme === Theme.DARK))
    document.querySelector('body')?.setAttribute('class', theme)
    setTheme(theme)
  }

  useEffect(() => {
    const isDarkTheme = JSON.parse(sessionStorage.getItem(STORAGE_DARK_THEME) || 'false')
    changeTheme(isDarkTheme ? Theme.DARK : Theme.LIGHT)
  }, [])

  return (
    <PlaygroundContext.Provider
      value={{
        theme,
        filesHash,
        setTheme,
        changeTheme,
        files,
        selectedFileName,
        setSelectedFileName,
        setFiles,
        addFile,
        removeFile,
        updateFileName
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  )
}
