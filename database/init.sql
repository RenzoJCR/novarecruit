DROP DATABASE IF EXISTS novarecruit_db;
CREATE DATABASE novarecruit_db;
USE novarecruit_db;

-- =========================================================
-- TABLA: roles
-- =========================================================
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_roles_nombre (nombre),
    INDEX idx_roles_estado (estado),

    CONSTRAINT chk_roles_nombre_not_empty 
        CHECK (CHAR_LENGTH(TRIM(nombre)) > 0)
);

-- =========================================================
-- TABLA: usuarios
-- =========================================================
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    foto_perfil VARCHAR(255),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rol_id BIGINT NOT NULL,

    CONSTRAINT fk_usuarios_roles
        FOREIGN KEY (rol_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_usuarios_correo (correo),
    INDEX idx_usuarios_estado (estado),
    INDEX idx_usuarios_rol_id (rol_id),

    CONSTRAINT chk_usuarios_correo_format 
        CHECK (correo LIKE '%@%.%'),

    CONSTRAINT chk_usuarios_nombres_not_empty 
        CHECK (CHAR_LENGTH(TRIM(nombres)) > 0),

    CONSTRAINT chk_usuarios_apellidos_not_empty 
        CHECK (CHAR_LENGTH(TRIM(apellidos)) > 0),

    CONSTRAINT chk_usuarios_password_length 
        CHECK (CHAR_LENGTH(password) >= 8)
);

-- =========================================================
-- TABLA: perfiles_postulante
-- =========================================================
CREATE TABLE perfiles_postulante (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE,
    descripcion TEXT,
    experiencia TEXT,
    linkedin VARCHAR(255),
    github VARCHAR(255),
    cv_url VARCHAR(255),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_perfiles_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_perfiles_usuario_id (usuario_id)
);

-- =========================================================
-- TABLA: areas
-- =========================================================
CREATE TABLE areas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_areas_nombre (nombre),
    INDEX idx_areas_estado (estado),

    CONSTRAINT chk_areas_nombre_not_empty 
        CHECK (CHAR_LENGTH(TRIM(nombre)) > 0)
);

-- =========================================================
-- TABLA: habilidades
-- =========================================================
CREATE TABLE habilidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    categoria VARCHAR(100),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_habilidades_nombre (nombre),
    INDEX idx_habilidades_categoria (categoria),
    INDEX idx_habilidades_estado (estado),

    CONSTRAINT chk_habilidades_nombre_not_empty 
        CHECK (CHAR_LENGTH(TRIM(nombre)) > 0)
);

