import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * Componente de botón con estética de neón para la interfaz de usuario.
 * Diseñado para mantener la coherencia visual con el estilo Cyberpunk de la aplicación.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.text - Texto a mostrar dentro del botón.
 * @param {function} props.onPress - Función callback a ejecutar al presionar el botón.
 * @param {boolean} [props.active=false] - Indica si el botón se encuentra en estado activo/seleccionado.
 * @returns {JSX.Element} Elemento TouchableOpacity estilizado.
 */
export const NeonButton = ({ text, onPress, active = false }) => {
    return (
        <TouchableOpacity
            style={[styles.btn, active && styles.activeBtn]}
            onPress={onPress}
        >
            <Text style={styles.btnText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btn:
    {
        backgroundColor: '#2D004B',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#00E5FF'
    },
    activeBtn:
    {
        backgroundColor: '#BC00FF',
        borderColor: '#FFFFFF'
    },
    btnText:
    {
        color: 'white',
        fontWeight: 'bold'
    }
});