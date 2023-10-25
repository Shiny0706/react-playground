import React, { useRef } from 'react'

import styles from './index.module.less'

interface Props {
  message: string
  onConfirm: () => void
  children: React.ReactNode
}

export const Dialog: React.FC<Props> = props => {
  const { message, onConfirm, children } = props
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    dialogRef.current?.showModal()
  }

  return (
    <span onClick={e => e.stopPropagation()}>
      <span onClick={handleOpen}>{children}</span>
      <dialog ref={dialogRef} className={styles.dialog}>
        <span className={styles.content}>
          <svg
            viewBox='64 64 896 896'
            focusable='false'
            data-icon='exclamation-circle'
            width='1em'
            height='1em'
            fill='currentColor'
            aria-hidden='true'
          >
            <path d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z'></path>
            <path d='M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z'></path>
          </svg>
          {message}
        </span>
        <form method='dialog'>
          <div className={styles['dialog-footer']}>
            <button onClick={() => dialogRef.current?.close()}>取 消</button>
            <button className={styles['dialog-btn']} onClick={onConfirm}>
              确 定
            </button>
          </div>
        </form>
      </dialog>
    </span>
  )
}
