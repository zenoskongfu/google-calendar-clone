import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { cc } from "../utils/cc"

export type ModalProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
}

let index = 0;

declare global{
  interface Window {
    [key: `div${number}`]: HTMLDivElement
  }
}


export function Modal({ children, isOpen, onClose }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const prevIsOpen = useRef<boolean>()

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handler)

    return () => {
      document.removeEventListener("keydown", handler)
    }
  }, [onClose])

  useLayoutEffect(() => {
    if (!isOpen && prevIsOpen.current) {
      setIsClosing(true)
    }

    prevIsOpen.current = isOpen
  }, [isOpen])


  const divRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    
    setTimeout(()=>{
      console.log('ref: ',divRef.current, isOpen, isClosing, index)
      window[('div'+index++) as 'div1' | 'div2'] = divRef.current!;
    },0)
    
  },[isOpen,isClosing])

  if (!isOpen && !isClosing) return null

  return createPortal(
    <div
      ref={divRef}
      onAnimationEnd={() => setIsClosing(false)}
      className={cc("modal", isClosing && "closing")}
    >
      <div className="overlay" onClick={onClose} />
      <div className="modal-body">{children}</div>
    </div>,
    document.querySelector("#modal-container") as HTMLElement
  )
}
