# Trazabilidad HU → implementación

HU del Product Backlog (17 Must + 13 Should). `Rol` indica dónde se ve en la demo.

HU | Prior. | Rol / pestaña | Implementación | Qué se verifica

HU-01 | Must | Vecino · Reportar (paso 1) | `camera.js`, `vecino.js › step1` | La cámara se abre sola al tocar «Reportar», sin galería; foto sellada con fecha/hora/GPS; sin foto no se continúa; se puede repetir 
HU-02 | Must | Vecino · Reportar (pasos 1 y 2) | `geo.js`, `store.zoneFor`, `vecino.js › step1, step2` | Permiso de ubicación explicado y solicitado al iniciar el primer reporte; ubicación adjuntada al tomar la foto; pin ajustable; derivación automática a municipalidad y junta 
HU-03 | Must | Vecino · Reportar | `vecino.js › reportar` | 3 pantallas (foto → ubicación/envío → confirmación); sin texto obligatorio 
HU-05 | Must | Vecino · confirmación, campana | `store.nextId`, `store.notify` | Código único `REP-xxxx` y notificación 
HU-06 | Must | Vecino · detalle | evento `storage` + `ev:data` | El estado se actualiza sin recargar (también entre pestañas) 
HU-08 | Must | Vecino · Mis reportes | `vecino.js › mis` | Más reciente primero, filtro por estado, fecha y ubicación 
HU-17 | Must | Municipal · Panel | `municipal.js › panel` | Todos los reportes de la jurisdicción con mapa y lista 
HU-18 | Must | Municipal · Panel | filtros en `store.s.filters` | Filtros combinables por zona, fechas y estado; se conservan al navegar 
HU-21 | Must | Municipal · detalle | `store.priority` | Puntaje 0–100 con 4 factores visibles; ajuste manual con motivo registrado 
HU-25 | Must | Municipal · Cuadrilla | `municipal.js › cuadrilla` | La cuadrilla sube la foto de «después» solo con la cámara, con fecha, hora y ubicación, asociada a la de «antes» 
HU-26 | Must | Municipal · detalle y Cuadrilla | `municipal.js › openReport, cuadrilla` | Comparación antes/después lado a lado; aprobar o rechazar (motivo obligatorio); el rechazo pide una nueva foto a la cuadrilla 
HU-27 | Must | Municipal · detalle | `act('resolve')` | «Resolver» solo con evidencia aprobada; notifica al vecino con la foto 
HU-33 | Must | Dirigente · Faenas | `dirigente.js › faenas` | Fecha, hora, lugar y descripción validados; visible a vecinos 
HU-38 | Must | Dirigente · Casos | `dirigente.js › evidencia` | Foto con fecha, hora y ubicación asociada a un caso 
HU-39 | Must | Vecino (reporte reservado) · Dirigente | casilla «reporte reservado»; avisos de privacidad | El nombre no se muestra a otros; no se piden datos de terceros 
HU-43 | Must | Dirigente · Solicitudes | `dirigente.js › solicitudes` | Estado (enviada / en revisión / atendida) y fecha del último cambio 
HU-47 | Must | Dirigente y Municipal · hilo | `openSolThread` | Comunicación en un solo hilo cronológico 
HU-04 | Should | Vecino · Cerca de mí | `vecino.js › cerca` | Reportes activos en radio configurable, con estado y distancia 
HU-10 | Should | Vecino · detalle | `vecino.js › openDetail` | Comentario con fecha y hora; no en reportes resueltos 
HU-11 | Should | Vecino · Faenas | `vecino.js › faenas` | Lista con filtro de cercanía y datos de la faena 
HU-12 | Should | Vecino · Faenas · detalle | `vecino.js › openFaena` | Inscripción desde el detalle de la faena, calendario y cancelación hasta 24 h antes (libera el cupo) 
HU-20 | Should | Municipal · Panel y Zonas | `store.isOverdue` | Plazo por prioridad; marca «atrasado» y alerta al ingresar 
HU-22 | Should | Municipal · Panel | `store.clusters` | Agrupa reportes a ≤ 50 m; al resolver se cierran todos 
HU-29 | Should | Municipal · Zonas / Dirigente · Mi zona | `municipal.js › zonas`, `dirigente.js › zona` | Vinculación zona–junta; la junta ve el estado en solo lectura 
HU-31 | Should | Municipal y Dirigente · comentarios | `thread` del reporte | Respuesta visible para ambas partes y notificada 
HU-34 | Should | Dirigente · Faenas | `dirigente.js › invitar, verInvitados` | Invitación a los vecinos registrados de la zona y número de confirmados 
HU-35 | Should | Dirigente · Faenas / Vecino | campos de insumos | Lista de insumos editable hasta el día anterior; visible al inscrito 
HU-36 | Should | Dirigente · Faenas | `attendance()` | Asistencia por faena; solo asistentes reciben puntos 
HU-40 | Should | Dirigente · Casos | casos con 4 fases | No se avanza sin una acción de la fase; solo se escala desde la fase final 
HU-44 | Should | Dirigente · Solicitudes / campana | `checkAlerts`, `remind` | Alerta por plazo vencido y reenvío de recordatorio desde la notificación 

