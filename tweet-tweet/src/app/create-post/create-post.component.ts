import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { IContent } from '../models/tweet.interface';
import { ThrowStmt } from '@angular/compiler';

const URL = 'http://localhost:3000/tweet';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  constructor(private userService: UserService) { }

  flag: number = 0;

  textArea:string;
  isVisible: Boolean = false;
  mentionIdArray = [];
  //searchedUsers: any = [];
  searchedUsers = [];

  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'image',
    authToken: localStorage.getItem("Authorization").substring(7)
  });

  ngOnInit() {
    
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      console.log("=========================", item, status);
    };
  }

  check(event: any){
    var strArray = this.textArea.split(" ");
    if(this.flag == 1){
      this.searchForUser();
    }
    if(event.key == "@"){
      this.flag = 1;
      this.isVisible = true;
    }
    if(event.key == " "){
      this.flag = 0;
      this.isVisible = false;
    }
    if(strArray[strArray.length - 1].charAt(0) == "@"){
      this.flag = 1;
      this.isVisible = true;
    }
    else{
      this.flag = 0;
      this.isVisible = false;
    }

    if(this.textArea == ""){
      this.flag = 0;
      this.isVisible = false;
    }
  }

  searchForUser(){
    var str = this.textArea.split(" ");
    var searchString = (str[str.length - 1]).substring(1);
    this.userService.searchUser(searchString).subscribe(res => {
      if(res.status == 200){
        this.searchedUsers = res.body;
      }
      else{
        console.log("Some Error");
      }
    });
  }

  insertTag(user: any){
    let strArray = this.textArea.split(" ");
    if(strArray[strArray.length - 1].charAt(0) == "@"){
      strArray.pop();
      this.textArea = strArray.join(" ") + " @" + user.userhandle;
      this.mentionIdArray.push(user._id);
      this.isVisible = false;
      this.flag = 0;
    }
  }

  OnSubmit(){
    this.uploader.onBuildItemForm = (item, form) => {
      form.append("text", this.textArea);
      form.append("mentions", this.mentionIdArray);
      item.formData = [this.textArea];
      item.formData = this.mentionIdArray;
    };
    this.uploader.uploadAll();
    this.textArea = "";
    this.mentionIdArray = [];
  }

}
