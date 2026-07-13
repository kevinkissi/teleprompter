import type { DataConnection } from 'peerjs'
import type { WireMessage } from './protocol'

/**
 * WebRTC data-channel transport via PeerJS. The public PeerJS broker is used only
 * for the brief pairing handshake; the actual control messages flow peer-to-peer
 * (direct over the local WiFi). PeerJS is imported dynamically so it lands in its
 * own chunk and never weighs down the offline-first core.
 */

// Namespace prefix on the shared public broker so our short codes don't collide
// with unrelated PeerJS apps.
const PREFIX = 'pof-tp-'

export type TransportStatus = 'connecting' | 'waiting' | 'connected' | 'disconnected' | 'error'

export interface TransportHandle {
  send: (msg: WireMessage) => void
  close: () => void
}

interface Callbacks {
  onStatus: (status: TransportStatus, errorType?: string) => void
  onMessage: (msg: WireMessage) => void
}

function wireConnection(conn: DataConnection, cb: Callbacks): void {
  conn.on('open', () => cb.onStatus('connected'))
  conn.on('data', (d) => cb.onMessage(d as WireMessage))
  conn.on('close', () => cb.onStatus('disconnected'))
  conn.on('error', () => cb.onStatus('disconnected'))
}

/** Phone side: register under `code` and wait for the laptop to connect. */
export async function startHost(code: string, cb: Callbacks): Promise<TransportHandle> {
  const { Peer } = await import('peerjs')
  const peer = new Peer(PREFIX + code)
  let conn: DataConnection | null = null

  peer.on('open', () => cb.onStatus('waiting'))
  peer.on('error', (e) => cb.onStatus('error', (e as { type?: string })?.type ?? 'error'))
  peer.on('connection', (c) => {
    // Latest controller wins; drop any previous one.
    if (conn && conn !== c) {
      try {
        conn.close()
      } catch {
        /* ignore */
      }
    }
    conn = c
    wireConnection(c, cb)
  })

  return {
    send: (m) => {
      if (conn && conn.open) conn.send(m)
    },
    close: () => {
      try {
        conn?.close()
      } catch {
        /* ignore */
      }
      peer.destroy()
    },
  }
}

/** Laptop side: connect to the phone registered under `code`. */
export async function startController(code: string, cb: Callbacks): Promise<TransportHandle> {
  const { Peer } = await import('peerjs')
  const peer = new Peer()
  let conn: DataConnection | null = null

  cb.onStatus('connecting')
  peer.on('open', () => {
    conn = peer.connect(PREFIX + code, { reliable: true })
    wireConnection(conn, cb)
  })
  peer.on('error', (e) => cb.onStatus('error', (e as { type?: string })?.type ?? 'error'))

  return {
    send: (m) => {
      if (conn && conn.open) conn.send(m)
    },
    close: () => {
      try {
        conn?.close()
      } catch {
        /* ignore */
      }
      peer.destroy()
    },
  }
}
