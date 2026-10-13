package com.legado.testtecnico.shared.error;

import java.util.Optional;

/**
 * Violação de uma regra de negócio. O handler global devolve 422 para qualquer subclasse.
 */
public abstract class RegraNegocioException extends RuntimeException {

    private final String campo;

    protected RegraNegocioException(String mensagem) {
        this(mensagem, null);
    }

    protected RegraNegocioException(String mensagem, String campo) {
        super(mensagem);
        this.campo = campo;
    }

    /**
     * Campo da requisição ligado ao erro, para o front marcar o campo certo.
     */
    public Optional<String> getCampo() {
        return Optional.ofNullable(campo);
    }
}
