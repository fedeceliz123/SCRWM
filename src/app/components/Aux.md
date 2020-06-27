  // Cuando la aplicación inicia
  ngOnInit(): void { 
    this.getIncises();
  }

  deleteAll(){
    for (var i in this.inciseService.incises) {
      this.inciseService.deleteIncise(this.inciseService.incises[i]._id)
      .subscribe(res => {
        this.getIncises();
        const C = document.getElementById('E');
        C.textContent = "";
        C.focus();
        this.inciseService.selectedIncise = new Incise();      
      });
    }
  }

  editIncise(incise: Incise){
    this.inciseService.selectedIncise = incise;
    this.linkIncisesDown(incise);
    const C = document.getElementById('E');
    C.textContent = incise.content;
    C.focus();
    this.showAbove(incise);
    this.showBelow(incise);
    this.showLeft(incise);
    this.showRight(incise);
  }

  editedIncise(incise: Incise){
    incise.content = document.getElementById('E').textContent;
    this.inciseService.putIncise(incise)
    .subscribe(res => {
      if(this.Below[0]){
        this.editIncise(this.Below[0]);
      } else {
        document.getElementById('E').textContent = "";
        this.inciseService.selectedIncise = new Incise();
        this.getIncises();
      }
    });
  }

  followingIncise(incise: Incise){
    console.log(incise);
    this.linkIncisesUp(incise);
    incise.content = document.getElementById('E').textContent;
    this.inciseService.postIncise(incise)
    .subscribe(res => {
      document.getElementById('E').textContent = "";
      this.getIncises();
    });
  }

  getIncises(){
    this.inciseService.getIncises()
      .subscribe(res => {
        this.inciseService.incises = res as Incise[];
        if(this.inciseService.selectedIncise._id){
          return;
        } else {
          this.Above = [];
          this.Below = [];
          this.Left = [];
          this.Right = [];
          var Linkable = [];
          for (var i in this.inciseService.incises) {
            Linkable.push([i, this.inciseService.incises[i]]);
          }
          const linkable = Linkable.slice(-1)[0];
          if(linkable){
            this.Above.push(linkable[1]);
          }
        }
      });
    }

  inciseComment(iCommented: Incise){
    if(iCommented._id){
      const C = document.getElementById('E');
      iCommented.content = C.textContent;
      this.inciseService.putIncise(iCommented)
      .subscribe(res => {
        C.textContent = "";
        C.focus();
        this.inciseService.selectedIncise = new Incise();
        const incise = this.inciseService.selectedIncise;
        this.linkIncisesLeft(iCommented, incise);
        this.showAbove(incise);
        this.showBelow(incise);
        this.showLeft(incise);
        this.showRight(incise);
      });
    } else {

    }
  }

  linkIncisesDown(incise: Incise){
    const Linkable = this.inciseService.incises;
    for (var i in Linkable) {
      if (incise.up === Linkable[i]._id){
        Linkable[i].down = incise._id;
        this.inciseService.putIncise(Linkable[i])
        .subscribe(res => {
          this.getIncises();
          });
      };
    } 
  }

  linkIncisesLeft(iCommented: Incise, incise: Incise){
    incise.left = iCommented._id;
    this.inciseService.postIncise(incise)
    .subscribe(res => {
      document.getElementById('E').textContent = "";
      this.getIncises();
    });
  }

  linkIncisesUp(incise: Incise){
    if(incise.left){
      this.linkIncisesRight(incise);
    } else {
      var Linkable = [];
      for (var i in this.inciseService.incises){
        Linkable.push([i, this.inciseService.incises[i]]);
      }
      const linkable = Linkable.slice(-1)[0];
      if(linkable){
        incise.up = linkable[1]._id;
      }  
    }
  }

  linkIncisesRight(incise: Incise){
    const Linkable = this.inciseService.incises;
    for (var i in Linkable) {
      if (incise.left === Linkable[i]._id){
        Linkable[i].right = incise._id;
        this.inciseService.putIncise(Linkable[i])
        .subscribe(res => {
          this.getIncises();
        });
      };
    } 
  }

  onKeypress(event: any){
    const incise = this.inciseService.selectedIncise;
    if(incise._id){
      if (document.getElementById('E').textContent == ""){
        return;
      } else {
        this.editedIncise(incise);
      }
    } else {
      this.followingIncise(incise);
    }
  }

  showAbove(incise: Incise){ 
    this.Above = [];
    const D = this.inciseService.incises;
    for (var i = 0; i < D.length; i++) {
      if(D[i]._id === incise.up){
        this.Above.push(D[i]);
      }
    }
  }

  showBelow(incise: Incise){ 
    this.Below = [];
    const D = this.inciseService.incises;
    for (var i = 0; i < D.length; i++) {
      if(D[i]._id === incise.down){
        this.Below.push(D[i]);
      }
    }
  }

  showLeft(incise: Incise){
    this.Left = [];
    const D = this.inciseService.incises;
    for (var i = 0; i < D.length; i++) {
      if(D[i]._id === incise.left){
        this.Left.push(D[i]);
      }
    }
  }

  showRight(incise: Incise){
    this.Right = [];
    const D = this.inciseService.incises;
    for (var i = 0; i < D.length; i++) {
      if(D[i]._id === incise.right){
        this.Right.push(D[i]);
      }
    }
  }

}



edited:
* llenar constantes
* nuevo inciso 
* conectar nuevo inciso con el anterior a través de las constantes

edit:
* llenar constantes
* traer inciso 
* conectar inciso traído con el anterior a través de las constantes