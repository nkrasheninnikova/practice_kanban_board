new Vue({
    el: '#app',
    data: {
        showForm: false,
        showReturnForm: false,
        returnReason: '',
        editIndex: null, // Индекс задачи, которая сейчас редактируется
        newTask: {
            title: '',
            description: '',
            deadline: ''
        },
        tasks: [], // Запланированные задачи
        inProgressTasks: [], // Задачи в работе
        testingTasks: [], // Тестирование
        completedTasks: [] // Выполненные задачи
    },
    methods: {
        openForm() {
            this.showForm = true;
        },
        closeForm() {
            this.showForm = false;
            this.newTask = { title: '', description: '', deadline: '' };
        },
        addTask() {
            const newTask = {
                title: this.newTask.title,
                description: this.newTask.description,
                deadline: this.newTask.deadline,
                createdAt: new Date().toLocaleString(),
                lastEditedAt: null, // Добавляем поле lastEditedAt и инициализируем его как null
                status: 'Запланировано'
            };
            this.tasks.push(newTask);
            this.closeForm();
        },
        deleteTask(index) {
            // Удаляем задачу из массива tasks
            this.tasks.splice(index, 1);
        },
        moveToInProgress(index) {
            const task = this.tasks[index];
            if (task) {
                task.status = 'В работе';
                this.inProgressTasks.push(task); // Добавляем задачу в inProgressTasks
                this.tasks.splice(index, 1); // Удаляем задачу из tasks
            }
        },
        startEdit(index) {
            this.editIndex = index; // Переключаем задачу в режим редактирования
        },
        saveEdit(index) {
            if (this.editIndex !== null) {
                // Определяем, в каком массиве находится задача
                let taskArray = this.tasks;
                if (this.inProgressTasks[this.editIndex]) {
                    taskArray = this.inProgressTasks;
                } else if (this.testingTasks[this.editIndex]) {
                    taskArray = this.testingTasks;
                }
                const task = taskArray[this.editIndex];
                if (task) {
                    task.lastEditedAt = new Date().toLocaleString(); // Добавляем временную метку редактирования
                }
            }
            this.editIndex = null; // Выходим из режима редактирования
        },
        cancelEdit() {
            this.editIndex = null; // Отменяем редактирование
        },
        openReturnForm(index) {
            this.returnIndex = index;
            this.showReturnForm = true;
        },
        closeReturnForm() {
            this.showReturnForm = false;
            this.returnReason = '';
        },
        returnTaskToInProgress() {
            const task = this.testingTasks[this.returnIndex];
            if (task) {
                task.returnReason = this.returnReason; // Сохраняем причину возврата
                task.status = 'Возвращено в работу';
                task.lastEditedAt = new Date().toLocaleString(); // Добавляем временную метку при возврате
                this.inProgressTasks.push(task); // Добавляем задачу обратно в "Задачи в работе"
                this.testingTasks.splice(this.returnIndex, 1); // Удаляем задачу из "Тестирования"
            }
            this.closeReturnForm();
        },
        moveToTesting(index) {
            const task = this.inProgressTasks[index];
            if (task) {
                task.status = 'Тестирование';
                this.testingTasks.push(task); // Добавляем задачу в testingTasks
                this.inProgressTasks.splice(index, 1); // Удаляем задачу из inProgressTasks
            }
        },
        moveToCompleted(index) {
            const task = this.testingTasks[index];
            if (task) {
                const deadlineDate = new Date(task.deadline);
                const currentDate = new Date();
                if (currentDate > deadlineDate) {
                    task.status = 'Просрочено';
                } else {
                    task.status = 'Выполнено';
                }
                task.lastEditedAt = new Date().toLocaleString(); // Добавляем временную метку при завершении
                this.completedTasks.push(task); // Добавляем задачу в completedTasks
                this.testingTasks.splice(index, 1); // Удаляем задачу из testingTasks
            }
        }
    }
});