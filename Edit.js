import React, { useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';

const Edit = ({ navigation, route }) => {
    const { key, index, type, onUpdateDataSource } = route.params;
    const [task, setTask] = useState(key);
    const [selectedStatus, setSelectedStatus] = useState(type);

    const handleSubmit = () => {
        onUpdateDataSource((datasource) => {
            const currentSectionIndex = datasource.findIndex(section => section.title === type);
            const newSectionIndex = datasource.findIndex(section => section.title === selectedStatus);

            if (currentSectionIndex !== -1 && newSectionIndex !== -1) {
                const updatedDatasource = [...datasource];

                // Update task name
                updatedDatasource[currentSectionIndex].data[index].key = task;

                // If the status has changed, move the task
                if (type !== selectedStatus) {
                    // Remove task from the current section
                    const [taskToMove] = updatedDatasource[currentSectionIndex].data.splice(index, 1);

                    // Update task's completed status based on new section
                    taskToMove.completed = selectedStatus === "Done";

                    // Add task to the new section
                    updatedDatasource[newSectionIndex].data.push(taskToMove);
                }

                return updatedDatasource;
            }
            return datasource;
        });

        navigation.goBack();
    };

    const handleDelete = () => {
        Alert.alert(
            "Are you sure?", '',
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        onUpdateDataSource((datasource) => {
                            const sectionIndex = datasource.findIndex(section => section.title === type);

                            if (sectionIndex !== -1) {
                                const updatedDatasource = [...datasource];
                                updatedDatasource[sectionIndex].data.splice(index, 1);
                                return updatedDatasource;
                            }
                            return datasource;
                        });

                        navigation.goBack();
                    },
                },
                { text: 'No' },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Task:</Text>
            <TextInput
                value={task}
                style={styles.input}
                onChangeText={(text) => setTask(text)}
            />

            <Text style={styles.label}>Change Status:</Text>
            <Picker
                selectedValue={selectedStatus}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedStatus(itemValue)}
            >
                <Picker.Item label="To do" value="To do" />
                <Picker.Item label="In Progress" value="In Progress" />
                <Picker.Item label="Done" value="Done" />
            </Picker>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleDelete}>
                    <Text style={styles.secondaryButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#d3e5fb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        backgroundColor: '#fff',
        fontSize: 16,
        width: '100%',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
        width: '100%',
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#F44336',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Edit;
