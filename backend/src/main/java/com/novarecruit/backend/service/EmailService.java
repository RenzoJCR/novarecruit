package com.novarecruit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${app.mail.from:novarecruit@demo.com}")
    private String mailFrom;

    public void enviarCodigoVerificacion(String destinatario, String nombreCompleto, String codigo) {
        if (!StringUtils.hasText(mailUsername)) {
            System.out.println("==============================================");
            System.out.println("CÓDIGO DE VERIFICACIÓN NOVARECRUIT");
            System.out.println("Correo: " + destinatario);
            System.out.println("Usuario: " + nombreCompleto);
            System.out.println("Código: " + codigo);
            System.out.println("==============================================");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(destinatario);
            message.setSubject("Código de verificación - NovaRecruit");
            message.setText(
                    "Hola " + nombreCompleto + ",\n\n" +
                            "Tu código de verificación para NovaRecruit es:\n\n" +
                            codigo + "\n\n" +
                            "Este código vence en 15 minutos.\n\n" +
                            "Si no solicitaste este registro, ignora este mensaje.\n\n" +
                            "Equipo NovaRecruit"
            );

            javaMailSender.send(message);
        } catch (Exception exception) {
            System.out.println("No se pudo enviar el correo. Código para pruebas: " + codigo);
            System.out.println("Error correo: " + exception.getMessage());
        }
    }
}