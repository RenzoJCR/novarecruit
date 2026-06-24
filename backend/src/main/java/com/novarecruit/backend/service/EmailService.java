package com.novarecruit.backend.service;

import com.novarecruit.backend.exception.BusinessException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.mail.from:novarecruit@demo.com}")
    private String fromEmail;

    @Value("${app.mail.from-name:NovaRecruit}")
    private String fromName;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    /*
     * Envía el código de verificación al correo del usuario.
     * Si app.mail.enabled=false, no envía correo real y muestra el código en consola.
     * Esto sirve para probar el proyecto aunque todavía no tengas SMTP configurado.
     */
    public void enviarCodigoVerificacion(String to, String nombreCompleto, String codigo) {
        if (!mailEnabled) {
            imprimirCodigoEnConsola(to, nombreCompleto, codigo);
            return;
        }

        if (mailUsername == null || mailUsername.isBlank()) {
            throw new BusinessException(
                    "El correo SMTP no está configurado. Revisa MAIL_USERNAME y MAIL_PASSWORD."
            );
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject("Código de verificación - NovaRecruit");
            helper.setText(buildHtml(nombreCompleto, codigo), true);

            mailSender.send(message);
        } catch (Exception exception) {
            throw new BusinessException(
                    "No se pudo enviar el correo de verificación. Revisa la configuración SMTP."
            );
        }
    }

    private void imprimirCodigoEnConsola(String to, String nombreCompleto, String codigo) {
        System.out.println("==================================================");
        System.out.println(" NOVARECRUIT - CÓDIGO DE VERIFICACIÓN");
        System.out.println(" Correo: " + to);
        System.out.println(" Usuario: " + nombreCompleto);
        System.out.println(" Código: " + codigo);
        System.out.println(" Nota: app.mail.enabled=false, por eso no se envió correo real.");
        System.out.println("==================================================");
    }

    private String buildHtml(String nombreCompleto, String codigo) {
        String nombre = nombreCompleto == null || nombreCompleto.isBlank()
                ? "postulante"
                : nombreCompleto;

        return """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>Verificación NovaRecruit</title>
                </head>
                <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a;">
                    <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
                        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;padding:28px;">
                            <h1 style="margin:0;color:#0f172a;font-size:24px;">NovaRecruit</h1>
                            <p style="margin:8px 0 0;color:#64748b;font-size:14px;">
                                Verificación de correo electrónico
                            </p>

                            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />

                            <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
                                Hola <strong>%s</strong>,
                            </p>

                            <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
                                Usa el siguiente código para verificar tu cuenta en NovaRecruit:
                            </p>

                            <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:14px;padding:18px;text-align:center;margin:24px 0;">
                                <span style="font-size:34px;letter-spacing:8px;font-weight:bold;color:#047857;">
                                    %s
                                </span>
                            </div>

                            <p style="font-size:14px;line-height:1.6;color:#64748b;margin:0;">
                                Este código vence en 15 minutos. Si no solicitaste esta verificación,
                                puedes ignorar este mensaje.
                            </p>
                        </div>

                        <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:18px;">
                            NovaRecruit - Sistema de reclutamiento TI
                        </p>
                    </div>
                </body>
                </html>
                """.formatted(nombre, codigo);
    }
}