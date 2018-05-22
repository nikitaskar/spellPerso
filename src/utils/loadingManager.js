import * as THREE from 'three'
class loadingManager {
    constructor(params){
        this.loader = new THREE.JSONLoader()
        this.paths = []
    }

    loadObject(paths) {
        this.paths = paths
        this.loaded = false;
        this.count = 0;
        this.objects = [];
        return new Promise (resolve => {
            for(let i = 0; i < this.paths.length; i++) {

                this.loader.load(paths[i], (object)=>{
                    this.count ++
                    this.objects.push(object)
                    
                    if(this.count == this.paths.length) {
                        this.loaded = true;
                        resolve(this.objects)
                    }
                })
    
               
            }        
        })
        
    }
}

export default loadingManager
