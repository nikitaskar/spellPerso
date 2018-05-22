import * as THREE from 'three'
import customizeChar from './components/customizeChar'
import loadingManager from './utils/loadingManager'
class App {
    constructor() {
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.001, 10000)
        this.camera.position.z = 5;
        this.scene = new THREE.Scene()

        let mat = new THREE.MeshBasicMaterial({color: "white"})
        let geo = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        this.mixer = null;
        this.loadingManager = new loadingManager()

        this.customizeChar = new customizeChar()

        this.customizeChar.loadCharacter()
        .then( geometries=>{
            this.customizeChar.createMeshGroup(geometries)
            .then(group => {
                this.character = group
                this.scene.add(group)
                console.log(this)
            // this.createChar()
            
            })
        })

    
        this.renderer = new THREE.WebGLRenderer({antialias: true})
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
        
        this.render()
        document.getElementById('changeHead').addEventListener('click', this.changeHead.bind(this))
        document.getElementById('createChar').addEventListener('click', this.createChar.bind(this, this.character))
    
    }

    changeHead() {
        if(this.character) {
            for (let i = 0; i < this.character.children.length; i++) {
                let bodyPart = this.character.children[i]
                
                if(bodyPart.name == "testCasque") {
                    this.character.remove(bodyPart)
                   this.loadingManager.loadObject(["./src/assets/chars/testCasque2.json"])
                   .then(object => {
                       let mat = new THREE.MeshBasicMaterial()
                       mat.skinning = true
                       let mesh = new THREE.SkinnedMesh(object[0], mat)
                       mesh.name = "testCasque"
                       this.character.add(mesh)
                   })
                }
            }
        }
    
    }

    createChar(group) {
        console.log(group)
    
        this.customizeChar.createCharacter(this.character)
        .then(character2 => {
            this.characterDef = character2            
            this.characterDef.mixer = new THREE.AnimationMixer(this.characterDef)
       
            this.walkAction = this.characterDef.mixer.clipAction(this.characterDef.geometry.animations[0]);
            this.walkAction.enabled = true

            this.walkAction.play()
            this.scene.add(this.characterDef)
            // this.scene.remove(this.character)
        })
    }

    render() {
        requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)

        if(this.characterDef && this.characterDef.mixer) {
              
                    this.characterDef.mixer.update( 15/1000 );
          
        }
        
    }
}

export default App