-- =========================================================
-- TABLA: vacantes
-- =========================================================
CREATE TABLE vacantes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    modalidad VARCHAR(50) NOT NULL,
    ubicacion VARCHAR(100),
    salario DECIMAL(10,2),
    nivel_experiencia VARCHAR(50),
    estado VARCHAR(50) NOT NULL DEFAULT 'ACTIVA',
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre DATE,
    area_id BIGINT NOT NULL,
    rrhh_id BIGINT NOT NULL,
    postulacion_ganadora_id BIGINT NULL,

    CONSTRAINT fk_vacantes_area
        FOREIGN KEY (area_id)
        REFERENCES areas(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_vacantes_rrhh
        FOREIGN KEY (rrhh_id)
        REFERENCES usuarios(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_vacantes_area_id (area_id),
    INDEX idx_vacantes_rrhh_id (rrhh_id),
    INDEX idx_vacantes_estado (estado),
    INDEX idx_vacantes_fecha_publicacion (fecha_publicacion),

    CONSTRAINT chk_vacantes_titulo_not_empty 
        CHECK (CHAR_LENGTH(TRIM(titulo)) > 0),

    CONSTRAINT chk_vacantes_descripcion_not_empty 
        CHECK (CHAR_LENGTH(TRIM(descripcion)) > 0),

    CONSTRAINT chk_vacantes_salario_positive 
        CHECK (salario IS NULL OR salario > 0),

    CONSTRAINT chk_vacantes_estado 
        CHECK (estado IN ('ACTIVA', 'EN_PROCESO', 'CERRADA', 'CANCELADA')),

    CONSTRAINT chk_vacantes_modalidad 
        CHECK (modalidad IN ('PRESENCIAL', 'REMOTO', 'HIBRIDO'))
);

-- =========================================================
-- TABLA: vacante_habilidades
-- Habilidades/requisitos técnicos definidos por RRHH para la vacante
-- =========================================================
CREATE TABLE vacante_habilidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vacante_id BIGINT NOT NULL,
    habilidad_id BIGINT NOT NULL,
    nivel_requerido VARCHAR(50) NOT NULL,
    obligatorio BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_vacante_habilidades_vacante
        FOREIGN KEY (vacante_id)
        REFERENCES vacantes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_vacante_habilidades_habilidad
        FOREIGN KEY (habilidad_id)
        REFERENCES habilidades(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    UNIQUE KEY uk_vacante_habilidad (vacante_id, habilidad_id),

    INDEX idx_vacante_habilidades_vacante_id (vacante_id),
    INDEX idx_vacante_habilidades_habilidad_id (habilidad_id),

    CONSTRAINT chk_vacante_habilidades_nivel 
        CHECK (nivel_requerido IN ('BASICO', 'INTERMEDIO', 'AVANZADO', 'EXPERTO'))
);

-- =========================================================
-- TABLA: postulaciones
-- =========================================================
CREATE TABLE postulaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    vacante_id BIGINT NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'POSTULADO',
    fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comentario_rrhh TEXT,
    comentario_tecnico TEXT,
    puntaje_tecnico DECIMAL(5,2) NULL,
    es_ganador BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_postulaciones_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_postulaciones_vacante
        FOREIGN KEY (vacante_id)
        REFERENCES vacantes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE KEY uk_usuario_vacante (usuario_id, vacante_id),

    INDEX idx_postulaciones_usuario_id (usuario_id),
    INDEX idx_postulaciones_vacante_id (vacante_id),
    INDEX idx_postulaciones_estado (estado),
    INDEX idx_postulaciones_fecha_postulacion (fecha_postulacion),
    INDEX idx_postulaciones_es_ganador (es_ganador),

    CONSTRAINT chk_postulaciones_estado 
        CHECK (
            estado IN (
                'POSTULADO',
                'EN_REVISION_RRHH',
                'APROBADO_RRHH',
                'RECHAZADO_RRHH',
                'EVALUACION_PENDIENTE',
                'EVALUACION_COMPLETADA',
                'APROBADO_TECNICO',
                'RECHAZADO_TECNICO',
                'SELECCIONADO',
                'NO_SELECCIONADO'
            )
        ),

    CONSTRAINT chk_postulaciones_puntaje 
        CHECK (puntaje_tecnico IS NULL OR puntaje_tecnico >= 0)
);

