import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Panel informativo nativo que muestra los detalles de la tienda seleccionada.
 * Este componente sustituye a la interfaz de Babylon GUI para asegurar fluidez y evitar problemas de teclado.
 * * @param {Object} props - Propiedades del componente.
 * @param {Object|null} props.store - Objeto con los datos de la tienda seleccionada.
 * @param {Function} props.onClose - Función para cerrar el panel y limpiar la selección.
 * @param {Function} props.onStartAR - Función para iniciar la cámara de Realidad Aumentada.
 * @returns {JSX.Element|null} El componente renderizado o null si no hay selección.
 */
export const StorePanel = ({ store, onClose, onStartAR }) => {
    // Si no hay ninguna tienda seleccionada, el componente no se renderiza.
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
 * Estilos del panel de información con temática neón y colores corporativos de la App.
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