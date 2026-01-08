import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Componente de búsqueda nativo con estética neón.
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.searchTerm - Texto actual de búsqueda.
 * @param {Function} props.onSearch - Callback al escribir.
 * @param {Array} props.results - Lista de tiendas filtradas.
 * @param {Function} props.onSelect - Callback al elegir una tienda.
 */
export const SearchBar = ({ searchTerm, onSearch, results, onSelect }) => {
    return (
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.input}
                placeholder="BUSCAR TIENDA..."
                placeholderTextColor="#BC00FF"
                value={searchTerm}
                onChangeText={onSearch}
            />
            {results.length > 0 && (
                <View style={styles.dropdown}>
                    {results.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.resultItem}
                            onPress={() => onSelect(item)}
                        >
                            <Text style={styles.resultText}>{item.nombre.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer:
    {
        position: 'absolute',
        top: 40, width: '100%',
        alignItems: 'center',
        zIndex: 10
    },
    input:
    {
        width: '90%',
        height: 60,
        backgroundColor: '#2D004B',
        borderColor: '#00E5FF',
        borderWidth: 2,
        borderRadius: 15,
        color: '#00E5FF',
        paddingHorizontal: 20,
        fontSize: 18,
        fontWeight: 'bold'
    },
    dropdown:
    {
        width: '90%',
        backgroundColor: '#190032',
        marginTop: 5,
        borderRadius: 10,
        overflow: 'hidden'
    },
    resultItem:
    {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#BC00FF'
    },
    resultText:
    {
        color: '#00E5FF',
        fontWeight: 'bold'
    },
});