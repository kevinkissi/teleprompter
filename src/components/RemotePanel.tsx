import { useRemoteStore } from '../remote/remoteStore'

/**
 * Phone (host) side: turn this device into a controllable teleprompter and show the
 * pairing code. Embedded in the Library "Remote" tab and the reader's remote sheet.
 */
export function RemotePanel() {
  const role = useRemoteStore((s) => s.role)
  const status = useRemoteStore((s) => s.status)
  const code = useRemoteStore((s) => s.code)
  const error = useRemoteStore((s) => s.error)
  const enableHost = useRemoteStore((s) => s.enableHost)
  const disconnect = useRemoteStore((s) => s.disconnect)

  if (role !== 'host') {
    return (
      <div className="remote-host">
        <p className="remote-host__hint">
          Let your laptop drive <strong>this</strong> phone. Tap below, then on the laptop open this
          same app and go to <strong>Remote</strong>.
        </p>
        <button className="btn btn--primary" onClick={() => void enableHost()} type="button">
          Enable remote control
        </button>
      </div>
    )
  }

  const connected = status === 'connected'
  return (
    <div className="remote-host">
      <div className="remote-code" aria-label="Pairing code">
        {code || '·····'}
      </div>
      <p className={'remote-status' + (connected ? ' remote-status--ok' : '')}>
        {status === 'connecting' && 'Starting…'}
        {status === 'waiting' &&
          'On your laptop: open this app → Remote → enter this code.'}
        {connected && 'Laptop connected. You can control this phone from your laptop.'}
        {status === 'error' &&
          `Couldn't start remote (${error}). Check your connection and try again.`}
        {status === 'disconnected' && 'Laptop disconnected. Waiting to reconnect…'}
      </p>
      <button className="btn btn--ghost" onClick={disconnect} type="button">
        Turn off remote
      </button>
    </div>
  )
}
