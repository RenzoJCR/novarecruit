CREATE DATABASE IF NOT EXISTS novarecruit_db;
USE novarecruit_db;

-- =========================================
-- TABLA ROLES
-- =========================================

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre)
);

-- =========================================
-- TABLA USUARIOS
-- =========================================

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    foto_perfil VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rol_id BIGINT NOT NULL,
    
    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (rol_id)
        REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    INDEX idx_correo (correo),
    INDEX idx_estado (estado),
    INDEX idx_rol_id (rol_id),
    
    CONSTRAINT chk_email_format CHECK (correo LIKE '%@%.%'),
    CONSTRAINT chk_nombres_not_empty CHECK (CHAR_LENGTH(TRIM(nombres)) > 0),
    CONSTRAINT chk_apellidos_not_empty CHECK (CHAR_LENGTH(TRIM(apellidos)) > 0),
    CONSTRAINT chk_password_length CHECK (CHAR_LENGTH(password) >= 8)
);

-- =========================================
-- TABLA PERFILES POSTULANTE
-- =========================================

CREATE TABLE IF NOT EXISTS perfiles_postulante (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE,
    descripcion TEXT,
    experiencia TEXT,
    linkedin VARCHAR(255),
    github VARCHAR(255),
    cv_url VARCHAR(255),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_perfil_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    INDEX idx_usuario_id (usuario_id)
);

-- =========================================
-- TABLA AREAS
-- =========================================

CREATE TABLE IF NOT EXISTS areas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre),
    INDEX idx_estado (estado),
    CONSTRAINT chk_nombre_not_empty CHECK (CHAR_LENGTH(TRIM(nombre)) > 0)
);

-- =========================================
-- TABLA HABILIDADES
-- =========================================

CREATE TABLE IF NOT EXISTS habilidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    categoria VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre),
    INDEX idx_categoria (categoria),
    CONSTRAINT chk_skill_name_not_empty CHECK (CHAR_LENGTH(TRIM(nombre)) > 0)
);

-- =========================================
-- TABLA VACANTES
-- =========================================

