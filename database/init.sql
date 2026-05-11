USE novarecruit_db;

-- =========================================
-- TABLA ROLES
-- =========================================

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

-- =========================================
-- TABLA USUARIOS
-- =========================================

CREATE TABLE usuarios (
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
        REFERENCES roles(id)
);

-- =========================================
-- TABLA PERFILES POSTULANTE
-- =========================================

CREATE TABLE perfiles_postulante (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE,
    descripcion TEXT,
    experiencia TEXT,
    linkedin VARCHAR(255),
    github VARCHAR(255),
    cv_url VARCHAR(255),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_perfil_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
);

-- =========================================
-- TABLA AREAS
-- =========================================

CREATE TABLE areas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE
);

-- =========================================
-- TABLA HABILIDADES
-- =========================================

CREATE TABLE habilidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    categoria VARCHAR(100)
);

-- =========================================
-- TABLA VACANTES
-- =========================================

CREATE TABLE vacantes (
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
        REFERENCES areas(id),

    CONSTRAINT fk_vacante_rrhh
        FOREIGN KEY (rrhh_id)
        REFERENCES usuarios(id)
);

-- =========================================
-- TABLA VACANTE_HABILIDADES
-- =========================================

CREATE TABLE vacante_habilidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    vacante_id BIGINT NOT NULL,
    habilidad_id BIGINT NOT NULL,

    nivel_requerido VARCHAR(50) NOT NULL,

    CONSTRAINT fk_vacante_habilidad_vacante
        FOREIGN KEY (vacante_id)
        REFERENCES vacantes(id),

    CONSTRAINT fk_vacante_habilidad_habilidad
        FOREIGN KEY (habilidad_id)
        REFERENCES habilidades(id)
);

-- =========================================
-- TABLA POSTULACIONES
-- =========================================

CREATE TABLE postulaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    usuario_id BIGINT NOT NULL,
    vacante_id BIGINT NOT NULL,

    estado VARCHAR(50) DEFAULT 'POSTULADO',

    fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    comentario_rrhh TEXT,
    comentario_tecnico TEXT,

    CONSTRAINT fk_postulacion_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id),

    CONSTRAINT fk_postulacion_vacante
        FOREIGN KEY (vacante_id)
        REFERENCES vacantes(id)
);

-- =========================================
-- TABLA POSTULANTE_HABILIDADES
-- =========================================

CREATE TABLE postulante_habilidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    postulacion_id BIGINT NOT NULL,
    habilidad_id BIGINT NOT NULL,

    nivel_postulante VARCHAR(50) NOT NULL,
    anios_experiencia INT,

    CONSTRAINT fk_postulante_habilidad_postulacion
        FOREIGN KEY (postulacion_id)
        REFERENCES postulaciones(id),

    CONSTRAINT fk_postulante_habilidad_habilidad
        FOREIGN KEY (habilidad_id)
        REFERENCES habilidades(id)
);

-- =========================================
-- INSERT ROLES
-- =========================================

INSERT INTO roles (nombre, descripcion)
VALUES
('ADMINISTRADOR', 'Administrador general del sistema'),
('RECURSOS_HUMANOS', 'Gestión de vacantes y postulaciones'),
('LIDER_TECNICO', 'Responsable de evaluaciones técnicas'),
('POSTULANTE', 'Usuario que aplica a vacantes');

-- =========================================
-- INSERT AREAS
-- =========================================

INSERT INTO areas (nombre, descripcion)
VALUES
('Frontend', 'Desarrollo de interfaces web'),
('Backend', 'Desarrollo de APIs y lógica de negocio'),
('Mobile', 'Desarrollo de aplicaciones móviles'),
('Cloud', 'Infraestructura y servicios cloud'),
('QA', 'Control de calidad y testing'),
('DevOps', 'Automatización e integración continua');