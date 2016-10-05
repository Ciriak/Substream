//Project object

function Project() {
  this.name = String;
  this.createDate = Date;
  this.fileUri = String;
}

Project.prototype = {
  lorem: function(){
    return "ipsum";
  }
};
