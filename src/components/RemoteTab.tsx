import { useAppStore } from '../state/appStore'
import { RemotePanel } from './RemotePanel'

/**
 * Library "Remote" tab. Same app runs on both devices — this screen offers both
 * roles so the user picks per device:
 *  - the phone/teleprompter enables "be controlled" (RemotePanel), and
 *  - the laptop taps "Control another device" to open the full-screen controller.
 */
export function RemoteTab() {
  const openRemote = useAppStore((s) => s.openRemote)

  return (
    <div className="remote-tab">
      <section className="remote-tab__card">
        <h3>This device is the teleprompter</h3>
        <p className="remote-tab__sub">
          Turn this on so another device (your laptop) can control it over the same WiFi.
        </p>
        <RemotePanel />
      </section>

      <section className="remote-tab__card">
        <h3>Control another device</h3>
        <p className="remote-tab__sub">
          Use this device (your laptop) to drive the teleprompter running on your phone.
        </p>
        <button className="btn btn--primary" onClick={openRemote} type="button">
          Open remote control
        </button>
      </section>
    </div>
  )
}
