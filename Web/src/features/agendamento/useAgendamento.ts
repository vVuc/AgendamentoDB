import { computed, reactive, ref } from 'vue'
import { agendarTransferencia } from './agendamento.api'
import type { Transferencia } from '@/shared/types/transferencia'
import { calcularTaxa, diasMaximos, encontrarFaixa } from '@/shared/domain/faixasTaxa'
import { useFaixasTaxa } from '@/shared/domain/useFaixasTaxa'
import { ErroApi } from '@/shared/api/http'
import { diasEntre, hojeISO, somarDias } from '@/shared/utils/datas'

const DIGITOS_DA_CONTA = 10

// Mesmo teto do back-end. Até ele, o number do JavaScript guarda valor, taxa e total
// exatos em centavos.
export const VALOR_MAXIMO = 9999999999999.99

export function apenasDigitosDaConta(valor: string): string {
  return valor.replace(/\D/g, '').slice(0, DIGITOS_DA_CONTA)
}

export function useAgendamento() {
  const hoje = hojeISO()
  const { faixas, erro: erroFaixas, recarregar: recarregarFaixas } = useFaixasTaxa()
  const limiteDias = computed(() => diasMaximos(faixas.value))
  // Sem a tabela ainda, a data fica sem limite superior.
  const dataMaxima = computed(() =>
    limiteDias.value > 0 ? somarDias(hoje, limiteDias.value) : undefined,
  )

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
      formulario.valor > VALOR_MAXIMO
        ? 'Erro: o valor máximo é R$ 9.999.999.999.999,99'
        : tocados.valor && formulario.valor <= 0
          ? 'Erro: informe um valor maior que zero'
          : (errosDoServidor.value.valor ?? ''),
    dataTransferencia: errosDoServidor.value.dataTransferencia ?? '',
  }))

  // Prévia calculada com a tabela que veio do back-end; ele recalcula a taxa ao salvar.
  const dias = computed(() =>
    formulario.dataTransferencia ? diasEntre(hoje, formulario.dataTransferencia) : null,
  )
  const faixa = computed(() =>
    dias.value === null ? null : encontrarFaixa(faixas.value, dias.value),
  )
  const semTaxaAplicavel = computed(
    () => faixas.value.length > 0 && dias.value !== null && faixa.value === null,
  )
  const taxa = computed(() => (faixa.value ? calcularTaxa(formulario.valor, faixa.value) : 0))
  const total = computed(() => formulario.valor + taxa.value)

  const podeAgendar = computed(
    () =>
      contaCompleta(formulario.contaOrigem) &&
      contaCompleta(formulario.contaDestino) &&
      !contasIguais.value &&
      formulario.valor > 0 &&
      formulario.valor <= VALOR_MAXIMO &&
      faixa.value !== null &&
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
    limiteDias,
    dataMaxima,
    formulario,
    erros,
    faixa,
    taxa,
    total,
    semTaxaAplicavel,
    erroFaixas,
    recarregarFaixas,
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
