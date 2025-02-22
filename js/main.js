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
                status: 'Запланировано'
            };
            this.tasks.push(newTask);
            this.closeForm();
        },
        deleteTask(index) {
            this.tasks.splice(index, 1);
        },
        moveToInProgress(index) {
            const task = this.tasks.splice(index, 1)[0];
            task.status = 'В работе';
            this.inProgressTasks.push(task);
        },
        startEdit(index) {
            this.editIndex = index; // Переключаем задачу в режим редактирования
        },
        saveEdit(index) {
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
            const task = this.testingTasks.splice(this.returnIndex, 1)[0];
            task.returnReason = this.returnReason;
            task.status = 'Возвращено в работу';
            this.inProgressTasks.push(task);
            this.closeReturnForm();
        },
        moveToTesting(index) {
            const task = this.inProgressTasks.splice(index, 1)[0];
            task.status = 'Тестирование';
            this.testingTasks.push(task);
        },
        moveToCompleted(index) {
            const task = this.testingTasks.splice(index, 1)[0];
            task.status = 'Выполнено';
            this.completedTasks.push(task);
        }
    }
});