import { ref } from 'vue'
import { getJson } from '@/shared/api/http'
import type { FaixaTaxa } from './faixasTaxa'

// Estado compartilhado: a tabela é pedida ao back-end uma vez só, para todas as telas.
const faixas = ref<FaixaTaxa[]>([])
const carregando = ref(false)
const erro = ref('')
let pedido: Promise<void> | null = null

function carregar(): Promise<void> {
  pedido ??= (async () => {
    carregando.value = true
    erro.value = ''
    try {
      faixas.value = await getJson<FaixaTaxa[]>('/api/taxas')
    } catch (falha) {
      erro.value =
        falha instanceof Error ? falha.message : 'Erro: não foi possível carregar as taxas.'
      // Permite tentar de novo depois de uma falha.
      pedido = null
    } finally {
      carregando.value = false
    }
  })()
  return pedido
}

export function useFaixasTaxa() {
  void carregar()
  return { faixas, carregando, erro, recarregar: carregar }
}

// Só para testes: volta ao estado inicial, antes do primeiro pedido.
export function redefinirFaixasTaxa() {
  faixas.value = []
  carregando.value = false
  erro.value = ''
  pedido = null
}
