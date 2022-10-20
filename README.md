# Modo de uso de layer aws-nodejs-logger
Este README contiene las diferentes formas de utilizar la layer aws-nodejs-logger

## Objetivos de la layer logger
El objetivo es el de tener un componente que sea reutilizable en diferentes lambdas. Que sea adaptable y que permita configurar distintos niveles de log de forma rápida y sencilla para la mayoria de los casos de usos de las lambdas que se encuentren disponibles.

## Modo de uso
Se debe importar el logger de la siguiente forma
```
const { logger } = require("aws-nodejs-logger");
```

Siendo module un objeto global de Node.js que le va a permitir obtener el nombre y la ruta del archivo desde donde se esta ejecutando el logger.

Para loggear un simple mensaje se debe llamar a la función log de la siguiente manera:

```
logger.log({info: "Mensaje de prueba"});
```

Generando un log con la siguiente estructura
```
<timestamp> <nivel de log> [ <nombre del archivo> <linea> ]: <mensaje>
```

## Diferentes tipos de niveles de log
La función log recibe el mensaje a partir de un objeto JSON donde en la ***key*** se especifica el nivel de log y en el ***valor*** se especifica lo que se quiere loggear.

De esta manera se pueden loggear en una misma linea múltiples logs con diferentes niveles.

Ejemplo
```
logger.log({
    info: 'Mensaje informativo',
    error: 'Mensaje de error',
    debug: 'Mensaje para debuguear'
})
```

## Niveles de logs.
Los diferentes niveles de log son

- debug
- info
- warn
- error

debug y error contienen un **pretty JSON**, pueden ser usados para loggear objetos JSON.

En el caso de debug va a loggear todas las keys del objeto.

Ejemplo
```
const customObject = {
    a: 1,
    b: {
        c: 1,
        d: 2
    }
}

logger.log({debug: customObject});
```

Dando como resultado:
```
<timestamp> <nivel de log> [ <nombre del archivo> <linea> ]: {
    a: 1,
    b: {
        c: 1,
        d: 2
    }
}
```

En el caso de los errores imprime una estructura que da más información sobre el mismo:

Ejemplo
```
const customError = new Error({'Este es un error});

logger.log({error: customError})
```

Va a producir una salida 
```
<timestamp> <nivel de log> [ <nombre del archivo> <linea> ]: {
  "tag": "ERROR",
  "message": "Este es un error",
  "filename": "nombre del file",
  "stack": <Imprime el stack asociado al error>
}
```

## Configuración
Se debe setear la **variable de entorno** **LOG_LEVEL**, en caso contrario lanzará una excepcion informando que dicha variable no está definida.

Puede tomar los siguientes valores
- error
- warn
- info
- debug

Ordenados desde el más importante al menos importante. Si el valor definido en LOG_LEVEL no es ninguno de estos tambien se lanzará una excepción.

## Sobreescribiendo las funciones nativas del console de NodeJS
Para sobreescribir y utilizar los métodos de la librería se debe importar y ejecutar el método indicado como se ejemplifica a continuación.

```
const { overwriteSystemLogs } = require('aws-nodejs-logger');
overwriteSystemLogs();
```

Hecho esto podremos utilizar el console como lo hacemos de manera nativa y nos imprimirá el mensaje, el nivel y demás información. Ejemplo:

```
console.info("aaa");
console.debug("bbb");
console.warn("ccc");
console.error("ddd");
```

También se permite el envio de múltiples parámetros:

```
console.info("aaa", "bbb");
console.debug("ccc", "ddd", "eee");
```

Si importamos el logger de la misma librería, otra forma de utilizarlo es la siguiente:

```
const { logger, overwriteSystemLogs } = require('aws-nodejs-logger');
overwriteSystemLogs();

logger.info("hola");
logger.warn("adios");
logger.error("esto es un error");
logger.log({info: "asdf", debug: {a:1}});
```


## Customizando el log
Es posible customizar el log con el console (si es que antes ejecutamos el método que permite sobreescribir las funciones nativas, es decir overwriteSystemLogs()).

```
console.custom({
    line: __line,
    info: "Info log",
    debug: {objectKey: "object message"},
    error: new Error("Error message"),
    warn: "new warning message"
});
```

## Loggeo de excepciones de **AWS**
El logger esta adaptado para detectar cuando se está haciendo un log de una excepción de AWS, en dicho caso agrega una etiqueta para poder visualizar rápidamente este tipo de excepción.

```
<timestamp> <nivel de log> [ <nombre del archivo> <linea> ]: EXCEPCION AWS <objeto>
```

## Dependencias
Este logger funciona utilizando como dependencia la libreria Winston
[link](https://www.npmjs.com/package/winston)