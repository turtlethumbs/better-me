<template>
  <div class="checklist">
    <h2>To-Do List</h2>
    <ul>
      <li v-for="(task, index) in tasks" :key="index" :class="{ completed: task.completed }">
        <input
          type="checkbox"
          :checked="task.completed"
          @change="toggleTaskCompletion(index)"
        />
        <span>{{ task.title }}</span>
        <button @click="confirmAndRemoveTask(index)">✖</button>
      </li>
    </ul>
    <div class="new-task">
      <input
        v-model="newTask"
        type="text"
        placeholder="Add a new task"
        @keyup.enter="addTask"
      />
      <button @click="addTask">Add</button>
    </div>
  </div>
</template>
  
  <script>
  export default {
    name: "TheTaskList",
    data() {
      return {
        tasks: [],
        newTask: "",
      };
    },
    mounted() {
      this.loadTasks();
    },
    methods: {
      async loadTasks() {
        try {
          const response = await fetch('http://127.0.0.1:3000/tasks');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          this.tasks = data.tasks;
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      },
      addTask() {
        if (this.newTask.trim()) {
          this.tasks.push({ title: this.newTask, completed: false });
          this.newTask = "";
        }
      },
      toggleTaskCompletion(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
      },
      confirmAndRemoveTask(index) {
        const confirmed = confirm("Are you sure you want to delete this task?");
        if (confirmed) {
          this.tasks.splice(index, 1);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .checklist {
    width: 80vw;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .checklist h2 {
    text-align: center;
    margin-bottom: 15px;
    color: #333;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  
  li:last-child {
    border-bottom: none;
  }
  
  li.completed span {
    text-decoration: line-through;
    color: #999;
  }
  
  input[type="checkbox"] {
    margin-right: 10px;
  }
  
  button {
    background: none;
    border: none;
    color: #ff6b6b;
    font-size: 18px;
    cursor: pointer;
  }
  
  button:hover {
    color: #ff3b3b;
  }
  
  .new-task {
    display: flex;
    margin-top: 15px;
  }
  
  .new-task input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .new-task button {
    padding: 8px 12px;
    margin-left: 8px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .new-task button:hover {
    background-color: #45a049;
  }
  </style>
  