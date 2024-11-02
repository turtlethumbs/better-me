<template>
  <div class="window active checklist">
    <div class="title-bar">
      <div class="title-bar-text">To-Do List</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        <button aria-label="Close"></button>
      </div>
    </div>
    <div class="window-body has-space">
      <TheProgressBar :totalTasks="totalTasks" :completedTasks="completedTasks"></TheProgressBar>
      <ul>
        <li 
          v-for="(task, index) in tasks" 
          :key="index" 
          :class="{ 'completed': task.completed, 'field-row': true, }" 
        >
          <div>
            <input
              :id="task.id"
              type="checkbox"
              :checked="task.completed"
              @change="toggleTaskCompletion(index)"
              class="checkbox"
            />
            <label :for="task.id" class="task-title" :class="{ 'line-through': task.completed }">{{ task.title }}</label>
          </div>
          <button @click="confirmAndRemoveTask(index)" class="remove-button">
            ✖
          </button>
        </li>
      </ul>
      <div class="new-task field-row">
        <input
          v-model="newTask"
          type="text"
          placeholder="Add a new task"
          @keyup.enter="addTask"
          class="new-task-input"
        />
        <button @click="addTask" class="add-button">
          Add
        </button>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
  import { defineComponent } from 'vue';
  import TheProgressBar from './TheProgressBar.vue';

  interface Task {
    id: number;
    title: string;
    completed: boolean;
  }

  export default defineComponent({
    name: "BaseTaskList",
    components: {
      TheProgressBar
    },
    data() {
      return {
        tasks: [] as Task[],
        newTask: "",
      };
    },
    computed: {
      totalTasks(): number {
        return this.tasks.length;
      },
      completedTasks(): number {
        return this.tasks.filter(task => task.completed).length;
      }
    },
    mounted() {
      this.loadTasks();
    },
    methods: {
      async loadTasks() {
        try {
          const response = await fetch('http://127.0.0.1:3000/tasks');
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          this.tasks = data.tasks;
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      },
      async addTask() {
        if (this.newTask.trim()) {
          const newTask = { title: this.newTask, completed: false };
          try {
            const response = await fetch('http://127.0.0.1:3000/tasks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newTask),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            this.tasks.push(data.task);
            this.newTask = ""; // Reset the input field
          } catch (error) {
            console.error('Error adding task:', error);
          }
        }
      },
      async toggleTaskCompletion(index: number) {
        const task = this.tasks[index];
        task.completed = !task.completed;
        try {
          await fetch(`http://127.0.0.1:3000/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: task.completed }),
          });
        } catch (error) {
          console.error('Error updating task completion:', error);
        }
      },
      confirmAndRemoveTask(index: number) {
        const confirmed = confirm("Are you sure you want to delete this task?");
        if (confirmed) {
          const task = this.tasks[index];
          fetch(`http://127.0.0.1:3000/tasks/${task.id}`, {
            method: 'DELETE',
          }).then(() => {
            this.tasks.splice(index, 1); // Remove the task from the local array
          }).catch(error => {
            console.error('Error deleting task:', error);
          });
        }
      },
    },
  });
</script>

<style scoped>
  .field-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-bottom: 1px solid #ccc;
    margin: 0 !important;
  }

  .checkbox {
    cursor: pointer;
  }

  .checklist ul {
    padding: 0;
  }

  .line-through {
    text-decoration: line-through;
  }
</style>
