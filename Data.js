const datasource = [
    {
        data: [
            { key: 'Task1', status: 'To Do', completed: false },
            { key: 'Task2', status: 'To Do', completed: false },
        ],
        title: "To Do",
        bgColor: "#FF6347",
        icon: "calendar-check",
    },
    {
        data: [
            { key: 'Task3', status: 'In Progress', completed: false },
            { key: 'Task4', status: 'In Progress', completed: false },
        ],
        title: "In Progress",
        bgColor: "#eace31",
        icon: "bars-progress",
    },
    {
        data: [
            { key: 'Task99', status: 'Done', completed: true },
        ],
        title: "Done",
        bgColor: "#4CAF50",
        icon: "check",
    }
];

export { datasource };
