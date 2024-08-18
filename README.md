# Management PI

## Configuración

1 - Clonar el repositorio:
Ejecta este comando para instalar los paquetes
```bash
git clone https://github.com/Zelaznog-2/ManagementPI
cd ManagementPI
```

2 - Instalar dependencias:

```bash
npm install -f
```

3 - Configurar variables de entorno:
- Renombrar el archivo: Cambia el nombre del archivo .env.example a .env.
- Configurar la base de datos:
  - URL de conexión: Reemplaza la URL de conexión de la base de datos en el archivo .env con la de tu instancia de PostgresSql.
  - Credenciales: Asegúrate de que las credenciales de acceso a la base de datos (usuario, contraseña) sean correctas.
- API key de Resend: Si utilizas Resend para enviar correos, agrega tu API key en la sección correspondiente del archivo .env.


3 - Crear las tablas de la base de datos:
```bash
npm run db:generate
# and
npm run db:migrate
```
Este comando ejecutará las migraciones necesarias para crear las tablas en tu base de datos.


4 - Ejecutar la aplicación
```bash
npm run dev
```
Este comando iniciará el servidor de desarrollo en el puerto 3000. Accede a [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

### Estructura del proyecto
- src: Contiene el código fuente de la aplicación.
- .env: Contiene las variables de entorno de la aplicación.

### Comandos útiles
- npm run build: Genera una versión de producción de la aplicación.
