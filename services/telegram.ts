import { TELEGRAM_CONFIG } from "@/config/services"

const sendMessage = async () => {
  const url = `${TELEGRAM_CONFIG.baseUrl}${TELEGRAM_CONFIG.token}/sendMessage`
  await fetch(url, {
    body: JSON.stringify({
      chat_id: TELEGRAM_CONFIG.chatId,
      text: `*🚨 Error Detectado*
      
Mensaje: prueba
Ruta: /cancion/hola`,
      parse_mode: "Markdown",
    }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const telegramService = {
  sendMessage,
}