-- Relación de vacante con postulación ganadora.
-- Se agrega después porque postulaciones depende de vacantes.
ALTER TABLE vacantes
ADD CONSTRAINT fk_vacantes_postulacion_ganadora
FOREIGN KEY (postulacion_ganadora_id)
REFERENCES postulaciones(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- =========================================================
-- TABLA: postulante_habilidades
-- Habilidades declaradas por el postulante al postular
-- =========================================================
CREATE TABLE postulante_habilidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    postulacion_id BIGINT NOT NULL,
    habilidad_id BIGINT NOT NULL,
    nivel_postulante VARCHAR(50) NOT NULL,
    anios_experiencia INT,

    CONSTRAINT fk_postulante_habilidades_postulacion
        FOREIGN KEY (postulacion_id)
        REFERENCES postulaciones(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_postulante_habilidades_habilidad
        FOREIGN KEY (habilidad_id)
        REFERENCES habilidades(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    UNIQUE KEY uk_postulacion_habilidad (postulacion_id, habilidad_id),

    INDEX idx_postulante_habilidades_postulacion_id (postulacion_id),
    INDEX idx_postulante_habilidades_habilidad_id (habilidad_id),

    CONSTRAINT chk_postulante_habilidades_nivel 
        CHECK (nivel_postulante IN ('BASICO', 'INTERMEDIO', 'AVANZADO', 'EXPERTO')),

    CONSTRAINT chk_postulante_habilidades_anios 
        CHECK (anios_experiencia IS NULL OR anios_experiencia >= 0)
);

-- =========================================================
-- TABLA: evaluaciones
-- Evaluaciones ligadas a vacantes. Una vacante puede tener una o varias.
-- =========================================================
CREATE TABLE evaluaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vacante_id BIGINT NOT NULL,
    tecnico_id BIGINT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT NOT NULL,
    puntaje_maximo DECIMAL(5,2) NOT NULL DEFAULT 100,
    estado VARCHAR(50) NOT NULL DEFAULT 'ACTIVA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_evaluaciones_vacante
        FOREIGN KEY (vacante_id)
        REFERENCES vacantes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_evaluaciones_tecnico
        FOREIGN KEY (tecnico_id)
        REFERENCES usuarios(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_evaluaciones_vacante_id (vacante_id),
    INDEX idx_evaluaciones_tecnico_id (tecnico_id),
    INDEX idx_evaluaciones_estado (estado),

    CONSTRAINT chk_evaluaciones_titulo_not_empty 
        CHECK (CHAR_LENGTH(TRIM(titulo)) > 0),

    CONSTRAINT chk_evaluaciones_duracion 
        CHECK (duracion_minutos > 0),

    CONSTRAINT chk_evaluaciones_puntaje_maximo 
        CHECK (puntaje_maximo > 0),

    CONSTRAINT chk_evaluaciones_estado 
        CHECK (estado IN ('ACTIVA', 'INACTIVA'))
);

-- =========================================================
-- TABLA: preguntas_evaluacion
-- =========================================================
CREATE TABLE preguntas_evaluacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evaluacion_id BIGINT NOT NULL,
    tipo_pregunta VARCHAR(30) NOT NULL,
    enunciado TEXT NOT NULL,
    puntaje DECIMAL(5,2) NOT NULL DEFAULT 1,
    orden INT NOT NULL,

    CONSTRAINT fk_preguntas_evaluacion
        FOREIGN KEY (evaluacion_id)
        REFERENCES evaluaciones(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_preguntas_evaluacion_id (evaluacion_id),
    INDEX idx_preguntas_tipo (tipo_pregunta),

    CONSTRAINT chk_preguntas_tipo 
        CHECK (tipo_pregunta IN ('MULTIPLE', 'VERDADERO_FALSO', 'TEXTO', 'CODIGO')),

    CONSTRAINT chk_preguntas_enunciado_not_empty 
        CHECK (CHAR_LENGTH(TRIM(enunciado)) > 0),

    CONSTRAINT chk_preguntas_puntaje 
        CHECK (puntaje > 0),

    CONSTRAINT chk_preguntas_orden 
        CHECK (orden > 0)
);

-- =========================================================
-- TABLA: opciones_pregunta
-- =========================================================
CREATE TABLE opciones_pregunta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pregunta_id BIGINT NOT NULL,
    texto VARCHAR(255) NOT NULL,
    es_correcta BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_opciones_pregunta
        FOREIGN KEY (pregunta_id)
        REFERENCES preguntas_evaluacion(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_opciones_pregunta_id (pregunta_id),

    CONSTRAINT chk_opciones_texto_not_empty 
        CHECK (CHAR_LENGTH(TRIM(texto)) > 0)
);

-- =========================================================
-- TABLA: evaluaciones_postulacion
-- Relaciona evaluaciones con postulaciones
-- =========================================================
CREATE TABLE evaluaciones_postulacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    postulacion_id BIGINT NOT NULL,
    evaluacion_id BIGINT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_envio TIMESTAMP NULL,
    puntaje_obtenido DECIMAL(5,2),
    estado VARCHAR(50) NOT NULL DEFAULT 'ASIGNADA',
    comentario_tecnico TEXT,

    CONSTRAINT fk_evaluaciones_postulacion_postulacion
        FOREIGN KEY (postulacion_id)
        REFERENCES postulaciones(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_evaluaciones_postulacion_evaluacion
        FOREIGN KEY (evaluacion_id)
        REFERENCES evaluaciones(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE KEY uk_evaluacion_postulacion (postulacion_id, evaluacion_id),

    INDEX idx_eval_post_postulacion_id (postulacion_id),
    INDEX idx_eval_post_evaluacion_id (evaluacion_id),
    INDEX idx_eval_post_estado (estado),

    CONSTRAINT chk_eval_post_estado 
        CHECK (estado IN ('ASIGNADA', 'EN_PROCESO', 'COMPLETADA', 'REVISADA')),

    CONSTRAINT chk_eval_post_puntaje 
        CHECK (puntaje_obtenido IS NULL OR puntaje_obtenido >= 0)
);

-- =========================================================
-- TABLA: respuestas_evaluacion
-- =========================================================
CREATE TABLE respuestas_evaluacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evaluacion_postulacion_id BIGINT NOT NULL,
    pregunta_id BIGINT NOT NULL,
    opcion_id BIGINT NULL,
    respuesta_texto TEXT,
    es_correcta BOOLEAN NULL,
    puntaje_obtenido DECIMAL(5,2) DEFAULT 0,

    CONSTRAINT fk_respuestas_evaluacion_postulacion
        FOREIGN KEY (evaluacion_postulacion_id)
        REFERENCES evaluaciones_postulacion(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_respuestas_pregunta
        FOREIGN KEY (pregunta_id)
        REFERENCES preguntas_evaluacion(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_respuestas_opcion
        FOREIGN KEY (opcion_id)
        REFERENCES opciones_pregunta(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_respuestas_eval_post_id (evaluacion_postulacion_id),
    INDEX idx_respuestas_pregunta_id (pregunta_id),
    INDEX idx_respuestas_opcion_id (opcion_id),

    CONSTRAINT chk_respuestas_puntaje 
        CHECK (puntaje_obtenido IS NULL OR puntaje_obtenido >= 0)
);

-- =========================================================
-- TABLA: mensajes_postulacion
-- Mensajes enviados por RRHH o usuarios internos al postulante
-- =========================================================
CREATE TABLE mensajes_postulacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    postulacion_id BIGINT NOT NULL,
    emisor_id BIGINT NOT NULL,
    asunto VARCHAR(150) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_mensajes_postulacion
        FOREIGN KEY (postulacion_id)
        REFERENCES postulaciones(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_mensajes_emisor
        FOREIGN KEY (emisor_id)
        REFERENCES usuarios(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_mensajes_postulacion_id (postulacion_id),
    INDEX idx_mensajes_emisor_id (emisor_id),
    INDEX idx_mensajes_leido (leido),

    CONSTRAINT chk_mensajes_asunto_not_empty 
        CHECK (CHAR_LENGTH(TRIM(asunto)) > 0),

    CONSTRAINT chk_mensajes_contenido_not_empty 
        CHECK (CHAR_LENGTH(TRIM(contenido)) > 0)
);

-- =========================================================
-- TABLA: notificaciones
-- Preparada para WebSocket/STOMP
-- =========================================================
CREATE TABLE notificaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    url_destino VARCHAR(255),
    leido BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notificaciones_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_notificaciones_usuario_id (usuario_id),
    INDEX idx_notificaciones_leido (leido),
    INDEX idx_notificaciones_tipo (tipo),

    CONSTRAINT chk_notificaciones_titulo_not_empty 
        CHECK (CHAR_LENGTH(TRIM(titulo)) > 0),

    CONSTRAINT chk_notificaciones_tipo 
        CHECK (
            tipo IN (
                'SISTEMA',
                'POSTULACION',
                'EVALUACION',
                'RESULTADO',
                'MENSAJE'
            )
        )
);

-- =========================================================
-- TABLA: logs_sistema
-- Para auditoría del administrador
-- =========================================================
CREATE TABLE logs_sistema (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NULL,
    accion VARCHAR(150) NOT NULL,
    modulo VARCHAR(80) NOT NULL,
    descripcion TEXT,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_origen VARCHAR(50),

    CONSTRAINT fk_logs_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_logs_usuario_id (usuario_id),
    INDEX idx_logs_modulo (modulo),
    INDEX idx_logs_accion (accion),
    INDEX idx_logs_fecha_hora (fecha_hora),

    CONSTRAINT chk_logs_accion_not_empty 
        CHECK (CHAR_LENGTH(TRIM(accion)) > 0),

    CONSTRAINT chk_logs_modulo_not_empty 
        CHECK (CHAR_LENGTH(TRIM(modulo)) > 0)
);

-- =========================================================
-- DATOS INICIALES
-- =========================================================

INSERT INTO roles (id, nombre, descripcion, estado) VALUES
(1, 'ADMINISTRADOR', 'Administrador general del sistema', TRUE),
(2, 'RECURSOS_HUMANOS', 'Gestión de vacantes y postulaciones', TRUE),
(3, 'LIDER_TECNICO', 'Responsable de evaluaciones técnicas y selección final', TRUE),
(4, 'POSTULANTE', 'Usuario que aplica a vacantes y rinde evaluaciones', TRUE);

INSERT INTO areas (id, nombre, descripcion, estado) VALUES
(1, 'Frontend', 'Desarrollo de interfaces web y experiencia de usuario', TRUE),
(2, 'Backend', 'Desarrollo de APIs y lógica de negocio', TRUE),
(3, 'Mobile', 'Desarrollo de aplicaciones móviles', TRUE),
(4, 'Cloud', 'Infraestructura y servicios cloud', TRUE),
(5, 'QA', 'Control de calidad y testing', TRUE),
(6, 'DevOps', 'Automatización, integración continua y despliegue', TRUE);

INSERT INTO habilidades (id, nombre, categoria, estado) VALUES
(1, 'React', 'Frontend', TRUE),
(2, 'JavaScript', 'Frontend', TRUE),
(3, 'Tailwind CSS', 'Frontend', TRUE),
(4, 'Java', 'Backend', TRUE),
(5, 'Spring Boot', 'Backend', TRUE),
(6, 'MySQL', 'Base de datos', TRUE),
(7, 'Git', 'Herramientas', TRUE),
(8, 'Docker', 'DevOps', TRUE),
(9, 'Testing QA', 'QA', TRUE),
(10, 'AWS', 'Cloud', TRUE);

-- Password de ejemplo: 12345678
-- Más adelante se reemplazará por BCrypt cuando implementemos JWT.
INSERT INTO usuarios (
    id,
    nombres,
    apellidos,
    correo,
    password,
    telefono,
    foto_perfil,
    estado,
    rol_id
) VALUES
(1, 'Admin', 'NovaTech', 'admin@novatech.com', '12345678', '+51 900 000 001', NULL, TRUE, 1),
(2, 'María', 'Torres', 'maria.torres@novatech.com', '12345678', '+51 900 000 002', NULL, TRUE, 2),
(3, 'Luis', 'Ramírez', 'luis.ramirez@novatech.com', '12345678', '+51 900 000 003', NULL, TRUE, 3),
(4, 'Carlos', 'Mendoza', 'carlos.mendoza@email.com', '12345678', '+51 987 654 321', NULL, TRUE, 4);

INSERT INTO perfiles_postulante (
    usuario_id,
    descripcion,
    experiencia,
    linkedin,
    github,
    cv_url
) VALUES (
    4,
    'Desarrollador frontend junior con conocimientos en React, JavaScript y consumo de APIs REST.',
    'Experiencia académica en desarrollo web, interfaces responsive y proyectos con React.',
    'https://linkedin.com/in/carlosmendoza',
    'https://github.com/carlosmendoza',
    'https://drive.google.com/cv-carlos'
);

INSERT INTO vacantes (
    id,
    titulo,
    descripcion,
    modalidad,
    ubicacion,
    salario,
    nivel_experiencia,
    estado,
    fecha_cierre,
    area_id,
    rrhh_id
) VALUES (
    1,
    'Frontend React Developer Jr',
    'Desarrollo de interfaces web modernas utilizando React, consumo de APIs REST y buenas prácticas de componentización.',
    'REMOTO',
    'Lima, Perú',
    3000.00,
    'Junior',
    'ACTIVA',
    '2026-12-31',
    1,
    2
);

INSERT INTO vacante_habilidades (
    vacante_id,
    habilidad_id,
    nivel_requerido,
    obligatorio
) VALUES
(1, 1, 'INTERMEDIO', TRUE),
(1, 2, 'INTERMEDIO', TRUE),
(1, 3, 'BASICO', FALSE),
(1, 7, 'BASICO', TRUE);

INSERT INTO postulaciones (
    id,
    usuario_id,
    vacante_id,
    estado,
    comentario_rrhh,
    comentario_tecnico,
    puntaje_tecnico,
    es_ganador
) VALUES (
    1,
    4,
    1,
    'POSTULADO',
    NULL,
    NULL,
    NULL,
    FALSE
);

INSERT INTO postulante_habilidades (
    postulacion_id,
    habilidad_id,
    nivel_postulante,
    anios_experiencia
) VALUES
(1, 1, 'INTERMEDIO', 1),
(1, 2, 'INTERMEDIO', 1),
(1, 3, 'BASICO', 1),
(1, 7, 'INTERMEDIO', 2);

INSERT INTO evaluaciones (
    id,
    vacante_id,
    tecnico_id,
    titulo,
    descripcion,
    duracion_minutos,
    puntaje_maximo,
    estado
) VALUES (
    1,
    1,
    3,
    'Evaluación React Junior',
    'Evaluación técnica para validar conocimientos básicos de React, componentes y estado.',
    40,
    100,
    'ACTIVA'
);

INSERT INTO preguntas_evaluacion (
    id,
    evaluacion_id,
    tipo_pregunta,
    enunciado,
    puntaje,
    orden
) VALUES
(1, 1, 'MULTIPLE', '¿Cuál es la función principal de React?', 20, 1),
(2, 1, 'TEXTO', 'Explica qué es un componente reutilizable.', 30, 2),
(3, 1, 'CODIGO', 'Escribe un ejemplo simple de componente funcional en React.', 50, 3);

INSERT INTO opciones_pregunta (
    pregunta_id,
    texto,
    es_correcta
) VALUES
(1, 'Construir interfaces de usuario', TRUE),
(1, 'Gestionar bases de datos', FALSE),
(1, 'Administrar servidores físicos', FALSE),
(1, 'Reemplazar sistemas operativos', FALSE);

INSERT INTO mensajes_postulacion (
    postulacion_id,
    emisor_id,
    asunto,
    contenido,
    leido
) VALUES (
    1,
    2,
    'Postulación recibida',
    'Tu postulación fue recibida correctamente y se encuentra en revisión por Recursos Humanos.',
    FALSE
);

INSERT INTO notificaciones (
    usuario_id,
    titulo,
    mensaje,
    tipo,
    url_destino,
    leido
) VALUES (
    4,
    'Postulación registrada',
    'Tu postulación a Frontend React Developer Jr fue registrada correctamente.',
    'POSTULACION',
    '/applicant/postulaciones',
    FALSE
);

INSERT INTO logs_sistema (
    usuario_id,
    accion,
    modulo,
    descripcion,
    ip_origen
) VALUES
(1, 'CARGA_INICIAL', 'SISTEMA', 'Se cargaron los datos iniciales del sistema NovaRecruit.', '127.0.0.1'),
(2, 'CREAR_VACANTE', 'VACANTES', 'RRHH creó la vacante Frontend React Developer Jr.', '127.0.0.1'),
(4, 'POSTULAR', 'POSTULACIONES', 'El postulante Carlos Mendoza aplicó a la vacante Frontend React Developer Jr.', '127.0.0.1');