import React, { Component } from 'react';
import './App.css';
import './font awesome/css/font-awesome.min.css';
// import axios from 'axios'

class App extends Component {
  // Initialize state
  constructor(props) {
    super(props);
    this.state = {
      value:'',
      list: [],
    };
    this.TaskIsDoneSwitcher = this.TaskIsDoneSwitcher.bind(this)
    this.addTask=this.addTask.bind(this)
    this.ArchiveSwitcher = this.ArchiveSwitcher.bind(this)
    this.delTask = this.delTask.bind(this)
  }

  componentDidMount() {
    this.getTasks();

  }
  async add(data){
    const headers = new Headers()
    headers.append('Content-Type','application/json')
    headers.append('Access-Control-Allow-Origin','*')
    headers.append('Access-Control-Allow-Method','*')
    headers.append('Access-Control-Allow-Headers','*')
    headers.append('Accept','application/json')
    const options = {
      method : 'POST',
      headers,
      body: JSON.stringify(data),
    }
   
    const request = new Request ('api/create',options)
    // const response = await fetch(request)
    fetch(request)
  }
  async updateDb(id,keyName,newValue){
    const headers = new Headers()
    headers.append('Content-Type','application/json')
    headers.append('Access-Control-Allow-Origin','*')
    headers.append('Access-Control-Allow-Method','*')
    headers.append('Access-Control-Allow-Headers','*')
    headers.append('Accept','application/json')
    const options = {
      method : 'POST',
      headers,
      body: JSON.stringify({"id" : id, "keyName" : keyName, "newValue" : newValue}),
    }
   
    const request = new Request ('api/update',options)
    fetch(request)
  }
  async deleteDb(id){
    const headers = new Headers()
    headers.append('Content-Type','application/json')
    headers.append('Access-Control-Allow-Origin','*')
    headers.append('Access-Control-Allow-Method','*')
    headers.append('Access-Control-Allow-Headers','*')
    headers.append('Accept','application/json')
    const options = {
      method : 'POST',
      headers,
      body: JSON.stringify({"id" : id}),
    }
    const request = new Request ('api/delete',options)
    fetch(request)
  }

  
  getTasks = () => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(list => {
        this.setState({ list })
      })
  }
  
  TaskIsDoneSwitcher = (id) => {
    this.updateDb(id, 'isDone', !this.state.list.find(item => item._id === id).isDone).then(()=>
    this.getTasks())
  }
  addTask = (e) => {
    e.preventDefault();
    document.getElementsByClassName('submit')[0].setAttribute("disabled","")
    const json = {"description": document.getElementsByClassName('newTask')[0].value, "isDone":false,"isArchived":false}
    document.getElementsByClassName('newTask')[0].value = ""
    this.add(json)
    .then(() => 
      this.getTasks()
    )
    .then(()=>{
      document.getElementsByClassName('submit')[0].removeAttribute("disabled")
    })

  }

  delTask = (id) => {
    this.deleteDb(id).then(()=>
    this.getTasks())
  }

  ArchiveSwitcher = (id) => {
    this.updateDb(id, 'isArchived', !this.state.list.find(item => item._id === id).isArchived).then(()=>
    this.getTasks())
  }
  

  render() {
    return (
          <div> 
            <div className="title container mx-auto"><h3>Cooperative To-Do List</h3></div> 
            <ul className="tasks list-group list-group-flush">
            {this.state.list.length>0 && this.state.list.map(item => (
                !item.isArchived && <div>
                  <li className="list-group-item" id={item._id}>
                    <i className={"fa fa-check "+(item.isDone ? 'text-success' : 'text-warning')} aria-hidden="true" onClick={() => this.TaskIsDoneSwitcher(item._id)}></i>
                    {item.isDone ? <span className="description">
                      <del>{item.description}</del></span>
                       : <span className="description">
                      {item.description}</span>
                      }
                      <i aria-hidden="true" onClick={() => this.ArchiveSwitcher(item._id)} className="btnTasks fa fa-archive"></i>
                      <i aria-hidden="true" onClick={() => this.delTask(item._id)} className="btnTasks fa fa-trash-o" ></i>
                </li>
                </div>
              ))
            }
            </ul>
            
            <form onSubmit={e => this.addTask(e)}>
              <div className="addATask input-group mb-3">
                <input type="text" className="newTask form-control" aria-describedby="button-addon2"></input>
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary submit" type="submit">Add a Task</button>
                </div>
              </div>

            </form>
            {this.state.list.filter(item => item.isArchived === true ).length>0 && <div className="container mx-auto"><h4>Tasks archived : </h4></div> }

            <ul className="tasks archived list-group list-group-flush">
              {this.state.list.length>0 && this.state.list.map(item => (
              item.isArchived && <span>
                <li className="list-group-item" id={item._id}>
                {!item.isDone ? <span className="description">{item.description}</span> : <span className="description"><del>{item.description}</del></span>}
                <i aria-hidden="true" onClick={() => this.ArchiveSwitcher(item._id)} className="btnTasks fa fa-archive"></i>
                <i aria-hidden="true" onClick={() => this.delTask(item._id)} className="btnTasks fa fa-trash-o" ></i>
                </li>
                </span>
              ))}
            </ul>

          
          </div>
    );
  }
}

export default App;