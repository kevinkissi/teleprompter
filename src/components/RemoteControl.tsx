import { useEffect, useRef, useState } from 'react'
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
  /** The slide we last asked for, held until the phone confirms it. Without
   *  this, two quick taps both compute their target from the same echoed index
   *  and the second one is a no-op. */
  const [pendingSlide, setPendingSlide] = useState<number | null>(null)
  const pendingSince = useRef(0)
  const echoedIndex = rs?.slideIndex ?? -1

  const connected = role === 'controller' && status === 'connected'

  function back() {
    disconnect()
    closeRemote()
  }

  // Release the optimistic index once the phone agrees — or after a second, so
  // a dropped command can never wedge the display on a slide it never reached.
  useEffect(() => {
    if (pendingSlide === null) return
    if (echoedIndex === pendingSlide) {
      setPendingSlide(null)
      return
    }
    const t = setTimeout(() => setPendingSlide(null), 1000)
    return () => clearTimeout(t)
  }, [pendingSlide, echoedIndex])

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
  // '' means the phone predates Slide Mode — not a mode, so the controls stay
  // hidden rather than sending commands it would silently drop.
  const slidesSupported = (rs?.protocolVersion ?? 1) >= 3 && rs?.playbackMode !== ''
  const inSlides = rs?.playbackMode === 'slide'
  const autoAdvance = inSlides && rs?.slideAdvance === 'auto'
  const slideCount = rs?.slideCount ?? 0
  const slideIndex = pendingSlide ?? echoedIndex

  const cmd = (c: RemoteCommand) => () => send(c)

  /** Absolute, like the desktop's — a relative step can never drift. */
  const goSlide = (index: number) => () => {
    if (slideCount <= 0) return
    const next = Math.min(Math.max(0, index), slideCount - 1)
    setPendingSlide(next)
    pendingSince.current = Date.now()
    send({ action: 'gotoSlide', index: next })
  }

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
              {inReader && inSlides
                ? ` · slide ${slideIndex + 1} of ${slideCount}`
                : inReader
                  ? ` · ${rs?.speedWpm ?? 0} WPM · -${formatDuration(rs?.remainingSeconds ?? 0)}`
                  : ''}
            </div>
            <div className="progress" aria-hidden="true">
              <div
                className="progress__bar"
                style={{
                  width: `${Math.round(
                    (inSlides && slideCount > 1
                      ? slideIndex / (slideCount - 1)
                      : (rs?.progress ?? 0)) * 100,
                  )}%`,
                }}
              />
            </div>
          </div>

          {!inReader && (
            <p className="remote__hint">
              Tap <strong>Scripts</strong> above to start prompting one on the phone.
            </p>
          )}

          {slidesSupported && (
            <div className="remote__grid remote__grid--four">
              <Key
                icon="list"
                label={inSlides ? 'Slides' : 'Scroll'}
                onClick={cmd({ action: 'setPlaybackMode', mode: inSlides ? 'continuous' : 'slide' })}
              />
              {inSlides && (
                <Key
                  icon={autoAdvance ? 'play' : 'chevron'}
                  label={autoAdvance ? 'Auto' : 'Manual'}
                  onClick={cmd({
                    action: 'setSlideAdvance',
                    advance: autoAdvance ? 'manual' : 'auto',
                  })}
                />
              )}
              {/* Freezes the script only. Whatever is recording keeps recording. */}
              <Key
                icon="pause"
                label={rs?.prompterPaused ? 'Resume' : 'Hold'}
                onClick={cmd({ action: rs?.prompterPaused ? 'resumePrompter' : 'pausePrompter' })}
                disabled={!inReader}
              />
            </div>
          )}

          <div className="remote__grid">
            <Key
              icon="top"
              label={inSlides ? 'First' : 'Top'}
              onClick={cmd({ action: 'top' })}
              disabled={!inReader}
            />
            <Key
              icon="rewind"
              label={inSlides ? 'Prev' : '-5s'}
              onClick={inSlides ? goSlide(slideIndex - 1) : cmd({ action: 'nudge', seconds: -5 })}
              disabled={!inReader}
            />
            {inSlides && !autoAdvance ? (
              <Key
                icon="forward"
                label="Next"
                onClick={goSlide(slideIndex + 1)}
                variant="primary"
                disabled={!inReader}
              />
            ) : (
              <Key
                icon={playing ? 'pause' : 'play'}
                label={playing ? 'Pause' : 'Play'}
                onClick={cmd({ action: 'togglePlay' })}
                variant="primary"
                disabled={!inReader}
              />
            )}
            <Key
              icon="forward"
              label={inSlides ? 'Next' : '+5s'}
              onClick={inSlides ? goSlide(slideIndex + 1) : cmd({ action: 'nudge', seconds: 5 })}
              disabled={!inReader}
            />
            <Key
              icon="bottom"
              label={inSlides ? 'Last' : 'End'}
              onClick={cmd({ action: 'bottom' })}
              disabled={!inReader}
            />
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
