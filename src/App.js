import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './fileUpload'
import './App.css';

class App extends Component {

  constructor(){  //no recibe props
    super()
    this.state = {
      user: null,
      pictures: [],
      uploadValue : 0
    }
    this.handleAuth = this.handleAuth.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleOnUpload = this.handleOnUpload.bind(this)
  }

  componentWillMount(){
      firebase.auth().onAuthStateChanged((user)=>{this.setState({ user}) }) //Auth Service
      firebase.database().ref('pictures').on('child_added', (snapshot) => {
        this.setState({
          pictures: this.state.pictures.concat(snapshot.val()) //hacemos esto ya que el estado debe ser inmutable y concat lo que hace es devolvernos un nuevo array y no trabajar sobre el que teniamos
        })
      })

  }

  //autenticacion --iniciar sesion
  handleAuth(){
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
    .then((result)=>{
    console.log(result)
    })
    .catch((error)=>{console.log(error)})
  }

  //cerrar sesion
  handleLogout(){
    firebase.auth().signOut().then((result) => {console.log(`${this.state.user.displayName} cerro sesion`)})
    .catch((error) => {console.log(error)})
  }

  //subir imagenes
     handleOnUpload(value){
        const file = value.target.files[0]
        const storageRef = firebase.storage().ref(`/fotos/${file}`)
        const upTask = storageRef.put(file)

        upTask.on('state_changed', (snapshot)=>{
            let porcentaje = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.setState({uploadValue:porcentaje}) 
        }, (error) => {
            console.log(error)
        }, () => {
           const uploadTemp = {
             photoURL: this.state.user.photoURL,
             displayName: this.state.user.displayName,
             image: upTask.snapshot.donwloadURL
           }

           const dbRef = firebase.database().ref('pictures') //creamos una referencia a la base de datos
           const newPicture= dbRef.push(); //invocamos el metodo push de la db
           newPicture.set(uploadTemp) //invocamos el metodo set y le pasamos el objeto que cremos uploadTemp
        })

    }
    //funcion que contiene el contenido de si u usuario esta o no logueado
  renderLoginButton(){
    if(this.state.user){
      return(
        <div>
          <img  width="300" src={this.state.user.photoURL} alt="user image"/>
          <p>Hola {this.state.user.displayName}</p>
          <button onClick={this.handleLogout}>Cerrar sesion</button>
          <FileUpload  onUpload={this.handleOnUpload} uploadValue={this.state.uploadValue}/>
          {
            this.state.pictures.map(picture =>(
              <div>
                <img src={picture.image}/>
                <br/>
                <img src={picture.photoURL} />
                <h3>{picture.displayName}</h3>
              </div>
            ))
          }
        </div>
      )
    }else{
      return (
         <button onClick={this.handleAuth}>Ingresa con google</button>
      )
    }


  }
 
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>CopiGram</h2>
        </div>
        <p className="App-intro">
         {this.renderLoginButton()}
        </p>
      </div>
    );
  }
}

export default App;
