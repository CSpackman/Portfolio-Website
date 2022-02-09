import React, { Component, setState, useEffect } from 'react';
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import spaceBackground from './assets/jeremy-perkins-uhjiu8FjnsQ-unsplash.jpg'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Xwing from './assets/xwing/t-65.obj'
import normalTexture from './assets/mars_1k_normal.jpg'
import marsTexture from './assets/mars_1k_color.jpg'
import linkden from './assets/linkdenLogo.png'
import github from './assets/githubLogo.png'
//import { text } from 'stream/consumers';

export default class Home extends React.Component {
        
    constructor() {
      super();
      //Set default message
      this.state = {
        skills_Messege: "loading...",
        fist_Messege: "loading...",
        second_Messege: "loading...",
        camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
        renderer: new THREE.WebGLRenderer(),
      }
      this.backgroundAnimation = this.backgroundAnimation.bind(this);
      this.helpers = this.helpers.bind(this)
      this.addStar = this.addStar.bind(this)
    }
    helpers(light, scene, camera, renderer){
      const lightHelper = new THREE.PointLightHelper(light)
      const gridHelper = new THREE.GridHelper(200, 50);
      scene.add(lightHelper, gridHelper)
      const controls = new OrbitControls(camera, renderer.domElement);
      const axesHelper = new THREE.AxesHelper( 5 );
      scene.add( axesHelper );
    }


   addStar(scene) {
    const geometry = new THREE.SphereGeometry(0.10, 32, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff});
    const star = new THREE.Mesh(geometry, material);
 
    var x, y ,z;
    x = THREE.MathUtils.randFloatSpread(100)
    y= THREE.MathUtils.randFloatSpread(100)
    z = THREE.MathUtils.randFloat(-75,3)
    star.position.set(x, y, z);
    scene.add(star)
  }



    backgroundAnimation(){
      let camera = this.state.camera
      const loader = new OBJLoader();
       const scene = new THREE.Scene();
 
      loader.load(Xwing,function ( object ) {
        var xwing_object =object;
	   
        //EVENT LISTENR
        window.addEventListener('scroll', function () {  
          const t = document.body.getBoundingClientRect().top;
          //camera.position.z = t * -0.01;
          
          camera.position.y=document.body.getBoundingClientRect().top/100;
          
          xwing_object.position.x=5.76
          xwing_object.position.x-= window.pageYOffset/100;
          xwing_object.position.y=camera.position.y-1.5;
          mars.position.z= (window.pageYOffset/10000)-1.5;
          //camera.rotation.y = t * -0.0010;
      
        })

        xwing_object.scale.set(.01,.01,.01)
        xwing_object.rotation.x = 0; //RED
        xwing_object.rotation.y = Math.PI; //GREEN
        xwing_object.rotation.z =0; //BLUE
        xwing_object.position.set(1.76,-1,-1)
		    scene.add( xwing_object );

      })
      //EVERYTHING AFTER HERE IS NOT RELVANT TO OBJECT LOADING

         //Animation SETUP
         
         //Background
        const Background = new THREE.TextureLoader().load(spaceBackground)
        scene.background = Background
            //Light
        const pointLight = new THREE.PointLight(0xffffff)
        pointLight.position.set(3,3,15);
        let renderer = this.state.renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(3);
        camera.position.setX(0);
        camera.position.setY(.5)


        this.mount.appendChild( renderer.domElement );
      
    
    
    


      


      for(let i=0; i<400; i++){
         this.addStar(scene);
         //this.shootingStar(scene)
      } 
        const loadedMarTexture =new THREE.TextureLoader().load(marsTexture);
        const loadedNormalTexture =new THREE.TextureLoader().load(normalTexture);
        const marsGeometry =  new THREE.SphereGeometry(3, 32, 32)
        const MarsMaterial = new THREE.MeshStandardMaterial({map: loadedMarTexture, normalMap: loadedNormalTexture})
        const mars = new THREE.Mesh( marsGeometry, MarsMaterial)
        
        mars.position.set(0,-15,-5)
        scene.add(mars)
        scene.add( pointLight);

      

      //this.helpers(pointLight, scene, camera, renderer)
       var animate = function () {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    };
      
    animate();
    // === THREE.JS EXAMPLE CODE END ===
    }

   
  
    componentDidMount() {
     this.backgroundAnimation();
      window.addEventListener('resize', this.handleResize, false)
     
      fetch('https://us-central1-connorspackman-49d00.cloudfunctions.net/app/skills')
            .then(res => res.text())
            .then(res => this.setState({skills_Messege: res}));
      fetch('https://us-central1-connorspackman-49d00.cloudfunctions.net/app/first')
          .then(res => res.text())
          .then(res => this.setState({first_Messege: res}));
      fetch('https://us-central1-connorspackman-49d00.cloudfunctions.net/app/second')
        .then(res => res.text())
        .then(res => this.setState({second_Messege: res}));
    }
    handleResize = () => {
    this.state.camera.aspect = window.innerWidth / window.innerHeight
    this.state.camera.updateProjectionMatrix()
    this.state.renderer.setSize(window.innerWidth, window.innerHeight)
}
 
  
  
    render() {
      window.onbeforeunload = function () {
      window.scrollTo(0, 0);
      }

    
      return (
        <div>
           <div ref={ref => (this.mount = ref)} className="space"></div>
        <div className="main">
          <section className="center">
          <h1>ConnorSpackman.com</h1>
          </section>
          <section className="left">
          <h2>About Me</h2>
          <p>{this.state.first_Messege}</p>
          
          </section>
          <section className="right">
          <h2>About this Website</h2>
          <p>{this.state.second_Messege}</p>
          </section>
         
          <section className="left">
          <h2>Qualifications</h2>
          <p>{this.state.skills_Messege}</p>
          <a href="https://firebasestorage.googleapis.com/v0/b/connorspackman-49d00.appspot.com/o/ConnorSpackman_resume.pdf?alt=media&token=c64eef8a-49e3-40f4-9df6-542c19a2f2ce" >
          <p className ="resume">Resume Link</p>
          </a>
          </section>

          <section className="right final">
          <a href="https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile">
             <img src= {linkden} className="link-image"/>
          </a>
          <a href="https://github.com/CSpackman">
             <img src= {github} className="github-image"/>
          </a>
          <p>Connor Spackman © 2021 </p>
          <p>Created by Connor Spackman</p>
          </section>
        </div>

        
        </div >
      );
    }
  }


const rootElement = document.getElementById("root");
ReactDOM.render(<Home />, rootElement);