CREATE TABLE IF NOT EXISTS vacantes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    modalidad VARCHAR(50) NOT NULL,
    ubicacion VARCHAR(100),
    salario DECIMAL(10,2),
    nivel_experiencia VARCHAR(50),
    estado VARCHAR(50) DEFAULT 'ACTIVA',
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre DATE,
    area_id BIGINT NOT NULL,
    rrhh_id BIGINT NOT NULL,
    
    CONSTRAINT fk_vacante_area
        FOREIGN KEY (area_id)
        REFERENCES areas(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_vacante_rrhh
        FOREIGN KEY (rrhh_id)
        REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    INDEX idx_area_id (area_id),
    INDEX idx_rrhh_id (rrhh_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_publicacion (fecha_publicacion),
    
    CONSTRAINT chk_titulo_not_empty CHECK (CHAR_LENGTH(TRIM(titulo)) > 0),
    CONSTRAINT chk_descripcion_not_empty CHECK (CHAR_LENGTH(TRIM(descripcion)) > 0),
    CONSTRAINT chk_salario_positive CHECK (salario IS NULL OR salario > 0),
    CONSTRAINT chk_estado_vacante CHECK (estado IN ('ACTIVA', 'CERRADA', 'CANCELADA')),
    CONSTRAINT chk_fecha_cierre_valid CHECK (fecha_cierre IS NULL OR fecha_cierre >= CURDATE()),
    CONSTRAINT chk_modalidad_valid CHECK (modalidad IN ('PRESENCIAL', 'REMOTO', 'HIBRIDO'))
);

-- =========================================
-- TABLA VACANTE_HABILIDADES
-- =========================================

CREATE TABLE IF NOT EXISTS vacante_habilidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vacante_id BIGINT NOT NULL,
    habilidad_id BIGINT NOT NULL,
    nivel_requerido VARCHAR(50) NOT NULL,
    
    CONSTRAINT fk_vacante_habilidad_vacante
        FOREIGN KEY (vacante_id)
        REFERENCES vacantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_vacante_habilidad_habilidad
        FOREIGN KEY (habilidad_id)
        REFERENCES habilidades(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    UNIQUE KEY uk_vacante_habilidad (vacante_id, habilidad_id),
    INDEX idx_habilidad_id (habilidad_id),
    
    CONSTRAINT chk_nivel_requerido CHECK (nivel_requerido IN ('BASICO', 'INTERMEDIO', 'AVANZADO', 'EXPERTO'))
);

-- =========================================
-- TABLA POSTULACIONES
-- =========================================

CREATE TABLE IF NOT EXISTS postulaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    vacante_id BIGINT NOT NULL,
    estado VARCHAR(50) DEFAULT 'POSTULADO',
    fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comentario_rrhh TEXT,
    comentario_tecnico TEXT,
    
    -- Campos añadidos para soportar el flujo de evaluaciones técnicas
    puntaje_tecnico INT NULL,
    respuestas_postulante TEXT NULL, -- Guardará el texto/JSON con las respuestas del candidato
    fecha_evaluacion TIMESTAMP NULL,  -- Registra cuándo rindió el examen

    CONSTRAINT fk_postulacion_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_postulacion_vacante
        FOREIGN KEY (vacante_id)
        REFERENCES vacantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    UNIQUE KEY uk_usuario_vacante (usuario_id, vacante_id),
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_vacante_id (vacante_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_postulacion (fecha_postulacion),
    
    CONSTRAINT chk_estado_postulacion CHECK (estado IN ('POSTULADO', 'EN_REVISION', 'ENTREVISTA', 'EVALUACION_TECNICA', 'RECHAZADO', 'ACEPTADO'))
);


CREATE TABLE IF NOT EXISTS evaluaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vacante_id BIGINT NOT NULL UNIQUE, -- Una evaluación por vacante
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_evaluacion_vacante
        FOREIGN KEY (vacante_id)
        REFERENCES vacantes(id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS preguntas_evaluacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evaluacion_id BIGINT NOT NULL,
    tipo_pregunta VARCHAR(30) NOT NULL, -- MULTIPLE, VERDADERO_FALSO, TEXTO, CODIGO
    enunciado TEXT NOT NULL,
    
    -- Opciones (Solo se llenan si el tipo es 'MULTIPLE')
    opcion_a VARCHAR(255) NULL,
    opcion_b VARCHAR(255) NULL,
    opcion_c VARCHAR(255) NULL,
    opcion_d VARCHAR(255) NULL,
    
    -- Se cambia a TEXT para albergar respuestas largas, códigos guía o letras únicas
    respuesta_correcta TEXT NULL, 
    
    CONSTRAINT fk_pregunta_evaluacion
        FOREIGN KEY (evaluacion_id)
        REFERENCES evaluaciones(id) ON DELETE CASCADE ON UPDATE CASCADE,
        
    CONSTRAINT chk_tipo_pregunta 
        CHECK (tipo_pregunta IN ('MULTIPLE', 'VERDADERO_FALSO', 'TEXTO', 'CODIGO'))
);

-- =========================================
-- TABLA POSTULANTE_HABILIDADES
-- =========================================

CREATE TABLE IF NOT EXISTS postulante_habilidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    postulacion_id BIGINT NOT NULL,
    habilidad_id BIGINT NOT NULL,
    nivel_postulante VARCHAR(50) NOT NULL,
    anios_experiencia INT,
    
    CONSTRAINT fk_postulante_habilidad_postulacion
        FOREIGN KEY (postulacion_id)
        REFERENCES postulaciones(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_postulante_habilidad_habilidad
        FOREIGN KEY (habilidad_id)
        REFERENCES habilidades(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    UNIQUE KEY uk_postulacion_habilidad (postulacion_id, habilidad_id),
    INDEX idx_habilidad_id (habilidad_id),
    
    CONSTRAINT chk_nivel_postulante CHECK (nivel_postulante IN ('BASICO', 'INTERMEDIO', 'AVANZADO', 'EXPERTO')),
    CONSTRAINT chk_anios_experiencia CHECK (anios_experiencia IS NULL OR anios_experiencia >= 0)
);

-- =========================================
-- INSERT ROLES (Ignore if already exists)
-- =========================================

INSERT IGNORE INTO roles (id, nombre, descripcion)
VALUES
(1, 'ADMINISTRADOR', 'Administrador general del sistema'),
(2, 'RECURSOS_HUMANOS', 'Gestión de vacantes y postulaciones'),
(3, 'LIDER_TECNICO', 'Responsable de evaluaciones técnicas'),
(4, 'POSTULANTE', 'Usuario que aplica a vacantes');

-- =========================================
-- INSERT AREAS (Ignore if already exists)
-- =========================================

INSERT IGNORE INTO areas (id, nombre, descripcion, estado)
VALUES
(1, 'Frontend', 'Desarrollo de interfaces web', TRUE),
(2, 'Backend', 'Desarrollo de APIs y lógica de negocio', TRUE),
(3, 'Mobile', 'Desarrollo de aplicaciones móviles', TRUE),
(4, 'Cloud', 'Infraestructura y servicios cloud', TRUE),
(5, 'QA', 'Control de calidad y testing', TRUE),
(6, 'DevOps', 'Automatización e integración continua', TRUE);

