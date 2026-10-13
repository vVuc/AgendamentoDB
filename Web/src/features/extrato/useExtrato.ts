import { computed, ref } from 'vue'
import { listarTransferencias } from './extrato.api'
import type { Transferencia } from '@/shared/types/transferencia'

// Mais recente primeiro. O back-end já devolve nessa ordem; aqui só garantimos.
function ordenar(transferencias: Transferencia[]): Transferencia[] {
  return [...transferencias].sort(
    (a, b) => b.dataAgendamento.localeCompare(a.dataAgendamento) || b.id - a.id,
  )
}

export function useExtrato() {
  const transferencias = ref<Transferencia[]>([])
  // Começa carregando para a tela não piscar "nenhuma transferência" antes da primeira resposta.
  const carregando = ref(true)
  const erro = ref('')

  const quantidade = computed(() => {
    const total = transferencias.value.length
    return `${total} ${total === 1 ? 'agendamento' : 'agendamentos'}`
  })

  async function carregar() {
    carregando.value = true
    erro.value = ''
    try {
      transferencias.value = ordenar(await listarTransferencias())
    } catch (falha) {
      erro.value =
        falha instanceof Error ? falha.message : 'Erro: não foi possível carregar o extrato.'
    } finally {
      carregando.value = false
    }
  }

  return { transferencias, carregando, erro, quantidade, carregar }
}
