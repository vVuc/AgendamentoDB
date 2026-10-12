const MS_POR_DIA = 24 * 60 * 60 * 1000

function doisDigitos(numero: number): string {
  return String(numero).padStart(2, '0')
}

// Datas trafegam como texto ISO (aaaa-mm-dd), o mesmo formato do <input type="date"> e da API.
export function paraISO(data: Date): string {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`
}

export function hojeISO(): string {
  return paraISO(new Date())
}

export function somarDias(dataISO: string, dias: number): string {
  const [ano, mes, dia] = dataISO.split('-').map(Number)
  return paraISO(new Date(ano!, mes! - 1, dia! + dias))
}

export function diasEntre(inicioISO: string, fimISO: string): number {
  const emUTC = (dataISO: string) => {
    const [ano, mes, dia] = dataISO.split('-').map(Number)
    return Date.UTC(ano!, mes! - 1, dia!)
  }
  return Math.round((emUTC(fimISO) - emUTC(inicioISO)) / MS_POR_DIA)
}

export function formatarDataISO(dataISO: string): string {
  const [ano, mes, dia] = dataISO.split('-')
  return `${dia}/${mes}/${ano}`
}
