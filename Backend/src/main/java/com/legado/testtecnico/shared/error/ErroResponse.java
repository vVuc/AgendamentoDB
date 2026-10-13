package com.legado.testtecnico.shared.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Map;

/**
 * Corpo único de erro da API. {@code campos} só aparece quando o erro é de um campo específico.
 */
@Getter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class ErroResponse {

    @Schema(example = "Erro: dados inválidos.")
    private final String mensagem;

    @Schema(description = "Mensagem por campo da requisição", example = "{\"contaOrigem\": \"Erro: a conta de origem deve ter 10 dígitos.\"}")
    private final Map<String, String> campos;

    public static ErroResponse de(String mensagem) {
        return new ErroResponse(mensagem, Map.of());
    }

    public static ErroResponse comCampos(String mensagem, Map<String, String> campos) {
        return new ErroResponse(mensagem, campos);
    }
}
