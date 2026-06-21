package com.novarecruit.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {

    @NotBlank(message = "La contraseña actual es obligatoria.")
    private String currentPassword;

    @NotBlank(message = "La nueva contraseña es obligatoria.")
    @Size(min = 8, max = 255, message = "La nueva contraseña debe tener entre 8 y 255 caracteres.")
    private String newPassword;

    @NotBlank(message = "La confirmación de contraseña es obligatoria.")
    private String confirmNewPassword;
}