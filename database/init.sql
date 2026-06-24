USE novarecruit_db;

-- =====================================================
-- SCRIPT INICIAL NOVARECRUIT
-- =====================================================
-- Este script se ejecuta solo la primera vez que se crea
-- el contenedor MySQL.
--
-- Creamos tablas base mínimas para poder insertar:
-- roles, áreas, habilidades y usuario admin inicial.
--
-- Luego Hibernate/JPA completa o actualiza el resto de
-- tablas del sistema cuando arranca el backend.
-- =====================================================

-- =====================================================
-- TABLA: roles
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    estado BIT NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_roles_nombre (nombre)
);

-- =====================================================
-- TABLA: areas
-- =====================================================
CREATE TABLE IF NOT EXISTS areas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    estado BIT NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_areas_nombre (nombre)
);

-- =====================================================
-- TABLA: habilidades
-- =====================================================
CREATE TABLE IF NOT EXISTS habilidades (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    estado BIT NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_habilidades_nombre (nombre)
);

-- =====================================================
-- TABLA: usuarios
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(120) NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    foto_perfil VARCHAR(255),
    estado BIT NOT NULL,
    correo_verificado BIT NOT NULL,
    debe_cambiar_password BIT NOT NULL,
    fecha_registro DATETIME NOT NULL,
    rol_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_usuarios_correo (correo),
    CONSTRAINT fk_usuarios_roles
        FOREIGN KEY (rol_id)
        REFERENCES roles(id)
);

-- =====================================================
-- ROLES BASE
-- =====================================================
INSERT INTO roles (id, nombre, descripcion, estado, created_at)
VALUES
(1, 'ADMINISTRADOR', 'Administrador general del sistema.', b'1', NOW()),
(2, 'RECURSOS_HUMANOS', 'Usuario encargado de gestionar vacantes y postulaciones.', b'1', NOW()),
(3, 'LIDER_TECNICO', 'Usuario encargado de evaluaciones técnicas.', b'1', NOW()),
(4, 'POSTULANTE', 'Usuario postulante que aplica a las vacantes.', b'1', NOW())
ON DUPLICATE KEY UPDATE
descripcion = VALUES(descripcion),
estado = b'1';

-- =====================================================
-- ÁREAS INICIALES
-- =====================================================
INSERT INTO areas (nombre, descripcion, estado, created_at)
VALUES
('Desarrollo de Software', 'Área encargada del desarrollo de soluciones web, móviles y backend.', b'1', NOW()),
('Calidad de Software', 'Área encargada de pruebas, aseguramiento de calidad y validación funcional.', b'1', NOW()),
('Infraestructura TI', 'Área encargada de servidores, redes, despliegue y soporte tecnológico.', b'1', NOW()),
('Datos e Inteligencia Artificial', 'Área enfocada en análisis de datos, automatización e inteligencia artificial.', b'1', NOW()),
('Soporte Técnico', 'Área encargada de atención técnica y resolución de incidencias.', b'1', NOW())
ON DUPLICATE KEY UPDATE
descripcion = VALUES(descripcion),
estado = b'1';

-- =====================================================
-- HABILIDADES INICIALES
-- =====================================================
INSERT INTO habilidades (nombre, categoria, estado, created_at)
VALUES
('Java', 'Backend', b'1', NOW()),
('Spring Boot', 'Backend', b'1', NOW()),
('MySQL', 'Base de datos', b'1', NOW()),
('React', 'Frontend', b'1', NOW()),
('JavaScript', 'Frontend', b'1', NOW()),
('HTML', 'Frontend', b'1', NOW()),
('CSS', 'Frontend', b'1', NOW()),
('Tailwind CSS', 'Frontend', b'1', NOW()),
('Git', 'Herramientas', b'1', NOW()),
('Docker', 'DevOps', b'1', NOW()),
('Azure', 'DevOps', b'1', NOW()),
('APIs REST', 'Backend', b'1', NOW()),
('Pruebas funcionales', 'QA', b'1', NOW()),
('SQL', 'Base de datos', b'1', NOW()),
('Comunicación efectiva', 'Habilidades blandas', b'1', NOW())
ON DUPLICATE KEY UPDATE
categoria = VALUES(categoria),
estado = b'1';

-- =====================================================
-- USUARIO ADMIN INICIAL
-- =====================================================
-- Correo: admin@novarecruit.com
-- Contraseña: Admin12345
--
-- La contraseña está cifrada con BCrypt.
-- Al iniciar sesión, usa:
-- correo: admin@novarecruit.com
-- clave: Admin12345
-- =====================================================
INSERT INTO usuarios (
    nombres,
    apellidos,
    correo,
    password,
    telefono,
    foto_perfil,
    estado,
    correo_verificado,
    debe_cambiar_password,
    fecha_registro,
    rol_id
)
VALUES (
    'Admin',
    'NovaRecruit',
    'admin@novarecruit.com',
    'Admin12345',,
    '999999999',
    NULL,
    b'1',
    b'1',
    b'0',
    NOW(),
    1
)
ON DUPLICATE KEY UPDATE
nombres = VALUES(nombres),
apellidos = VALUES(apellidos),
password = VALUES(password),
telefono = VALUES(telefono),
estado = b'1',
correo_verificado = b'1',
debe_cambiar_password = b'0',
rol_id = 1;