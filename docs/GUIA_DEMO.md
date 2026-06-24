# Guía de demostración - NovaRecruit

Esta guía muestra el flujo principal del sistema NovaRecruit para una demostración funcional ante el profesor.

---

## 1. Objetivo de la demo

Demostrar el funcionamiento de una aplicación full stack de reclutamiento tecnológico, donde participan cuatro roles:

* Administrador
* Recursos Humanos
* Líder Técnico
* Postulante

El flujo inicia con la configuración del sistema, continúa con la creación de una vacante, la postulación de un candidato, la revisión por RRHH, la evaluación técnica y finaliza con la selección del ganador.

---

## 2. Acceso al sistema desplegado

URL de producción:

```txt
http://57.156.65.62
```

El sistema está desplegado en una máquina virtual Ubuntu en Azure usando Docker Compose.

Servicios desplegados:

```txt
Frontend React + Nginx
Backend Spring Boot
Base de datos MySQL
```

---

## 3. Explicación rápida de arquitectura

Para explicar al profesor:

```txt
El sistema está desplegado en Azure dentro de una máquina virtual Ubuntu. Se usa Docker Compose para levantar tres contenedores: MySQL, backend Spring Boot y frontend React servido con Nginx. El usuario accede por el puerto 80. Nginx redirige internamente las peticiones /api al backend y /ws al WebSocket del backend. La base de datos no está expuesta al exterior, solo se comunica dentro de la red interna de Docker.
```

---

## 4. Usuario administrador inicial

```txt
Correo: admin@novarecruit.com
Contraseña: Admin12345
```

---

## 5. Flujo de demostración

### Paso 1: Iniciar sesión como administrador

1. Entrar a `http://57.156.65.62`.
2. Ir a iniciar sesión.
3. Usar el usuario administrador:

```txt
admin@novarecruit.com
Admin12345
```

4. Mostrar el panel del administrador.

Explicación:

```txt
Desde el administrador se gestionan usuarios internos, áreas, habilidades, logs del sistema y notificaciones.
```

---

### Paso 2: Verificar áreas y habilidades

Entrar a:

```txt
Áreas
Habilidades
```

Mostrar que existen áreas y habilidades base cargadas desde el script inicial de base de datos.

Ejemplos:

```txt
Área: Desarrollo Full Stack
Habilidades: Java, Spring Boot, React, MySQL, Docker
```

Explicación:

```txt
Las áreas permiten clasificar las vacantes y las habilidades permiten definir los requisitos técnicos que tendrá cada proceso de selección.
```

---

### Paso 3: Crear usuario RRHH

Entrar a:

```txt
Crear usuario
```

Datos sugeridos:

```txt
Nombres: Valeria
Apellidos: Torres Mendoza
Correo: rrhh.demo@novarecruit.com
Teléfono: 987654321
Rol: Recursos Humanos
Contraseña: RrhhDemo123
```

Explicación:

```txt
Este usuario será el encargado de crear vacantes y revisar postulaciones.
```

---

### Paso 4: Crear usuario líder técnico

Entrar nuevamente a:

```txt
Crear usuario
```

Datos sugeridos:

```txt
Nombres: Diego
Apellidos: Salazar Rojas
Correo: tecnico.demo@novarecruit.com
Teléfono: 912345678
Rol: Líder Técnico
Contraseña: TecnicoDemo123
```

Explicación:

```txt
Este usuario será el encargado de crear evaluaciones técnicas, asignarlas y revisar resultados.
```

---

### Paso 5: Iniciar sesión como RRHH

Cerrar sesión e ingresar con:

```txt
Correo: rrhh.demo@novarecruit.com
Contraseña: RrhhDemo123
```

Explicación:

```txt
El panel de RRHH está simplificado para trabajar por vacante. Desde una vacante se pueden revisar sus candidatos y aprobarlos o rechazarlos.
```

---

### Paso 6: Crear una vacante

Entrar a:

```txt
Crear vacante
```

Datos de prueba:

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

Explicación:

```txt
RRHH crea una vacante asociada a un área y define las habilidades que debe tener el candidato. Estas habilidades luego se comparan con las habilidades declaradas por el postulante.
```

---

### Paso 7: Registrar postulante

Abrir otra ventana o cerrar sesión.

Ir a registro y crear un postulante.

Datos sugeridos:

```txt
Nombres: Carlos
Apellidos: Mendoza Ruiz
Correo: usar un correo real disponible
Teléfono: 987111222
Contraseña: Postulante123
```

Explicación:

```txt
El sistema registra al postulante y envía un código de verificación al correo real usando SMTP.
```

---

### Paso 8: Verificar correo

