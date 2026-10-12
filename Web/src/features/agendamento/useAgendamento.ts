import { computed, onScopeDispose, reactive, ref, watch } from 'vue'
import { agendarTransferencia, consultarTaxa } from './agendamento.api'
import type { PreviaTaxa, Transferencia } from '@/shared/types/transferencia'
import { DIAS_MAXIMOS } from '@/shared/domain/faixasTaxa'
import { ErroApi } from '@/shared/api/http'
import { hojeISO, somarDias } from '@/shared/utils/datas'

const DIGITOS_DA_CONTA = 10
// Espera a pessoa parar de digitar o valor antes de pedir a prévia ao servidor.
export const ESPERA_DA_PREVIA_MS = 300

export function apenasDigitosDaConta(valor: string): string {
  return valor.replace(/\D/g, '').slice(0, DIGITOS_DA_CONTA)
}

export function useAgendamento() {
  const hoje = hojeISO()
  const dataMaxima = somarDias(hoje, DIAS_MAXIMOS)

  const formulario = reactive({
    contaOrigem: '',
    contaDestino: '',
    valor: 0,
    dataTransferencia: '',
  })

  // Erros de campo só aparecem depois que a pessoa sai do campo.
  const tocados = reactive({ contaOrigem: false, contaDestino: false, valor: false })

  const enviando = ref(false)
  const erroServidor = ref('')
  const agendada = ref<Transferencia | null>(null)
  // Erros por campo devolvidos pelo servidor no envio; somem quando a pessoa edita.
  const errosDoServidor = ref<Record<string, string>>({})

  const contaCompleta = (conta: string) => conta.length === DIGITOS_DA_CONTA
  const contasIguais = computed(
    () =>
      contaCompleta(formulario.contaOrigem) && formulario.contaOrigem === formulario.contaDestino,
  )

  const erros = computed(() => ({
    contaOrigem:
      tocados.contaOrigem && !contaCompleta(formulario.contaOrigem)
        ? 'Erro: a conta deve ter 10 dígitos'
        : (errosDoServidor.value.contaOrigem ?? ''),
    contaDestino:
      tocados.contaDestino && !contaCompleta(formulario.contaDestino)
        ? 'Erro: a conta deve ter 10 dígitos'
        : contasIguais.value
          ? 'Erro: a conta de destino deve ser diferente da origem'
          : (errosDoServidor.value.contaDestino ?? ''),
    valor:
      tocados.valor && formulario.valor <= 0
        ? 'Erro: informe um valor maior que zero'
        : (errosDoServidor.value.valor ?? ''),
    dataTransferencia: errosDoServidor.value.dataTransferencia ?? '',
  }))

  // A taxa vem sempre do back-end: a prévia é pedida a cada mudança de valor ou data.
  const previa = ref<PreviaTaxa | null>(null)
  const erroPrevia = ref('')
  const semTaxaAplicavel = ref(false)
  const consultandoTaxa = ref(false)
  let temporizador: ReturnType<typeof setTimeout> | undefined
  let ultimaConsulta = 0

  async function atualizarPrevia(valor: number, data: string) {
    const consulta = ++ultimaConsulta
    try {
      const resposta = await consultarTaxa(valor, data)
      if (consulta === ultimaConsulta) previa.value = resposta
    } catch (erro) {
      if (consulta !== ultimaConsulta) return
      semTaxaAplicavel.value = erro instanceof ErroApi && erro.status === 422
      erroPrevia.value =
        erro instanceof ErroApi ? erro.message : 'Erro: não foi possível calcular a taxa.'
    } finally {
      if (consulta === ultimaConsulta) consultandoTaxa.value = false
    }
  }

  watch(
    () => [formulario.valor, formulario.dataTransferencia] as const,
    ([valor, data]) => {
      clearTimeout(temporizador)
      ultimaConsulta++
      previa.value = null
      erroPrevia.value = ''
      semTaxaAplicavel.value = false
      consultandoTaxa.value = valor > 0 && data !== ''
      if (!consultandoTaxa.value) return
      temporizador = setTimeout(() => atualizarPrevia(valor, data), ESPERA_DA_PREVIA_MS)
    },
  )

  onScopeDispose(() => clearTimeout(temporizador))

  const podeAgendar = computed(
    () =>
      contaCompleta(formulario.contaOrigem) &&
      contaCompleta(formulario.contaDestino) &&
      !contasIguais.value &&
      formulario.valor > 0 &&
      previa.value !== null &&
      !enviando.value,
  )

  function tocar(campo: keyof typeof tocados) {
    tocados[campo] = true
  }

  // Qualquer edição tira da tela o resultado do envio anterior.
  function aoEditar() {
    agendada.value = null
    erroServidor.value = ''
    errosDoServidor.value = {}
  }

  async function agendar() {
    if (!podeAgendar.value) return
    enviando.value = true
    erroServidor.value = ''
    try {
      agendada.value = await agendarTransferencia({ ...formulario })
      // Mantém a origem e a data para facilitar agendamentos seguidos, como no protótipo.
      formulario.contaDestino = ''
      formulario.valor = 0
      tocados.contaDestino = false
      tocados.valor = false
    } catch (erro) {
      erroServidor.value =
        erro instanceof ErroApi ? erro.message : 'Erro: algo deu errado. Tente de novo.'
      errosDoServidor.value = erro instanceof ErroApi ? erro.campos : {}
    } finally {
      enviando.value = false
    }
  }

  function limpar() {
    Object.assign(formulario, {
      contaOrigem: '',
      contaDestino: '',
      valor: 0,
      dataTransferencia: '',
    })
    Object.assign(tocados, { contaOrigem: false, contaDestino: false, valor: false })
    aoEditar()
  }

  return {
    hoje,
    dataMaxima,
    formulario,
    erros,
    previa,
    erroPrevia,
    semTaxaAplicavel,
    consultandoTaxa,
    podeAgendar,
    enviando,
    erroServidor,
    agendada,
    tocar,
    aoEditar,
    agendar,
    limpar,
  }
}
