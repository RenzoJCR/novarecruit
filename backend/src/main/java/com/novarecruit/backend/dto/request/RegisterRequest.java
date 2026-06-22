package com.novarecruit.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Los nombres son obligatorios.")
    @Size(min = 2, max = 100, message = "Los nombres deben tener entre 2 y 100 caracteres.")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios.")
    @Size(min = 2, max = 100, message = "Los apellidos deben tener entre 2 y 100 caracteres.")
    private String apellidos;

    @NotBlank(message = "El correo es obligatorio.")
    @Email(message = "El correo no tiene un formato válido.")
    @Size(max = 120, message = "El correo no debe superar los 120 caracteres.")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria.")
    @Size(min = 8, max = 255, message = "La contraseña debe tener al menos 8 caracteres.")
    private String password;

    @Size(max = 20, message = "El teléfono no debe superar los 20 caracteres.")
    private String telefono;
}