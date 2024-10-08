import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, FlatList, Button, Alert, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Modal, Card } from '@ui-kitten/components'

const SavedForms = () => {
    const [forms, setForms] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedForm, setSelectedForm] = useState(null)

    const fetchSavedForms = async () => {
        try {
            const savedForms = JSON.parse(await AsyncStorage.getItem('savedForms')) || []
            setForms(savedForms)
        } catch (error) {
            console.error('Error :', error)
        }
    }

    const deleteForm = async (id) => {
        try {
            const updatedForms = forms.filter(form => form.id !== id)
            await AsyncStorage.setItem('savedForms', JSON.stringify(updatedForms))
            setForms(updatedForms)
            Alert.alert('Exito', 'Formulario eliminado')
        } catch (error) {
            console.error('Error :', error)
            Alert.alert('Error', 'No se pudo eliminar el formulario')
        }
    }

    const openModal = (form) => {
        setSelectedForm(form)
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setSelectedForm(null)
    }

    useEffect(() => {
        fetchSavedForms()
    }, [])

    const renderItem = ({ item }) => (
        <View style={styles.formItem}>
            <TouchableOpacity onPress={() => openModal(item)}>
                <Text style={styles.formTitle}>{item.nombreFormulario}</Text>
            </TouchableOpacity>
            <Button title="Eliminar" onPress={() => deleteForm(item.id)} />
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{"Formularios Guardados"}</Text>
            <FlatList
                data={forms}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <Card style={styles.modalCard}>
                        <Text style={styles.modalTitle}>{selectedForm?.nombreFormulario}</Text>
                        {selectedForm && Object.entries(selectedForm.data).map(([key, value]) => (
                            <Text key={key}>{`${key}: ${value}`}</Text>
                        ))}
                        <Button title="Cerrar" onPress={closeModal} />
                    </Card>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    listContainer: {
        paddingBottom: 100,
    },
    formItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    formTitle: {
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalCard: {
        width: '100%',
        padding: 12,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 16,
    },
})

export default SavedForms
