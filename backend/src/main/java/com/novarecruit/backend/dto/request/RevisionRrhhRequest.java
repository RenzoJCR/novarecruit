package com.novarecruit.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RevisionRrhhRequest {

    @NotNull(message = "Debes indicar si la postulación fue aprobada o rechazada.")
    private Boolean aprobado;

    @Size(max = 1000, message = "El comentario no debe superar los 1000 caracteres.")
    private String comentarioRrhh;
}