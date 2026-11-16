// El receptor configurado debe responder { confirmado: true, acuse: "..." }.
// Un folio estable le permite deduplicar reintentos si se interrumpe la conexión.
export async function entregarAviso(url, token, aviso) {
  const destino = new URL(url);
  if (destino.protocol !== 'https:' || !token) {
    throw new Error('La integración necesita HTTPS y un token configurado.');
  }
  const res = await fetch(destino, {
    method: 'POST',
    redirect: 'error',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
      'Idempotency-Key': aviso.folio,
    },
    body: JSON.stringify(aviso),
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) {
    throw new Error('El receptor no confirmó la entrega.');
  }
  const data = await res.json();
  if (
    data.confirmado !== true ||
    typeof data.acuse !== 'string' ||
    !data.acuse.trim() ||
    data.acuse.length > 100
  ) {
    throw new Error('El receptor devolvió un acuse inválido.');
  }
  return { confirmado: true, acuse: data.acuse, modo: 'REAL' };
}

export async function avisarEscolares(aviso) {
  if (!process.env.ESCOLARES_WEBHOOK_URL) {
    return { confirmado: true, acuse: 'PRUEBA-' + aviso.folio, modo: 'SIMULADO' };
  }
  return entregarAviso(
    process.env.ESCOLARES_WEBHOOK_URL,
    process.env.ESCOLARES_WEBHOOK_TOKEN,
    aviso,
  );
}
