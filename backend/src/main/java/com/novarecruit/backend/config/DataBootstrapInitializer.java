package com.novarecruit.backend.config;

import java.math.BigDecimal;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.novarecruit.backend.entity.Area;
import com.novarecruit.backend.entity.Habilidad;
import com.novarecruit.backend.entity.Rol;
import com.novarecruit.backend.entity.Usuario;
import com.novarecruit.backend.entity.Vacante;
import com.novarecruit.backend.repository.AreaRepository;
import com.novarecruit.backend.repository.HabilidadRepository;
import com.novarecruit.backend.repository.RolRepository;
import com.novarecruit.backend.repository.UsuarioRepository;
import com.novarecruit.backend.repository.VacanteRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.bootstrap.enabled", havingValue = "true", matchIfMissing = true)
public class DataBootstrapInitializer implements ApplicationRunner {

    private static final String ROL_ADMINISTRADOR = "ADMINISTRADOR";
    private static final String ROL_RECURSOS_HUMANOS = "RECURSOS_HUMANOS";
    private static final String ROL_LIDER_TECNICO = "LIDER_TECNICO";
    private static final String ROL_POSTULANTE = "POSTULANTE";

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
        private final AreaRepository areaRepository;
        private final HabilidadRepository habilidadRepository;
        private final VacanteRepository vacanteRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Rol administrador = asegurarRol(ROL_ADMINISTRADOR, "Administrador general del sistema");
        Rol recursosHumanos = asegurarRol(ROL_RECURSOS_HUMANOS, "Gestión de vacantes y postulaciones");
        Rol liderTecnico = asegurarRol(ROL_LIDER_TECNICO, "Responsable de evaluaciones técnicas");
        Rol postulante = asegurarRol(ROL_POSTULANTE, "Usuario que aplica a vacantes");

        asegurarUsuario(
                "Admin",
                "Sistema",
                "admin@novarecruit.com",
                "Admin1234!",
                "900000001",
                administrador
        );

        asegurarUsuario(
                "Recursos",
                "Humanos",
                "rrhh@novarecruit.com",
                "Rrhh1234!",
                "900000002",
                recursosHumanos
        );

        asegurarUsuario(
                "Lider",
                "Tecnico",
                "tecnico@novarecruit.com",
                "Tecnico1234!",
                "900000003",
                liderTecnico
        );

        asegurarUsuario(
                "Postulante",
                "Demo",
                "postulante@novarecruit.com",
                "Postulante1234!",
                "900000004",
                postulante
        );

        Area tecnologia = asegurarArea("Tecnología", "Vacantes relacionadas con desarrollo, soporte y sistemas.");
        Area rrhhArea = asegurarArea("Recursos Humanos", "Gestión de talento, selección y cultura.");

        Usuario rrhhUsuario = usuarioRepository.findByCorreoIgnoreCase("rrhh@novarecruit.com")
                .orElseThrow(() -> new IllegalStateException("No se encontró el usuario RRHH base."));

        Habilidad java = asegurarHabilidad("Java", "Backend");
        Habilidad springBoot = asegurarHabilidad("Spring Boot", "Backend");
        Habilidad sql = asegurarHabilidad("SQL", "Base de Datos");
        Habilidad comunicacion = asegurarHabilidad("Comunicación", "Soft Skill");

        asegurarVacante(
                "Desarrollador Backend Java Junior",
                "Buscamos un perfil junior para apoyar en desarrollo de APIs REST y mantenimiento de servicios.",
                "HIBRIDO",
                "Lima",
                new BigDecimal("3500.00"),
                "Junior",
                tecnologia,
                rrhhUsuario
        );

        asegurarVacante(
                "Analista de Selección TI",
                "Responsable de filtrado de candidatos, coordinación de entrevistas y seguimiento de procesos.",
                "PRESENCIAL",
                "Lima",
                new BigDecimal("3200.00"),
                "Junior",
                rrhhArea,
                rrhhUsuario
        );

        asegurarVacante(
                "Soporte Técnico N1",
                "Atención de incidencias, registro de tickets y soporte a usuarios internos.",
                "REMOTO",
                "Lima",
                new BigDecimal("2800.00"),
                "Junior",
                tecnologia,
                rrhhUsuario
        );
    }

    private Rol asegurarRol(String nombre, String descripcion) {
        return rolRepository.findByNombreIgnoreCase(nombre)
                .orElseGet(() -> rolRepository.save(Rol.builder()
                        .nombre(nombre)
                        .descripcion(descripcion)
                        .build()));
    }

    private void asegurarUsuario(
            String nombres,
            String apellidos,
            String correo,
            String passwordPlano,
            String telefono,
            Rol rol
    ) {
        if (usuarioRepository.existsByCorreoIgnoreCase(correo)) {
            return;
        }

        Usuario usuario = Usuario.builder()
                .nombres(nombres)
                .apellidos(apellidos)
                .correo(correo)
                .password(passwordEncoder.encode(passwordPlano))
                .telefono(telefono)
                .estado(true)
                .rol(rol)
                .build();

        usuarioRepository.save(usuario);
    }

    private Area asegurarArea(String nombre, String descripcion) {
        return areaRepository.findAll().stream()
                .filter(area -> area.getNombre() != null && area.getNombre().equalsIgnoreCase(nombre))
                .findFirst()
                .orElseGet(() -> areaRepository.save(Area.builder()
                        .nombre(nombre)
                        .descripcion(descripcion)
                        .estado(true)
                        .build()));
    }

    private Habilidad asegurarHabilidad(String nombre, String categoria) {
        return habilidadRepository.findAll().stream()
                .filter(habilidad -> habilidad.getNombre() != null && habilidad.getNombre().equalsIgnoreCase(nombre))
                .findFirst()
                .orElseGet(() -> habilidadRepository.save(Habilidad.builder()
                        .nombre(nombre)
                        .categoria(categoria)
                        .build()));
    }

    private void asegurarVacante(
            String titulo,
            String descripcion,
            String modalidad,
            String ubicacion,
            BigDecimal salario,
            String nivelExperiencia,
            Area area,
            Usuario rrhh
    ) {
        if (vacanteRepository.existsByTituloIgnoreCase(titulo)) {
            return;
        }

        Vacante vacante = Vacante.builder()
                .titulo(titulo)
                .descripcion(descripcion)
                .modalidad(modalidad)
                .ubicacion(ubicacion)
                .salario(salario)
                .nivelExperiencia(nivelExperiencia)
                .estado("ACTIVA")
                .area(area)
                .rrhh(rrhh)
                .build();

        vacanteRepository.save(vacante);
    }
}