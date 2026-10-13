package com.legado.testtecnico.shared.error;

public class TransferenciaNaoEncontradaException extends RuntimeException {

    public TransferenciaNaoEncontradaException(Long id) {
        super("Erro: transferência " + id + " não encontrada.");
    }
}
