package com.novarecruit.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {

    @NotBlank(message = "La contraseña actual es obligatoria.")
    private String passwordActual;

    @NotBlank(message = "La nueva contraseña es obligatoria.")
    @Size(min = 8, max = 255, message = "La nueva contraseña debe tener al menos 8 caracteres.")
    private String nuevaPassword;
}