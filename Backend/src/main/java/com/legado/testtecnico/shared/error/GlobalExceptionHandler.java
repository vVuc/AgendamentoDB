package com.legado.testtecnico.shared.error;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Converte toda exceção em {@link ErroResponse}. Os erros padrão do Spring MVC (405, 415...)
 * mantêm o status da classe base, só com o corpo trocado.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final String DADOS_INVALIDOS = "Erro: dados inválidos.";
    private static final String CORPO_INVALIDO =
            "Erro: o corpo da requisição é inválido. Confira os campos e use datas no formato aaaa-mm-dd.";
    private static final String REQUISICAO_INVALIDA = "Erro: a requisição não pôde ser processada.";
    private static final String FALHA_INESPERADA = "Erro: falha inesperada no servidor. Tente novamente.";

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroResponse> tratarRegraNegocio(RegraNegocioException erro) {
        ErroResponse corpo = erro.getCampo()
                .map(campo -> ErroResponse.comCampos(erro.getMessage(), Map.of(campo, erro.getMessage())))
                .orElseGet(() -> ErroResponse.de(erro.getMessage()));
        return ResponseEntity.unprocessableEntity().body(corpo);
    }

    @ExceptionHandler(TransferenciaNaoEncontradaException.class)
    public ResponseEntity<ErroResponse> tratarNaoEncontrada(TransferenciaNaoEncontradaException erro) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErroResponse.de(erro.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> tratarFalhaInesperada(Exception erro) {
        log.error("Falha inesperada ao processar a requisição", erro);
        return ResponseEntity.internalServerError().body(ErroResponse.de(FALHA_INESPERADA));
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException erro,
                                                                  HttpHeaders headers, HttpStatus status,
                                                                  WebRequest request) {
        Map<String, String> campos = new LinkedHashMap<>();
        erro.getBindingResult().getFieldErrors()
                .forEach(campo -> campos.putIfAbsent(campo.getField(), campo.getDefaultMessage()));
        return ResponseEntity.badRequest().body(ErroResponse.comCampos(DADOS_INVALIDOS, campos));
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException erro,
                                                                  HttpHeaders headers, HttpStatus status,
                                                                  WebRequest request) {
        return ResponseEntity.badRequest().body(ErroResponse.de(CORPO_INVALIDO));
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception erro, Object body, HttpHeaders headers,
                                                             HttpStatus status, WebRequest request) {
        return ResponseEntity.status(status).headers(headers).body(ErroResponse.de(REQUISICAO_INVALIDA));
    }
}
