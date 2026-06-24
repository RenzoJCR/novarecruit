# NovaRecruit

NovaRecruit es una aplicación web full stack para la gestión de procesos de reclutamiento de perfiles tecnológicos. El sistema permite publicar vacantes, registrar postulantes, revisar postulaciones, asignar evaluaciones técnicas, calificar resultados y seleccionar al ganador de una vacante.

El proyecto fue desarrollado como parte del curso de Desarrollo Full Stack, utilizando React para el frontend, Spring Boot para el backend, MySQL como base de datos y Docker para el despliegue en una máquina virtual de Azure.

---

## Tecnologías utilizadas

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* STOMP WebSocket
* Lucide React

### Backend

* Java 17
* Spring Boot
* Spring Security
* JWT
* Spring Data JPA
* Spring WebSocket
* Spring Mail
* Maven

### Base de datos

* MySQL 8.4

### Despliegue

* Azure Virtual Machine
* Ubuntu Server 24.04 LTS
* Docker
* Docker Compose
* Nginx

---

## Roles del sistema

El sistema cuenta con cuatro roles principales:

### Administrador

Puede gestionar usuarios, áreas, habilidades, logs del sistema y notificaciones.

### Recursos Humanos

Puede crear vacantes, revisar postulantes por vacante, aprobar postulaciones para evaluación técnica o rechazarlas.

### Líder Técnico

Puede crear evaluaciones técnicas, asignarlas a postulantes aprobados, revisar resultados y seleccionar al ganador de una vacante.

### Postulante

Puede registrarse, verificar su correo, ver vacantes, postular, resolver evaluaciones y revisar el estado de sus postulaciones.

---

## Funcionalidades principales

* Registro de postulantes.
* Verificación real de correo electrónico mediante SMTP.
* Inicio de sesión con JWT.
* Gestión de usuarios internos.
* Gestión de áreas.
* Gestión de habilidades.
* Creación de vacantes.
* Postulación a vacantes.
* Revisión de postulaciones por RRHH.
* Creación de evaluaciones técnicas.
* Asignación de evaluaciones a postulantes.
* Resolución de evaluaciones por parte del postulante.
* Revisión técnica de resultados.
* Selección de ganador.
* Notificaciones por usuario.
* Notificaciones en tiempo real con WebSocket/STOMP.
* Despliegue con Docker Compose en Azure.

---

## Arquitectura general

El sistema está dividido en tres servicios principales:

```txt
NovaRecruit
├── Frontend React + Nginx
├── Backend Spring Boot
└── MySQL
```

En producción, el usuario accede al sistema mediante la IP pública de la máquina virtual de Azure. El frontend se sirve mediante Nginx en el puerto 80. Las peticiones al backend se redirigen internamente usando las rutas `/api` y `/ws`.

```txt
Usuario
  |
  | http://IP_PUBLICA
  v
Nginx Frontend
  ├── /api  → Backend Spring Boot
  └── /ws   → WebSocket Spring Boot
        |
        v
      MySQL
```

La base de datos no se expone directamente al exterior. Solo se comunica con el backend dentro de la red interna de Docker.

---

## Estructura del proyecto

```txt
NovaRecruit
├── backend
│   ├── src
│   ├── pom.xml
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend
│   ├── src
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
│
├── database
│   └── init.sql
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Requisitos para ejecución local

Para ejecutar el proyecto localmente se necesita:

* Java 17 o superior.
* Maven.
* Node.js.
* MySQL.
* Git.

---

## Configuración local del backend

Ubicación del backend:

```txt
backend
```

El archivo principal de configuración se encuentra en:

```txt
backend/src/main/resources/application.properties
```

El backend utiliza variables de entorno para conectarse a la base de datos y configurar el correo.

Ejemplo de variables para entorno local:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=novarecruit_db
DB_USER=root
DB_PASSWORD=tu_password_mysql

JWT_SECRET=uRz7F7Fq4H9d9ixOqf4P3UVAEg6b4OiQS85LSgZXy/ao=
JWT_EXPIRATION_MS=86400000

MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_password_de_aplicacion
APP_MAIL_ENABLED=true
FRONTEND_URL=http://localhost:5173
```

Para ejecutar el backend:

```bash
cd backend
mvn spring-boot:run
```

El backend se ejecuta por defecto en:

```txt
http://localhost:8080
```

---

## Configuración local del frontend

Ubicación del frontend:

```txt
frontend
```

Crear o revisar el archivo:

```txt
frontend/.env
```

