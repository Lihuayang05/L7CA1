import React, { useState, useEffect } from 'react';
import { StatusBar, SectionList, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { datasource as initialDataSource } from './Data.js';
import Icon from 'react-native-vector-icons/FontAwesome6';

const Home = ({ navigation }) => {
    const [data, setData] = useState(initialDataSource);
    const [taskSummary, setTaskSummary] = useState({
        totalTasks: 0,
        completedTasks: 0,
        unfinishedTasks: 0,
        completedPercentage: 0,
        donePercentage: 0,
    });

    const calculateSummary = (datasource) => {
        let totalTasks = 0;
        let completedTasks = 0;
        let doneTasks = 0;

        datasource.forEach((section) => {
            section.data.forEach((task) => {
                totalTasks++;
                if (task.completed) {
                    completedTasks++;
                    if (section.title === 'Done') {
                        doneTasks++;
                    }
                }
            });
        });

        const unfinishedTasks = totalTasks - completedTasks;
        const completedPercentage = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
        const donePercentage = totalTasks ? ((doneTasks / totalTasks) * 100).toFixed(1) : 0;

        return {
            totalTasks,
            completedTasks,
            unfinishedTasks,
            completedPercentage,
            donePercentage,
        };
    };

    useEffect(() => {
        setTaskSummary(calculateSummary(data));
    }, [data]);

    const toggleTaskCompletion = (taskKey, currentSectionTitle) => {
        setData((prevData) => {
            const updatedData = prevData.map((section) => {
                const updatedSectionData = section.data.map((task) =>
                    task.key === taskKey ? { ...task, completed: !task.completed } : task
                );
                return { ...section, data: updatedSectionData };
            });

            // Move task to "Done" section if completed
            const currentSection = updatedData.find((section) => section.title === currentSectionTitle);
            const task = currentSection?.data.find((task) => task.key === taskKey);

            if (task?.completed) {
                const doneSection = updatedData.find((section) => section.title === "Done");
                if (doneSection) {
                    doneSection.data.push({ ...task, completed: true });
                    currentSection.data = currentSection.data.filter((t) => t.key !== taskKey);
                }
            } else if (currentSectionTitle === "Done") {
                // Move task back to a default section if unmarked as done
                const defaultSection = updatedData.find((section) => section.title === "To do");
                if (defaultSection) {
                    defaultSection.data.push({ ...task, completed: false });
                    currentSection.data = currentSection.data.filter((t) => t.key !== taskKey);
                }
            }

            return updatedData;
        });
    };



    const renderItem = ({ item, index, section }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
                navigation.navigate('Edit', {
                    index,
                    type: section.title,
                    key: item.key,
                    sectionTitle: section.title,
                    onUpdateDataSource: (updateFunction) => {
                        setData((prevData) => updateFunction(prevData));
                    },
                });
            }}
            onLongPress={() => toggleTaskCompletion(item.key, section.title)}
        >
            <Text style={styles.itemText}>{item.key}</Text>
            {section.title === 'Done' && <Icon name="check" size={20} color="green" style={styles.tickIcon} />}
        </TouchableOpacity>
    );

    const handleAddTask = () => {
        navigation.navigate('Add', {
            onTaskAdded: (newTask) => {
                setData((prevData) => {
                    const updatedData = [...prevData];
                    const section = updatedData.find((section) => section.title === newTask.category);

                    if (section) {
                        section.data.push({
                            key: newTask.name,
                            completed: newTask.completed || false,
                        });
                    } else {
                        console.warn(`Category "${newTask.category}" not found.`);
                    }

                    return updatedData;
                });
            },
        });
    };

    const renderSectionHeader = ({ section: { title, bgColor, icon } }) => (
        <View style={[styles.headerContainer, { backgroundColor: bgColor || '#9c2222' }]}>
            <Icon name={icon} size={30} color="white" style={styles.headerIcon} />
            <Text style={styles.headerText}>{title}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden={true} />

            <View style={styles.topHeaderContainer}>
                <Icon name="list" size={30} color="white" style={styles.topHeaderIcon} />
                <Text style={styles.topHeaderText}>Task Manager</Text>
            </View>

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Total Tasks: {taskSummary.totalTasks}</Text>
                <Text style={styles.summaryText}>
                    Completed Tasks: {taskSummary.completedTasks} ({taskSummary.completedPercentage}%)
                </Text>
                <Text style={styles.summaryText}>Unfinished Tasks: {taskSummary.unfinishedTasks}</Text>
                <Text style={styles.summaryText}>
                    Tasks in "Done": {taskSummary.donePercentage}% of total tasks
                </Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                <Icon name="plus" size={24} color="white" />
                <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>

            <SectionList
                sections={data}
                keyExtractor={(item, index) => `${item.key}-${index}`}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={styles.sectionListContent}
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d3e5fb',
    },
    topHeaderContainer: {
        backgroundColor: '#288eff',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topHeaderIcon: {
        marginRight: 10,
    },
    topHeaderText: {
        fontSize: 26,
        fontWeight: '600',
        color: 'white',
        textTransform: 'capitalize',
    },
    summaryContainer: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        margin: 15,
        borderRadius: 10,
        elevation: 3,
    },
    summaryText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    itemContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
    },
    tickIcon: {
        marginLeft: 10,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6660c',
        paddingVertical: 14,
        borderRadius: 30,
        marginVertical: 15,
        marginHorizontal: 15,
        elevation: 3,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    headerContainer: {
        backgroundColor: '#F56C42',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginRight: 10,
    },
    headerText: {
        fontSize: 22,
        fontWeight: '600',
        color: 'white',
    },
    sectionListContent: {
        paddingHorizontal: 15,
    },
});

export default Home;
