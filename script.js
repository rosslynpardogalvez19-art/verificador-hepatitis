async function cargarCertificado() {

    const resultado = document.getElementById("resultado");

    // Obtener el código desde la URL
    const parametros = new URLSearchParams(window.location.search);
    const codigo = parametros.get("codigo");

    // Si no hay código
    if (!codigo) {

        resultado.innerHTML = `
            <div class="no-valido">
                <h2>🔎 Verificación de certificado</h2>

                <p>
                    No se recibió ningún código de validación.
                </p>

                <p>
                    Escanee el código QR correspondiente
                    al certificado que desea verificar.
                </p>
            </div>
        `;

        return;
    }

    try {

        // Cargar nuestra base de datos
        const respuesta = await fetch("certificado.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la base de datos.");
        }

        const certificados = await respuesta.json();

        // Buscar el certificado por código
        const certificado = certificados.find(
            item =>
                String(item.codigo).trim().toUpperCase() ===
                String(codigo).trim().toUpperCase()
        );

        // Si el código NO existe
        if (!certificado) {

            resultado.innerHTML = `
                <div class="no-valido">

                    <h2>❌ CERTIFICADO NO ENCONTRADO</h2>

                    <p>
                        El código consultado no pertenece
                        al registro oficial del
                        II Simposio Departamental
                        de Hepatitis Virales.
                    </p>

                    <div class="codigo">
                        Código consultado:<br>
                        <strong>${codigo}</strong>
                    </div>

                </div>
            `;

            return;
        }

        // Comprobar el estado del certificado
        const estado = String(certificado.estado || "")
            .trim()
            .toLowerCase();

        // Si el certificado está anulado
        if (estado !== "válido") {

            resultado.innerHTML = `
                <div class="no-valido">

                    <div class="estado-anulado">
                        ✕
                    </div>

                    <h2>
                        CERTIFICADO ANULADO
                    </h2>

                    <div class="linea"></div>

                    <p class="etiqueta">
                        NOMBRE
                    </p>

                    <p class="nombre">
                        ${certificado.nombre}
                    </p>

                    <p class="etiqueta">
                        CÓDIGO DE VALIDACIÓN
                    </p>

                    <p class="dato">
                        ${certificado.codigo}
                    </p>

                    <div class="anulado">
                        ✕ CERTIFICADO NO VÁLIDO
                    </div>

                    <p class="pie">
                        Este certificado no se encuentra
                        vigente en el registro oficial del
                        II Simposio Departamental de
                        Hepatitis Virales.
                    </p>

                </div>
            `;

            return;
        }

        // Si encontramos un certificado válido
        resultado.innerHTML = `

            <div class="certificado">

                <div class="estado-valido">
                    ✓
                </div>

                <h2>
                    CERTIFICADO VERIFICADO
                </h2>

                <div class="linea"></div>

                <p class="etiqueta">
                    NOMBRE
                </p>

                <p class="nombre">
                    ${certificado.nombre}
                </p>

                <p class="etiqueta">
                    CATEGORÍA
                </p>

                <p class="dato">
                    ${certificado.tipo}
                </p>

                <p class="etiqueta">
                    CÓDIGO DE VALIDACIÓN
                </p>

                <p class="dato">
                    ${certificado.codigo}
                </p>

                <p class="etiqueta">
                    EVENTO
                </p>

                <p class="dato">
                    ${certificado.evento}
                </p>

                <p class="etiqueta">
                    FECHA
                </p>

                <p class="dato">
                    ${certificado.fecha}
                </p>

                <p class="etiqueta">
                    LUGAR
                </p>

                <p class="dato">
                    ${certificado.lugar}
                </p>

                <div class="valido">
                    ✓ CERTIFICADO VÁLIDO
                </div>

                <p class="pie">
                    Sistema de validación oficial del
                    II Simposio Departamental de
                    Hepatitis Virales.
                </p>

            </div>
        `;

    } catch (error) {

        console.error(error);

        resultado.innerHTML = `

            <div class="no-valido">

                <h2>⚠️ ERROR DE VERIFICACIÓN</h2>

                <p>
                    No fue posible consultar el
                    registro oficial de certificados.
                </p>

            </div>
        `;
    }
}

// Iniciar el sistema
cargarCertificado();
