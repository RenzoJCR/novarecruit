package com.novarecruit.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OpcionPreguntaResponse {

    private Long id;
    private String texto;
    private Boolean esCorrecta;
}