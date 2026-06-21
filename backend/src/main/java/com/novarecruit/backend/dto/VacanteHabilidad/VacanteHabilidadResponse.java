package com.novarecruit.backend.dto.VacanteHabilidad;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class VacanteHabilidadResponse {

    private Long id;
    private Long vacanteId;
    private String vacanteTitulo;
    private Long habilidadId;
    private String habilidadNombre;
    private String nivelRequerido;
}