1. Revisar el correo del postulante.
2. Copiar el código de 6 dígitos.
3. Ingresar a la pantalla de verificación.
4. Colocar correo y código.
5. Confirmar verificación.

Explicación:

```txt
La verificación evita que un postulante use una cuenta sin confirmar su correo. El código se guarda en la base de datos y tiene vencimiento.
```

---

### Paso 9: Postular a la vacante

Entrar como postulante y seleccionar:

```txt
Vacantes → Practicante Full Stack Junior
```

Datos de habilidades declaradas:

```txt
Java
Nivel: Intermedio
Años de experiencia: 1
```

```txt
Spring Boot
Nivel: Básico
Años de experiencia: 1
```

```txt
React
Nivel: Intermedio
Años de experiencia: 1
```

```txt
MySQL
Nivel: Básico
Años de experiencia: 1
```

```txt
Docker
Nivel: Básico
Años de experiencia: 0
```

Presentación:

```txt
Soy estudiante de Ingeniería de Software con interés en el desarrollo full stack. Tengo experiencia académica usando React, Spring Boot y MySQL, y deseo seguir aprendiendo sobre desarrollo web y despliegue de aplicaciones.
```

CV URL:

```txt
https://drive.google.com/file/d/ejemplo-cv-postulante
```

Explicación:

```txt
El postulante aplica a una vacante declarando sus habilidades, nivel y años de experiencia.
```

---

### Paso 10: Mostrar notificación en tiempo real para RRHH

Mantener una ventana abierta con el usuario RRHH.

Cuando el postulante aplica, RRHH debe recibir una notificación en vivo.

Explicación:

```txt
Las notificaciones se guardan en la base de datos y también se envían en tiempo real mediante WebSocket/STOMP. Por eso aparecen sin recargar la página.
```

---

### Paso 11: RRHH revisa al postulante

Entrar como RRHH:

```txt
Vacantes → Practicante Full Stack Junior → Ver
```

Buscar al postulante:

```txt
Carlos Mendoza Ruiz
```

Comentario para aprobar:

```txt
El postulante cumple con el perfil inicial solicitado. Presenta conocimientos básicos en frontend, backend y base de datos, por lo que puede continuar a la evaluación técnica.
```

Acción:

```txt
Aprobar para evaluación
```

Explicación:

```txt
RRHH revisa la información del candidato desde la vacante. Si cumple el perfil inicial, lo aprueba para pasar a la etapa técnica.
```

---

### Paso 12: Iniciar sesión como líder técnico

Cerrar sesión e ingresar con:

```txt
Correo: tecnico.demo@novarecruit.com
Contraseña: TecnicoDemo123
```

Explicación:

```txt
El líder técnico gestiona los procesos técnicos por vacante. Desde ahí puede crear evaluaciones, asignarlas y revisar resultados.
```

---

### Paso 13: Crear evaluación técnica

Entrar a:

```txt
Crear evaluación
```

Datos:

```txt
Título: Evaluación técnica Full Stack Junior
Vacante: Practicante Full Stack Junior
Duración: 30
Puntaje máximo: 100
Estado: Activa
```

Descripción:

```txt
Evaluación orientada a validar conocimientos básicos de desarrollo full stack, incluyendo backend con Spring Boot, frontend con React, base de datos MySQL y conceptos iniciales de Docker.
```

Preguntas:

#### Pregunta 1

```txt
En Spring Boot, ¿qué anotación se utiliza comúnmente para declarar una clase como controlador REST?
```

Opciones:

```txt
@Service
@Repository
@RestController
@Entity
```

Correcta:

```txt
@RestController
```

Puntaje:

```txt
20
```

#### Pregunta 2

```txt
En React, ¿qué hook se utiliza para manejar estado dentro de un componente funcional?
```

Opciones:

```txt
useState
useRoute
useDatabase
useController
```

Correcta:

```txt
useState
```

Puntaje:

```txt
20
```

#### Pregunta 3

```txt
¿Cuál de las siguientes sentencias SQL se usa para consultar datos de una tabla?
```

Opciones:

```txt
INSERT
SELECT
DELETE
UPDATE
```

Correcta:

```txt
SELECT
```

Puntaje:

```txt
20
```

#### Pregunta 4

```txt
¿Para qué sirve Docker en un proyecto full stack?
```

Opciones:

```txt
Para diseñar interfaces gráficas
Para crear y ejecutar contenedores con la aplicación y sus servicios
Para escribir consultas SQL automáticamente
Para reemplazar completamente al backend
```

Correcta:

```txt
Para crear y ejecutar contenedores con la aplicación y sus servicios
```

Puntaje:

