
// 
//   const deadlineInput = document.getElementById('deadline');

//   const now = new Date();
//   const localISOTime = now.toISOString().slice(0, 16); // format: YYYY-MM-DDTHH:mm

//   deadlineInput.min = localISOTime;
// });
// window.addEventListener('DOMContentLoaded', () => {
//   const deadlineInput = document.getElementById('deadline');
//   const now = new Date();
//   const isoString = now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
//   deadlineInput.value = isoString;
//   deadlineInput.min = isoString;
// });

  // your code here

const token = localStorage.getItem('token');
const form = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const mylist=document.getElementById("thisdatetasks");
const timerIntervals = {};
// 🟢 Submit (Add / Update Task)


form.addEventListener('submit', async (e) => {
  e.preventDefault();
//  const deadlineInput = document.getElementById('deadline');
//   const deadlineValue = new Date(deadlineInput.value);
//   const now = new Date();

//   if (deadlineValue <= now) {
//     alert("Deadline must be in the future!");
//     return;
//   }
 const deadline = document.getElementById('deadline').value;
 const date=new Date(deadline);
 const now=new Date();
 if(date<=now)
 {
  alert("Input Deadline is in the past!");
  return;
 }
  const id = document.getElementById('id').value;
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  
  // const today = new Date();
  // today.setHours(0, 0, 0, 0);

  // if (deadline < today) {
  //   alert("Deadline cannot be in the past!");
  //   return;
  // }
  const method = id ? 'PUT' : 'POST';
  const url = id ? `https://astha-task-manager-app.onrender.com/tasks/${id}` : 'https://astha-task-manager-app.onrender.com/tasks';

  try {
    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, deadline })
    });

    form.reset();
    loadTasks();
  } catch (error) {
    console.error('Error saving task:', error);
  }
});

// 🟢 Load All Tasks
async function loadTasks() {
  try {
    const res = await fetch('https://astha-task-manager-app.onrender.com/tasks', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const tasks = await res.json();
    console.log("Tasks fetched:", tasks);

    // Validate if response is an array
    if (!Array.isArray(tasks)) {
      taskList.innerHTML = `<li style="color:red;">Error: ${tasks.error || 'Unexpected response'}</li>`;
      return;
    }

    taskList.innerHTML = '';
        
    tasks.forEach(task => {
      const li = document.createElement('li');
      const timer=`timer-${task._id}`;
      li.innerHTML = `
        <strong>${task.number}.${task.title}</strong> (${task.status})<br>
        ${task.description}<br>
        Deadline: ${new Date(task.deadline).toLocaleString()}<br>
        
        

        <span id="${timer}"></span><br>
        
        <button onclick='editTask("${task._id}")'>Edit</button>
        <button onclick='deleteTask("${task._id}")'>Delete</button>
        <button onclick='toggleStatus("${task._id}")'>
          Mark as ${task.status === "pending" ? "Completed" : "Pending"}
        </button>
      `;
      
      taskList.appendChild(li);
     
      startTimer(task.deadline, timer,task._id,task.status);
    });
    renderCalendar(tasks); 

  } catch (error) {
    taskList.innerHTML = `<li style="color:red;">Error loading tasks</li>`;
    console.error('Error:', error);
  }
}
// function updatetimer(deadline,timer)
// { 
//   function update(){
// const now=new Date();
// const target= new Date(deadline)
//  const difference=target-now;
//      day = Math.floor(difference / (1000 * 60 * 60 * 24));
//      hr = Math.floor((difference / (1000 * 60 * 60)) % 24);
//      min = Math.floor((difference / (1000 * 60)) % 60);
//       const seconds = Math.floor((difference / 1000) % 60);
//     document.getElementById(timer).innerText = `⏳ ${day}d ${hr}h ${min}m ${seconds}`;

//     setTimeout(update,1000);
//   } 
//   update();

    // const seconds = Math.floor((diff / 1000) % 60);
   

    function startTimer(deadline, timer,taskid,taskstatus) {
 

  // Clear any previous timer for this task
  if (timerIntervals[taskid]) {
    clearInterval(timerIntervals[taskid]);
  }

  function update() {
    const now = new Date();
    const target = new Date(deadline);
    const diff = target - now;

      if (diff <= 0) {
      document.getElementById(timer).innerText = "⏰ Deadline passed!";
      clearInterval(timerIntervals[taskid]);
      return;
    }
    if(taskstatus=='completed' )
    {
        document.getElementById(timer).innerHTML=`<strong style="color: green;">
  Task Completed yay!
</strong>`  ;
      clearInterval(timerIntervals[taskid]);
      return;
    }
    
  

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    if(diff<24 * 60 * 60 * 1000)
    {
      document.getElementById(timer).innerHTML=`<strong style="color: red;">
  ⏳ ${days}d ${hours}h ${minutes}m ${seconds}s
</strong>` 
    }
    else{
    document.getElementById(timer).innerText = `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s `;
  }
}

  // Initial call + setInterval
  update();
  
  timerIntervals[taskid] = setInterval(update, 1000);
   
}
 function renderCalendar(tasks) {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) {
    console.error("❌ Calendar element not found!");
    return;
  }

  if (!Array.isArray(tasks)) {
    console.error("❌ Tasks must be an array");
    return;
  }

  const events = tasks.map(task => ({
    title: task.title,
    start: task.deadline,
    allDay: true,
  }));

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 'auto',
    events: events,

    dateClick: function(info) {
      const clickedDate = new Date(info.dateStr);  // Date object of clicked cell

      const matchingTasks = tasks.filter(task => {
        const taskDate = new Date(task.deadline);
        return (
          taskDate.getFullYear() === clickedDate.getFullYear() &&
          taskDate.getMonth() === clickedDate.getMonth() &&
          taskDate.getDate() === clickedDate.getDate()
        );
      });

      let content = '';
      if (matchingTasks.length === 0) {
        content = `<p>No tasks on this day.</p>`;
      } else {
        matchingTasks.forEach(task => {
          content += `
            <div style="margin-bottom: 10px;">
              <strong>#${task.number} - ${task.title}</strong> (${task.status})<br>
              Description: ${task.description}<br>
              Deadline: ${new Date(task.deadline).toLocaleString()}<br>
              
                
            </div>
            <hr>
          `;
        });
      }

      openModal(`Tasks on ${info.dateStr}`, content);
    }
  });

  calendar.render();
}