Contenido recomendado para desarrollo local:

```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

Instalar dependencias:

```bash
cd frontend
npm install
```

Ejecutar frontend:

```bash
npm run dev
```

El frontend se ejecuta por defecto en:

```txt
http://localhost:5173
```

---

## Configuración del correo

El sistema utiliza Spring Mail para enviar códigos de verificación al correo del postulante.

Para usar Gmail SMTP se necesita:

1. Crear o usar una cuenta Gmail.
2. Activar verificación en dos pasos.
3. Generar una contraseña de aplicación.
4. Configurar las variables:

```env
MAIL_USERNAME=correo@gmail.com
MAIL_PASSWORD=password_de_aplicacion_sin_espacios
APP_MAIL_ENABLED=true
```

Si se desea probar sin correo real, se puede usar:

```env
APP_MAIL_ENABLED=false
```

En ese caso, el código de verificación se mostrará en la consola del backend.

---

## Despliegue con Docker Compose

El proyecto incluye archivos para desplegar los servicios con Docker:

```txt
docker-compose.yml
backend/Dockerfile
frontend/Dockerfile
frontend/nginx.conf
database/init.sql
```

Crear un archivo `.env` en la raíz del proyecto con las variables reales del servidor:

```env
MYSQL_DATABASE=novarecruit_db
MYSQL_USER=novarecruit_user
MYSQL_PASSWORD=NovarecruitDb2026!
MYSQL_ROOT_PASSWORD=RootNovarecruit2026!

DB_HOST=mysql
DB_PORT=3306
DB_NAME=novarecruit_db
DB_USER=novarecruit_user
DB_PASSWORD=NovarecruitDb2026!

JWT_SECRET=uRz7F7Fq4H9d9ixOqf4P3UVAEg6b4OiQS85LSgZXy/ao=
JWT_EXPIRATION_MS=86400000

MAIL_USERNAME=correo@gmail.com
MAIL_PASSWORD=password_de_aplicacion
APP_MAIL_ENABLED=true

