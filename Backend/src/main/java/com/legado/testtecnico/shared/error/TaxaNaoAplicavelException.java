package com.legado.testtecnico.shared.error;

public class TaxaNaoAplicavelException extends RegraNegocioException {

    public TaxaNaoAplicavelException() {
        super("Erro: não há taxa aplicável para a data informada.");
    }
}
