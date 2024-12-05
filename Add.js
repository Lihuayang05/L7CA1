import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { datasource } from './Data.js';

const Add = ({ navigation }) => {
    const [task, setTask] = useState('');
    const [type, setType] = useState('');

    const handleAdd = () => {
        if (!task || !type) {
            alert('Please enter both task and type');
            return;
        }

        // Create the new task object and mark completed if added to "Done"
        const newTask = {
            key: task,
            completed: type === 'Done' // Automatically mark completed if "Done"
        };

        // Determine the section index based on the selected task type
        const sectionIndex = getSectionIndex(type);

        // Add the task to the appropriate section
        if (sectionIndex !== -1) {
            datasource[sectionIndex].data.push(newTask);
        }

        // Navigate back to the Home screen
        navigation.navigate('Home');
    };

    const getSectionIndex = (type) => {
        // Map task type to section index
        switch (type) {
            case 'To do':
                return 0;
            case 'In Progress':
                return 1;
            case 'Done':
                return 2;
            default:
                return -1; // Return -1 if no valid type is selected
        }
    };

    return (
        <View style={styles.container}>
            {/* Task Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Task:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter task"
                    value={task}
                    onChangeText={setTask}
                />
            </View>

            {/* Type Dropdown */}
            <View style={styles.inputContainer}>
                <RNPickerSelect
                    value={type}
                    onValueChange={(value) => setType(value)}
                    items={[
                        { label: 'To do', value: 'To do' },
                        { label: 'In Progress', value: 'In Progress' },
                        { label: 'Done', value: 'Done' },
                    ]}
                />
            </View>

            {/* Submit Button */}
            <Button title="Add Task" onPress={handleAdd} />
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
    inputContainer: {
        width: '100%',
        paddingHorizontal: 15,
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
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
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
        marginVertical: 10,
        width: '100%',
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Add;
