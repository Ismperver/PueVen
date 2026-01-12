import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList } from 'react-native';

/**
 * Componente funcional de barra de búsqueda modular.
 * Integra capacidades de filtrado por texto y por categoría, presentando los resultados en una lista desplegable.
 * Diseñado para superponerse a la interfaz 3D.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {string} props.searchTerm - Valor actual del campo de texto de búsqueda.
 * @param {Function} props.onSearch - Función manejadora (callback) que se ejecuta al modificar el texto.
 * @param {Array} props.results - Arreglo de objetos de tienda filtrados a mostrar.
 * @param {Function} props.onSelect - Función callback ejecutada al seleccionar una tienda de la lista.
 * @param {Array} props.categories - Arreglo de categorías disponibles para el filtrado.
 * @param {Function} props.onCategorySelect - Función callback ejecutada al seleccionar una opción del filtro de categorías.
 * @returns {JSX.Element} Elemento React renderizado.
 */
export const SearchBar = ({ searchTerm, onSearch, results, onSelect, categories = [], onCategorySelect }) => {
    const [showCats, setShowCats] = useState(false);
    const [selectedCat, setSelectedCat] = useState('TODAS');

    const handleCatPress = (cat) => {
        setSelectedCat(cat);
        onCategorySelect(cat === 'TODAS' ? '' : cat);
        setShowCats(false);
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.searchRow}>
                {/* Campo de Texto */}
                <TextInput
                    style={styles.input}
                    placeholder="BUSCAR TIENDA..."
                    placeholderTextColor="#BC00FF"
                    value={searchTerm}
                    onChangeText={onSearch}
                />

                {/* Botón de Filtro de Categoría */}
                <TouchableOpacity style={styles.filterBtn} onPress={() => setShowCats(true)}>
                    <Text style={styles.filterBtnText}>🏷️</Text>
                </TouchableOpacity>
            </View>

            {/* Desplegable de Resultados con ScrollView */}
            {results.length > 0 && (
                <View style={styles.dropdownContainer}>
                    <ScrollView
                        style={styles.scrollView}
                        nestedScrollEnabled={true}
                        maxHeight={250}
                    >
                        {results.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.resultItem}
                                onPress={() => onSelect(item)}
                            >
                                <View>
                                    <Text style={styles.resultText}>{item.nombre.toUpperCase()}</Text>
                                    <Text style={styles.categoryTag}>{item.categoria.toUpperCase()}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Modal para selección de Categoría */}
            <Modal visible={showCats} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowCats(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>FILTRAR POR CATEGORÍA</Text>
                        <FlatList
                            data={['TODAS', ...categories]}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.catItem, selectedCat === item && styles.activeCat]}
                                    onPress={() => handleCatPress(item)}
                                >
                                    <Text style={styles.catText}>{item.toUpperCase()}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create
    (
        {
            mainContainer:
            {
                position: 'absolute',
                top: 40,
                width: '100%',
                alignItems: 'center',
                zIndex: 100
            },
            searchRow:
            {
                flexDirection: 'row',
                width: '90%',
                height: 60
            },
            input:
            {
                flex: 1,
                backgroundColor: '#2D004B',
                borderColor: '#00E5FF',
                borderWidth: 2,
                borderRadius: 15,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                color: '#00E5FF',
                paddingHorizontal: 20,
                fontSize: 16,
                fontWeight: 'bold'
            },
            filterBtn:
            {
                width: 60,
                backgroundColor: '#190032',
                borderColor: '#00E5FF',
                borderWidth: 2,
                borderLeftWidth: 0,
                borderTopRightRadius: 15,
                borderBottomRightRadius: 15,
                justifyContent: 'center',
                alignItems: 'center'
            },
            filterBtnText:
            {
                fontSize: 24
            },
            dropdownContainer:
            {
                width: '90%',
                backgroundColor: '#190032',
                marginTop: 5,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#BC00FF',
                overflow: 'hidden'
            },
            scrollView:
            {
                width: '100%'
            },
            resultItem:
            {
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#3D006E'
            },
            resultText:
            {
                color: '#00E5FF',
                fontWeight: 'bold',
                fontSize: 16
            },
            categoryTag:
            {
                color: '#BC00FF',
                fontSize: 10,
                marginTop: 2
            },
            modalOverlay:
            {
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.8)',
                justifyContent: 'center',
                alignItems: 'center'
            },
            modalContent:
            {
                width: '80%',
                backgroundColor: '#190032',
                borderRadius: 20,
                padding: 20,
                borderWidth: 2,
                borderColor: '#00E5FF'
            },
            modalTitle:
            {
                color: '#00E5FF',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 15,
                textAlign: 'center'
            },
            catItem:
            {
                padding: 15,
                borderRadius: 10,
                marginBottom: 5
            },
            activeCat:
            {
                backgroundColor: '#3D006E'
            },
            catText:
            {
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center'
            }
        });