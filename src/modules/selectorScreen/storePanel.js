import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Componente funcional que renderiza un panel informativo nativo con los detalles de la tienda seleccionada.
 * Se superpone a la vista 3D para evitar problemas de interacción comunes en interfaces puramente canvas (Babylon GUI) y mejorar la accesibilidad.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {Object|null} props.store - Objeto de datos de la tienda seleccionada. Si es null, el componente no se renderiza.
 * @param {Function} props.onClose - Función callback para cerrar el panel y limpiar la selección actual.
 * @param {Function} props.onStartAR - Función callback que inicia el modo de Realidad Aumentada con la tienda seleccionada como objetivo.
 * @returns {JSX.Element|null} El elemento React del panel o null si no hay tienda activa.
 */
export const StorePanel = ({ store, onClose, onStartAR }) => {
    if (!store) return null;

    return (
        <View style={styles.infoPanel}>
            {/* Botón de cierre superior */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeBtnText}>CERRAR</Text>
            </TouchableOpacity>

            {/* Cabecera del panel: Nombre de la tienda */}
            <Text style={styles.panelTitle}>{store.nombre.toUpperCase()}</Text>

            {/* Subtítulo: Categoría y Nivel */}
            <Text style={styles.panelCategory}>
                {store.categoria.toUpperCase()} — PLANTA {store.planta === 0 ? "BAJA" : "PRIMERA"}
            </Text>

            {/* Cuerpo: Descripción detallada */}
            <Text style={styles.panelDesc}>{store.descripcion}</Text>

            {/* Acción principal: Inicio del guiado AR */}
            <TouchableOpacity
                style={styles.arButton}
                onPress={() => onStartAR(store)}
            >
                <Text style={styles.arButtonText}>INICIAR GUÍADO (AR)</Text>
            </TouchableOpacity>
        </View>
    );
};

/**
 * Define los estilos visuales del panel, implementando una paleta de colores neón y sombras para destacar sobre la escena 3D.
 */
const styles = StyleSheet.create({
    infoPanel: {
        position: 'absolute',
        bottom: 120,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#190032', // Morado oscuro profundo
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderColor: '#BC00FF', // Borde neón morado
        zIndex: 5,
        elevation: 10,
        shadowColor: '#BC00FF',
        shadowOpacity: 0.8,
        shadowRadius: 15
    },
    closeBtn: {
        alignSelf: 'flex-end',
        marginBottom: 10
    },
    closeBtnText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
        opacity: 0.7
    },
    panelTitle: {
        color: '#00E5FF', // Azul neón
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    panelCategory: {
        color: '#BC00FF',
        fontSize: 14,
        marginVertical: 5,
        fontWeight: '600'
    },
    panelDesc: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
        marginTop: 10
    },
    arButton: {
        backgroundColor: '#00E5FF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#00E5FF',
        shadowOpacity: 0.5,
        shadowRadius: 10
    },
    arButtonText: {
        color: '#190032',
        fontWeight: 'bold',
        fontSize: 16
    }
});