FRONTEND_URL=http://IP_PUBLICA
```

Construir los contenedores:

```bash
docker compose build
```

Levantar los servicios:

```bash
docker compose up -d
```

Verificar el estado:

```bash
docker compose ps
```

Ver logs del backend:

```bash
docker compose logs backend --tail=100
```

Ver logs en tiempo real:

```bash
docker compose logs -f backend
```

---

## Despliegue en Azure

El sistema fue desplegado en una máquina virtual de Azure con Ubuntu Server.

Configuración usada:

```txt
Sistema operativo: Ubuntu Server 24.04 LTS
Servidor: Azure Virtual Machine
Contenedores: Docker Compose
Frontend: Nginx
Backend: Spring Boot
Base de datos: MySQL
Puerto público: 80
```

El usuario accede al sistema mediante:

```txt
http://IP_PUBLICA
```

En el despliegue, solo se expone el puerto 80. El backend y MySQL permanecen internos dentro de Docker.

---

## Comandos útiles en Azure

Entrar al servidor por SSH:

```bash
ssh -i "C:\NovaKeys\novarecruit-key.pem" azureuser@IP_PUBLICA
```

Ir al proyecto:

```bash
cd ~/novarecruit
```

Ver contenedores:

```bash
docker compose ps
```

Actualizar después de cambios en GitHub:

```bash
git pull
docker compose up -d --build
```

Reiniciar contenedores:

```bash
docker compose restart
```

Apagar contenedores sin borrar datos:

```bash
docker compose down
```

Levantar contenedores:

```bash
docker compose up -d
```

Ver logs del backend:

```bash
docker compose logs backend --tail=100
```

Ver logs del frontend:

```bash
docker compose logs frontend --tail=100
```

Ver logs de MySQL:

```bash
docker compose logs mysql --tail=100
```

No usar este comando salvo que se quiera borrar la base de datos:

```bash
docker compose down -v
```

Ese comando elimina el volumen de MySQL.

---

## Usuarios de prueba

### Administrador inicial

```txt
Correo: admin@novarecruit.com
Contraseña: Admin12345
```

### Usuario RRHH sugerido

```txt
Nombres: Valeria
Apellidos: Torres Mendoza
Correo: rrhh.demo@novarecruit.com
Teléfono: 987654321
Rol: Recursos Humanos
Contraseña: RrhhDemo123
```

### Usuario técnico sugerido

```txt
Nombres: Diego
Apellidos: Salazar Rojas
Correo: tecnico.demo@novarecruit.com
Teléfono: 912345678
Rol: Líder Técnico
Contraseña: TecnicoDemo123
```

### Usuario postulante sugerido

```txt
Nombres: Carlos
Apellidos: Mendoza Ruiz
Correo: usar un correo real disponible
Teléfono: 987111222
Contraseña: Postulante123
```

---

## Flujo de prueba recomendado

1. Iniciar sesión como administrador.
2. Crear usuario RRHH.
3. Crear usuario líder técnico.
4. Verificar áreas y habilidades.
5. Iniciar sesión como RRHH.
6. Crear una vacante.
7. Registrar un postulante.
8. Verificar correo del postulante.
9. Postular a la vacante.
10. Revisar la postulación desde RRHH.
11. Aprobar para evaluación técnica.
12. Iniciar sesión como líder técnico.
13. Crear una evaluación técnica.
14. Asignar la evaluación al postulante.
15. Iniciar sesión como postulante.
16. Resolver la evaluación.
17. Volver al líder técnico.
18. Revisar resultado.
19. Aprobar técnicamente.
20. Seleccionar ganador.
21. Verificar notificaciones en tiempo real.

---

## Vacante de prueba sugerida

```txt
Título: Practicante Full Stack Junior
Área: Desarrollo Full Stack
Modalidad: Híbrido
Ubicación: Lima, Perú
Salario: 1200
Nivel de experiencia: Junior
Fecha de cierre: 2026-08-30
```

Descripción:

```txt
Buscamos un practicante de desarrollo full stack con conocimientos básicos en React, Spring Boot y MySQL. La persona participará en el desarrollo de módulos web, consumo de APIs REST, validación de formularios y soporte en despliegues con Docker.
```

Requisitos:

```txt
Conocimientos básicos de programación orientada a objetos.
Manejo básico de React para interfaces web.
Conocimientos iniciales de Spring Boot y APIs REST.
Uso de MySQL para consultas y diseño básico de tablas.
Interés en aprender despliegue con Docker y servicios en la nube.
```

Habilidades requeridas:

```txt
Java - Intermedio - Obligatoria
Spring Boot - Intermedio - Obligatoria
React - Intermedio - Obligatoria
MySQL - Básico - Obligatoria
Docker - Básico - Deseable
```

---

## Evaluación técnica de prueba

Título:

```txt
Evaluación técnica Full Stack Junior
```

Descripción:

```txt
Evaluación orientada a validar conocimientos básicos de desarrollo full stack, incluyendo backend con Spring Boot, frontend con React, base de datos MySQL y conceptos iniciales de Docker.
```

Duración:

```txt
30 minutos
```

Puntaje máximo:

```txt
100
```

Preguntas:

1. En Spring Boot, ¿qué anotación se utiliza comúnmente para declarar una clase como controlador REST?

```txt
Correcta: @RestController
```

2. En React, ¿qué hook se utiliza para manejar estado dentro de un componente funcional?

```txt
Correcta: useState
```

3. ¿Cuál de las siguientes sentencias SQL se usa para consultar datos de una tabla?

```txt
Correcta: SELECT
```

4. ¿Para qué sirve Docker en un proyecto full stack?

```txt
Correcta: Para crear y ejecutar contenedores con la aplicación y sus servicios
```

5. ¿Qué formato se usa comúnmente para intercambiar datos entre frontend y backend en una API REST?

```txt
Correcta: JSON
```

---

## Consideraciones de seguridad

* Las contraseñas reales no se suben al repositorio.
* El archivo `.env` está excluido mediante `.gitignore`.
* MySQL no está expuesto públicamente.
* El backend no se expone directamente al exterior.
* El acceso público se realiza por Nginx usando el puerto 80.
* El sistema utiliza JWT para autenticación.
* Las notificaciones en tiempo real se envían por WebSocket/STOMP.

---

## Estado del proyecto

El proyecto se encuentra funcional y desplegado en Azure. El flujo principal de reclutamiento se encuentra implementado desde la creación de vacantes hasta la selección del ganador.

Funcionalidades completadas:

```txt
Autenticación
Registro
Verificación de correo
Gestión de usuarios
Gestión de áreas
Gestión de habilidades
Gestión de vacantes
Postulación
Revisión RRHH
Evaluación técnica
Selección de ganador
Notificaciones en tiempo real
Despliegue en Azure con Docker
```

---

## Autor

Proyecto desarrollado por Renzo Coveñas Ramirez para el curso de Desarrollo Full Stack.
