package com.legado.testtecnico.transferencia.api;

import com.legado.testtecnico.shared.error.ErroResponse;
import com.legado.testtecnico.transferencia.api.dto.TransferenciaRequest;
import com.legado.testtecnico.transferencia.api.dto.TransferenciaResponse;
import com.legado.testtecnico.transferencia.domain.Transferencia;
import com.legado.testtecnico.transferencia.service.TransferenciaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transferencias")
@RequiredArgsConstructor
@Tag(name = "Transferências", description = "Agendamento e extrato")
public class TransferenciaController {

    private final TransferenciaService service;

    @PostMapping
    @Operation(summary = "Agenda uma transferência",
            description = "A taxa e a data de agendamento são definidas pelo servidor.")
    @ApiResponse(responseCode = "201", description = "Transferência agendada")
    @ApiResponse(responseCode = "400", description = "Dados inválidos",
            content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    @ApiResponse(responseCode = "422", description = "Sem taxa aplicável para a data, ou contas iguais",
            content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    public ResponseEntity<TransferenciaResponse> agendar(@Valid @RequestBody TransferenciaRequest request) {
        Transferencia transferencia = service.agendar(
                request.getContaOrigem(),
                request.getContaDestino(),
                request.getValor(),
                request.getDataTransferencia());

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(transferencia.getId())
                .toUri();
        return ResponseEntity.created(location).body(TransferenciaResponse.de(transferencia));
    }

    @GetMapping
    @Operation(summary = "Lista o extrato", description = "Do agendamento mais recente para o mais antigo.")
    public List<TransferenciaResponse> listarExtrato() {
        return service.listarExtrato().stream()
                .map(TransferenciaResponse::de)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca uma transferência agendada")
    @ApiResponse(responseCode = "200", description = "Transferência encontrada")
    @ApiResponse(responseCode = "404", description = "Transferência não encontrada",
            content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    public TransferenciaResponse buscar(@PathVariable Long id) {
        return TransferenciaResponse.de(service.buscarPorId(id));
    }
}
