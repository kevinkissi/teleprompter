import { useState } from 'react'
import { useAppStore } from '../state/appStore'
import { useRemoteStore } from '../remote/remoteStore'
import { Icon, type IconName } from './Icon'
import { formatDuration } from '../utils/estimateReadTime'
import type { RemoteCommand } from '../remote/protocol'

/**
 * Laptop (controller) side, full-screen. Pairs to the phone by code, then drives it
 * and mirrors its live status. Runs as its own top-level view.
 */
export function RemoteControl() {
  const closeRemote = useAppStore((s) => s.closeRemote)
  const role = useRemoteStore((s) => s.role)
  const status = useRemoteStore((s) => s.status)
  const error = useRemoteStore((s) => s.error)
  const rs = useRemoteStore((s) => s.remoteState)
  const connectController = useRemoteStore((s) => s.connectController)
  const disconnect = useRemoteStore((s) => s.disconnect)
  const send = useRemoteStore((s) => s.sendCommand)

  const [code, setCode] = useState('')
  const [showScripts, setShowScripts] = useState(false)

  const connected = role === 'controller' && status === 'connected'

  function back() {
    disconnect()
    closeRemote()
  }

  if (!connected) {
    return (
      <div className="remote">
        <div className="remote__bar">
          <button className="btn btn--icon btn--ghost" onClick={back} aria-label="Back" type="button">
            <Icon name="back" />
          </button>
          <div className="remote__bar-title">Remote control</div>
          <span style={{ width: 44 }} />
        </div>
        <div className="remote__pair">
          <h2 style={{ margin: 0 }}>Control your teleprompter</h2>
          <p className="remote__hint">
            On your <strong>phone</strong>, open this app → <strong>Remote</strong> →{' '}
            <strong>Enable remote control</strong>. Then type the 5-character code it shows:
          </p>
          <input
            className="remote__code-input"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 5))}
            placeholder="ABC12"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Pairing code"
          />
          <button
            className="btn btn--primary btn--lg"
            disabled={code.trim().length < 5 || status === 'connecting'}
            onClick={() => void connectController(code)}
            type="button"
          >
            {status === 'connecting' ? 'Connecting…' : 'Connect'}
          </button>
          {status === 'error' && (
            <p className="remote__err">
              Couldn’t connect ({error}). Make sure the phone shows a code (remote is on) and both
              devices are on the same WiFi, then try again.
            </p>
          )}
          {status === 'disconnected' && (
            <p className="remote__err">Disconnected. Check the code and try again.</p>
          )}
        </div>
      </div>
    )
  }

  const playing = rs?.playing ?? false
  const inReader = rs?.view === 'reader'
  const title = rs?.currentTitle || (inReader ? 'Untitled' : 'No script open')

  const cmd = (c: RemoteCommand) => () => send(c)

  const Key = ({
    icon,
    label,
    onClick,
    variant,
    disabled,
  }: {
    icon: IconName
    label: string
    onClick: () => void
    variant?: 'primary'
    disabled?: boolean
  }) => (
    <button
      className={'remote-btn' + (variant === 'primary' ? ' remote-btn--primary' : '')}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <Icon name={icon} size={variant === 'primary' ? 30 : 24} />
      <span>{label}</span>
    </button>
  )

  return (
    <div className="remote">
      <div className="remote__bar">
        <button className="btn btn--icon btn--ghost" onClick={back} aria-label="Back" type="button">
          <Icon name="back" />
        </button>
        <div className="remote__bar-title">
          <span className="remote__dot" /> Connected
        </div>
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => setShowScripts((v) => !v)}
          type="button"
        >
          {showScripts ? 'Controls' : 'Scripts'}
        </button>
      </div>

      {showScripts ? (
        <div className="remote__scripts">
          {(rs?.scripts ?? []).map((s) => (
            <button
              key={s.id}
              className={
                'remote__script' + (s.id === rs?.currentScriptId ? ' remote__script--active' : '')
              }
              onClick={() => {
                send({ action: 'openScript', id: s.id })
                setShowScripts(false)
              }}
              type="button"
            >
              {s.title}
            </button>
          ))}
          {(!rs?.scripts || rs.scripts.length === 0) && (
            <p className="remote__hint">No scripts on the phone yet.</p>
          )}
        </div>
      ) : (
        <div className="remote__panel">
          <div className="remote__now">
            <div className="remote__now-title">{title}</div>
            <div className="remote__now-meta">
              {inReader
                ? playing
                  ? 'Playing'
                  : rs?.countingDown
                    ? 'Counting down…'
                    : rs?.ended
                      ? 'At the end'
                      : 'Paused'
                : 'On the library screen'}
              {inReader &&
                ` · ${rs?.speedWpm ?? 0} WPM · -${formatDuration(rs?.remainingSeconds ?? 0)}`}
            </div>
            <div className="progress" aria-hidden="true">
              <div
                className="progress__bar"
                style={{ width: `${Math.round((rs?.progress ?? 0) * 100)}%` }}
              />
            </div>
          </div>

          {!inReader && (
            <p className="remote__hint">
              Tap <strong>Scripts</strong> above to start prompting one on the phone.
            </p>
          )}

          <div className="remote__grid">
            <Key icon="top" label="Top" onClick={cmd({ action: 'top' })} disabled={!inReader} />
            <Key icon="rewind" label="-5s" onClick={cmd({ action: 'nudge', seconds: -5 })} disabled={!inReader} />
            <Key
              icon={playing ? 'pause' : 'play'}
              label={playing ? 'Pause' : 'Play'}
              onClick={cmd({ action: 'togglePlay' })}
              variant="primary"
              disabled={!inReader}
            />
            <Key icon="forward" label="+5s" onClick={cmd({ action: 'nudge', seconds: 5 })} disabled={!inReader} />
            <Key icon="bottom" label="End" onClick={cmd({ action: 'bottom' })} disabled={!inReader} />
          </div>

          <button
            className="remote-btn remote-btn--wide"
            onClick={cmd({ action: 'restart' })}
            disabled={!inReader}
            type="button"
          >
            <Icon name="top" size={22} />
            <span>Restart from top</span>
          </button>

          <div className="remote__grid remote__grid--four">
            <Key icon="minus" label="Slower" onClick={cmd({ action: 'speedDelta', delta: -5 })} />
            <Key icon="plus" label="Faster" onClick={cmd({ action: 'speedDelta', delta: 5 })} />
            <Key icon="minus" label="Font" onClick={cmd({ action: 'fontDelta', delta: -4 })} />
            <Key icon="font" label="Font +" onClick={cmd({ action: 'fontDelta', delta: 4 })} />
          </div>
        </div>
      )}
    </div>
  )
}
