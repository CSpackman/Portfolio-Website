
import React from 'react';
import PDFVIEWER from './pdfViewer';
export default class Admin extends React.Component {
    constructor() {
      super();
      this.state = {
        skills_Messege: '',
        file: null,
        fileName: 'file',

      }
      this.saveFile = this.saveFile.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
      this.updateText = this.updateText.bind(this)
      this.onSubmitText = this.onSubmitText.bind(this)
    }

    saveFile(event){
        this.setState({ file: event.target.files[0]});
    }
    updateText(event){
        this.setState({ skills_Messege: event.target.value });
        console.log(this.state)
    }

    componentDidMount() {
      //GET message from server using fetch api
        fetch('https://us-central1-connorspackman-49d00.cloudfunctions.net/app/skills')
            .then(res => res.text())
            .then(res => this.setState({skills_Messege: res}));
    }

    onSubmit(event){
        event.preventDefault();
        var formData = new FormData();
        formData.append('file', this.state.file)
        formData.append("name", this.state.fileName);
    try{
        fetch('https://us-central1-connorspackman-49d00.cloudfunctions.net/app/upload/resume', {
            method: 'POST',
            body: formData,
        }
        )
        }catch(err){
            console.log("ERROR"+err)
        }
    }
    onSubmitText(event){
        event.preventDefault();
        

    try{
        const data = JSON.stringify({"mesg":this.state.skills_Messege});
        console.log(data)
        fetch('https://us-central1-connorspackman-49d00.cloudfunctions.net/app/upload/skills', {
            method: 'POST',
            body: data,
            headers:{
                "Content-Type": "application/json "
            }
        }
        )
        }catch(err){
            console.log("ERROR"+err)
        }
    }

    render() {
      return (
        <div>
          <h1>Admin</h1>
          <form >
          <input type="file"  onChange={this.saveFile}></input>
          <button onClick={this.onSubmit}> SUBMIT</button>
          </form>
           <PDFVIEWER props={this.state.file} />
           <h1>Skills</h1>
          <form >
           <textarea value= {this.state.skills_Messege} type='text' name="skills" onChange={this.updateText}rows="5" cols="33">
            </textarea>
          <button onClick={this.onSubmitText}> SUBMIT</button>
          </form>
        </div>
      );
    }
  }