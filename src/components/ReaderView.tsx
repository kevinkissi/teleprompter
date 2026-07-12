import { PromptDisplay } from './PromptDisplay'
import { ControlOverlay } from './ControlOverlay'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useAutoHideControls } from '../hooks/useAutoHideControls'

export function ReaderView() {
  useKeyboardShortcuts()
  useAutoHideControls(true)

  return (
    <div className="reader">
      <PromptDisplay />
      <ControlOverlay />
    </div>
  )
}