// async function handleDateClick(dateStr) {
   
//     const res = await fetch('/tasks', {
//       headers: { 'Authorization': `Bearer ${token}` }
//     });
  
  
//     const tasks = await res.json();
//     const targetDate = dateStr;

// const filteredTasks = tasks.filter(task =>
//   new Date(task.deadline).toISOString().split("T")[0] === targetDate)
//   console.log(filteredTasks);
//   mylist.innerHTML = '';
        
//     filteredTasks.forEach(task => {
//       const li = document.createElement('li');
      
//       li.innerHTML = `${task.number}
//       <br>
//       ${task.status}
//       <br>
//       Task Title:${task.title}
//       <br>
//       Task Deadline:${new Date(task.deadline).toLocaleString()}
//       <br>
//       `;
      
//       mylist.appendChild(li);}
     
//     )
     
     
  // You can put custom logic here
// }

// 🟢 Edit Task (prefill form)
async function editTask(id) {
  try {
    const res = await fetch(`https://astha-task-manager-app.onrender.com/tasks/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const task = await res.json();
    document.getElementById('id').value = task._id;
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
     document.getElementById("deadline").value = new Date(task.deadline).toISOString().slice(0,16);

  } catch (error) {
    console.error('Error editing task:', error);
  }
}

// 🟢 Delete Task
async function deleteTask(id) {
  try {
    const res=await fetch(`https://astha-task-manager-app.onrender.com/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    //    clearInterval(timerIntervals[id]);
    // delete timerIntervals[id];
    // if (timerIntervals[taskId]) {
    //     clearInterval(timerIntervals[taskId]);
    //     delete timerIntervals[taskId];
    
    if (!res.ok) {
      throw new Error("Failed to delete task");
    }
    if (timerIntervals[id]) {
  clearInterval(timerIntervals[id]);
  delete timerIntervals[id];
}
  console.log('Task deleted. Reloading tasks...');
loadTasks();


    
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

// 🟢 Toggle Task Status
async function toggleStatus(id) {
  try {
    await fetch(`https://astha-task-manager-app.onrender.com/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadTasks();
  } catch (error) {
    console.error('Error toggling status:', error);
  }
}
window.editTask = editTask;
window.deleteTask = deleteTask;
window.toggleStatus = toggleStatus;
function openModal(title, content) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalContent').innerHTML = content;
  document.getElementById('myModal').style.display = 'block';
  document.getElementById('modalOverlay').style.display = 'block';
}

function closeModal() {
  document.getElementById('myModal').style.display = 'none';
  document.getElementById('modalOverlay').style.display = 'none';
}




// Initial load
loadTasks();

