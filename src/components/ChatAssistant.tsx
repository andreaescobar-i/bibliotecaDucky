/*----
 * Programa: ChatAssistant.tsx
 * Objetivo: Ventana genérica del asistente Ducky conectada a la API (/api/chat). Es un diseño
 *           provisional para ver el funcionamiento; se reemplaza cuando exista el definitivo
 */

import { useEffect, useRef, useState } from 'react';
import { chatHistory, resetChat, sendChat, type ChatMessage } from '../api';

// Largo máximo de una pregunta; la API aplica el mismo límite (CHAT_MAX_CARACTERES)
const MAX_CHARS = 500;

const TOPICS = [
  '¿Cuál es el objetivo de Biblioteca Ducky?',
  '¿Qué incluye el sistema?',
  '¿En qué plataforma puedo usarlo?',
  '¿Cómo funciona la lista de espera?',
  '¿Qué puedo hacer en el sistema?',
  '¿Qué libros hay disponibles?',
  '¿Cuáles son mis préstamos y adeudos?',
  '¿Cuántos días dura un préstamo?',
];

// Mensaje de la conversación; "failed" marca un aviso de error que no viene del asistente
type Message = ChatMessage & { failed?: boolean };

const timeText = (value: string) =>
  new Date(value).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

export function ChatAssistant({ userName, close }: { userName?: string; close: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);

  // Al abrir la ventana se recupera la conversación abierta de la cuenta
  useEffect(() => {
    let active = true;
    chatHistory()
      .then((history) => active && setMessages(history))
      .catch((error) => active && setMessages([failure(error)]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // La lista siempre muestra el mensaje más reciente
  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [messages, sending]);

  function failure(error: unknown): Message {
    return {
      emisor: 'Ducky',
      texto: (error as Error).message,
      fecha: new Date().toISOString(),
      failed: true,
    };
  }

  async function send(question: string) {
    const clean = question.trim();
    if (!clean || sending) return;
    setMessages((m) => [
      ...m,
      { emisor: 'Usuario', texto: clean, fecha: new Date().toISOString() },
    ]);
    setText('');
    setSending(true);
    try {
      const reply = await sendChat(clean);
      setMessages((m) => [...m, reply]);
    } catch (error) {
      setMessages((m) => [...m, failure(error)]);
    } finally {
      setSending(false);
      box.current?.focus();
    }
  }

  async function restart() {
    if (sending) return;
    try {
      await resetChat();
      setMessages([]);
      setText('');
    } catch (error) {
      setMessages((m) => [...m, failure(error)]);
    }
    box.current?.focus();
  }

  const empty = !loading && messages.length === 0;
  return (
    <section className="chat-assistant" aria-label="Asistente Ducky">
      <header>
        <h2>Ducky · Asistente de biblioteca</h2>
        <p>Responde con los datos reales del catálogo y de tu cuenta.</p>
      </header>

      <div className="chat-list" ref={list} role="log" aria-live="polite">
        {loading && <p className="chat-note">Cargando conversación…</p>}
        {empty && (
          <p className="chat-note">
            Hola{userName ? `, ${userName.split(' ')[0]}` : ''}. Soy Ducky. Escribe tu pregunta o
            elige uno de los temas.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble ${m.emisor === 'Usuario' ? 'mine' : 'ducky'}${m.failed ? ' failed' : ''}`}
            role={m.failed ? 'alert' : undefined}
          >
            <small>
              {m.emisor === 'Usuario' ? 'Tú' : 'Ducky'} · {timeText(m.fecha)}
            </small>
            <p>{m.texto}</p>
          </div>
        ))}
        {sending && <p className="chat-note typing">Ducky está escribiendo…</p>}
      </div>

      {empty && (
        <div className="chat-topics" aria-label="Temas frecuentes">
          {TOPICS.map((topic) => (
            <button key={topic} className="action" onClick={() => void send(topic)}>
              {topic}
            </button>
          ))}
        </div>
      )}

      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          void send(text);
        }}
      >
        <textarea
          ref={box}
          aria-label="Escribe tu pregunta"
          placeholder="Escribe tu pregunta"
          rows={2}
          maxLength={MAX_CHARS}
          value={text}
          autoFocus
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Enter envía; Mayús + Enter agrega un renglón
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void send(text);
            }
          }}
        />
        <button className="action primary" type="submit" disabled={sending || !text.trim()}>
          {sending ? 'Enviando…' : 'Enviar'}
        </button>
      </form>

      <footer>
        <small>
          {text.length}/{MAX_CHARS}
        </small>
        <span>
          <button
            className="action"
            type="button"
            disabled={sending || empty}
            onClick={() => void restart()}
          >
            Reiniciar
          </button>
          <button className="action" type="button" onClick={close}>
            Cerrar
          </button>
        </span>
      </footer>
    </section>
  );
}
