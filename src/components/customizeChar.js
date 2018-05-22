import loadingManager from '../utils/loadingManager'
import * as THREE from 'three'

class customizeChar {
    constructor() {
        this.loadingManager = new loadingManager()
        this.mesh = new THREE.Group()
        this.fileNames = [
            "testCuisseGauche",
            "testCuisseDroite",
            "testMolletGauche",
            "testPiedGauche",
            "testMolletDroit",
            "testPiedDroit",
            "testBrasDroit",
            "testMainDroite",
            "testCasque",
            "testTete",
            "testBrasGauche",
            "testMainGauche",
            "testBody",
        ]
        this.paths = []

        for (let i = 0; i < this.fileNames.length; i++) {
            this.paths.push("src/assets/chars/"+this.fileNames[i]+".json")
            
        }
    }

    loadCharacter() {
        return this.loadingManager.loadObject(this.paths)
    }

    createMeshGroup(geometries) {
        return new Promise(resolve => {
            for (let i = 0; i < geometries.length; i++) {
                    let color  = new THREE.Color()
                    color.setHex(Math.random() * 0xffffff)
                    let mat = new THREE.MeshBasicMaterial({color: color})
                    mat.skinning = true
                    let mesh = new THREE.SkinnedMesh(geometries[i], mat)
                    mesh.name = this.fileNames[i]
                    this.mesh.add(mesh)  
                
                
                if(i+1 == geometries.length) {
                    resolve(this.mesh)
                }
            }
        })
    }

    createCharacter(character) {
        
        return new Promise(resolve => {
            this.character = character.children[0]
   
            for (let i = 1; i < character.children.length; i++) {
       
                let bodyPart = character.children[i]
                this.character.geometry.merge(bodyPart.geometry, bodyPart.matrix, i)
                
                for (let j = 0; j < bodyPart.geometry.skinIndices.length; j++) {
                    this.character.geometry.skinIndices.push(bodyPart.geometry.skinIndices[j ])
                    this.character.geometry.skinWeights.push(bodyPart.geometry.skinWeights[j ])
                }


                if(i+1 == character.children.length) {
                    this.character.material = new THREE.MeshFaceMaterial([character.children[0].material, character.children[1].material, character.children[2].material,character.children[3].material,character.children[4].material,character.children[5].material,character.children[6].material,character.children[7].material,character.children[8].material,character.children[9].material, character.children[10].material,character.children[11].material,character.children[12].material])                    
                    resolve(this.character)
                }
            }
        })
    }
}

export default customizeChar