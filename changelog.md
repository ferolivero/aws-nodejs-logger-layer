# Changelog
Se documentarán todas las modificaciones notables a este proyecto.

## [Unreleased]

## [2.0.1-SNAPSHOT.0] - 2020-01-09 - [AAAA-MM-DD]
### Added
- Permanece el logger tradicional de esta librería (logger.log(obj)), funcionando de la misma forma cómo lo conocemos.
- Se agrega un método opcional (overwriteSystemLogs()) que sobreescribe los métodos del console que ya estan definidos: al importarlo y ejecutarlo nos permitirá usar los métodos del console ('error', 'warn', 'info', 'debug') de forma tal que guardará los logs de una determinada forma que dependerá del método que se utilice.
- Ahora se puede customizar el log de forma tal que utilizando console.custom(obj) obtendremos un log con los niveles y mensajes deseados.
- Se agregó una validación para determinar que el LOG_LEVEL esté dentro de los valores permitidos (que son: 'error', 'warn', 'info', 'debug').
- Además del número de línea ahora también se especifica el número de columna.
- Tambien se pueden enviar múltiples parámetros al logger para que se impriman uno a continuación del otro.

### Changed
- Ya no es necesario pasar el parámetro __line al método log del logger.
- La clase de LoggerWrapper tiene métodos que se han modificado en su nombre, agregándoles un underscore (_) en su nombre para indicar que son privados propios de la clase misma y que no deben de ser utilizados fuera de este.