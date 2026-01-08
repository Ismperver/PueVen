import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * Botón genérico con estilo neón para la interfaz de React Native.
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