> Reglas del puntaje de prioridad (HU-21): volumen 30 + riesgo 30 + ubicación 20 + frecuencia 20 = 100. Nivel Alta ≥ 70, Media ≥ 45, Baja < 45.


## Ampliación de trazabilidad para la evaluación de 48 HU

Las siguientes funciones se incorporaron o se identificaron durante la revisión ampliada. La presencia en código no equivale a una prueba de aceptación aprobada.

| HU | Estado de implementación en esta rama | Ubicación / observación |
|---|---|---|
| HU-14 | No encontrada | No existe vista de ranking de vecinos. |
| HU-15 | No encontrada | No existe flujo de canje de puntos por beneficios. |
| HU-19 | Implementada en código; pendiente de prueba funcional | `js/map.js`: los marcadores de reportes próximos se agrupan visualmente y conservan sus registros individuales. |
| HU-23 | Implementada en código; pendiente de prueba funcional | `js/municipal.js`: detalle del reporte muestra reportes anteriores resueltos a 50 m o menos. |
| HU-24 | Parcial | `js/municipal.js`: indicadores por zona implementados. Falta filtro por rango de fechas y exportación del resumen en CSV o PDF, exigidos por los criterios. |
| HU-28 | Parcial / requiere validación | Se muestra la distancia entre la ubicación de la foto posterior y el punto reportado; falta confirmar una regla de bloqueo por umbral GPS. |
| HU-32 | No encontrada | No se identificó un resumen específico por junta vecinal. |
| HU-41 | Parcial | `js/municipal.js`: descarga CSV con datos consolidados de reportes. Falta agrupar evidencias fotográficas de un mismo punto en un documento y permitir enviarlo como denuncia formal. |
| HU-42 | No encontrada | No se identificó registro de verificación entre pares. |
| HU-45 | Parcial | `js/dirigente.js`: compara zona, tipo y similitud del asunto, y advierte duplicados. Falta ofrecer la vinculación directa con la solicitud existente. |
| HU-46 | Parcial | `js/municipal.js`: resumen por estado y tipo implementado. Falta filtro por periodo y exportación/compartición del resumen. |
| HU-48 | Implementada en código; pendiente de prueba funcional | `js/dirigente.js` y `js/municipal.js`: la junta califica del 1 al 5 una solicitud atendida, agrega comentario opcional y la municipalidad puede consultar la valoración. |

**Pendiente antes de declarar las 48 HU listas:** implementar las historias marcadas como «No encontrada», completar las parciales y ejecutar las pruebas funcionales en GitHub Pages. Las HU que ya existían en la trazabilidad original también deben volver a probarse tras los cambios.
