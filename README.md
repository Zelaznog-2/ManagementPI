# Management PI

## Configuración rápida

1 - Primero parte
Ejecta este comando para instalar los paquetes
```bash
npm install -f
```

2 - Segunda parte

```
Debes modificar el nombre archivo .env-example a .env
Ya una vez esa parte lista, modifica la dirección de la url de la base de datos con la de tu configuración
y también agrega la api key se resend para habilitar el correo
```

3 - Tercera parte
Una vez lo de arriba vas a escribir los comando para crear las tablas de la base de datos
```bash
npm run db:generate
# and
npm run db:migrate
```

4 - Cuarta
Ejecuta el siguiente comando para abir esta url [http://localhost:3000](http://localhost:3000) y ver lo resultado de la aplicación
```bash
npm run dev
```

