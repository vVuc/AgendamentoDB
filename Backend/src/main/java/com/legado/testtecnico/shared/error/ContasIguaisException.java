package com.legado.testtecnico.shared.error;

public class ContasIguaisException extends RegraNegocioException {

    public ContasIguaisException() {
        super("Erro: a conta de destino deve ser diferente da conta de origem.", "contaDestino");
    }
}
