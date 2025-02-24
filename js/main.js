new Vue({
    el: '#app',
    data: {
        showForm: false,
        showReturnForm: false,
        returnReason: '',
        editIndex: null,
        currentArray: null,
        draggedTask: null,
        newTask: {
            title: '',
            description: '',
            deadline: ''
        },
        tasks: [], // Задачи
        plannedTasks: [], // Запланированные задачи
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
                lastEditedAt: null
            };
            this.tasks.push(newTask);
            this.closeForm();
        },
        deleteTask(index, array) {
            array.splice(index, 1);
        },
        startEdit(index, array) {
            this.editIndex = index;
            this.currentArray = array;
        },
        saveEdit() {
            if (this.editIndex !== null && this.currentArray) {
                const task = this.currentArray[this.editIndex];
                if (task) {
                    task.lastEditedAt = new Date().toLocaleString();
                }
            }
            this.editIndex = null;
            this.currentArray = null;
        },
        cancelEdit() {
            this.editIndex = null;
            this.currentArray = null;
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
                task.returnReason = this.returnReason;
                task.status = 'Возвращено в работу';
                task.lastEditedAt = new Date().toLocaleString();
                this.inProgressTasks.push(task);
                this.testingTasks.splice(this.returnIndex, 1);
            }
            this.closeReturnForm();
        },
        startDrag(event, task) {
            this.draggedTask = task;
            event.dataTransfer.setData('text/plain', JSON.stringify(task));
        },
        onDrop(event, targetArrayName) {
            const taskData = JSON.parse(event.dataTransfer.getData('text/plain'));
            const task = this.draggedTask;

            // Удаляем задачу из текущего массива
            if (this.tasks.includes(task)) {
                this.tasks.splice(this.tasks.indexOf(task), 1);
            } else if (this.plannedTasks.includes(task)) {
                this.plannedTasks.splice(this.plannedTasks.indexOf(task), 1);
            } else if (this.inProgressTasks.includes(task)) {
                this.inProgressTasks.splice(this.inProgressTasks.indexOf(task), 1);
            } else if (this.testingTasks.includes(task)) {
                this.testingTasks.splice(this.testingTasks.indexOf(task), 1);
            } else if (this.completedTasks.includes(task)) {
                this.completedTasks.splice(this.completedTasks.indexOf(task), 1);
            }

            // Добавляем задачу в целевой массив
            if (targetArrayName === 'tasks') {
                this.tasks.push(task);
            } else if (targetArrayName === 'plannedTasks') {
                this.plannedTasks.push(task);
            } else if (targetArrayName === 'inProgressTasks') {
                this.inProgressTasks.push(task);
            } else if (targetArrayName === 'testingTasks') {
                this.testingTasks.push(task);
            } else if (targetArrayName === 'completedTasks') {
                this.completedTasks.push(task);
                task.status = 'Выполнено';
            }
        }
    }
});