```txt
20
```

#### Pregunta 5

```txt
¿Qué formato se usa comúnmente para intercambiar datos entre frontend y backend en una API REST?
```

Opciones:

```txt
JSON
PNG
MP3
DOCX
```

Correcta:

```txt
JSON
```

Puntaje:

```txt
20
```

Explicación:

```txt
La evaluación permite medir conocimientos técnicos del postulante. Se pueden registrar preguntas, opciones, respuestas correctas y puntajes.
```

---

### Paso 14: Asignar evaluación al postulante

Entrar a:

```txt
Procesos técnicos → Practicante Full Stack Junior
```

Buscar al postulante:

```txt
Carlos Mendoza Ruiz
```

Asignar:

```txt
Evaluación técnica Full Stack Junior
```

Explicación:

```txt
El líder técnico asigna una evaluación al postulante aprobado por RRHH. El postulante recibe una notificación para resolverla.
```

---

### Paso 15: Postulante resuelve evaluación

Entrar como postulante:

```txt
Correo: correo real usado en el registro
Contraseña: Postulante123
```

Ir a:

```txt
Mis evaluaciones
```

Responder:

```txt
1. @RestController
2. useState
3. SELECT
4. Para crear y ejecutar contenedores con la aplicación y sus servicios
5. JSON
```

Enviar evaluación.

Explicación:

```txt
El postulante resuelve la evaluación asignada. Sus respuestas quedan registradas y pasan a revisión técnica.
```

---

### Paso 16: Líder técnico revisa resultado

Entrar como líder técnico:

```txt
Procesos técnicos → Practicante Full Stack Junior
```

Revisar evaluación del postulante.

Datos de revisión:

```txt
Puntaje final: 95
Comentario técnico: El postulante demuestra conocimientos sólidos para el nivel junior. Responde correctamente la mayoría de preguntas y evidencia comprensión general del flujo full stack.
```

Acción:

```txt
Aprobar técnico
```

Explicación:

```txt
El líder técnico revisa las respuestas, asigna un puntaje final y determina si el postulante es apto para selección.
```

---

### Paso 17: Seleccionar ganador

Desde el mismo proceso técnico:

```txt
Seleccionar como ganador
```

Explicación:

```txt
Al seleccionar ganador, la vacante queda con un postulante elegido y el proceso puede darse por finalizado.
```

---

## 6. Demostración de notificaciones

Durante el flujo se pueden mostrar notificaciones en:

```txt
Postulante
RRHH
Líder Técnico
Administrador
```

Ejemplos:

```txt
Nuevo postulante aplicado a una vacante.
Postulación aprobada por RRHH.
Evaluación asignada.
Evaluación enviada por el postulante.
Resultado revisado.
Ganador seleccionado.
```

Explicación:

```txt
Cada usuario recibe sus propias notificaciones. No todos ven lo mismo, porque las notificaciones se generan por usuario y se envían al canal WebSocket correspondiente.
```

---

## 7. Comandos útiles para mostrar despliegue

Entrar al servidor:

```bash
ssh -i "C:\NovaKeys\novarecruit-key.pem" azureuser@57.156.65.62
```

Entrar al proyecto:

```bash
cd ~/novarecruit
```

Ver contenedores:

```bash
docker compose ps
```

Ver logs del backend:

```bash
docker compose logs backend --tail=100
```

Actualizar sistema después de cambios:

```bash
git pull
docker compose up -d --build
```

---

## 8. Qué decir en la exposición

Texto sugerido:

```txt
NovaRecruit es una aplicación full stack para gestionar procesos de reclutamiento tecnológico. El sistema permite que RRHH cree vacantes, que los postulantes apliquen, que el líder técnico asigne y revise evaluaciones, y que finalmente se seleccione un ganador. Además, cuenta con autenticación mediante JWT, verificación real de correo, base de datos MySQL, notificaciones en tiempo real con WebSocket y despliegue en una máquina virtual de Azure usando Docker Compose.
```

---

## 9. Validaciones importantes implementadas

Durante la demo se puede mencionar:

```txt
Validaciones de formularios.
Control de roles.
Contraseñas cifradas.
Verificación de correo.
Estados del proceso.
Notificaciones por usuario.
Uso de variables de entorno.
Base de datos no expuesta públicamente.
Backend no expuesto directamente.
Despliegue con contenedores.
```

---

## 10. Cierre de la demo

Texto sugerido:

```txt
Con esta demostración se valida el funcionamiento completo del sistema desde la configuración inicial hasta la selección del ganador de una vacante. También se evidencia la integración entre frontend, backend, base de datos, correo real, WebSocket y despliegue en la nube.
```
